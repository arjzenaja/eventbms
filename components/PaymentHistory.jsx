"use client";
import React, { useContext, useEffect, useState } from "react";
import { PaymentContext } from "@/context/PaymentContext";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { BiCheckCircle } from "react-icons/bi";
import { BiXCircle } from "react-icons/bi";
import { BiTime } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import { BiRefresh } from "react-icons/bi";

const PaymentHistory = () => {
  const { paymentHistory } = useContext(PaymentContext);
  const { isDark, isLight } = useTheme();
  const { user, isAuthenticated } = useUser();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchPayments();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/payments', {
        headers: {
          'Authorization': 'Bearer admin-token', // In production, use real JWT token
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      // Filter payments by user email if user is logged in
      let userPayments = data.payments || [];
      if (user && user.email) {
        userPayments = userPayments.filter(payment => 
          payment.paymentForm?.customerEmail === user.email ||
          payment.orderData?.customerEmail === user.email
        );
      }
      
      setPayments(userPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <BiCheckCircle className="text-green-400 text-lg" />;
      case 'failed':
      case 'cancelled':
        return <BiXCircle className="text-red-400 text-lg" />;
      case 'pending':
        return <BiTime className="text-yellow-400 text-lg" />;
      default:
        return <BiTime className="text-gray-400 text-lg" />;
    }
  };

  const getStatusColor = (status) => {
    if (isLight) {
      switch (status) {
        case 'completed':
          return 'bg-green-100 text-green-800 border-green-300';
        case 'failed':
        case 'cancelled':
          return 'bg-red-100 text-red-800 border-red-300';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-300';
      }
    } else {
      switch (status) {
        case 'completed':
          return 'bg-green-600/20 text-green-300 border-green-400/30';
        case 'failed':
        case 'cancelled':
          return 'bg-red-600/20 text-red-300 border-red-400/30';
        case 'pending':
          return 'bg-yellow-600/20 text-yellow-300 border-yellow-400/30';
        default:
          return 'bg-gray-600/20 text-gray-300 border-gray-400/30';
      }
    }
  };

  const formatPrice = (price) => `Rp ${Number(price || 0).toLocaleString("id-ID")}`;
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`w-8 h-8 border-2 ${isLight ? 'border-blue-400' : 'border-purple-400'} border-t-transparent rounded-full animate-spin`} />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="space-y-8 mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isLight ? 'text-gray-900' : 'text-white'} mb-2`}>Riwayat Pembayaran</h1>
            <p className={`${isLight ? 'text-blue-600' : 'text-blue-200'} text-lg`}>Semua transaksi pembayaran Anda</p>
          </div>
        </div>
        
        <div className="text-center py-16">
          <div className={`w-24 h-24 ${isLight ? 'bg-gray-100' : 'bg-white/10'} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <svg className={`w-12 h-12 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className={`text-xl font-semibold ${isLight ? 'text-gray-700' : 'text-white'} mb-2`}>Silakan Login Terlebih Dahulu</h3>
          <p className={`${isLight ? 'text-blue-600' : 'text-blue-200'} mb-6`}>Anda perlu login untuk melihat riwayat pembayaran</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          >
            Login Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isLight ? 'text-gray-900' : 'text-white'} mb-2`}>Riwayat Pembayaran</h1>
          <p className={`${isLight ? 'text-blue-600' : 'text-blue-200'} text-lg`}>Semua transaksi pembayaran Anda</p>
        </div>
        <button
          onClick={fetchPayments}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <BiRefresh className="text-lg" />
          Refresh
        </button>
      </div>

      {/* Payments List */}
      {payments.length === 0 ? (
        <div className="text-center py-16">
          <div className={`w-24 h-24 ${isLight ? 'bg-gray-100' : 'bg-white/10'} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <svg className={`w-12 h-12 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className={`text-xl font-semibold ${isLight ? 'text-gray-700' : 'text-white'} mb-2`}>Belum ada riwayat pembayaran</h3>
          <p className={`${isLight ? 'text-blue-600' : 'text-blue-200'}`}>Pembayaran Anda akan muncul di sini setelah melakukan transaksi</p>
        </div>
      ) : (
        <div className="space-y-6">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className={`${isLight ? 'bg-white border-gray-200 shadow-lg hover:shadow-xl' : 'bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl hover:bg-white/15'} rounded-2xl p-6 border transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(payment.status)}
                  <div>
                    <div className={`font-semibold ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
                      {payment.orderData?.eventName || 'Event'}
                    </div>
                    <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'} font-mono`}>
                      {payment.id}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${isLight ? 'text-purple-600' : 'text-purple-300'}`}>
                    {formatPrice(payment.totalAmount)}
                  </div>
                  <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formatDate(payment.createdAt)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <div className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Tipe Tiket</div>
                  <div className={`${isLight ? 'text-gray-900' : 'text-gray-100'} capitalize`}>{payment.orderData?.ticketType}</div>
                </div>
                <div>
                  <div className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Jumlah</div>
                  <div className={`${isLight ? 'text-gray-900' : 'text-gray-100'}`}>{payment.orderData?.amount} tiket</div>
                </div>
                <div>
                  <div className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Metode Pembayaran</div>
                  <div className={`${isLight ? 'text-gray-900' : 'text-gray-100'} flex items-center gap-2`}>
                    <span className="text-lg">{payment.paymentMethod?.icon}</span>
                    {payment.paymentMethod?.name}
                  </div>
                </div>
                <div>
                  <div className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Status</div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                  {payment.status === 'pending' && 'Menunggu verifikasi'}
                  {payment.status === 'completed' && 'Pembayaran berhasil'}
                  {payment.status === 'failed' && 'Pembayaran gagal'}
                  {payment.status === 'cancelled' && 'Pembayaran dibatalkan'}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(`/payment-status/${payment.id}`, '_blank')}
                    className={`flex items-center gap-1 px-3 py-1 ${isLight ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-blue-600/20 text-blue-300 hover:bg-blue-600/30'} rounded-lg text-sm`}
                  >
                    <BiShow className="text-sm" />
                    Detail
                  </button>
                  {payment.status === 'pending' && (
                    <button
                      onClick={() => window.open(`/payment-instructions/${payment.id}`, '_blank')}
                      className={`flex items-center gap-1 px-3 py-1 ${isLight ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-green-600/20 text-green-300 hover:bg-green-600/30'} rounded-lg text-sm`}
                    >
                      Instruksi
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
