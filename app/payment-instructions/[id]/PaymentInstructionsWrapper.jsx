"use client";
import React, { useState, useEffect } from "react";
import PaymentInstructions from "@/components/PaymentInstructions";
import { BiLeftArrowAlt } from "react-icons/bi";

export default function PaymentInstructionsWrapper({ paymentId }) {
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayment();
  }, [paymentId]);

  const fetchPayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/payments/${paymentId}`);
      const data = await response.json();
      if (data.payment) {
        setPayment(data.payment);
      }
    } catch (error) {
      console.error("Error fetching payment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">Pembayaran tidak ditemukan</div>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <BiLeftArrowAlt className="text-xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Instruksi Pembayaran</h1>
          <p className="text-gray-400">Ikuti langkah-langkah berikut untuk menyelesaikan pembayaran</p>
        </div>
      </div>

      {/* Payment Instructions */}
      <PaymentInstructions
        paymentMethod={payment.paymentMethod}
        amount={payment.totalAmount}
        paymentForm={payment.paymentForm}
      />

      {/* Payment Summary */}
      <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Ringkasan Pembayaran</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Event:</span>
            <span className="text-gray-100">{payment.orderData?.eventName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Tipe Tiket:</span>
            <span className="text-gray-100 capitalize">{payment.orderData?.ticketType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Jumlah:</span>
            <span className="text-gray-100">{payment.orderData?.amount} tiket</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Subtotal:</span>
            <span className="text-gray-100">Rp {Number(payment.amount || 0).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Biaya Admin:</span>
            <span className="text-gray-100">Rp {Number(payment.fee || 0).toLocaleString("id-ID")}</span>
          </div>
          <div className="h-px bg-white/10 my-2" />
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-gray-200">Total:</span>
            <span className="text-purple-300">Rp {Number(payment.totalAmount || 0).toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-6 text-center">
        <div className="text-sm text-gray-400">
          Butuh bantuan? Hubungi kami di{" "}
          <a href="mailto:support@eventbms.com" className="text-purple-400 hover:text-purple-300">
            support@eventbms.com
          </a>
        </div>
      </div>
    </>
  );
}
