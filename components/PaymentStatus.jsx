"use client";
import React, { useContext, useEffect, useState } from "react";
import { PaymentContext } from "@/context/PaymentContext";
import { BiCheckCircle, BiXCircle, BiClock, BiRefreshCw } from "react-icons/bi";

const PaymentStatus = ({ paymentId, onRefresh }) => {
  const { paymentHistory } = useContext(PaymentContext);
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
        return <BiCheckCircle className="text-green-400 text-xl" />;
      case 'failed':
      case 'cancelled':
        return <BiXCircle className="text-red-400 text-xl" />;
      case 'pending':
        return <BiClock className="text-yellow-400 text-xl" />;
      default:
        return <BiClock className="text-gray-400 text-xl" />;
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
      <div className="flex items-center justify-center p-8">
        <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-400 mb-4">Pembayaran tidak ditemukan</div>
        <button
          onClick={fetchPaymentStatus}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Status Header */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(payment.status)}
            <div>
              <h3 className="text-lg font-semibold text-gray-100">
                {getStatusText(payment.status)}
              </h3>
              <p className={`text-sm ${getStatusColor(payment.status)}`}>
                ID: {payment.id}
              </p>
            </div>
          </div>
          <button
            onClick={fetchPaymentStatus}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <BiRefreshCw className="text-xl" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-400">Tanggal Pembayaran</div>
            <div className="text-gray-100">{formatDate(payment.createdAt)}</div>
          </div>
          <div>
            <div className="text-gray-400">Total Pembayaran</div>
            <div className="text-gray-100 font-semibold">{formatPrice(payment.totalAmount)}</div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h4 className="text-lg font-semibold text-gray-100 mb-4">Detail Pembayaran</h4>
        
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-400">Metode Pembayaran</div>
            <div className="text-gray-100 flex items-center gap-2">
              <span className="text-lg">{payment.paymentMethod?.icon}</span>
              {payment.paymentMethod?.name}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400">Event</div>
            <div className="text-gray-100">{payment.orderData?.eventName}</div>
          </div>

          <div>
            <div className="text-sm text-gray-400">Tipe Tiket</div>
            <div className="text-gray-100 capitalize">{payment.orderData?.ticketType}</div>
          </div>

          <div>
            <div className="text-sm text-gray-400">Jumlah Tiket</div>
            <div className="text-gray-100">{payment.orderData?.amount} tiket</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-400">Subtotal</div>
              <div className="text-gray-100">{formatPrice(payment.amount)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Biaya Admin</div>
              <div className="text-gray-100">{formatPrice(payment.fee)}</div>
            </div>
          </div>

          <div className="h-px bg-white/10" />
          
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-gray-200">Total</span>
            <span className="text-purple-300">{formatPrice(payment.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Payment Instructions (if pending) */}
      {payment.status === 'pending' && payment.paymentMethod && (
        <div className="bg-blue-600/10 border border-blue-400/20 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-blue-300 mb-4">Instruksi Pembayaran</h4>
          
          {payment.paymentMethod.id === 'bank_transfer' && (
            <div className="space-y-3">
              <div className="text-sm text-blue-200">
                Transfer ke rekening berikut:
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-200">Bank:</span>
                    <span className="text-white">{payment.paymentForm.bankCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">No. Rekening:</span>
                    <span className="text-white font-mono">{payment.paymentForm.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Atas Nama:</span>
                    <span className="text-white">{payment.paymentForm.accountHolder}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-blue-200">Jumlah:</span>
                    <span className="text-white">{formatPrice(payment.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {payment.paymentMethod.id === 'e_wallet' && (
            <div className="space-y-3">
              <div className="text-sm text-blue-200">
                Transfer ke e-wallet berikut:
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-200">E-Wallet:</span>
                    <span className="text-white">{payment.paymentForm.walletCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">Nomor:</span>
                    <span className="text-white font-mono">{payment.paymentForm.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-blue-200">Jumlah:</span>
                    <span className="text-white">{formatPrice(payment.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-blue-200 mt-4">
            * Pembayaran akan diverifikasi dalam 1x24 jam
          </div>
        </div>
      )}

      {/* Admin Notes (if any) */}
      {payment.adminNotes && (
        <div className="bg-yellow-600/10 border border-yellow-400/20 rounded-xl p-4">
          <h5 className="text-sm font-semibold text-yellow-300 mb-2">Catatan Admin</h5>
          <p className="text-sm text-yellow-200">{payment.adminNotes}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
