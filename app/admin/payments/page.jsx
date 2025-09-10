"use client";
import React, { useState, useEffect } from "react";
import { BiSearch, BiFilter, BiRefreshCw, BiCheckCircle, BiXCircle, BiClock, BiEye } from "react-icons/bi";

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);

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

  const updatePaymentStatus = async (paymentId, status, adminNotes) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, adminNotes }),
      });

      if (response.ok) {
        fetchPayments();
        setSelectedPayment(null);
      }
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orderData?.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.paymentForm?.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Manajemen Pembayaran</h1>
          <p className="text-gray-400">Kelola dan verifikasi pembayaran tiket</p>
        </div>
        <button
          onClick={fetchPayments}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <BiRefreshCw className="text-lg" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan ID, event, atau nama pelanggan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-100 placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-100 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ID Pembayaran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Metode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-100">
                      {payment.id.substring(0, 12)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-100">
                      {payment.orderData?.eventName || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-100">
                      {payment.paymentForm?.customerName || '-'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {payment.paymentForm?.customerEmail || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{payment.paymentMethod?.icon}</span>
                      <span className="text-sm text-gray-100">
                        {payment.paymentMethod?.name || '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-100">
                      {formatPrice(payment.totalAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-100">
                      {formatDate(payment.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 text-sm"
                    >
                      <BiEye className="text-sm" />
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-100">Detail Pembayaran</h2>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <BiXCircle className="text-xl" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Payment Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">ID Pembayaran</div>
                    <div className="text-sm font-mono text-gray-100">{selectedPayment.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Status</div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(selectedPayment.status)}
                      <span className="text-sm text-gray-100 capitalize">{selectedPayment.status}</span>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-3">Detail Pesanan</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Event:</span>
                      <span className="text-gray-100">{selectedPayment.orderData?.eventName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tipe Tiket:</span>
                      <span className="text-gray-100 capitalize">{selectedPayment.orderData?.ticketType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Jumlah:</span>
                      <span className="text-gray-100">{selectedPayment.orderData?.amount} tiket</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Harga per Tiket:</span>
                      <span className="text-gray-100">{formatPrice(selectedPayment.orderData?.ticketPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-3">Informasi Pelanggan</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nama:</span>
                      <span className="text-gray-100">{selectedPayment.paymentForm?.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-gray-100">{selectedPayment.paymentForm?.customerEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Telepon:</span>
                      <span className="text-gray-100">{selectedPayment.paymentForm?.customerPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-3">Ringkasan Pembayaran</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal:</span>
                      <span className="text-gray-100">{formatPrice(selectedPayment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Biaya Admin:</span>
                      <span className="text-gray-100">{formatPrice(selectedPayment.fee)}</span>
                    </div>
                    <div className="h-px bg-white/10 my-2" />
                    <div className="flex justify-between text-base font-semibold">
                      <span className="text-gray-200">Total:</span>
                      <span className="text-purple-300">{formatPrice(selectedPayment.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                {selectedPayment.status === 'pending' && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-100">Aksi Admin</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => updatePaymentStatus(selectedPayment.id, 'completed', 'Pembayaran diverifikasi')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <BiCheckCircle className="text-lg" />
                        Verifikasi
                      </button>
                      <button
                        onClick={() => updatePaymentStatus(selectedPayment.id, 'cancelled', 'Pembayaran dibatalkan')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <BiXCircle className="text-lg" />
                        Batalkan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsPage;
