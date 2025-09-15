"use client";
import React from "react";
import PaymentHistory from "@/components/PaymentHistory";
import { PaymentProvider } from "@/context/PaymentContext";
import { useTheme } from "@/context/ThemeContext";

export default function PaymentHistoryPage() {
  const { isLight } = useTheme();
  
  return (
    <div className={`min-h-screen ${isLight ? 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50' : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'} pt-24`}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <PaymentProvider>
          <PaymentHistory />
        </PaymentProvider>
      </div>
    </div>
  );
}
