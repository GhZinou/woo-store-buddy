
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AppContext";
import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const { signup, isAuthenticated } = useAuth();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = () => {
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
    
    setError("");
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setError(""); // Clear previous errors before new submission
    
    try {
      const { name, email, password } = formData;
      await signup(email, password, name);
      // If signup is successful, AppContext will set isAuthenticated to true, triggering navigation
    } catch (err: any) {
      // Assuming error structure from useAuth or API might be { response: { data: { message: "..." } } }
      // Or a direct error object with a message property
      const errorMessage = err.response?.data?.message || err.message || "Signup failed. Please try again.";
      setError(errorMessage);
      console.error("Signup Page Error:", err); // Log the full error for debugging
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <AuthLayout
      title="Create Your Account"
      description="Enter your personal details to get started."
      error={error}
      footerContent={
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-orange hover:underline">
            Sign In
          </Link>
        </p>
      }
    >
      <SignupForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </AuthLayout>
  );
};

export default Signup;
