
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AppContext";

const Profile = () => {
  const { user } = useAuth();
  
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });
  
  const [storeInfo, setStoreInfo] = useState({
    storeUrl: user?.storeUrl || "",
    consumerKey: "****************",
    consumerSecret: "****************"
  });
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStoreInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStoreInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUpdatePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to update the user's information
    toast.success("Personal information updated successfully!");
  };
  
  const handleUpdateStoreInfo = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to update the user's store information
    toast.success("Store connection details updated successfully!");
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    
    // In a real app, this would call an API to change the user's password
    toast.success("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your account settings and store connections
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePersonalInfo} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={personalInfo.name}
                  onChange={handlePersonalInfoChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange}
                />
              </div>
              <Button type="submit" className="bg-brand-orange hover:bg-brand-orange-dark">
                Update Information
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>WooCommerce Store Connection</CardTitle>
            <CardDescription>Update your store connection details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateStoreInfo} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeUrl">Store URL</Label>
                <Input
                  id="storeUrl"
                  name="storeUrl"
                  value={storeInfo.storeUrl}
                  onChange={handleStoreInfoChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consumerKey">Consumer Key</Label>
                <Input
                  id="consumerKey"
                  name="consumerKey"
                  type="password"
                  value={storeInfo.consumerKey}
                  onChange={handleStoreInfoChange}
                />
                <p className="text-xs text-gray-500">
                  Leave unchanged to keep your current key.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="consumerSecret">Consumer Secret</Label>
                <Input
                  id="consumerSecret"
                  name="consumerSecret"
                  type="password"
                  value={storeInfo.consumerSecret}
                  onChange={handleStoreInfoChange}
                />
                <p className="text-xs text-gray-500">
                  Leave unchanged to keep your current secret.
                </p>
              </div>
              <Button type="submit" className="bg-brand-orange hover:bg-brand-orange-dark">
                Update Connection
              </Button>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500">
                  Find your WooCommerce API keys in your WooCommerce dashboard under
                  WooCommerce &gt; Settings &gt; Advanced &gt; REST API.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-brand-orange hover:bg-brand-orange-dark">
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Manage your subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <h3 className="font-medium text-amber-800">Free Trial</h3>
              <p className="text-sm text-amber-700 mt-1">
                You are currently on a free 15-day trial. Your trial will end on {user?.trialExpirationDate ? new Date(user.trialExpirationDate).toLocaleDateString() : "N/A"}.
              </p>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-medium">Available Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-md bg-white">
                  <h4 className="font-medium">Basic</h4>
                  <p className="text-2xl font-bold mt-2">$9.99<span className="text-sm font-normal text-gray-500">/month</span></p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Single store connection
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Basic analytics
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Email support
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-brand-orange hover:bg-brand-orange-dark">
                    Choose Basic
                  </Button>
                </div>
                <div className="p-4 border-2 border-brand-orange rounded-md bg-white relative">
                  <div className="absolute -top-3 right-4 bg-brand-orange text-white px-2 py-1 text-xs rounded">
                    POPULAR
                  </div>
                  <h4 className="font-medium">Premium</h4>
                  <p className="text-2xl font-bold mt-2">$19.99<span className="text-sm font-normal text-gray-500">/month</span></p>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Multiple store connections
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Advanced analytics
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Priority support
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Bulk product management
                    </li>
                  </ul>
                  <Button className="w-full mt-4 bg-brand-orange hover:bg-brand-orange-dark">
                    Choose Premium
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-gray-500 border-t pt-4">
            All plans include a 14-day money-back guarantee.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
