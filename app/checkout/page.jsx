"use client";
import React from "react";
import PaymentCheckout from "@/components/PaymentCheckout";
import { PaymentProvider } from "@/context/PaymentContext";
import { useTheme } from "@/context/ThemeContext";

export default function CheckoutPage() {
  const { isDark, isHydrated } = useTheme();
  
  const handleBack = () => {
    // Navigate back to event page or previous page
    window.history.back();
  };

  const handleSuccess = (result) => {
    // Handle successful payment
    console.log("Payment successful:", result);
    // You can add additional logic here like redirecting to success page
  };

  // Show loading state while hydrating to prevent flash
  if (!isHydrated) {
    return (
      <div className="min-h-screen pt-24 bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen pt-24 transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100'
    }`}>
      <PaymentProvider>
        <PaymentCheckout onBack={handleBack} onSuccess={handleSuccess} />
      </PaymentProvider>
    </div>
  );
}
