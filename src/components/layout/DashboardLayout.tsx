
import React, { useState } from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AppContext";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const calculateDaysLeft = () => {
    if (!user?.trialExpirationDate) return 0;
    
    const expirationDate = new Date(user.trialExpirationDate);
    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = calculateDaysLeft();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`transition-all duration-300 ${
        isSidebarOpen ? "lg:ml-64" : "lg:ml-64"
      }`}>
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-border sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-2 h-16">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                className="lg:hidden"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              {daysLeft > 0 && (
                <div className="hidden md:block px-3 py-1 bg-amber-100 text-amber-800 rounded-md text-sm">
                  Trial: {daysLeft} days left
                </div>
              )}
              
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              
              <Link to="/profile" className="flex items-center hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-white font-medium">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <span className="ml-2 font-medium hidden md:block">{user?.name}</span>
              </Link>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
