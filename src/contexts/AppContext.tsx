
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  name: string;
  storeUrl: string;
  trialExpirationDate: Date;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, storeUrl: string, consumerKey: string, consumerSecret: string) => Promise<void>;
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
  
  // Mock checking for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // This would be a real API call in production
        const storedUser = localStorage.getItem("woostore_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock API call - would be a real API call in production
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === "demo@woostore.com" && password === "password") {
        const mockUser = {
          id: "user_123",
          email: "demo@woostore.com",
          name: "Demo User",
          storeUrl: "https://demo-store.com",
          trialExpirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
        };
        
        setUser(mockUser);
        localStorage.setItem("woostore_user", JSON.stringify(mockUser));
        toast.success("Login successful!");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    storeUrl: string, 
    consumerKey: string, 
    consumerSecret: string
  ) => {
    setIsLoading(true);
    try {
      // Mock API call - would be a real API call in production
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a mock user
      const mockUser = {
        id: "user_" + Date.now(),
        email,
        name,
        storeUrl,
        trialExpirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
      };
      
      setUser(mockUser);
      localStorage.setItem("woostore_user", JSON.stringify(mockUser));
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Signup failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("woostore_user");
    toast.info("You've been logged out.");
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
