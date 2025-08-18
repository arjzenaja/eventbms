'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { Plus, ArrowLeft, Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useState } from 'react';
import { Alert, Toast } from '@/components/ui/alert';

export default function AdminAddDataPage() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('info');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('info');

  const dataTypes = [
    {
      value: 'objek-wisata',
      label: 'Objek Wisata',
      icon: '🏔️',
      description: 'Tambah destinasi wisata baru',
      route: '/admin/destinations/new',
    },
    {
      value: 'kuliner',
      label: 'Kuliner',
      icon: '🍽️',
      description: 'Tambah tempat kuliner baru',
      route: '/admin/culinary/new',
    },
    {
      value: 'penginapan',
      label: 'Penginapan',
      icon: '🏨',
      description: 'Tambah akomodasi penginapan',
      route: '/admin/accommodation/new',
    },
    {
      value: 'oleh-oleh',
      label: 'Oleh-oleh',
      icon: '🛍️',
      description: 'Tambah toko oleh-oleh',
      route: '/admin/souvenirs/new',
    },
    {
      value: 'desa-wisata',
      label: 'Desa Wisata',
      icon: '🏘️',
      description: 'Tambah desa wisata baru',
      route: '/admin/villages/new',
    },
    {
      value: 'biro-perjalanan',
      label: 'Biro Perjalanan',
      icon: '🚌',
      description: 'Tambah biro perjalanan',
      route: '/admin/travel-agencies/new',
    },
    {
      value: 'event',
      label: 'Event',
      icon: '🎉',
      description: 'Tambah event baru',
      route: '/admin/events/new',
    },
  ];

  const handleChoose = (route) => {
    router.push(route);
  };

  const showAlertDemo = (type) => {
    setAlertType(type);
    setShowAlert(true);
  };

  const showToastDemo = (type) => {
    setToastType(type);
    setShowToast(true);
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
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="inline-flex h-10 w-10 items-center justify-center border border-gray-300 rounded-xl hover:bg-gray-50"
              title="Kembali"
            >
              <ArrowLeft size={16} className="text-black" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tambah Data Baru</h1>
              <p className="text-gray-600 mt-1">Pilih jenis data yang ingin ditambahkan</p>
            </div>
          </div>
        </div>

        {/* Alert Demo Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Demo Alert Modern</h2>
          </div>
          <p className="text-gray-600 mb-4">Coba berbagai jenis alert yang lebih menarik:</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => showAlertDemo('info')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            >
              <Info className="w-4 h-4" />
              Info Alert
            </button>
            <button
              onClick={() => showAlertDemo('success')}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Success Alert
            </button>
            <button
              onClick={() => showAlertDemo('warning')}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              Warning Alert
            </button>
            <button
              onClick={() => showAlertDemo('error')}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              Error Alert
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-gray-600 mb-3">Atau coba Toast notification:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => showToastDemo('info')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm"
              >
                <Info className="w-4 h-4" />
                Info Toast
              </button>
              <button
                onClick={() => showToastDemo('success')}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Success Toast
              </button>
              <button
                onClick={() => showToastDemo('warning')}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-lg transition-colors text-sm"
              >
                <AlertTriangle className="w-4 h-4" />
                Warning Toast
              </button>
              <button
                onClick={() => showToastDemo('error')}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm"
              >
                <AlertTriangle className="w-4 h-4" />
                Error Toast
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataTypes.map((d) => (
              <button
                key={d.value}
                onClick={() => handleChoose(d.route)}
                className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:bg-blue-50 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{d.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{d.label}</h3>
                    <p className="text-sm text-gray-600 mt-1 group-hover:text-blue-600 transition-colors">{d.description}</p>
                  </div>
                  <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Plus size={20} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Modern Alert Component */}
        {showAlert && (
          <Alert
            type={alertType}
            title={getAlertContent(alertType).title}
            message={getAlertContent(alertType).message}
            show={showAlert}
            onClose={() => setShowAlert(false)}
            autoClose={true}
            autoCloseDelay={2000}
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
            autoCloseDelay={2000}
            position="top-right"
          />
        )}
      </div>
    </ProtectedRoute>
  );
}


