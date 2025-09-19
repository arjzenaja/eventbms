"use client";
import React from "react";
import PaymentStatus from "@/components/PaymentStatus";
import { PaymentProvider } from "@/context/PaymentContext";
import { useTheme } from "@/context/ThemeContext";

export default function PaymentStatusWrapper({ paymentId }) {
  const { isLight } = useTheme();
  
  return (
    <div className={`min-h-screen pt-28 ${isLight ? 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50' : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'}`}>
      <PaymentProvider>
        <PaymentStatus paymentId={paymentId} />
      </PaymentProvider>
    </div>
  );
}
