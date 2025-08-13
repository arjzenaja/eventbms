'use client';

import { useState } from 'react';
import { Alert, Toast } from './alert';
import { ConfirmDialog, useConfirmDialog } from './ConfirmDialog';
import { useAlert } from '@/hooks/useAlert';
import { Eye, EyeOff, Edit, Copy, Trash2, Download } from 'lucide-react';

// Contoh implementasi untuk menggantikan alert di ACTION_BUTTONS_README.md
export function AlertExamples() {
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewData, setQuickViewData] = useState(null);
  const [showDuplicateSuccess, setShowDuplicateSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  
  const { showSuccess, showError, showWarning, showInfo } = useAlert();
  const { showConfirm } = useConfirmDialog();

  // 1. Quick View - Menggantikan alert() untuk menampilkan info destinasi
  const handleQuickView = (destination) => {
    const data = {
      title: destination.title,
      location: destination.location,
      type: destination.type,
      description: destination.short_description || 'Tidak ada deskripsi',
      price: destination.seats?.[0]?.price?.toLocaleString('id-ID') || '0'
    };
    
    setQuickViewData(data);
    setShowQuickView(true);
  };

  // 2. Duplicate Destination - Menggantikan alert() untuk konfirmasi duplikasi
  const handleDuplicateDestination = async (destinationId) => {
    const confirmed = await showConfirm({
      type: 'info',
      title: 'Konfirmasi Duplikasi',
      message: 'Apakah Anda yakin ingin menduplikasi objek wisata ini?',
      confirmText: 'Duplikasi',
      cancelText: 'Batal',
    });

    if (confirmed) {
      try {
        // Simulasi API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Tampilkan success alert
        setShowDuplicateSuccess(true);
        
        // Atau gunakan hook
        showSuccess('Berhasil!', 'Objek wisata berhasil diduplikasi!');
        
        // Refresh data
        // await refreshData();
      } catch (error) {
        showError('Error!', 'Gagal menduplikasi objek wisata: ' + error.message);
      }
    }
  };

  // 3. Delete Destination - Menggantikan confirm() dan alert()
  const handleDeleteDestination = async (destinationId) => {
    const confirmed = await showConfirm({
      type: 'warning',
      title: 'Konfirmasi Hapus',
      message: 'Apakah Anda yakin ingin menghapus objek wisata ini? Tindakan ini tidak dapat dibatalkan.',
      confirmText: 'Hapus',
      cancelText: 'Batal',
    });

    if (confirmed) {
      try {
        // Simulasi API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Tampilkan success alert
        setShowDeleteSuccess(true);
        
        // Atau gunakan hook
        showSuccess('Berhasil!', 'Objek wisata berhasil dihapus!');
        
        // Update state lokal
        // setDestinations(prev => prev.filter(dest => dest.id !== destinationId));
        
        // Refresh data
        // await refreshData();
      } catch (error) {
        showError('Error!', 'Gagal menghapus objek wisata. Silakan coba lagi.');
      }
    }
  };

  // 4. Export Data - Menggantikan alert() untuk notifikasi
  const handleExportData = () => {
    // Simulasi export
    showInfo('Export Data', 'Memulai export data destinasi ke CSV...');
    
    setTimeout(() => {
      showSuccess('Export Berhasil!', 'Data telah berhasil diexport ke file CSV');
    }, 2000);
  };

  // Data dummy untuk demo
  const dummyDestination = {
    id: 1,
    title: 'Gunung Bromo',
    location: 'Probolinggo, Jawa Timur',
    type: 'wisata-alam',
    short_description: 'Gunung berapi aktif dengan pemandangan sunrise yang indah',
    seats: [{ price: 50000 }]
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Contoh Implementasi Alert Modern
        </h1>
        <p className="text-gray-600">
          Menggantikan alert() dan confirm() bawaan browser dengan komponen yang lebih menarik
        </p>
      </div>

      {/* Quick View Example */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple-600" />
          1. Quick View (Menggantikan alert())
        </h2>
        <p className="text-gray-600 mb-4">
          Sebelumnya menggunakan <code className="bg-gray-100 px-2 py-1 rounded">alert()</code> untuk menampilkan info destinasi
        </p>
        
        <button
          onClick={() => handleQuickView(dummyDestination)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          Lihat Quick View
        </button>
      </div>

      {/* Duplicate Example */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Copy className="w-5 h-5 text-orange-600" />
          2. Duplikasi (Menggantikan confirm() + alert())
        </h2>
        <p className="text-gray-600 mb-4">
          Sebelumnya menggunakan <code className="bg-gray-100 px-2 py-1 rounded">confirm()</code> dan <code className="bg-gray-100 px-2 py-1 rounded">alert()</code>
        </p>
        
        <button
          onClick={() => handleDuplicateDestination(1)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors"
        >
          <Copy className="w-4 h-4" />
          Duplikasi Destinasi
        </button>
      </div>

      {/* Delete Example */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-600" />
          3. Hapus (Menggantikan confirm() + alert())
        </h2>
        <p className="text-gray-600 mb-4">
          Sebelumnya menggunakan <code className="bg-gray-100 px-2 py-1 rounded">confirm()</code> dan <code className="bg-gray-100 px-2 py-1 rounded">alert()</code>
        </p>
        
        <button
          onClick={() => handleDeleteDestination(1)}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Hapus Destinasi
        </button>
      </div>

      {/* Export Example */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-indigo-600" />
          4. Export Data (Menggantikan alert())
        </h2>
        <p className="text-gray-600 mb-4">
          Sebelumnya menggunakan <code className="bg-gray-100 px-2 py-1 rounded">alert()</code> untuk notifikasi
        </p>
        
        <button
          onClick={handleExportData}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Quick View Alert */}
      {showQuickView && quickViewData && (
        <Alert
          type="info"
          title="Informasi Destinasi"
          message={`
Nama: ${quickViewData.title}
Lokasi: ${quickViewData.location}
Tipe: ${quickViewData.type}
Deskripsi: ${quickViewData.description}
Harga: Rp ${quickViewData.price}
          `.trim()}
          show={showQuickView}
          onClose={() => setShowQuickView(false)}
          autoClose={false}
        />
      )}

      {/* Duplicate Success Alert */}
      {showDuplicateSuccess && (
        <Alert
          type="success"
          title="Berhasil!"
          message="Objek wisata berhasil diduplikasi!"
          show={showDuplicateSuccess}
          onClose={() => setShowDuplicateSuccess(false)}
          autoClose={true}
          autoCloseDelay={3000}
        />
      )}

      {/* Delete Success Alert */}
      {showDeleteSuccess && (
        <Alert
          type="success"
          title="Berhasil!"
          message="Objek wisata berhasil dihapus!"
          show={showDeleteSuccess}
          onClose={() => setShowDeleteSuccess(false)}
          autoClose={true}
          autoCloseDelay={3000}
        />
      )}
    </div>
  );
}
