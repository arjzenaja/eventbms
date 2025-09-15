"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Toast } from "@/components/ui/alert";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BiCheckCircle, BiXCircle, BiTime, BiRefresh, BiMoneyWithdraw } from "react-icons/bi";

export default function AdminRefundsPage() {
  const { isLight } = useTheme();
  const [refunds, setRefunds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/payments', {
        headers: {
          'Authorization': 'Bearer admin-token',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      // Filter payments that have refund requests
      const paymentsWithRefunds = data.payments?.filter(payment => payment.refund) || [];
      setRefunds(paymentsWithRefunds);
    } catch (error) {
      console.error("Error fetching refunds:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessRefund = (refund) => {
    setSelectedRefund(refund);
    setAdminNote('');
    setShowProcessModal(true);
  };

  const processRefund = async (action) => {
    if (!selectedRefund) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer admin-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refundId: selectedRefund.refund.id,
          action: action,
          adminNote: adminNote
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setToast({
          show: true,
          type: action === 'approve' ? 'success' : 'warning',
          title: action === 'approve' ? 'Refund disetujui' : 'Refund ditolak',
          message: 'Permintaan refund telah diproses.'
        });
        setShowProcessModal(false);
        fetchRefunds(); // Refresh refund list
      } else {
        setToast({
          show: true,
          type: 'error',
          title: 'Gagal memproses refund',
          message: data.error || 'Terjadi kesalahan.'
        });
      }
    } catch (error) {
      console.error('Process refund error:', error);
      setToast({
        show: true,
        type: 'error',
        title: 'Kesalahan sistem',
        message: 'Terjadi kesalahan saat memproses refund. Silakan coba lagi.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getRefundStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <BiTime className="text-yellow-500 text-lg" />;
      case 'approved':
        return <BiCheckCircle className="text-green-500 text-lg" />;
      case 'rejected':
        return <BiXCircle className="text-red-500 text-lg" />;
      case 'processed':
        return <BiMoneyWithdraw className="text-blue-500 text-lg" />;
      default:
        return <BiTime className="text-gray-500 text-lg" />;
    }
  };

  const getRefundStatusColor = (status) => {
    if (isLight) {
      switch (status) {
        case 'pending':
          return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        case 'approved':
          return 'bg-green-100 text-green-800 border-green-300';
        case 'rejected':
          return 'bg-red-100 text-red-800 border-red-300';
        case 'processed':
          return 'bg-blue-100 text-blue-800 border-blue-300';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-300';
      }
    } else {
      switch (status) {
        case 'pending':
          return 'bg-yellow-600/20 text-yellow-300 border-yellow-400/30';
        case 'approved':
          return 'bg-green-600/20 text-green-300 border-green-400/30';
        case 'rejected':
          return 'bg-red-600/20 text-red-300 border-red-400/30';
        case 'processed':
          return 'bg-blue-600/20 text-blue-300 border-blue-400/30';
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

  return (
    <ProtectedRoute>
      <div className={`min-h-screen ${isLight ? 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50' : 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'} pt-24`}>
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="space-y-8 mt-8">
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
                <h1 className={`text-3xl font-bold ${isLight ? 'text-gray-900' : 'text-white'} mb-2`}>Kelola Refund</h1>
                <p className={`${isLight ? 'text-blue-600' : 'text-blue-200'} text-lg`}>Kelola permintaan refund dari pelanggan</p>
              </div>
              <button
                onClick={fetchRefunds}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <BiRefresh className="text-lg" />
                Refresh
              </button>
            </div>

            {/* Refunds List */}
            {refunds.length === 0 ? (
              <div className="text-center py-16">
                <div className={`w-24 h-24 ${isLight ? 'bg-gray-100' : 'bg-white/10'} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <BiMoneyWithdraw className={`w-12 h-12 ${isLight ? 'text-blue-600' : 'text-blue-400'}`} />
                </div>
                <h3 className={`text-xl font-semibold ${isLight ? 'text-gray-700' : 'text-white'} mb-2`}>Belum ada permintaan refund</h3>
                <p className={`${isLight ? 'text-blue-600' : 'text-blue-200'}`}>Permintaan refund akan muncul di sini</p>
              </div>
            ) : (
              <div className="space-y-6">
                {refunds.map((payment) => (
                  <div
                    key={payment.id}
                    className={`${isLight ? 'bg-white border-gray-200 shadow-lg hover:shadow-xl' : 'bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl hover:bg-white/15'} rounded-2xl p-6 border transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getRefundStatusIcon(payment.refund.status)}
                        <div>
                          <div className={`font-semibold ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
                            {payment.orderData?.eventName || 'Event'}
                          </div>
                          <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'} font-mono`}>
                            Refund ID: {payment.refund.id}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${isLight ? 'text-purple-600' : 'text-purple-300'}`}>
                          {formatPrice(payment.refund.amount)}
                        </div>
                        <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                          {formatDate(payment.refund.requestedAt)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <div className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Payment ID</div>
                        <div className={`${isLight ? 'text-gray-900' : 'text-gray-100'} font-mono text-xs`}>{payment.id}</div>
                      </div>
                      <div>
                        <div className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Metode Refund</div>
                        <div className={`${isLight ? 'text-gray-900' : 'text-gray-100'}`}>{payment.refund.refundMethod}</div>
                      </div>
                      <div>
                        <div className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Status</div>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRefundStatusColor(payment.refund.status)}`}>
                          {payment.refund.status}
                        </span>
                      </div>
                      <div>
                        <div className={`${isLight ? 'text-gray-500' : 'text-gray-400'}`}>Pelanggan</div>
                        <div className={`${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
                          {payment.paymentForm?.customerName || payment.orderData?.customerName || 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className={`${isLight ? 'text-gray-500' : 'text-gray-400'} text-sm mb-1`}>Alasan Refund:</div>
                      <div className={`${isLight ? 'bg-gray-50 text-gray-800' : 'bg-gray-700 text-gray-200'} p-3 rounded-lg text-sm`}>
                        {payment.refund.reason}
                      </div>
                    </div>

                    {payment.refund.adminNote && (
                      <div className="mb-4">
                        <div className={`${isLight ? 'text-gray-500' : 'text-gray-400'} text-sm mb-1`}>Catatan Admin:</div>
                        <div className={`${isLight ? 'bg-blue-50 text-blue-800' : 'bg-blue-700 text-blue-200'} p-3 rounded-lg text-sm`}>
                          {payment.refund.adminNote}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className={`text-sm ${isLight ? 'text-gray-500' : 'text-gray-400'}`}>
                        {payment.refund.status === 'pending' && 'Menunggu persetujuan admin'}
                        {payment.refund.status === 'approved' && 'Refund disetujui'}
                        {payment.refund.status === 'rejected' && 'Refund ditolak'}
                        {payment.refund.status === 'processed' && 'Refund sudah diproses'}
                      </div>
                      <div className="flex gap-2">
                        {payment.refund.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleProcessRefund(payment)}
                              className={`flex items-center gap-1 px-3 py-1 ${isLight ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-green-600/20 text-green-300 hover:bg-green-600/30'} rounded-lg text-sm`}
                            >
                              <BiCheckCircle className="text-sm" />
                              Setujui
                            </button>
                            <button
                              onClick={() => handleProcessRefund(payment)}
                              className={`flex items-center gap-1 px-3 py-1 ${isLight ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-red-600/20 text-red-300 hover:bg-red-600/30'} rounded-lg text-sm`}
                            >
                              <BiXCircle className="text-sm" />
                              Tolak
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Process Refund Modal */}
            {showProcessModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className={`${isLight ? 'bg-white' : 'bg-gray-800'} rounded-2xl p-6 max-w-md w-full`}>
                  <h3 className={`text-xl font-bold ${isLight ? 'text-gray-900' : 'text-white'} mb-4`}>
                    Proses Refund
                  </h3>
                  
                  <div className="mb-4">
                    <div className={`${isLight ? 'bg-gray-50' : 'bg-gray-700'} rounded-lg p-3 mb-3`}>
                      <div className="text-sm font-medium text-gray-600 mb-1">Detail Refund</div>
                      <div className={`${isLight ? 'text-gray-900' : 'text-white'} font-semibold`}>
                        {selectedRefund?.orderData?.eventName}
                      </div>
                      <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                        Jumlah: {formatPrice(selectedRefund?.refund.amount)}
                      </div>
                      <div className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-300'}`}>
                        Alasan: {selectedRefund?.refund.reason}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className={`block text-sm font-medium ${isLight ? 'text-gray-700' : 'text-gray-300'} mb-2`}>
                      Catatan Admin (Opsional)
                    </label>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Tambahkan catatan untuk pelanggan..."
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isLight 
                          ? 'bg-white border-gray-300 text-gray-900' 
                          : 'bg-gray-700 border-gray-600 text-white'
                      }`}
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowProcessModal(false)}
                      className={`flex-1 px-4 py-2 border rounded-lg font-medium ${
                        isLight 
                          ? 'border-gray-300 text-gray-700 hover:bg-gray-50' 
                          : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => processRefund('reject')}
                      disabled={isProcessing}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'Memproses...' : 'Tolak'}
                    </button>
                    <button
                      onClick={() => processRefund('approve')}
                      disabled={isProcessing}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'Memproses...' : 'Setujui'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
