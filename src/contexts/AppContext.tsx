
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { authService, userService } from "@/services/api";

// Define User type
export type User = {
  id: string;
  email: string;
  name?: string;
  storeUrl?: string;
  trialExpirationDate?: string; // Added this property to fix the TypeScript error
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is already logged in when app loads
  useEffect(() => {
    const token = localStorage.getItem("woostore_token");
    const storedUser = localStorage.getItem("woostore_user");
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("woostore_token");
        localStorage.removeItem("woostore_user");
      }
    }
    
    setIsLoading(false);
  }, []);
  
  const refreshUser = async () => {
    try {
      const { user } = await userService.getProfile();
      setUser(user);
      localStorage.setItem("woostore_user", JSON.stringify(user));
    } catch (error) {
      console.error("Failed to refresh user profile:", error);
    }
  };
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user, token } = await authService.login(email, password);
      
      setUser(user);
      localStorage.setItem("woostore_token", token);
      localStorage.setItem("woostore_user", JSON.stringify(user));
      
      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { user, token } = await authService.register(email, password, name);
      
      setUser(user);
      localStorage.setItem("woostore_token", token);
      localStorage.setItem("woostore_user", JSON.stringify(user));
      
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("woostore_token");
    localStorage.removeItem("woostore_user");
    toast.success("Logged out successfully");
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    refreshUser
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
