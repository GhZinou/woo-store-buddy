
import React, { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Store, X } from "lucide-react";
import { authService } from "@/services/api";
import { useAuth } from "@/contexts/AppContext";
import { toast } from "sonner";
import { z } from "zod";

const storeSchema = z.object({
  storeUrl: z.string().url("Please enter a valid URL").min(1, "Store URL is required"),
  consumerKey: z.string().min(1, "Consumer Key is required"),
  consumerSecret: z.string().min(1, "Consumer Secret is required")
});

const StoreWarning = () => {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    storeUrl: "",
    consumerKey: "",
    consumerSecret: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { user, refreshUser } = useAuth();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    try {
      storeSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await authService.connectStore(
        user?.id || '',
        formData.storeUrl,
        formData.consumerKey,
        formData.consumerSecret
      );
      
      toast.success("Store connected successfully!");
      setShowForm(false);
      refreshUser(); // Refresh user data to update storeUrl
    } catch (error) {
      console.error("Failed to connect store:", error);
      toast.error("Failed to connect store. Please check your credentials and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (user?.storeUrl) return null;
  
  return (
    <>
      <Alert className="bg-amber-50 border-amber-200 mb-6">
        <Store className="h-5 w-5 text-amber-600" />
        <AlertTitle className="text-amber-800">Your store is not linked</AlertTitle>
        <AlertDescription className="text-amber-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p>Please link your WooCommerce store to view and manage products and orders.</p>
            <Button 
              className="bg-amber-500 hover:bg-amber-600 text-white whitespace-nowrap"
              onClick={() => setShowForm(true)}
            >
              <Link className="h-4 w-4 mr-2" />
              Link Store
            </Button>
          </div>
        </AlertDescription>
      </Alert>
      
      {showForm && (
        <Card className="mb-6 border border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Connect Your WooCommerce Store</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setShowForm(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="storeUrl">Store URL</Label>
                  <Input 
                    id="storeUrl" 
                    name="storeUrl" 
                    placeholder="https://your-store.com" 
                    value={formData.storeUrl} 
                    onChange={handleChange}
                  />
                  {errors.storeUrl && <p className="text-sm text-red-500">{errors.storeUrl}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="consumerKey">Consumer Key (CK)</Label>
                  <Input 
                    id="consumerKey" 
                    name="consumerKey" 
                    placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                    value={formData.consumerKey} 
                    onChange={handleChange}
                  />
                  {errors.consumerKey && <p className="text-sm text-red-500">{errors.consumerKey}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="consumerSecret">Consumer Secret (CS)</Label>
                  <Input 
                    id="consumerSecret" 
                    name="consumerSecret" 
                    type="password" 
                    placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                    value={formData.consumerSecret} 
                    onChange={handleChange}
                  />
                  {errors.consumerSecret && <p className="text-sm text-red-500">{errors.consumerSecret}</p>}
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  <strong>Not sure where to find these?</strong> Log in to your WordPress admin, go to WooCommerce &gt; Settings &gt; Advanced &gt; REST API and create a new API key with Read/Write permissions.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                type="button" 
                variant="ghost" 
                className="mr-2" 
                onClick={() => setShowForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-brand-orange hover:bg-brand-orange-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Connecting..." : "Connect Store"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </>
  );
};

export default StoreWarning;
