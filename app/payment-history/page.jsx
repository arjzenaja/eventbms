"use client";
import React, { Suspense } from "react";
import PaymentHistory from "@/components/PaymentHistory";
import { PaymentProvider } from "@/context/PaymentContext";
import { useTheme } from "@/context/ThemeContext";

export default function PaymentHistoryPage() {
  const { isLight } = useTheme();
  
  return (
    <div className={`min-h-screen ${isLight ? 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50' : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'} pt-24`}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <PaymentProvider>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Memuat riwayat pembayaran...</p>
              </div>
            </div>
          }>
            <PaymentHistory />
          </Suspense>
        </PaymentProvider>
      </div>
    </div>
  );
}
