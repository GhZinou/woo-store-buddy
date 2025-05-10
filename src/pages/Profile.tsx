
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { userService } from "@/services/api";
import { useAuth } from "@/contexts/AppContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Profile = () => {
  const { user, logout } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const updateProfileMutation = useMutation({
    mutationFn: (data: { email: string }) => userService.updateProfile(data),
    onSuccess: (data) => {
      // Update user in local storage
      const updatedUser = data.user;
      localStorage.setItem("woostore_user", JSON.stringify(updatedUser));
      
      // Invalidate queries that might depend on user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      await updateProfileMutation.mutateAsync({ email });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-gray-500">
          Manage your account settings
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" disabled={isSubmitting || email === user?.email}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Store Connection</CardTitle>
            <CardDescription>Your WooCommerce store details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="block mb-1">Store URL</Label>
                <div className="text-lg font-medium">
                  {user?.storeUrl || "No store connected"}
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="destructive" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
