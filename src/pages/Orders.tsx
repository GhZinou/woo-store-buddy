
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

type Order = {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: string;
  status: string;
  paymentMethod: string;
  items: number;
};

const Orders = () => {
  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: "#1234",
      customer: "John Doe",
      email: "john@example.com",
      date: "2023-05-10",
      total: "$59.99",
      status: "completed",
      paymentMethod: "Credit Card",
      items: 2
    },
    {
      id: "#1235",
      customer: "Jane Smith",
      email: "jane@example.com",
      date: "2023-05-09",
      total: "$125.00",
      status: "processing",
      paymentMethod: "PayPal",
      items: 3
    },
    {
      id: "#1236",
      customer: "Mike Johnson",
      email: "mike@example.com",
      date: "2023-05-08",
      total: "$85.50",
      status: "completed",
      paymentMethod: "Credit Card",
      items: 1
    },
    {
      id: "#1237",
      customer: "Sarah Williams",
      email: "sarah@example.com",
      date: "2023-05-07",
      total: "$210.99",
      status: "pending",
      paymentMethod: "Bank Transfer",
      items: 5
    },
    {
      id: "#1238",
      customer: "David Brown",
      email: "david@example.com",
      date: "2023-05-06",
      total: "$45.75",
      status: "on-hold",
      paymentMethod: "Credit Card",
      items: 2
    },
    {
      id: "#1239",
      customer: "Emily Davis",
      email: "emily@example.com",
      date: "2023-05-05",
      total: "$199.99",
      status: "completed",
      paymentMethod: "PayPal",
      items: 4
    },
    {
      id: "#1240",
      customer: "Robert Wilson",
      email: "robert@example.com",
      date: "2023-05-04",
      total: "$67.25",
      status: "refunded",
      paymentMethod: "Credit Card",
      items: 2
    },
    {
      id: "#1241",
      customer: "Lisa Miller",
      email: "lisa@example.com",
      date: "2023-05-03",
      total: "$32.50",
      status: "cancelled",
      paymentMethod: "PayPal",
      items: 1
    }
  ];
  
  const [orders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getOrderStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "on-hold":
        return "bg-orange-100 text-orange-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
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
                      <td className="px-4 py-4 font-medium">{order.id}</td>
                      <td className="px-4 py-4">
                        <div>{order.customer}</div>
                        <div className="text-xs text-gray-500">{order.email}</div>
                      </td>
                      <td className="px-4 py-4 text-sm">{order.date}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${getOrderStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm">{order.paymentMethod}</td>
                      <td className="px-4 py-4 font-medium">{order.total}</td>
                      <td className="px-4 py-4 text-center">{order.items}</td>
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
              Showing {filteredOrders.length} of {orders.length} orders
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
