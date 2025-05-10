
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AppContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  
  // Mock data for dashboard stats
  const salesData = [
    { name: "Jan", sales: 4000, orders: 28 },
    { name: "Feb", sales: 3000, orders: 20 },
    { name: "Mar", sales: 2000, orders: 15 },
    { name: "Apr", sales: 2780, orders: 22 },
    { name: "May", sales: 1890, orders: 17 },
    { name: "Jun", sales: 2390, orders: 21 },
    { name: "Jul", sales: 3490, orders: 29 },
  ];
  
  const recentOrders = [
    { id: "#1234", customer: "John Doe", date: "2023-05-10", total: "$59.99", status: "Completed" },
    { id: "#1235", customer: "Jane Smith", date: "2023-05-09", total: "$125.00", status: "Processing" },
    { id: "#1236", customer: "Mike Johnson", date: "2023-05-08", total: "$85.50", status: "Completed" },
    { id: "#1237", customer: "Sarah Williams", date: "2023-05-07", total: "$210.99", status: "Pending" }
  ];
  
  const topProducts = [
    { name: "Wireless Earbuds", sold: 25, revenue: "$1,250.00" },
    { name: "Smart Watch", sold: 18, revenue: "$3,600.00" },
    { name: "Bluetooth Speaker", sold: 15, revenue: "$750.00" },
    { name: "Fitness Tracker", sold: 12, revenue: "$600.00" }
  ];
  
  const formatCurrency = (value: number) => {
    return `$${value}`;
  };
  
  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Welcome back, {user?.name}! Here's what's happening with your store.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sales</div>
              <div className="text-3xl font-bold mt-1">$18,550</div>
              <div className="text-sm text-green-600 mt-1">+12.5% from last month</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</div>
              <div className="text-3xl font-bold mt-1">152</div>
              <div className="text-sm text-green-600 mt-1">+5.8% from last month</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</div>
              <div className="text-3xl font-bold mt-1">85</div>
              <div className="text-sm text-gray-600 mt-1">3 new products this month</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Out of Stock</div>
              <div className="text-3xl font-bold mt-1">7</div>
              <div className="text-sm text-red-600 mt-1">+3 since last week</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Area type="monotone" dataKey="sales" stroke="#FF7A00" fill="#FF9A40" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Order Statistics</CardTitle>
            <CardDescription>Monthly order count</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#FF7A00" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3 text-sm font-medium">{order.id}</td>
                      <td className="px-4 py-3 text-sm">{order.customer}</td>
                      <td className="px-4 py-3 text-sm">{order.date}</td>
                      <td className="px-4 py-3 text-sm">{order.total}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${getOrderStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Units Sold</th>
                    <th className="px-4 py-3">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, i) => (
                    <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                      <td className="px-4 py-3 text-sm">{product.sold}</td>
                      <td className="px-4 py-3 text-sm">{product.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
