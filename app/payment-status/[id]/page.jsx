import React from "react";
import PaymentStatusWrapper from "./PaymentStatusWrapper";

export default async function PaymentStatusPage({ params }) {
  const { id } = await params;

  return (
    <PaymentStatusWrapper paymentId={id} />
  );
}
