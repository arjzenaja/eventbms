"use client";
import React, { useContext, useEffect, useState } from "react";
import { PaymentContext } from "@/context/PaymentContext";
import { BiCheckCircle, BiXCircle, BiClock, BiEye, BiRefreshCw } from "react-icons/bi";

const PaymentHistory = () => {
  const { paymentHistory } = useContext(PaymentContext);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/payments');
      const data = await response.json();
      setPayments(data.payments || []);
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
        return <BiClock className="text-yellow-400 text-lg" />;
      default:
        return <BiClock className="text-gray-400 text-lg" />;
    }
  };

  const getStatusColor = (status) => {
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
        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-100">Riwayat Pembayaran</h2>
          <p className="text-gray-400">Semua transaksi pembayaran Anda</p>
        </div>
        <button
          onClick={fetchPayments}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <BiRefreshCw className="text-lg" />
          Refresh
        </button>
      </div>

      {/* Payments List */}
      {payments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">Belum ada riwayat pembayaran</div>
          <div className="text-sm text-gray-500">Pembayaran Anda akan muncul di sini</div>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(payment.status)}
                  <div>
                    <div className="font-semibold text-gray-100">
                      {payment.orderData?.eventName || 'Event'}
                    </div>
                    <div className="text-sm text-gray-400 font-mono">
                      {payment.id}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-300">
                    {formatPrice(payment.totalAmount)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {formatDate(payment.createdAt)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <div className="text-gray-400">Tipe Tiket</div>
                  <div className="text-gray-100 capitalize">{payment.orderData?.ticketType}</div>
                </div>
                <div>
                  <div className="text-gray-400">Jumlah</div>
                  <div className="text-gray-100">{payment.orderData?.amount} tiket</div>
                </div>
                <div>
                  <div className="text-gray-400">Metode Pembayaran</div>
                  <div className="text-gray-100 flex items-center gap-2">
                    <span className="text-lg">{payment.paymentMethod?.icon}</span>
                    {payment.paymentMethod?.name}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Status</div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  {payment.status === 'pending' && 'Menunggu verifikasi'}
                  {payment.status === 'completed' && 'Pembayaran berhasil'}
                  {payment.status === 'failed' && 'Pembayaran gagal'}
                  {payment.status === 'cancelled' && 'Pembayaran dibatalkan'}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(`/payment-status/${payment.id}`, '_blank')}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 text-sm"
                  >
                    <BiEye className="text-sm" />
                    Detail
                  </button>
                  {payment.status === 'pending' && (
                    <button
                      onClick={() => window.open(`/payment-instructions/${payment.id}`, '_blank')}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600/20 text-green-300 rounded-lg hover:bg-green-600/30 text-sm"
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
