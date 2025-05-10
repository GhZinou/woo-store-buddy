
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { authService, userService } from "@/services/api";

type User = {
  id: string;
  email: string;
  name?: string;
  storeUrl?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  connectStore: (storeUrl: string, consumerKey: string, consumerSecret: string) => Promise<void>;
  logout: () => void;
};

const AppContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAuth must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("woostore_token");
        
        if (token) {
          const storedUser = localStorage.getItem("woostore_user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // If we have a token but no user, fetch user profile
            const { user: profileUser } = await userService.getProfile();
            setUser(profileUser);
            localStorage.setItem("woostore_user", JSON.stringify(profileUser));
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear invalid session
        localStorage.removeItem("woostore_token");
        localStorage.removeItem("woostore_user");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user, token } = await authService.login(email, password);
      
      setUser(user);
      localStorage.setItem("woostore_token", token);
      localStorage.setItem("woostore_user", JSON.stringify(user));
      
      toast.success("Login successful!");
    } catch (error) {
      // Error is handled by API interceptor
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { user, token } = await authService.register(email, password);
      
      setUser(user);
      localStorage.setItem("woostore_token", token);
      localStorage.setItem("woostore_user", JSON.stringify(user));
      
      toast.success("Account created successfully!");
    } catch (error) {
      // Error is handled by API interceptor
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const connectStore = async (storeUrl: string, consumerKey: string, consumerSecret: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { storeUrl: connectedStoreUrl } = await authService.connectStore(
        user.id,
        storeUrl,
        consumerKey,
        consumerSecret
      );
      
      const updatedUser = {
        ...user,
        storeUrl: connectedStoreUrl
      };
      
      setUser(updatedUser);
      localStorage.setItem("woostore_user", JSON.stringify(updatedUser));
      
      toast.success("Store connected successfully!");
    } catch (error) {
      // Error is handled by API interceptor
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("woostore_token");
    localStorage.removeItem("woostore_user");
    toast.info("You've been logged out.");
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    connectStore,
    logout
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
