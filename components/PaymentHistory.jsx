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
import { BiSearch } from "react-icons/bi";
import { BiCopy } from "react-icons/bi";
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
  const [searchQuery, setSearchQuery] = useState('');

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
      <div className="flex items-center justify-center h-72">
        <div className="relative">
          <div className={`w-12 h-12 rounded-full border-4 ${isLight ? 'border-blue-200' : 'border-purple-400/40'} border-t-transparent animate-spin`}></div>
          <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" style={{ animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div className="space-y-8 mt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-4xl font-black ${isLight ? 'text-gray-900' : 'text-white'} mb-2`}>Riwayat Pembayaran</h1>
            <p className={`${isLight ? 'text-blue-600' : 'text-blue-200'} text-lg`}>Semua transaksi pembayaran Anda</p>
          </div>
        </div>
        
        <div className="text-center py-16">
          <div className={`${isLight ? 'bg-gradient-to-br from-gray-100 to-gray-200' : 'bg-white/10'} w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
            <svg className={`w-12 h-12 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className={`text-2xl font-bold ${isLight ? 'text-gray-700' : 'text-white'} mb-2`}>Silakan Login Terlebih Dahulu</h3>
          <p className={`${isLight ? 'text-blue-600' : 'text-blue-200'} mb-6`}>Anda perlu login untuk melihat riwayat pembayaran</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
    const matchesStatus = statusFilter === 'all' ? true : (p.status || '').toLowerCase() === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery = !q || [
      p.id,
      p.orderData?.eventName,
      p.orderData?.ticketType,
      p.paymentMethod?.name,
      p.paymentForm?.customerEmail,
      p.orderData?.customerEmail,
    ].filter(Boolean).some(v => String(v).toLowerCase().includes(q));
    return matchesStatus && matchesQuery;
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
    <div className="space-y-10 mt-8">
      {/* Quick Filters - enhanced UI */}
      <div className={`${isLight ? 'bg-white/80 border-gray-200' : 'bg-slate-900/70 border-white/10'} backdrop-blur-xl border rounded-3xl p-4 shadow-2xl`}> 
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative">
            <BiSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${isLight ? 'text-gray-400' : 'text-gray-300'}`} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari transaksi (event, ID, email, metode)"
              className={`w-full pl-12 pr-4 py-3 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLight ? 'bg-white border-gray-300 text-gray-900' : 'bg-white/10 border-white/20 text-white placeholder:text-gray-300'}`}
            />
          </div>
          <div className="flex flex-wrap gap-3">
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
                className={`group px-5 py-2.5 rounded-2xl text-sm border transition-all duration-200 flex items-center gap-2 hover:shadow-md ${
                  (statusFilter === f.key)
                    ? (isLight ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-md' : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent shadow-lg')
                    : (isLight ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50' : 'bg-white/10 text-gray-200 border-white/20 hover:bg-white/15')
                }`}
              >
                <span className="text-base">{f.icon}</span>
                <span className="font-medium">{f.label}</span>
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  (statusFilter === f.key)
                    ? 'bg-white/20 text-white'
                    : (isLight ? 'bg-gray-100 text-gray-600' : 'bg-white/10 text-gray-300')
                }`}>
                  {statusCounts[f.key] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

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
          <h1 className={`text-4xl font-black ${isLight ? 'text-gray-900' : 'text-white'} mb-2`}>Riwayat Pembayaran</h1>
          <p className={`${isLight ? 'text-blue-600' : 'text-blue-200'} text-lg`}>Semua transaksi pembayaran Anda</p>
        </div>
        <button
          onClick={fetchPayments}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <BiRefresh className="text-lg" />
          Refresh
        </button>
      </div>

      {/* Payments List */}
      {(paymentsFiltered.length === 0) ? (
        <div className="text-center py-20">
          <div className={`${isLight ? 'bg-gradient-to-br from-gray-100 to-gray-200' : 'bg-white/10'} w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
            <svg className={`w-12 h-12 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className={`text-2xl font-bold ${isLight ? 'text-gray-700' : 'text-white'} mb-2`}>Belum ada riwayat pembayaran</h3>
          <p className={`${isLight ? 'text-blue-600' : 'text-blue-200'} mb-6`}>Pembayaran Anda akan muncul di sini setelah melakukan transaksi</p>
          <a href="/events" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg">Jelajahi Event</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {paymentsFiltered.map((payment) => (
            <div
              key={payment.id}
              className={`${isLight 
                ? 'bg-white border-gray-200 shadow-xl hover:shadow-2xl' 
                : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-white/20 shadow-2xl hover:from-white/15 hover:to-white/10'} rounded-3xl p-7 border transition-all duration-300 hover:scale-[1.01]`}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  {getStatusIcon(payment.status)}
                  <div>
                    <div className={`font-extrabold text-lg ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
                      {payment.orderData?.eventName || 'Event'}
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${isLight ? 'text-gray-500' : 'text-gray-400'} font-mono`}>
                      <span>{payment.id}</span>
                      <button
                        onClick={() => navigator.clipboard?.writeText(payment.id)}
                        className={`${isLight ? 'hover:text-gray-700' : 'hover:text-gray-200'} transition-colors`}
                        title="Copy ID"
                        aria-label="Copy ID"
                      >
                        <BiCopy />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-black ${isLight ? 'text-purple-600' : 'text-purple-300'}`}>
                    {formatPrice(payment.totalAmount)}
                  </div>
                  <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formatDate(payment.createdAt)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
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
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                    <span className="capitalize">{payment.status?.replace('_', ' ')}</span>
                  </span>
                </div>
              </div>

              <div className={`h-px ${isLight ? 'bg-gray-200' : 'bg-white/10'} my-4`} />

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
                    className={`flex items-center gap-1.5 px-3 py-1.5 ${isLight ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500/30 text-blue-200 hover:bg-blue-500/40'} rounded-lg text-sm transition-colors`}
                  >
                    <BiShow className="text-sm" />
                    Detail
                  </button>
                  {payment.status === 'pending' && (
                    <button
                      onClick={() => window.open(`/payment-instructions/${payment.id}`, '_blank')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 ${isLight ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-500/30 text-green-200 hover:bg-green-500/40'} rounded-lg text-sm transition-colors`}
                    >
                      Instruksi
                    </button>
                  )}
                  {(payment.status === 'cancelled' || payment.status === 'failed') && !payment.refund && (
                    <button
                      onClick={() => handleRefundRequest(payment)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 ${isLight ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-orange-500/30 text-orange-200 hover:bg-orange-500/40'} rounded-lg text-sm transition-colors`}
                    >
                      <BiMoneyWithdraw className="text-sm" />
                      Refund
                    </button>
                  )}
                </div>
              </div>
              
              {/* Refund Status */}
              {payment.refund && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BiMoneyWithdraw className="text-orange-400" />
                      <span className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                        Status Refund:
                      </span>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getRefundStatus(payment)?.color}`}>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${isLight ? 'bg-white' : 'bg-gray-800'} rounded-3xl p-6 max-w-md w-full shadow-2xl border ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg">
                <BiMoneyWithdraw className="text-xl" />
              </div>
              <h3 className={`text-2xl font-black ${isLight ? 'text-gray-900' : 'text-white'}`}>
                Ajukan Refund
              </h3>
            </div>
            
            <div className="mb-4">
              <div className={`${isLight ? 'bg-gray-50' : 'bg-gray-700'} rounded-xl p-4 mb-3 border ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
                <div className="text-sm font-bold text-gray-600 mb-1">Detail Pembayaran</div>
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
              <label className={`block text-sm font-bold ${isLight ? 'text-gray-700' : 'text-gray-300'} mb-2`}>
                Alasan Refund *
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Jelaskan alasan mengapa Anda meminta refund..."
                className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                className={`flex-1 px-4 py-2 border rounded-xl font-bold ${
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
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
