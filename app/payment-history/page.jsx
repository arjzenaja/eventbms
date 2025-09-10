"use client";
import React from "react";
import PaymentHistory from "@/components/PaymentHistory";
import PaymentProvider from "@/context/PaymentContext";

export default function PaymentHistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="max-w-6xl mx-auto p-6">
        <PaymentProvider>
          <PaymentHistory />
        </PaymentProvider>
      </div>
    </div>
  );
}
