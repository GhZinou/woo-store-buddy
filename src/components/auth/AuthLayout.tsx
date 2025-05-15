
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footerContent: React.ReactNode;
  error?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, description, children, footerContent, error }) => {
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
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">{error}</div>}
          {children}
        </CardContent>
        <CardFooter className="flex justify-center">
          {footerContent}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthLayout;
