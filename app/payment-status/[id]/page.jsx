"use client";
import React from "react";
import PaymentStatus from "@/components/PaymentStatus";
import { PaymentProvider } from "@/context/PaymentContext";

export default function PaymentStatusPage({ params }) {
  const { id } = params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="max-w-4xl mx-auto p-6">
        <PaymentProvider>
          <PaymentStatus paymentId={id} />
        </PaymentProvider>
      </div>
    </div>
  );
}
