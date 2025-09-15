"use client";
import React, { Suspense } from "react";
import PaymentSuccessWrapper from "./PaymentSuccessWrapper";
import { useTheme } from "@/context/ThemeContext";

export default function PaymentSuccessPage() {
  const { theme } = useTheme();
  
  return (
    <Suspense fallback={
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4 ${
            theme === 'dark' ? 'border-purple-400' : 'border-blue-500'
          }`} />
          <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Memuat halaman...
          </p>
        </div>
      </div>
    }>
      <PaymentSuccessWrapper />
    </Suspense>
  );
}
