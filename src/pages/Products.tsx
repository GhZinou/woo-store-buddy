
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Product = {
  id: number;
  name: string;
  sku: string;
  price: string;
  regularPrice: string;
  stockStatus: string;
  stockQuantity: number;
  categories: string[];
};

const Products = () => {
  // Mock products data
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Wireless Earbuds",
      sku: "WE-001",
      price: "$49.99",
      regularPrice: "$59.99",
      stockStatus: "instock",
      stockQuantity: 25,
      categories: ["Electronics", "Audio"]
    },
    {
      id: 2,
      name: "Smart Watch",
      sku: "SW-002",
      price: "$199.99",
      regularPrice: "$249.99",
      stockStatus: "instock",
      stockQuantity: 12,
      categories: ["Electronics", "Wearables"]
    },
    {
      id: 3,
      name: "Bluetooth Speaker",
      sku: "BS-003",
      price: "$79.99",
      regularPrice: "$99.99",
      stockStatus: "instock",
      stockQuantity: 18,
      categories: ["Electronics", "Audio"]
    },
    {
      id: 4,
      name: "Fitness Tracker",
      sku: "FT-004",
      price: "$59.99",
      regularPrice: "$79.99",
      stockStatus: "instock",
      stockQuantity: 30,
      categories: ["Electronics", "Fitness"]
    },
    {
      id: 5,
      name: "Smart Home Hub",
      sku: "SH-005",
      price: "$129.99",
      regularPrice: "$149.99",
      stockStatus: "outofstock",
      stockQuantity: 0,
      categories: ["Electronics", "Smart Home"]
    },
    {
      id: 6,
      name: "Wireless Charger",
      sku: "WC-006",
      price: "$29.99",
      regularPrice: "$39.99",
      stockStatus: "instock",
      stockQuantity: 45,
      categories: ["Electronics", "Accessories"]
    },
    {
      id: 7,
      name: "Bluetooth Headphones",
      sku: "BH-007",
      price: "$89.99",
      regularPrice: "$99.99",
      stockStatus: "lowstock",
      stockQuantity: 3,
      categories: ["Electronics", "Audio"]
    }
  ];
  
  const [products] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStockStatusClass = (status: string) => {
    switch (status) {
      case "instock":
        return "bg-green-100 text-green-800";
      case "outofstock":
        return "bg-red-100 text-red-800";
      case "lowstock":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStockStatusLabel = (status: string) => {
    switch (status) {
      case "instock":
        return "In Stock";
      case "outofstock":
        return "Out of Stock";
      case "lowstock":
        return "Low Stock";
      default:
        return status;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your WooCommerce products
          </p>
        </div>
        <Button className="bg-brand-orange hover:bg-brand-orange-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Product List</CardTitle>
          <CardDescription>All of your store's products in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 my-6">
            <div className="w-full sm:w-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
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
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Categories</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-4">
                        <div className="font-medium">{product.name}</div>
                      </td>
                      <td className="px-4 py-4 text-sm">{product.sku}</td>
                      <td className="px-4 py-4 text-sm">
                        <div className="font-medium">{product.price}</div>
                        {product.regularPrice !== product.price && (
                          <div className="text-gray-500 line-through text-xs">{product.regularPrice}</div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className={`px-2 py-1 rounded-full text-xs inline-block w-fit ${getStockStatusClass(product.stockStatus)}`}>
                            {getStockStatusLabel(product.stockStatus)}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            {product.stockQuantity} units
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {product.categories.map((category, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{category}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      No products found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing {filteredProducts.length} of {products.length} products
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

export default Products;
