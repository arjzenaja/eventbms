"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BiCheckCircle } from "react-icons/bi";

const PaymentSuccess = ({ paymentData, onBuyMore, onBackHome }) => {
  const router = useRouter();
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <BiCheckCircle className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Pembayaran Berhasil!</h1>
          <p className="text-blue-200 text-lg">Terima kasih atas pembelian tiket Anda</p>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Detail Pembayaran</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Order ID:</span>
              <span className="text-white font-mono">{paymentData?.orderId || 'ORDER-1757763228421'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-300">Nama:</span>
              <span className="text-white">{paymentData?.customerName || 'Arjzen'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-300">Email:</span>
              <span className="text-white">{paymentData?.customerEmail || 'arjzenimato1706@gmail.com'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-300">Event:</span>
              <span className="text-white">{paymentData?.eventName || 'Sample Event'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-300">Metode Pembayaran:</span>
              <span className="text-white">{paymentData?.paymentMethod || 'E-Wallet (DANA)'}</span>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t border-white/20">
              <span className="text-gray-300 font-semibold">Total:</span>
              <span className="text-green-400 font-bold text-lg">
                {formatPrice(paymentData?.totalAmount || 111500)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleBuyMore}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Beli Tiket Lainnya
          </button>
          
          <button
            onClick={handleBackHome}
            className="flex-1 bg-white text-blue-600 py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
