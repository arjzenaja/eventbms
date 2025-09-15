"use client";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PaymentContext } from "@/context/PaymentContext";
import { useTheme } from "@/context/ThemeContext";
import { useUser } from "@/context/UserContext";
import { BiCheckCircle } from "react-icons/bi";
import { BiXCircle } from "react-icons/bi";
import { BiTime } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import { BiRefresh } from "react-icons/bi";
import { BiMoneyWithdraw } from "react-icons/bi";
import { Toast } from "@/components/ui/alert";

const PaymentHistory = () => {
  const { paymentHistory } = useContext(PaymentContext);
  const { isDark, isLight } = useTheme();
  const { user, isAuthenticated } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [refundReason, setRefundReason] = useState('');
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'info', title: '', message: '' });

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

  const getRefundStatus = (payment) => {
    if (!payment.refund) return null;
    const isLightMode = isLight;
    switch (payment.refund.status) {
      case 'pending':
        return { text: 'Refund Diajukan', color: isLightMode ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-yellow-600/20 text-yellow-300 border-yellow-400/30' };
      case 'approved':
        return { text: 'Refund Disetujui', color: isLightMode ? 'bg-green-100 text-green-800 border-green-300' : 'bg-green-600/20 text-green-300 border-green-400/30' };
      case 'processed':
        return { text: 'Refund Diproses', color: isLightMode ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-blue-600/20 text-blue-300 border-blue-400/30' };
      case 'rejected':
        return { text: 'Refund Ditolak', color: isLightMode ? 'bg-red-100 text-red-800 border-red-300' : 'bg-red-600/20 text-red-300 border-red-400/30' };
      default:
        return null;
    }
  };
  const handleRefundRequest = (payment) => {
    setSelectedPayment(payment);
    setRefundReason('');
    setShowRefundModal(true);
  };

  const submitRefundRequest = async () => {
    if (!refundReason.trim()) {
      setToast({ show: true, type: 'warning', title: 'Alasan diperlukan', message: 'Mohon isi alasan refund.' });
      return;
    }
    setIsSubmittingRefund(true);
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: selectedPayment.id,
          reason: refundReason.trim()
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setToast({ show: true, type: 'success', title: 'Berhasil', message: 'Permintaan refund berhasil diajukan! Admin akan memproses 1-3 hari kerja.' });
        setShowRefundModal(false);
        setRefundReason('');
        await fetchPayments();
      } else {
        setToast({ show: true, type: 'error', title: 'Gagal mengajukan', message: data.error || 'Coba lagi nanti.' });
      }
    } catch (err) {
      setToast({ show: true, type: 'error', title: 'Kesalahan', message: 'Gagal menghubungi server.' });
    } finally {
      setIsSubmittingRefund(false);
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

  // URL filter param
  const statusFilter = (searchParams?.get('status') || 'all').toLowerCase();

  const paymentsFiltered = payments.filter((p) => {
    if (statusFilter === 'all') return true;
    return (p.status || '').toLowerCase() === statusFilter;
  });

  const setStatusFilter = (status) => {
    const params = new URLSearchParams(Array.from(searchParams?.entries?.() || []));
    if (!status || status === 'all') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    router.push(`/payment-history${params.toString() ? `?${params.toString()}` : ''}`);
  };

  // Build counts for badges
  const statusCounts = payments.reduce((acc, p) => {
    const key = (p.status || 'unknown').toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    acc.all = (acc.all || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8 mt-8">
      {/* Quick Filters - enhanced UI */}
      <div className={`z-40 ${isLight ? 'bg-white/90 border-gray-200' : 'bg-slate-900/80 border-white/10'} backdrop-blur-md border rounded-2xl p-3 shadow-lg`}> 
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'Semua', icon: '📋' },
            { key: 'pending', label: 'Pending', icon: '⏳' },
            { key: 'completed', label: 'Berhasil', icon: '✅' },
            { key: 'failed', label: 'Gagal', icon: '❌' },
            { key: 'cancelled', label: 'Dibatalkan', icon: '🛑' },
            { key: 'refund_requested', label: 'Refund Diajukan', icon: '🧾' },
            { key: 'refunded', label: 'Refund Disetujui', icon: '💸' },
            { key: 'refund_rejected', label: 'Refund Ditolak', icon: '🚫' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`group px-4 py-2 rounded-full text-sm border transition-all duration-200 flex items-center gap-2 ${
                (statusFilter === f.key)
                  ? (isLight ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md' : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent shadow-lg')
                  : (isLight ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50' : 'bg-white/10 text-gray-200 border-white/20 hover:bg-white/15')
              }`}
            >
              <span className="text-base">{f.icon}</span>
              <span className="font-medium">{f.label}</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                (statusFilter === f.key)
                  ? (isLight ? 'bg-white/20 text-white' : 'bg-white/20 text-white')
                  : (isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-gray-300')
              }`}>
                {statusCounts[f.key] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="h-4 xl:h-8" />
      <Toast
        type={toast.type}
        title={toast.title}
        message={toast.message}
        show={toast.show}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
        position="top-right"
        autoClose={true}
        autoCloseDelay={2600}
      />
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
      {(paymentsFiltered.length === 0) ? (
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
          {paymentsFiltered.map((payment) => (
            <div
              key={payment.id}
              className={`${isLight 
                ? 'bg-white border-gray-200 shadow-lg hover:shadow-xl' 
                : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border-white/20 shadow-2xl hover:from-white/15 hover:to-white/10'} rounded-3xl p-6 border transition-all duration-300 hover:scale-[1.01]`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(payment.status)}
                  <div>
                    <div className={`font-semibold text-lg ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
                      {payment.orderData?.eventName || 'Event'}
                    </div>
                    <div className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-400'} font-mono`}> 
                      {payment.id}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-extrabold ${isLight ? 'text-purple-600' : 'text-purple-300'}`}>
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
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                    <span className="capitalize">{payment.status?.replace('_', ' ')}</span>
                  </span>
                </div>
              </div>

              <div className={`h-px ${isLight ? 'bg-gray-200' : 'bg-white/10'} my-3`} />

              <div className="flex items-center justify-between">
                <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                  {payment.status === 'pending' && 'Menunggu verifikasi'}
                  {payment.status === 'completed' && 'Pembayaran berhasil'}
                  {payment.status === 'failed' && 'Pembayaran gagal'}
                  {payment.status === 'cancelled' && 'Pembayaran dibatalkan'}
                  {payment.status === 'refund_requested' && 'Refund diajukan'}
                  {payment.status === 'refunded' && 'Refund diproses'}
                  {payment.status === 'refund_rejected' && 'Refund ditolak'}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(`/payment-status/${payment.id}`, '_blank')}
                    className={`flex items-center gap-1 px-3 py-1 ${isLight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500/30 text-blue-200 hover:bg-blue-500/40'} rounded-lg text-sm transition-colors`}
                  >
                    <BiShow className="text-sm" />
                    Detail
                  </button>
                  {payment.status === 'pending' && (
                    <button
                      onClick={() => window.open(`/payment-instructions/${payment.id}`, '_blank')}
                      className={`flex items-center gap-1 px-3 py-1 ${isLight ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-500/30 text-green-200 hover:bg-green-500/40'} rounded-lg text-sm transition-colors`}
                    >
                      Instruksi
                    </button>
                  )}
                  {(payment.status === 'cancelled' || payment.status === 'failed') && !payment.refund && (
                    <button
                      onClick={() => handleRefundRequest(payment)}
                      className={`flex items-center gap-1 px-3 py-1 ${isLight ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-orange-500/30 text-orange-200 hover:bg-orange-500/40'} rounded-lg text-sm transition-colors`}
                    >
                      <BiMoneyWithdraw className="text-sm" />
                      Refund
                    </button>
                  )}
                </div>
              </div>
              
              {/* Refund Status */}
              {payment.refund && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BiMoneyWithdraw className="text-orange-500" />
                      <span className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                        Status Refund:
                      </span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRefundStatus(payment)?.color}`}>
                      {getRefundStatus(payment)?.text}
                    </span>
                  </div>
                  {payment.refund.reason && (
                    <div className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                      Alasan: {payment.refund.reason}
                    </div>
                  )}
                  {payment.refund.adminNote && (
                    <div className={`text-xs ${isLight ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                      Catatan Admin: {payment.refund.adminNote}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Refund Request Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isLight ? 'bg-white' : 'bg-gray-800'} rounded-2xl p-6 max-w-md w-full`}>
            <h3 className={`text-xl font-bold ${isLight ? 'text-gray-900' : 'text-white'} mb-4`}>
              Ajukan Refund
            </h3>
            
            <div className="mb-4">
              <div className={`${isLight ? 'bg-gray-50' : 'bg-gray-700'} rounded-lg p-3 mb-3`}>
                <div className="text-sm font-medium text-gray-600 mb-1">Detail Pembayaran</div>
                <div className={`${isLight ? 'text-gray-900' : 'text-white'} font-semibold`}>
                  {selectedPayment?.orderData?.eventName}
                </div>
                <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                  ID: {selectedPayment?.id}
                </div>
                <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                  Jumlah: {formatPrice(selectedPayment?.totalAmount)}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium ${isLight ? 'text-gray-700' : 'text-gray-300'} mb-2`}>
                Alasan Refund *
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Jelaskan alasan mengapa Anda meminta refund..."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isLight 
                    ? 'bg-white border-gray-300 text-gray-900' 
                    : 'bg-gray-700 border-gray-600 text-white'
                }`}
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRefundModal(false)}
                className={`flex-1 px-4 py-2 border rounded-lg font-medium ${
                  isLight 
                    ? 'border-gray-300 text-gray-700 hover:bg-gray-50' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Batal
              </button>
              <button
                onClick={submitRefundRequest}
                disabled={isSubmittingRefund}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingRefund ? 'Mengirim...' : 'Ajukan Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
