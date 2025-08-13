'use client';

import { useState } from 'react';
import { Alert, Toast } from './alert';
import { ConfirmDialog, useConfirmDialog } from './ConfirmDialog';
import { useAlert } from '@/hooks/useAlert';
import { Bell, AlertTriangle, CheckCircle, Info, Trash2, Save, Download } from 'lucide-react';

export function AlertDemo() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('info');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('info');
  
  const { alert, showSuccess, showError, showWarning, showInfo } = useAlert();
  const { dialog, showConfirm } = useConfirmDialog();

  const showAlertDemo = (type) => {
    setAlertType(type);
    setShowAlert(true);
  };

  const showToastDemo = (type) => {
    setToastType(type);
    setShowToast(true);
  };

  const handleDelete = async () => {
    const confirmed = await showConfirm({
      type: 'warning',
      title: 'Konfirmasi Hapus',
      message: 'Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.',
      confirmText: 'Hapus',
      cancelText: 'Batal',
    });

    if (confirmed) {
      showSuccess('Berhasil!', 'Item telah berhasil dihapus dari database.');
    }
  };

  const handleSave = () => {
    showSuccess('Tersimpan!', 'Data telah berhasil disimpan ke database.');
  };

  const handleDownload = () => {
    showInfo('Download', 'Memulai download file...');
  };

  const getAlertContent = (type) => {
    switch (type) {
      case 'success':
        return {
          title: 'Berhasil!',
          message: 'Data telah berhasil disimpan ke database. Total culinary items: 0, Filtered: 0',
        };
      case 'error':
        return {
          title: 'Error!',
          message: 'Terjadi kesalahan saat menyimpan data. Silakan coba lagi.',
        };
      case 'warning':
        return {
          title: 'Peringatan!',
          message: 'Data yang Anda masukkan mungkin tidak lengkap. Periksa kembali.',
        };
      default:
        return {
          title: 'Informasi',
          message: 'Total culinary items: 0, Filtered: 0',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Bell className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Demo Alert Modern</h2>
      </div>
      
      <p className="text-gray-600">
        Komponen alert modern yang dapat menggantikan alert bawaan browser dengan desain yang lebih menarik dan responsif.
      </p>

      {/* Alert Types */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Jenis Alert</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => showAlertDemo('info')}
            className="flex items-center gap-2 px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Info className="w-4 h-4" />
            Info Alert
          </button>
          <button
            onClick={() => showAlertDemo('success')}
            className="flex items-center gap-2 px-4 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <CheckCircle className="w-4 h-4" />
            Success Alert
          </button>
          <button
            onClick={() => showAlertDemo('warning')}
            className="flex items-center gap-2 px-4 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <AlertTriangle className="w-4 h-4" />
            Warning Alert
          </button>
          <button
            onClick={() => showAlertDemo('error')}
            className="flex items-center gap-2 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <AlertTriangle className="w-4 h-4" />
            Error Alert
          </button>
        </div>
      </div>

      {/* Toast Types */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Toast Notification</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => showToastDemo('info')}
            className="flex items-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Info className="w-4 h-4" />
            Info Toast
          </button>
          <button
            onClick={() => showToastDemo('success')}
            className="flex items-center gap-2 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <CheckCircle className="w-4 h-4" />
            Success Toast
          </button>
          <button
            onClick={() => showToastDemo('warning')}
            className="flex items-center gap-2 px-4 py-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <AlertTriangle className="w-4 h-4" />
            Warning Toast
          </button>
          <button
            onClick={() => showToastDemo('error')}
            className="flex items-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <AlertTriangle className="w-4 h-4" />
            Error Toast
          </button>
        </div>
      </div>

      {/* Practical Examples */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contoh Penggunaan Praktis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-3 px-4 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Save className="w-4 h-4" />
            Simpan Data
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-3 px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Download className="w-4 h-4" />
            Download File
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-3 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <Trash2 className="w-4 h-4" />
            Hapus Item
          </button>
        </div>
      </div>

      {/* Hook Usage Examples */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Penggunaan Hook</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => showInfo('Informasi', 'Ini adalah contoh penggunaan hook showInfo')}
            className="px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors"
          >
            showInfo
          </button>
          <button
            onClick={() => showSuccess('Berhasil', 'Ini adalah contoh penggunaan hook showSuccess')}
            className="px-4 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl transition-colors"
          >
            showSuccess
          </button>
          <button
            onClick={() => showWarning('Peringatan', 'Ini adalah contoh penggunaan hook showWarning')}
            className="px-4 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-xl transition-colors"
          >
            showWarning
          </button>
          <button
            onClick={() => showError('Error', 'Ini adalah contoh penggunaan hook showError')}
            className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors"
          >
            showError
          </button>
        </div>
      </div>

      {/* Alert Component */}
      {showAlert && (
        <Alert
          type={alertType}
          title={getAlertContent(alertType).title}
          message={getAlertContent(alertType).message}
          show={showAlert}
          onClose={() => setShowAlert(false)}
          autoClose={true}
          autoCloseDelay={4000}
        />
      )}

      {/* Toast Component */}
      {showToast && (
        <Toast
          type={toastType}
          title={getAlertContent(toastType).title}
          message={getAlertContent(toastType).message}
          show={showToast}
          onClose={() => setShowToast(false)}
          autoClose={true}
          autoCloseDelay={4000}
          position="top-right"
        />
      )}

      {/* Hook Alert */}
      {alert.show && (
        <Alert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          show={alert.show}
          onClose={() => {}} // Hook will handle this
          autoClose={alert.autoClose}
          autoCloseDelay={alert.autoCloseDelay}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        showCancel={dialog.showCancel}
        show={dialog.show}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel}
      />
    </div>
  );
}
