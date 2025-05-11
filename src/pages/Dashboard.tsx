
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AppContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/api";
import StoreWarning from "@/components/StoreWarning";

const Dashboard = () => {
  const { user } = useAuth();
  
  // Fetch dashboard summary data from API
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: async () => {
      if (!user?.storeUrl) {
        return null;
      }
      const response = await dashboardService.getSummary();
      return response.summary;
    },
    enabled: !!user?.storeUrl
  });
  
  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };
  
  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "on-hold":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Welcome back, {user?.name}! Here's what's happening with your store.
        </p>
      </div>
      
      {/* Show store warning if store is not linked */}
      {!user?.storeUrl && <StoreWarning />}
      
      {/* Main dashboard content */}
      {user?.storeUrl && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sales</div>
                  <div className="text-3xl font-bold mt-1">
                    {isLoading ? "Loading..." : error ? "Error" : formatCurrency(data?.currentMonthTotal || 0)}
                  </div>
                  {data && (
                    <div className={`text-sm mt-1 ${parseFloat(data.percentChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(data.percentChange) >= 0 ? '+' : ''}{data.percentChange}% from last month
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</div>
                  <div className="text-3xl font-bold mt-1">
                    {isLoading ? "Loading..." : error ? "Error" : data?.orderCount || 0}
                  </div>
                  {data && (
                    <div className={`text-sm mt-1 ${parseFloat(data.orderPercentChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(data.orderPercentChange) >= 0 ? '+' : ''}{data.orderPercentChange}% from last month
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</div>
                  <div className="text-3xl font-bold mt-1">
                    {isLoading ? "Loading..." : error ? "Error" : data?.productCount || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {isLoading ? "" : error ? "" : `${data?.topProducts?.length || 0} top selling products`}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Out of Stock</div>
                  <div className="text-3xl font-bold mt-1">
                    {isLoading ? "Loading..." : error ? "Error" : data?.outOfStockCount || 0}
                  </div>
                  <div className="text-sm text-red-600 mt-1">
                    {isLoading ? "" : error ? "" : data?.outOfStockCount > 0 ? "Needs attention" : "All products in stock"}
                  </div>
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
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">Loading...</div>
                  ) : error ? (
                    <div className="flex items-center justify-center h-full text-red-500">Error loading data</div>
                  ) : data?.salesData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatCurrency} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Area type="monotone" dataKey="sales" stroke="#FF7A00" fill="#FF9A40" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">No data available</div>
                  )}
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
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">Loading...</div>
                  ) : error ? (
                    <div className="flex items-center justify-center h-full text-red-500">Error loading data</div>
                  ) : data?.salesData ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="orders" fill="#FF7A00" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">No data available</div>
                  )}
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
                  {isLoading ? (
                    <div className="py-4 text-center">Loading...</div>
                  ) : error ? (
                    <div className="py-4 text-center text-red-500">Error loading orders</div>
                  ) : data?.recentOrders && data.recentOrders.length > 0 ? (
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
                        {data.recentOrders.map((order) => (
                          <tr key={order.id} className="border-t border-gray-200 dark:border-gray-700">
                            <td className="px-4 py-3 text-sm font-medium">#{order.number}</td>
                            <td className="px-4 py-3 text-sm">{order.customer}</td>
                            <td className="px-4 py-3 text-sm">{formatDate(order.date)}</td>
                            <td className="px-4 py-3 text-sm">${parseFloat(order.total).toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs capitalize ${getOrderStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-4 text-center text-gray-500">No recent orders found</div>
                  )}
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
                  {isLoading ? (
                    <div className="py-4 text-center">Loading...</div>
                  ) : error ? (
                    <div className="py-4 text-center text-red-500">Error loading products</div>
                  ) : data?.topProducts && data.topProducts.length > 0 ? (
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          <th className="px-4 py-3">Product</th>
                          <th className="px-4 py-3">Units Sold</th>
                          <th className="px-4 py-3">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topProducts.map((product, i) => (
                          <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                            <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                            <td className="px-4 py-3 text-sm">{product.sold}</td>
                            <td className="px-4 py-3 text-sm">${product.revenue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-4 text-center text-gray-500">No top products found</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
