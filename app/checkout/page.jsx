"use client";
import React from "react";
import PaymentCheckout from "@/components/PaymentCheckout";
import { PaymentProvider } from "@/context/PaymentContext";
import { TicketProvider } from "@/context/TicketContext";
import { UserProvider } from "@/context/UserContext";

export default function CheckoutPage() {
  const handleBack = () => {
    // Navigate back to event page or previous page
    window.history.back();
  };

  const handleSuccess = (result) => {
    // Handle successful payment
    console.log("Payment successful:", result);
    // You can add additional logic here like redirecting to success page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 pt-24">
      <UserProvider>
        <TicketProvider>
          <PaymentProvider>
            <PaymentCheckout onBack={handleBack} onSuccess={handleSuccess} />
          </PaymentProvider>
        </TicketProvider>
      </UserProvider>
    </div>
  );
}
