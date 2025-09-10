"use client";
import React, { useContext, useState } from "react";
import { PaymentContext } from "@/context/PaymentContext";
import { TicketContext } from "@/context/TicketContext";
import PaymentMethod from "./PaymentMethod";
import PaymentForm from "./PaymentForm";
import { BiArrowLeft, BiCheckCircle, BiXCircle, BiClock } from "react-icons/bi";

const PaymentCheckout = ({ onBack, onSuccess }) => {
  const { checkoutData } = useContext(TicketContext);
  const { paymentStatus, resetPayment } = useContext(PaymentContext);
  const [currentStep, setCurrentStep] = useState(1); // 1: Payment Method, 2: Payment Form, 3: Success

  const formatPrice = (price) => `Rp ${Number(price || 0).toLocaleString("id-ID")}`;

  const handlePaymentMethodSelect = (method) => {
    setCurrentStep(2);
  };

  const handlePaymentSuccess = (result) => {
    setCurrentStep(3);
    if (onSuccess) {
      onSuccess(result);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 1 && onBack) {
      onBack();
    }
  };

  const handleNewPayment = () => {
    resetPayment();
    setCurrentStep(1);
  };

  if (!checkoutData) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">Tidak ada data pembayaran</div>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleBack}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <BiArrowLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Checkout Pembayaran</h1>
          <p className="text-gray-400">Selesaikan pembayaran untuk tiket Anda</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Order Summary */}
        <div className="space-y-6">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Ringkasan Pesanan</h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400">Event</div>
                <div className="font-medium text-gray-100">{checkoutData.eventName}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Tipe Tiket</div>
                <div className="font-medium text-gray-100 capitalize">{checkoutData.ticketType}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Harga per Tiket</div>
                <div className="font-medium text-gray-100">{formatPrice(checkoutData.ticketPrice)}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-400">Jumlah</div>
                <div className="font-medium text-gray-100">{checkoutData.amount} tiket</div>
              </div>
              
              <div className="h-px bg-white/10" />
              
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-200">Total</span>
                <span className="text-purple-300">{formatPrice(checkoutData.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          {paymentStatus.isProcessing && (
            <div className="bg-blue-600/10 border border-blue-400/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <div className="text-blue-300 font-medium">Memproses pembayaran...</div>
              </div>
            </div>
          )}

          {paymentStatus.isSuccess && (
            <div className="bg-green-600/10 border border-green-400/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <BiCheckCircle className="text-green-400 text-xl" />
                <div>
                  <div className="text-green-300 font-medium">Pembayaran Berhasil!</div>
                  <div className="text-green-200 text-sm">ID Transaksi: {paymentStatus.transactionId}</div>
                </div>
              </div>
            </div>
          )}

          {paymentStatus.isFailed && (
            <div className="bg-red-600/10 border border-red-400/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <BiXCircle className="text-red-400 text-xl" />
                <div>
                  <div className="text-red-300 font-medium">Pembayaran Gagal</div>
                  <div className="text-red-200 text-sm">{paymentStatus.errorMessage}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Payment Process */}
        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${
              currentStep >= 1 ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-white/20' : 'bg-gray-600'
              }`}>
                1
              </div>
              Pilih Metode
            </div>
            <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-purple-600' : 'bg-white/10'}`} />
            <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${
              currentStep >= 2 ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-white/20' : 'bg-gray-600'
              }`}>
                2
              </div>
              Isi Data
            </div>
            <div className={`w-8 h-0.5 ${currentStep >= 3 ? 'bg-purple-600' : 'bg-white/10'}`} />
            <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${
              currentStep >= 3 ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? 'bg-white/20' : 'bg-gray-600'
              }`}>
                3
              </div>
              Selesai
            </div>
          </div>

          {/* Payment Steps */}
          {currentStep === 1 && (
            <PaymentMethod onMethodSelect={handlePaymentMethodSelect} />
          )}

          {currentStep === 2 && (
            <PaymentForm 
              orderData={checkoutData} 
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}

          {currentStep === 3 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BiCheckCircle className="text-green-400 text-4xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Pembayaran Berhasil!</h2>
              <p className="text-gray-400 mb-6">
                Terima kasih! Tiket Anda telah berhasil dipesan. 
                Detail tiket akan dikirim ke email Anda.
              </p>
              <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-gray-400">ID Transaksi</div>
                  <div className="font-mono text-gray-100">{paymentStatus.transactionId}</div>
                </div>
                <button
                  onClick={handleNewPayment}
                  className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Buat Pesanan Baru
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
