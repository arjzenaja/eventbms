"use client";
import React from "react";
import PaymentStatus from "@/components/PaymentStatus";
import { PaymentProvider } from "@/context/PaymentContext";

export default function PaymentStatusWrapper({ paymentId }) {
  return (
    <PaymentProvider>
      <PaymentStatus paymentId={paymentId} />
    </PaymentProvider>
  );
}
