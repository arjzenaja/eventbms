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
import { BiMoneyWithdraw } from "react-icons/bi";
  import { Toast } from "@/components/ui/alert";

const PaymentStatus = ({ paymentId, onRefresh }) => {
  const { paymentHistory } = useContext(PaymentContext);
  const { isDark, isLight } = useTheme();
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'info', title: '', message: '' });

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

  const getStatusText = (status, refundStatus) => {
    // Prioritize refund status when exists
    if (refundStatus) {
      switch (refundStatus) {
        case 'pending':
          return 'Refund Diajukan';
        case 'approved':
          return 'Refund Disetujui';
        case 'processed':
          return 'Refund Diproses';
        case 'rejected':
          return 'Refund Ditolak';
        default:
          break;
      }
    }
    switch (status) {
      case 'completed':
        return 'Pembayaran Berhasil';
      case 'failed':
        return 'Pembayaran Gagal';
      case 'cancelled':
        return 'Pembayaran Dibatalkan';
      case 'pending':
        return 'Menunggu Pembayaran';
      case 'refund_requested':
        return 'Refund Diajukan';
      case 'refunded':
        return 'Refund Disetujui';
      case 'refund_rejected':
        return 'Refund Ditolak';
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
    setToast({ show: true, type: 'success', title: 'Tersalin', message: 'Teks berhasil disalin.' });
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

  // Convert technical reasons into clearer, action-oriented explanations
  const getFriendlyReasonText = (payment) => {
    const raw = payment?.refund?.reason || payment?.adminNotes || '';

    // Timeout-based cancellation
    if (payment.status === 'cancelled' && payment.expiresAt) {
      const expiredAt = new Date(payment.expiresAt);
      if (new Date() > expiredAt) {
        return 'Pembayaran dibatalkan otomatis karena melewati batas waktu pembayaran dan kami belum menerima konfirmasi transfer.';
      }
    }

    // Keyword-based mapping
    const text = (raw || '').toLowerCase();
    if (text.includes('sistem') || text.includes('otomatis')) {
      return 'Pembayaran dibatalkan otomatis karena bukti transfer belum valid/masuk hingga batas waktu yang ditentukan.';
    }
    if (text.includes('mismatch') || text.includes('tidak sesuai') || text.includes('beda nominal')) {
      return 'Nominal atau data pembayaran tidak sesuai dengan instruksi. Demi keamanan, transaksi dibatalkan.';
    }
    if (text.includes('fraud') || text.includes('curang') || text.includes('duplikat')) {
      return 'Sistem mendeteksi aktivitas tidak biasa/duplikasi transaksi sehingga pembayaran dibatalkan demi keamanan.';
    }
    if (payment.status === 'failed') {
      return 'Transaksi gagal diproses oleh bank/penyedia pembayaran. Tidak ada dana yang ditarik.';
    }
    if (payment.status === 'refund_rejected') {
      return payment.refund?.adminNote || 'Permintaan refund belum dapat disetujui berdasarkan hasil pengecekan tim kami.';
    }
    if (raw) {
      return raw;
    }
    return 'Transaksi dibatalkan. Jika Anda merasa ini keliru, silakan ajukan refund atau hubungi dukungan kami.';
  };

  const getRejectionReason = (payment) => {
    // Check if payment has admin notes or rejection reason
    if (payment.adminNotes) {
      return payment.adminNotes;
    }
    
    // Check if payment was cancelled due to timeout
    if (payment.status === 'cancelled' && payment.expiresAt) {
      const expiredAt = new Date(payment.expiresAt);
      const now = new Date();
      if (now > expiredAt) {
        return 'Pembayaran dibatalkan karena melewati batas waktu pembayaran.';
      }
    }
    
    // Default rejection reasons based on status
    switch (payment.status) {
      case 'cancelled':
        return 'Pembayaran dibatalkan oleh sistem atau pelanggan.';
      case 'failed':
        return 'Pembayaran gagal diproses oleh bank atau provider pembayaran.';
      case 'refund_rejected':
        return payment.refund?.adminNote || 'Refund ditolak oleh admin.';
      default:
        return null;
    }
  };

  const getRefundStatus = (payment) => {
    if (!payment.refund) return null;
    
    switch (payment.refund.status) {
      case 'pending':
        return { text: 'Refund Dijajukan', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
      case 'approved':
        return { text: 'Refund Disetujui', color: 'bg-green-100 text-green-800 border-green-300' };
      case 'rejected':
        return { text: 'Refund Ditolak', color: 'bg-red-100 text-red-800 border-red-300' };
      case 'processed':
        return { text: 'Refund Diproses', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className={`w-16 h-16 border-4 ${isLight ? 'border-blue-400' : 'border-purple-400'} border-t-transparent rounded-full animate-spin mx-auto mb-4`} />
          <p className={`${isLight ? 'text-gray-900' : 'text-white'} text-lg`}>Memuat status pembayaran...</p>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
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
    <div className="p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          show={toast.show}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
          position="top-right"
          autoClose={true}
          autoCloseDelay={2400}
        />
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
              {getStatusText(payment.status, payment.refund?.status)}
            </h2>
            <p className={`text-lg ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
              {payment.refund?.status === 'pending' && 'Permintaan refund sedang direview oleh admin'}
              {payment.refund?.status === 'approved' && 'Refund Anda telah disetujui, dana akan diproses secepatnya'}
              {payment.refund?.status === 'processed' && 'Refund sedang diproses oleh tim keuangan'}
              {payment.refund?.status === 'rejected' && 'Permintaan refund ditolak'}
              {!payment.refund && payment.status === 'completed' && 'Pembayaran Anda telah berhasil diproses'}
              {!payment.refund && payment.status === 'pending' && 'Menunggu konfirmasi pembayaran'}
              {!payment.refund && payment.status === 'failed' && 'Pembayaran gagal diproses'}
              {!payment.refund && payment.status === 'cancelled' && 'Pembayaran telah dibatalkan'}
              {!payment.refund && payment.status === 'refund_requested' && 'Permintaan refund sedang diproses'}
              {!payment.refund && payment.status === 'refunded' && 'Refund Anda telah disetujui dan akan diproses oleh tim kami.'}
              {!payment.refund && payment.status === 'refund_rejected' && 'Permintaan refund ditolak'}
            </p>
            
            {/* Rejection Reason */}
            {getRejectionReason(payment) && (
              <div className={`mt-4 p-4 ${isLight ? 'bg-red-50 border-red-200' : 'bg-red-500/20 border-red-400/30'} rounded-xl border`}>
                <div className={`flex items-center gap-2 ${isLight ? 'text-red-700' : 'text-red-200'}`}>
                  <BiXCircle className="text-lg" />
                  <span className="font-medium">Alasan:</span>
                </div>
                <div className={`mt-2 ${isLight ? 'text-red-600' : 'text-red-300'}`}>
                  {getFriendlyReasonText(payment)}
                </div>
                <ul className={`mt-3 text-sm ${isLight ? 'text-gray-600' : 'text-gray-300'} list-disc pl-5`}> 
                  <li>Pastikan nominal dan tujuan transfer sesuai instruksi.</li>
                  <li>Upload bukti pembayaran yang jelas dan tidak blur.</li>
                  <li>Jika sudah transfer namun dibatalkan, ajukan refund dari halaman Riwayat.</li>
                </ul>
              </div>
            )}
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

        {/* Refund Information */}
        {payment.refund && (
          <div className={`${isLight ? 'bg-gradient-to-r from-orange-100 to-red-100 border-orange-300 shadow-lg' : 'bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-lg border-orange-400/30 shadow-2xl'} rounded-3xl p-8 border`}>
            <h3 className={`text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-white'} mb-6 flex items-center gap-3`}>
              <BiMoneyWithdraw className={`${isLight ? 'text-orange-600' : 'text-orange-400'}`} />
              Informasi Refund
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className={`${isLight ? 'bg-white' : 'bg-white/10'} rounded-2xl p-6`}>
                <h4 className={`text-lg font-semibold ${isLight ? 'text-gray-900' : 'text-white'} mb-4`}>Detail Refund</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Refund ID:</span>
                    <span className={`${isLight ? 'text-gray-900' : 'text-white'} font-mono text-sm`}>{payment.refund.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Jumlah Refund:</span>
                    <span className={`${isLight ? 'text-green-600' : 'text-green-400'} font-bold`}>{formatPrice(payment.refund.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Status:</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRefundStatus(payment)?.color}`}>
                      {getRefundStatus(payment)?.text}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Diajukan:</span>
                    <span className={`${isLight ? 'text-gray-900' : 'text-white'}`}>{formatDate(payment.refund.requestedAt)}</span>
                  </div>
                  {payment.refund.processedAt && (
                    <div className="flex justify-between">
                      <span className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Diproses:</span>
                      <span className={`${isLight ? 'text-gray-900' : 'text-white'}`}>{formatDate(payment.refund.processedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`${isLight ? 'bg-white' : 'bg-white/10'} rounded-2xl p-6`}>
                <h4 className={`text-lg font-semibold ${isLight ? 'text-gray-900' : 'text-white'} mb-4`}>Alasan Refund</h4>
                <div className={`${isLight ? 'bg-gray-50' : 'bg-white/5'} p-4 rounded-lg`}>
                  <p className={`${isLight ? 'text-gray-700' : 'text-gray-300'}`}>{payment.refund.reason}</p>
                </div>
                
                {payment.refund.adminNote && (
                  <div className="mt-4">
                    <h5 className={`text-sm font-medium ${isLight ? 'text-gray-600' : 'text-gray-400'} mb-2`}>Catatan Admin:</h5>
                    <div className={`${isLight ? 'bg-blue-50' : 'bg-blue-500/10'} p-3 rounded-lg`}>
                      <p className={`${isLight ? 'text-blue-700' : 'text-blue-300'} text-sm`}>{payment.refund.adminNote}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className={`p-4 ${isLight ? 'bg-yellow-100 border-yellow-300' : 'bg-yellow-500/20 border-yellow-400/30'} rounded-xl border`}>
              <div className={`flex items-center gap-2 ${isLight ? 'text-yellow-700' : 'text-yellow-200'}`}>
                <BiTime className="text-lg" />
                <span className="font-medium">Informasi Penting:</span>
              </div>
              <p className={`mt-2 ${isLight ? 'text-yellow-600' : 'text-yellow-300'} text-sm`}>
                {payment.refund.status === 'pending' && 'Refund Anda sedang dalam proses review oleh admin. Proses ini memakan waktu 1-3 hari kerja.'}
                {payment.refund.status === 'approved' && 'Refund Anda telah disetujui dan akan diproses dalam 1-2 hari kerja.'}
                {payment.refund.status === 'rejected' && 'Refund Anda ditolak. Silakan hubungi customer service untuk informasi lebih lanjut.'}
                {payment.refund.status === 'processed' && 'Refund Anda telah diproses dan dana akan dikembalikan sesuai metode pembayaran asli.'}
              </p>
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
          
          {/* Refund Button for cancelled/failed payments without refund */}
          {(payment.status === 'cancelled' || payment.status === 'failed') && !payment.refund && (
            <button
              onClick={() => setShowRefundModal(true)}
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <BiMoneyWithdraw className="text-xl" />
              Ajukan Refund
            </button>
          )}
          
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

      {/* Refund Request Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isLight ? 'bg-white' : 'bg-gray-800'} rounded-2xl p-6 max-w-md w-full`}>
            <h3 className={`text-xl font-bold ${isLight ? 'text-gray-900' : 'text-white'} mb-4`}>
              Ajukan Refund
            </h3>
            <p className={`${isLight ? 'text-gray-600' : 'text-gray-300'} text-sm mb-3`}>
              Refund hanya tersedia untuk transaksi yang dibatalkan atau gagal.
            </p>
            <label className={`${isLight ? 'text-gray-700' : 'text-gray-300'} text-sm font-medium`}>Alasan Refund</label>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Tuliskan alasan refund Anda..."
              rows={4}
              className={`w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLight ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'
              }`}
            />
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowRefundModal(false)}
                className={`flex-1 px-4 py-2 border rounded-lg font-medium ${
                  isLight ? 'border-gray-300 text-gray-700 hover:bg-gray-50' : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  if (!refundReason.trim()) {
                    setToast({ show: true, type: 'warning', title: 'Alasan diperlukan', message: 'Mohon isi alasan refund.' });
                    return;
                  }
                  try {
                    setIsSubmittingRefund(true);
                    const response = await fetch('/api/payments/refund', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ paymentId: payment.id, reason: refundReason.trim() })
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                      setToast({ show: true, type: 'success', title: 'Berhasil', message: 'Permintaan refund diajukan.' });
                      setShowRefundModal(false);
                      setRefundReason('');
                      await fetchPaymentStatus();
                    } else {
                      setToast({ show: true, type: 'error', title: 'Gagal mengajukan', message: data.error || 'Coba lagi nanti.' });
                    }
                  } catch (err) {
                    setToast({ show: true, type: 'error', title: 'Kesalahan', message: 'Gagal menghubungi server.' });
                  } finally {
                    setIsSubmittingRefund(false);
                  }
                }}
                disabled={isSubmittingRefund}
                className={`flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmittingRefund ? 'Mengirim...' : 'Kirim'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;

