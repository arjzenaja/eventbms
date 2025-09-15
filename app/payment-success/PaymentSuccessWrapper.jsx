"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PaymentSuccess from "@/components/PaymentSuccess";
import { PaymentProvider } from "@/context/PaymentContext";
import { useTheme } from "@/context/ThemeContext";

export default function PaymentSuccessWrapper() {
  const searchParams = useSearchParams();
  const { theme } = useTheme();
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get payment data from URL params or localStorage
    const orderId = searchParams.get('orderId');
    const paymentId = searchParams.get('paymentId');
    
    // Try to get payment data from localStorage first
    if (typeof window !== 'undefined') {
      const savedPaymentData = localStorage.getItem('lastPaymentData');
      if (savedPaymentData) {
        try {
          const parsedData = JSON.parse(savedPaymentData);
          setPaymentData(parsedData);
        } catch (error) {
          console.error('Error parsing payment data:', error);
        }
      }
    }

    // If we have a payment ID, fetch from API
    if (paymentId) {
      fetchPaymentData(paymentId);
    }

    setIsLoading(false);
  }, [searchParams]);

  const fetchPaymentData = async (paymentId) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}`);
      const data = await response.json();
      if (data.payment) {
        setPaymentData({
          orderId: data.payment.id,
          customerName: data.payment.orderData?.customerName || data.payment.paymentForm?.customerName,
          customerEmail: data.payment.orderData?.customerEmail || data.payment.paymentForm?.customerEmail,
          eventName: data.payment.orderData?.eventName,
          paymentMethod: data.payment.paymentMethod?.name || 
                        (data.payment.paymentMethod?.type === 'bank' ? 'Bank Transfer' :
                         data.payment.paymentMethod?.type === 'ewallet' ? 'E-Wallet' :
                         data.payment.paymentMethod?.type === 'credit_card' ? 'Kartu Kredit' :
                         data.payment.paymentMethod?.type || 'Pembayaran'),
          totalAmount: data.payment.totalAmount
        });
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };

  const handleBuyMore = () => {
    // Clear payment data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lastPaymentData');
      // Navigate to appropriate page based on order type
      if (paymentData?.items) {
        window.location.href = '/dolan-banyumas';
      } else {
        window.location.href = '/events';
      }
    }
  };

  const handleBackHome = () => {
    // Clear payment data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lastPaymentData');
      // Navigate to home page
      window.location.href = '/';
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${
          theme === 'dark' ? 'border-purple-400' : 'border-blue-500'
        }`} />
      </div>
    );
  }

  return (
    <PaymentProvider>
      <PaymentSuccess 
        paymentData={paymentData}
        onBuyMore={handleBuyMore}
        onBackHome={handleBackHome}
      />
    </PaymentProvider>
  );
}
