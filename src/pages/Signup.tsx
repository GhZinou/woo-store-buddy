
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AppContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    storeUrl: "",
    consumerKey: "",
    consumerSecret: ""
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const { signup, isAuthenticated } = useAuth();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateFirstStep = () => {
    const { name, email, password, confirmPassword } = formData;
    
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return false;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    
    return true;
  };
  
  const nextStep = () => {
    if (validateFirstStep()) {
      setError("");
      setCurrentStep(2);
    }
  };
  
  const prevStep = () => {
    setCurrentStep(1);
    setError("");
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const { storeUrl, consumerKey, consumerSecret } = formData;
    
    if (!storeUrl || !consumerKey || !consumerSecret) {
      setError("Please fill in all store connection details.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { name, email, password, storeUrl, consumerKey, consumerSecret } = formData;
      await signup(email, password, name, storeUrl, consumerKey, consumerSecret);
    } catch (error: any) {
      setError(error.message || "Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 rounded-md bg-brand-orange flex items-center justify-center text-white font-bold text-lg mr-3">
          W
        </div>
        <h1 className="text-2xl font-bold">WooStore Buddy</h1>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>
            {currentStep === 1 ? "Enter your personal details" : "Connect your WooCommerce store"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}
          
          {currentStep === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button
                type="button"
                className="w-full bg-brand-orange hover:bg-brand-orange-dark"
                onClick={nextStep}
              >
                Next
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeUrl">WooCommerce Store URL</Label>
                <Input
                  id="storeUrl"
                  name="storeUrl"
                  type="text"
                  placeholder="https://yourdomain.com"
                  value={formData.storeUrl}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consumerKey">Consumer Key</Label>
                <Input
                  id="consumerKey"
                  name="consumerKey"
                  type="text"
                  placeholder="ck_xxxxxxxx"
                  value={formData.consumerKey}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consumerSecret">Consumer Secret</Label>
                <Input
                  id="consumerSecret"
                  name="consumerSecret"
                  type="text"
                  placeholder="cs_xxxxxxxx"
                  value={formData.consumerSecret}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                <p>
                  You can find your API keys in your WooCommerce dashboard under
                  WooCommerce &gt; Settings &gt; Advanced &gt; REST API.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  className="w-1/2"
                  variant="outline"
                  onClick={prevStep}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="w-1/2 bg-brand-orange hover:bg-brand-orange-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-orange hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
