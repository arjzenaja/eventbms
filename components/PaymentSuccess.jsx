"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BiCheckCircle } from "react-icons/bi";
import CulinaryOrderDetails from "./CulinaryOrderDetails";
import { useTheme } from "@/context/ThemeContext";

const PaymentSuccess = ({ paymentData, onBuyMore, onBackHome }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (price) => `Rp ${Number(price || 0).toLocaleString("id-ID")}`;

  const handleBuyMore = () => {
    if (onBuyMore) {
      onBuyMore();
    } else {
      router.push('/events');
    }
  };

  const handleBackHome = () => {
    if (onBackHome) {
      onBackHome();
    } else {
      router.push('/');
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
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <BiCheckCircle className="text-white text-4xl" />
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Pembayaran Berhasil!
          </h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-blue-200' : 'text-gray-600'
          }`}>
            {paymentData?.items ? 'Terima kasih atas pesanan kuliner Anda' : 'Terima kasih atas pembelian tiket Anda'}
          </p>
        </div>

        {/* Payment Details Card */}
        {paymentData?.items ? (
          <div className={`rounded-2xl p-6 shadow-2xl mb-8 ${
            theme === 'dark' 
              ? 'bg-white/10 backdrop-blur-lg border border-white/20' 
              : 'bg-white border border-gray-200'
          }`}>
            <CulinaryOrderDetails 
              orderData={paymentData} 
              paymentData={paymentData}
            />
          </div>
        ) : (
          <div className={`rounded-2xl p-6 shadow-2xl mb-8 ${
            theme === 'dark' 
              ? 'bg-white/10 backdrop-blur-lg border border-white/20' 
              : 'bg-white border border-gray-200'
          }`}>
            <h2 className={`text-xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Detail Pembayaran
            </h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Order ID:</span>
                <span className={`font-mono ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {paymentData?.orderId || 'ORDER-1757763228421'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Nama:</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {paymentData?.customerName || 'Arjzen'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Email:</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {paymentData?.customerEmail || 'arjzenimato1706@gmail.com'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Event:</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {paymentData?.eventName || 'Sample Event'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Metode Pembayaran:</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  {paymentData?.paymentMethod || 'E-Wallet (DANA)'}
                </span>
              </div>
              
              <div className={`flex justify-between items-center pt-3 border-t ${
                theme === 'dark' ? 'border-white/20' : 'border-gray-200'
              }`}>
                <span className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total:
                </span>
                <span className="text-green-500 font-bold text-lg">
                  {formatPrice(paymentData?.totalAmount || 111500)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleBuyMore}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            {paymentData?.items ? 'Pesan Kuliner Lainnya' : 'Beli Tiket Lainnya'}
          </button>
          
          <button
            onClick={handleBackHome}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-colors ${
              theme === 'dark'
                ? 'bg-white text-blue-600 hover:bg-gray-100'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            }`}
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
