"use client";
import React, { Suspense } from "react";
import PaymentSuccessWrapper from "./PaymentSuccessWrapper";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Memuat halaman...</p>
        </div>
      </div>
    }>
      <PaymentSuccessWrapper />
    </Suspense>
  );
}
