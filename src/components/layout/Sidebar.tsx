
import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { 
  Home, 
  Package, 
  ShoppingCart, 
  User, 
  LogOut,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AppContext";

type SidebarProps = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const Sidebar = ({ isSidebarOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Products", path: "/products", icon: <Package className="h-5 w-5" /> },
    { name: "Orders", path: "/orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { name: "Profile", path: "/profile", icon: <User className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-200 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
      />
      
      <aside 
        className={`fixed top-0 left-0 z-30 h-screen bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:translate-x-0 lg:w-64"} 
          flex flex-col border-r border-border`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-md bg-brand-orange flex items-center justify-center text-white font-bold text-lg">
              W
            </span>
            <h1 className="font-bold text-xl">WooStore</h1>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 py-6 px-3 overflow-y-auto custom-scrollbar">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 rounded-md transition-colors
                    ${isActive(item.path) ? 
                      "bg-brand-orange text-white" : 
                      "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3 font-medium">{item.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-2">Logout</span>
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
