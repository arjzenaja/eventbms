"use client";
import React, { useContext, useEffect, useState } from "react";
import { PaymentContext } from "@/context/PaymentContext";
import { useTheme } from "@/context/ThemeContext";
import { BiCheckCircle } from "react-icons/bi";
import { BiXCircle } from "react-icons/bi";
import { BiTime } from "react-icons/bi";
import { BiRefresh } from "react-icons/bi";
import { BiDownload } from "react-icons/bi";
import { BiShare } from "react-icons/bi";
import { BiCopy } from "react-icons/bi";
import { BiCalendar } from "react-icons/bi";
import { BiCreditCard } from "react-icons/bi";
import { BiUser } from "react-icons/bi";
import { BiEnvelope } from "react-icons/bi";
import { BiPhone } from "react-icons/bi";
import { BiReceipt } from "react-icons/bi";

const PaymentStatus = ({ paymentId, onRefresh }) => {
  const { paymentHistory } = useContext(PaymentContext);
  const { isDark, isLight } = useTheme();
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (paymentId) {
      fetchPaymentStatus();
    }
  }, [paymentId]);

  const fetchPaymentStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/payments/${paymentId}`);
      const data = await response.json();
      if (data.payment) {
        setPayment(data.payment);
      }
    } catch (error) {
      console.error("Error fetching payment status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <BiCheckCircle className="text-green-400 text-4xl" />;
      case 'failed':
      case 'cancelled':
        return <BiXCircle className="text-red-400 text-4xl" />;
      case 'pending':
        return <BiTime className="text-yellow-400 text-4xl" />;
      default:
        return <BiTime className="text-gray-400 text-4xl" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Pembayaran Berhasil';
      case 'failed':
        return 'Pembayaran Gagal';
      case 'cancelled':
        return 'Pembayaran Dibatalkan';
      case 'pending':
        return 'Menunggu Pembayaran';
      default:
        return 'Status Tidak Diketahui';
    }
  };

  const getStatusColor = (status) => {
    if (isLight) {
      switch (status) {
        case 'completed':
          return 'text-green-600';
        case 'failed':
        case 'cancelled':
          return 'text-red-600';
        case 'pending':
          return 'text-yellow-600';
        default:
          return 'text-gray-600';
      }
    } else {
      switch (status) {
        case 'completed':
          return 'text-green-400';
        case 'failed':
        case 'cancelled':
          return 'text-red-400';
        case 'pending':
          return 'text-yellow-400';
        default:
          return 'text-gray-400';
      }
    }
  };

  const getStatusBgColor = (status) => {
    if (isLight) {
      switch (status) {
        case 'completed':
          return 'bg-green-100 border-green-300';
        case 'failed':
        case 'cancelled':
          return 'bg-red-100 border-red-300';
        case 'pending':
          return 'bg-yellow-100 border-yellow-300';
        default:
          return 'bg-gray-100 border-gray-300';
      }
    } else {
      switch (status) {
        case 'completed':
          return 'bg-green-500/20 border-green-400/30';
        case 'failed':
        case 'cancelled':
          return 'bg-red-500/20 border-red-400/30';
        case 'pending':
          return 'bg-yellow-500/20 border-yellow-400/30';
        default:
          return 'bg-gray-500/20 border-gray-400/30';
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
  };

  const formatPrice = (price) => `Rp ${Number(price || 0).toLocaleString("id-ID")}`;
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${isLight ? 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50' : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 ${isLight ? 'border-blue-400' : 'border-purple-400'} border-t-transparent rounded-full animate-spin mx-auto mb-4`} />
          <p className={`${isLight ? 'text-gray-900' : 'text-white'} text-lg`}>Memuat status pembayaran...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className={`min-h-screen ${isLight ? 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50' : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'} flex items-center justify-center p-4`}>
        <div className="max-w-md w-full text-center">
          <div className={`${isLight ? 'bg-white border-gray-200 shadow-lg' : 'bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl'} rounded-3xl p-8 border`}>
            <div className={`w-20 h-20 ${isLight ? 'bg-red-100' : 'bg-red-500/20'} rounded-full flex items-center justify-center mx-auto mb-6`}>
              <BiXCircle className={`${isLight ? 'text-red-600' : 'text-red-400'} text-4xl`} />
            </div>
            <h2 className={`text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-white'} mb-4`}>Pembayaran Tidak Ditemukan</h2>
            <p className={`${isLight ? 'text-blue-600' : 'text-blue-200'} mb-8`}>ID pembayaran tidak valid atau telah dihapus</p>
            <button
              onClick={fetchPaymentStatus}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              <BiRefresh className="inline mr-2" />
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isLight ? 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50' : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'} p-4`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${isLight ? 'text-gray-900' : 'text-white'} mb-2`}>Status Pembayaran</h1>
          <p className={`${isLight ? 'text-blue-600' : 'text-blue-200'} text-lg`}>Detail transaksi pembayaran Anda</p>
        </div>

        {/* Status Card */}
        <div className={`${getStatusBgColor(payment.status)} ${isLight ? 'shadow-lg' : 'backdrop-blur-lg shadow-2xl'} rounded-3xl p-8 border`}>
          <div className="text-center mb-8">
            <div className={`w-24 h-24 ${isLight ? 'bg-white' : 'bg-white/10'} rounded-full flex items-center justify-center mx-auto mb-6`}>
              {getStatusIcon(payment.status)}
            </div>
            <h2 className={`text-3xl font-bold ${isLight ? 'text-gray-900' : 'text-white'} mb-2`}>
              {getStatusText(payment.status)}
            </h2>
            <p className={`text-lg ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
              {payment.status === 'completed' && 'Pembayaran Anda telah berhasil diproses'}
              {payment.status === 'pending' && 'Menunggu konfirmasi pembayaran'}
              {payment.status === 'failed' && 'Pembayaran gagal diproses'}
              {payment.status === 'cancelled' && 'Pembayaran telah dibatalkan'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className={`${isLight ? 'bg-gray-50' : 'bg-white/5'} rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <BiCalendar className={`${isLight ? 'text-blue-600' : 'text-blue-400'} text-xl`} />
                <h3 className={`text-lg font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>Tanggal Transaksi</h3>
              </div>
              <p className={`${isLight ? 'text-gray-600' : 'text-gray-300'}`}>{formatDate(payment.createdAt)}</p>
            </div>

            <div className={`${isLight ? 'bg-gray-50' : 'bg-white/5'} rounded-2xl p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <BiCreditCard className={`${isLight ? 'text-green-600' : 'text-green-400'} text-xl`} />
                <h3 className={`text-lg font-semibold ${isLight ? 'text-gray-900' : 'text-white'}`}>Total Pembayaran</h3>
              </div>
              <p className={`text-2xl font-bold ${isLight ? 'text-green-600' : 'text-green-400'}`}>{formatPrice(payment.totalAmount)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`}>ID Transaksi:</span>
              <span className={`${isLight ? 'text-gray-900' : 'text-white'} font-mono ${isLight ? 'bg-gray-100' : 'bg-white/10'} px-3 py-1 rounded-lg`}>
                {payment.id}
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(payment.id)}
              className={`flex items-center gap-2 px-4 py-2 ${isLight ? 'bg-gray-100 hover:bg-gray-200' : 'bg-white/10 hover:bg-white/20'} rounded-lg transition-colors`}
            >
              <BiCopy className="text-lg" />
              <span className="text-sm">Copy</span>
            </button>
          </div>
        </div>

        {/* Payment Details */}
        <div className={`${isLight ? 'bg-white border-gray-200 shadow-lg' : 'bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl'} rounded-3xl p-8 border`}>
          <h3 className={`text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-white'} mb-8 flex items-center gap-3`}>
            <BiReceipt className={`${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
            Detail Pembayaran
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Event Information */}
            <div className="space-y-6">
              <div className={`${isLight ? 'bg-gray-50' : 'bg-white/5'} rounded-2xl p-6`}>
                <h4 className={`text-lg font-semibold ${isLight ? 'text-gray-900' : 'text-white'} mb-4 flex items-center gap-2`}>
                  <BiReceipt className={`${isLight ? 'text-purple-600' : 'text-purple-400'}`} />
                  {payment.orderData?.ticketType === 'culinary' ? 'Informasi Pesanan' : 'Informasi Event'}
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className={`${isLight ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
                      {payment.orderData?.ticketType === 'culinary' ? 'Kuliner' : 'Nama Event'}
                    </span>
                    <p className={`${isLight ? 'text-gray-900' : 'text-white'} font-medium`}>{payment.orderData?.eventName || 'N/A'}</p>
                  </div>
                  <div>
                    <span className={`${isLight ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
                      {payment.orderData?.ticketType === 'culinary' ? 'Tipe Pesanan' : 'Tipe Tiket'}
                    </span>
                    <p className={`${isLight ? 'text-gray-900' : 'text-white'} capitalize`}>
                      {payment.orderData?.ticketType === 'culinary' ? 'Pesanan Kuliner' : payment.orderData?.ticketType || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className={`${isLight ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
                      {payment.orderData?.ticketType === 'culinary' ? 'Jumlah Item' : 'Jumlah Tiket'}
                    </span>
                    <p className={`${isLight ? 'text-gray-900' : 'text-white'}`}>
                      {payment.orderData?.amount || 0} {payment.orderData?.ticketType === 'culinary' ? 'item' : 'tiket'}
                    </p>
                  </div>
                  {payment.orderData?.address && (
                    <div>
                      <span className={`${isLight ? 'text-gray-500' : 'text-gray-400'} text-sm`}>Alamat Pengiriman</span>
                      <p className={`${isLight ? 'text-gray-900' : 'text-white'}`}>{payment.orderData.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Information */}
              <div className={`${isLight ? 'bg-gray-50' : 'bg-white/5'} rounded-2xl p-6`}>
                <h4 className={`text-lg font-semibold ${isLight ? 'text-gray-900' : 'text-white'} mb-4 flex items-center gap-2`}>
                  <BiUser className={`${isLight ? 'text-green-600' : 'text-green-400'}`} />
                  Informasi Customer
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <BiUser className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`} />
                    <div>
                      <span className={`${isLight ? 'text-gray-500' : 'text-gray-400'} text-sm`}>Nama</span>
                      <p className={`${isLight ? 'text-gray-900' : 'text-white'}`}>{payment.orderData?.customerName || payment.paymentForm?.customerName || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BiEnvelope className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`} />
                    <div>
                      <span className={`${isLight ? 'text-gray-500' : 'text-gray-400'} text-sm`}>Email</span>
                      <p className={`${isLight ? 'text-gray-900' : 'text-white'}`}>{payment.orderData?.customerEmail || payment.paymentForm?.customerEmail || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BiPhone className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`} />
                    <div>
                      <span className={`${isLight ? 'text-gray-500' : 'text-gray-400'} text-sm`}>Telepon</span>
                      <p className={`${isLight ? 'text-gray-900' : 'text-white'}`}>{payment.orderData?.customerPhone || payment.paymentForm?.customerPhone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-6">
              <div className={`${isLight ? 'bg-gray-50' : 'bg-white/5'} rounded-2xl p-6`}>
                <h4 className={`text-lg font-semibold ${isLight ? 'text-gray-900' : 'text-white'} mb-4 flex items-center gap-2`}>
                  <BiCreditCard className={`${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                  Metode Pembayaran
                </h4>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {payment.paymentMethod?.icon || 
                     (payment.paymentMethod?.type === 'bank' ? '🏦' : 
                      payment.paymentMethod?.type === 'ewallet' ? '📱' : 
                      payment.paymentMethod?.type === 'credit_card' ? '💳' : '💳')}
                  </span>
                  <div>
                    <p className={`${isLight ? 'text-gray-900' : 'text-white'} font-medium`}>
                      {payment.paymentMethod?.name || 
                       payment.paymentMethod?.type === 'bank' ? 'Bank Transfer' :
                       payment.paymentMethod?.type === 'ewallet' ? 'E-Wallet' :
                       payment.paymentMethod?.type === 'credit_card' ? 'Kartu Kredit' :
                       payment.paymentMethod?.type || 'Pembayaran'}
                    </p>
                    <p className={`${isLight ? 'text-gray-500' : 'text-gray-400'} text-sm`}>
                      {payment.paymentMethod?.type === 'bank' ? 'Transfer Bank' :
                       payment.paymentMethod?.type === 'ewallet' ? 'Dompet Digital' :
                       payment.paymentMethod?.type === 'credit_card' ? 'Kartu Kredit' :
                       payment.paymentMethod?.type || 'Metode Pembayaran'}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${isLight ? 'bg-gray-50' : 'bg-white/5'} rounded-2xl p-6`}>
                <h4 className={`text-lg font-semibold ${isLight ? 'text-gray-900' : 'text-white'} mb-4`}>Rincian Harga</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Subtotal</span>
                    <span className={`${isLight ? 'text-gray-900' : 'text-white'}`}>{formatPrice(payment.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Biaya Admin</span>
                    <span className={`${isLight ? 'text-gray-900' : 'text-white'}`}>{formatPrice(payment.fee)}</span>
                  </div>
                  <div className={`h-px ${isLight ? 'bg-gray-200' : 'bg-white/10'} my-3`} />
                  <div className="flex justify-between text-lg font-bold">
                    <span className={`${isLight ? 'text-gray-900' : 'text-white'}`}>Total</span>
                    <span className={`${isLight ? 'text-green-600' : 'text-green-400'}`}>{formatPrice(payment.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Instructions (if pending) */}
        {payment.status === 'pending' && payment.paymentMethod && (
          <div className={`${isLight ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300 shadow-lg' : 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-lg border-blue-400/30 shadow-2xl'} rounded-3xl p-8 border`}>
            <h3 className={`text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-white'} mb-6 flex items-center gap-3`}>
              <BiCreditCard className={`${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
              Instruksi Pembayaran
            </h3>
            
            {payment.paymentMethod.id === 'bank_transfer' && (
              <div className="space-y-6">
                <div className={`text-lg ${isLight ? 'text-blue-600' : 'text-blue-200'}`}>
                  Transfer ke rekening berikut:
                </div>
                <div className={`${isLight ? 'bg-white' : 'bg-white/10'} rounded-2xl p-6`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={`${isLight ? 'text-blue-600' : 'text-blue-200'}`}>Bank:</span>
                        <span className={`${isLight ? 'text-gray-900' : 'text-white'} font-medium`}>{payment.paymentForm.bankCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${isLight ? 'text-blue-600' : 'text-blue-200'}`}>No. Rekening:</span>
                        <span className={`${isLight ? 'text-gray-900' : 'text-white'} font-mono ${isLight ? 'bg-gray-100' : 'bg-white/10'} px-3 py-1 rounded-lg`}>
                          {payment.paymentForm.accountNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${isLight ? 'text-blue-600' : 'text-blue-200'}`}>Atas Nama:</span>
                        <span className={`${isLight ? 'text-gray-900' : 'text-white'} font-medium`}>{payment.paymentForm.accountHolder}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className={`${isLight ? 'text-blue-600' : 'text-blue-200'} text-sm mb-2`}>Jumlah Transfer</div>
                        <div className={`text-3xl font-bold ${isLight ? 'text-gray-900' : 'text-white'} ${isLight ? 'bg-green-100' : 'bg-green-500/20'} px-6 py-3 rounded-xl`}>
                          {formatPrice(payment.totalAmount)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {payment.paymentMethod.id === 'e_wallet' && (
              <div className="space-y-6">
                <div className={`text-lg ${isLight ? 'text-blue-600' : 'text-blue-200'}`}>
                  Transfer ke e-wallet berikut:
                </div>
                <div className={`${isLight ? 'bg-white' : 'bg-white/10'} rounded-2xl p-6`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={`${isLight ? 'text-blue-600' : 'text-blue-200'}`}>E-Wallet:</span>
                        <span className={`${isLight ? 'text-gray-900' : 'text-white'} font-medium`}>{payment.paymentForm.walletCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${isLight ? 'text-blue-600' : 'text-blue-200'}`}>Nomor:</span>
                        <span className={`${isLight ? 'text-gray-900' : 'text-white'} font-mono ${isLight ? 'bg-gray-100' : 'bg-white/10'} px-3 py-1 rounded-lg`}>
                          {payment.paymentForm.phoneNumber}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <div className={`${isLight ? 'text-blue-600' : 'text-blue-200'} text-sm mb-2`}>Jumlah Transfer</div>
                        <div className={`text-3xl font-bold ${isLight ? 'text-gray-900' : 'text-white'} ${isLight ? 'bg-green-100' : 'bg-green-500/20'} px-6 py-3 rounded-xl`}>
                          {formatPrice(payment.totalAmount)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={`mt-6 p-4 ${isLight ? 'bg-yellow-100 border-yellow-300' : 'bg-yellow-500/20 border-yellow-400/30'} rounded-xl border`}>
              <div className={`flex items-center gap-2 ${isLight ? 'text-yellow-700' : 'text-yellow-200'}`}>
                <BiTime className="text-lg" />
                <span className="font-medium">Pembayaran akan diverifikasi dalam 1x24 jam</span>
              </div>
            </div>
          </div>
        )}

        {/* Admin Notes (if any) */}
        {payment.adminNotes && (
          <div className={`${isLight ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300 shadow-lg' : 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-lg border-yellow-400/30 shadow-2xl'} rounded-3xl p-6 border`}>
            <h4 className={`text-lg font-semibold ${isLight ? 'text-yellow-700' : 'text-yellow-300'} mb-3 flex items-center gap-2`}>
              <BiTime className="text-lg" />
              Catatan Admin
            </h4>
            <p className={`${isLight ? 'text-yellow-600' : 'text-yellow-200'}`}>{payment.adminNotes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={fetchPaymentStatus}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <BiRefresh className="text-xl" />
            Refresh Status
          </button>
          
          <button
            onClick={() => window.print()}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <BiDownload className="text-xl" />
            Download PDF
          </button>
          
          <button
            onClick={() => copyToClipboard(window.location.href)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
          >
            <BiShare className="text-xl" />
            Share Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;

