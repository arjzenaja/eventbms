"use client";
import React from "react";
import PaymentHistory from "@/components/PaymentHistory";
import { PaymentProvider } from "@/context/PaymentContext";

export default function PaymentHistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pt-24">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <PaymentProvider>
          <PaymentHistory />
        </PaymentProvider>
      </div>
    </div>
  );
}
