import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ordersService } from "@/services/api";

type Order = {
  id: number;
  number: string;
  status: string;
  date_created: string;
  total: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
  };
  payment_method_title: string;
  line_items: Array<any>;
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterParams, setFilterParams] = useState({});
  
  // Fetch orders from API
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', filterParams],
    queryFn: async () => {
      const response = await ordersService.getOrders(filterParams);
      return response.orders || [];
    }
  });
  
  // Filter orders by search term
  const filteredOrders = data?.filter((order: Order) => {
    const searchString = searchTerm.toLowerCase();
    const orderNumber = order.number.toLowerCase();
    const customerName = `${order.billing.first_name} ${order.billing.last_name}`.toLowerCase();
    const customerEmail = order.billing.email.toLowerCase();
    
    return orderNumber.includes(searchString) || 
           customerName.includes(searchString) || 
           customerEmail.includes(searchString);
  }) || [];
  
  // Helper function to format a date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Helper function to get order status class
  const getOrderStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
      case "on-hold":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Orders</h1>
          <p className="text-gray-500">There was an error loading your orders.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your WooCommerce orders
        </p>
      </div>
      
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Order List</CardTitle>
          <CardDescription>All of your store's orders in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 my-6">
            <div className="w-full sm:w-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Items</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-4 font-medium">{order.number}</td>
                      <td className="px-4 py-4">
                        <div>{order.billing.first_name} {order.billing.last_name}</div>
                        <div className="text-xs text-gray-500">{order.billing.email}</div>
                      </td>
                      <td className="px-4 py-4 text-sm">{formatDate(order.date_created)}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${getOrderStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">{order.payment_method_title}</td>
                      <td className="px-4 py-4 font-medium">{order.total}</td>
                      <td className="px-4 py-4 text-center">{order.line_items.length}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No orders found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing {filteredOrders.length} of {data?.length} orders
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
