import React from "react";
import PaymentInstructionsWrapper from "./PaymentInstructionsWrapper";

export default async function PaymentInstructionsPage({ params }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="max-w-4xl mx-auto p-6">
        <PaymentInstructionsWrapper paymentId={id} />
      </div>
    </div>
  );
}
