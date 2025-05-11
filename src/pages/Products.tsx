
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { productsService } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AppContext";
import StoreWarning from "@/components/StoreWarning";

type Product = {
  id: number;
  name: string;
  sku: string;
  price: string;
  regular_price: string;
  stock_status: string;
  stock_quantity: number;
  categories: Array<{id: number, name: string}>;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Fetch products from API
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      if (!user?.storeUrl) return { products: [] };
      const response = await productsService.getProducts();
      return response || { products: [] };
    },
    enabled: !!user?.storeUrl
  });
  
  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => productsService.deleteProduct(productId),
    onSuccess: () => {
      // Invalidate and refetch products after deletion
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  });
  
  // Handle product deletion
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id.toString());
    }
  };
  
  // Filter products by search term
  const filteredProducts = data?.products?.filter((product: Product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  // Helper function to get stock status display
  const getStockStatusClass = (status: string) => {
    switch (status) {
      case "instock":
        return "bg-green-100 text-green-800";
      case "outofstock":
        return "bg-red-100 text-red-800";
      case "onbackorder":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Helper function to get stock status label
  const getStockStatusLabel = (status: string) => {
    switch (status) {
      case "instock":
        return "In Stock";
      case "outofstock":
        return "Out of Stock";
      case "onbackorder":
        return "On Backorder";
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
      
      {/* Show store warning if store is not linked */}
      <StoreWarning />
      
      {user?.storeUrl && (
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center">
                        Loading products...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-red-500">
                        Error loading products. Please try again.
                      </td>
                    </tr>
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-4">
                          <div className="font-medium">{product.name}</div>
                        </td>
                        <td className="px-4 py-4 text-sm">{product.sku}</td>
                        <td className="px-4 py-4 text-sm">
                          <div className="font-medium">{product.price}</div>
                          {product.regular_price !== product.price && (
                            <div className="text-gray-500 line-through text-xs">{product.regular_price}</div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className={`px-2 py-1 rounded-full text-xs inline-block w-fit ${getStockStatusClass(product.stock_status)}`}>
                              {getStockStatusLabel(product.stock_status)}
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              {product.stock_quantity} units
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {product.categories.map((category, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{category.name}</Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleDeleteProduct(product.id.toString())}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                        {searchTerm ? 'No products found matching your search.' : 'No products found in your store.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {filteredProducts.length} of {data?.products?.length || 0} products
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
      )}
    </div>
  );
};

export default Products;
