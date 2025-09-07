'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

function CustomSelect({ label, value, onChange, options, className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const current = options.find(o => o.value === value) || options[0];
  return (
    <div className={className} ref={ref}>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
      <button type="button" onClick={() => setOpen(o => !o)} className={`w-full px-4 py-2.5 border rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-150 flex items-center justify-between shadow-sm ${open ? 'border-indigo-500' : 'border-gray-300'}`}>
        <span className="flex items-center gap-3">
          {current?.icon && <span className="text-lg leading-none">{current.icon}</span>}
          <span className="font-medium truncate">{current?.label}</span>
        </span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd"/></svg>
      </button>
      {open && (
        <div className="relative">
          <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="max-h-72 overflow-y-auto">
              {options.map(opt => (
                <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setOpen(false); }} className={`w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-indigo-50 ${value === opt.value ? 'bg-indigo-50' : ''}`}>
                  <span className="flex items-center gap-3">
                    {opt.icon && <span className="text-lg leading-none">{opt.icon}</span>}
                    <span className={`font-medium ${value === opt.value ? 'text-indigo-700' : 'text-gray-900'}`}>{opt.label}</span>
                  </span>
                  {value === opt.value && <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminVillages() {
  const [villages, setVillages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [modal, setModal] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [quickViewItem, setQuickViewItem] = useState(null);

  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const response = await fetch('/api/desa_wisata');
        const data = await response.json();
        
        if (data.success) {
          setVillages(data.desa_wisata);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching villages:', error);
        setError('Terjadi kesalahan saat mengambil data desa wisata');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVillages();
  }, []);

  const filteredVillages = villages.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDeleteVillage = async (itemId) => {
    try {
      const response = await fetch(`/api/desa_wisata/${itemId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setVillages(villages.filter(item => item.id !== itemId));
        setModal({ title: 'Berhasil', message: 'Desa wisata berhasil dihapus!', confirmText: 'OK', onConfirm: () => setModal(null) });
      } else {
        setModal({ title: 'Gagal', message: 'Gagal menghapus desa wisata: ' + data.message, confirmText: 'OK', onConfirm: () => setModal(null) });
      }
    } catch (error) {
      console.error('Error deleting village:', error);
      setModal({ title: 'Error', message: 'Terjadi kesalahan saat menghapus desa wisata', confirmText: 'OK', onConfirm: () => setModal(null) });
    }
  };

  const confirmDeleteVillage = (itemId) => {
    setModal({
      title: 'Hapus Desa Wisata',
      message: 'Apakah Anda yakin ingin menghapus desa wisata ini?',
      confirmText: 'Hapus',
      cancelText: 'Batal',
      onConfirm: async () => { setModal(null); await handleDeleteVillage(itemId); }
    });
  };

  const handleExportData = () => {
    const exportData = filteredVillages.map(item => ({
      ID: item.id,
      Nama: item.title,
      Lokasi: item.location,
      Tipe: item.type,
      Kategori: item.category || 'Desa Wisata',
      Deskripsi: item.short_description || '',
      Biaya_Masuk: item.entrance_fee || 'Gratis',
      Kontak: item.contact || '',
      Alamat: item.address || '',
      Latitude: item.coordinates?.latitude || item.coordinates?.lat || '',
      Longitude: item.coordinates?.longitude || item.coordinates?.lng || '',
      Direkomendasikan: item.recommended ? 'Ya' : 'Tidak'
    }));

    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `desa_wisata_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/desa_wisata');
      const data = await response.json();
      
      if (data.success) {
        setVillages(data.desa_wisata);
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error refreshing villages:', error);
      setError('Terjadi kesalahan saat refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data desa wisata..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data desa wisata"
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <svg className="w-7 h-7 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7l9-4 9 4-9 4-9-4zm0 6l9 4 9-4M3 7v6m18-6v6"/></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Desa Wisata</h1>
                  <p className="text-gray-600 mt-1">Kelola desa wisata: data, paket, ekspor, dan migrasi tipe.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link 
                  href="/admin/villages/packages" 
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V7a2 2 0 00-2-2h-4l-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"/></svg>
                  Kelola Paket
                </Link>
                <Link 
                  href="/admin/villages/new" 
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                  Tambah Desa
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <CustomSelect
                  value={filterType}
                  onChange={(v) => setFilterType(v)}
                  options={[
                    { value: 'all', label: 'Semua Tipe', icon: '🗂️' },
                    { value: 'desa-wisata', label: 'Desa Wisata', icon: '🏘️' },
                  ]}
                  className="min-w-[180px]"
                />
                

                
                <button 
                  onClick={refreshData}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-white shadow-sm hover:bg-emerald-700 disabled:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0014-7V5M19 5A9 9 0 005 12v7"/></svg>
                  Refresh
                </button>
                
                <button 
                  onClick={handleExportData}
                  disabled={filteredVillages.length === 0}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  title="Export Data Desa Wisata ke CSV"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m0 0l-3-3m3 3l3-3M4 4h16v4H4zM4 8v10a2 2 0 002 2h12a2 2 0 002-2V8"/></svg>
                  Export
                </button>
                
                <button 
                  onClick={() => {
                    const uniqueTypes = [...new Set(villages.map(v => v.type))];
                    setModal({
                      title: 'Debug Info',
                      message: `Total desa wisata: ${villages.length}\nTersaring: ${filteredVillages.length}\n\nTypes in data: ${uniqueTypes.join(', ')}\nCurrent filterType: ${filterType}`,
                      confirmText: 'OK',
                      onConfirm: () => setModal(null)
                    });
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  title="Debug Info"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3a1 1 0 012 0v1m4 1l-.707.707M21 11h-1M4 11H3m3.343-5.657l-.707-.707"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8a5 5 0 00-5 5c0 1.657 1.343 3 3 3h4c1.657 0 3-1.343 3-3a5 5 0 00-5-5z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19h6"/>
                  </svg>
                  Debug
                </button>
                
                <button 
                  onClick={() => {
                    setModal({
                      title: 'Fix Invalid IDs',
                      message: 'Perbaiki ID tidak valid? Ini akan membersihkan data yang korup.',
                      confirmText: 'Perbaiki',
                      cancelText: 'Batal',
                      onConfirm: async () => {
                        setModal(null);
                        try {
                          setIsModalLoading(true);
                          const response = await fetch('/api/desa_wisata/fix-ids', { method: 'POST' });
                          const data = await response.json();
                          if (data.success) {
                            setModal({ title: 'Sukses', message: 'ID berhasil diperbaiki. Memperbarui data...', confirmText: 'OK', onConfirm: async () => { setModal(null); await refreshData(); } });
                          } else {
                            setModal({ title: 'Gagal', message: 'Gagal memperbaiki ID: ' + data.message, confirmText: 'OK', onConfirm: () => setModal(null) });
                          }
                        } catch (err) {
                          setModal({ title: 'Error', message: 'Error memperbaiki ID: ' + String(err), confirmText: 'OK', onConfirm: () => setModal(null) });
                        } finally {
                          setIsModalLoading(false);
                        }
                      }
                    });
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2.5 text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  title="Fix Invalid IDs"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9a3 3 0 100 6 3 3 0 000-6z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.4 15a1.8 1.8 0 00.33 1.9l.06.06a1 1 0 01-1.42 1.42l-.06-.06a1.8 1.8 0 00-1.9-.33 1.8 1.8 0 00-1.1 1.66V20a1 1 0 01-2 0v-.35a1.8 1.8 0 00-1.1-1.66 1.8 1.8 0 00-1.9.33l-.06.06a1 1 0 01-1.42-1.42l.06-.06a1.8 1.8 0 00.33-1.9 1.8 1.8 0 00-1.66-1.1H4a1 1 0 010-2h.35a1.8 1.8 0 001.66-1.1 1.8 1.8 0 00-.33-1.9l-.06-.06A1 1 0 016.04 6.1l.06.06a1.8 1.8 0 001.9.33A1.8 1.8 0 0010 4.82V4a1 1 0 012 0v.35a1.8 1.8 0 001.1 1.66 1.8 1.8 0 001.9-.33l.06-.06a1 1 0 011.42 1.42l-.06.06a1.8 1.8 0 00-.33 1.9 1.8 1.8 0 001.66 1.1H20a1 1 0 010 2h-.35a1.8 1.8 0 00-1.66 1.1z"/>
                  </svg>
                  Fix IDs
                </button>
                
                <button 
                  onClick={() => {
                    setModal({
                      title: 'Migrasi Tipe',
                      message: 'Migrasi tipe untuk standarisasi data desa wisata? Backup akan dibuat otomatis.',
                      confirmText: 'Migrasi',
                      cancelText: 'Batal',
                      onConfirm: async () => {
                        setModal(null);
                        try {
                          setIsModalLoading(true);
                          const response = await fetch('/api/destinations/migrate-types?action=migrate', { method: 'POST' });
                          const data = await response.json();
                          if (data.success) {
                            setModal({ title: 'Sukses', message: `Migrasi berhasil! ${data.migrated_items} item distandarisasi.\nBackup: ${data.backup_file}`, confirmText: 'OK', onConfirm: async () => { setModal(null); await refreshData(); } });
                          } else {
                            setModal({ title: 'Gagal', message: 'Gagal migrate types: ' + data.message, confirmText: 'OK', onConfirm: () => setModal(null) });
                          }
                        } catch (err) {
                          setModal({ title: 'Error', message: 'Error migrate types: ' + String(err), confirmText: 'OK', onConfirm: () => setModal(null) });
                        } finally {
                          setIsModalLoading(false);
                        }
                      }
                    });
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  title="Migrate Types Data Desa Wisata"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0014-7V5M19 5A9 9 0 005 12v7"/></svg>
                  Migrate Types
                </button>
              </div>
            </div>

            {/* Summary Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Total Village Items Card */}
              <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7l9-4 9 4-9 4-9-4zm0 6l9 4 9-4"/></svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Desa Wisata</dt>
                        <dd className="text-2xl font-bold text-gray-900">{villages.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtered Items Card */}
              <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Tersaring</dt>
                        <dd className="text-2xl font-bold text-gray-900">{filteredVillages.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Village Types Card */}
              <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h10a2 2 0 012 2v10l-6 6H7a2 2 0 01-2-2V5a2 2 0 012-2z"/></svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Jenis Desa Wisata</dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {Array.from(new Set(villages.map(item => item.type))).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Locations Card */}
              <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Lokasi</dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {Array.from(new Set(villages.map(item => item.location))).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Debug Info */}
            <div className="bg-indigo-50 p-4 mb-4 rounded-xl border border-indigo-100">
              <div className="text-sm text-gray-600">
                <strong>Debug Info:</strong> Filter Type: <span className="font-mono">{filterType}</span> | 
                Total Desa Wisata: <span className="font-mono">{villages.length}</span> | 
                Filtered: <span className="font-mono">{filteredVillages.length}</span>
                {filterType !== 'all' && (
                  <span> | Matching types: {villages.filter(item => item.type === filterType).length}</span>
                )}
                {villages.length > 0 && (
                  <span> | Types in data: {Array.from(new Set(villages.map(item => item.type))).join(', ')}</span>
                )}
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAMA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIPE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KATEGORI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BIAYA MASUK</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOKASI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KOORDINAT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AKSI</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVillages.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                        Tidak ada data desa wisata yang ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredVillages.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={item.img_sm || '/placeholder.jpg'} 
                                alt={item.title}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.title}</div>
                              <div className="text-sm text-gray-500">{item.short_description?.substring(0, 50)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {item.type === 'desa-wisata' ? 'Desa Wisata' : 
                             item.type === 'kampung-wisata' ? 'Kampung Wisata' : 
                             item.type === 'ecotourism' ? 'Ecotourism' : 
                             item.type === 'cultural-village' ? 'Desa Budaya' : item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.entrance_fee || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.coordinates ? (
                            <div className="text-xs">
                              <div>Lat: {item.coordinates.latitude || item.coordinates.lat || '-'}</div>
                              <div>Lng: {item.coordinates.longitude || item.coordinates.lng || '-'}</div>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setQuickViewItem(item)}
                              className="text-purple-600 hover:text-purple-900 p-2 rounded-full hover:bg-purple-50 transition-transform duration-150 hover:scale-105 active:scale-95"
                              title="Quick View"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            </button>
                            <Link
                              href={`/admin/villages/${item.id}/view`}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-transform duration-150 hover:scale-105 active:scale-95"
                              title="Lihat Detail"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </Link>
                            <Link
                              href={`/admin/villages/${item.id}`}
                              className="text-emerald-600 hover:text-emerald-900 p-2 rounded-full hover:bg-emerald-50 transition-transform duration-150 hover:scale-105 active:scale-95"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            </Link>
                            <button 
                              onClick={() => confirmDeleteVillage(item.id)}
                              className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-transform duration-150 hover:scale-105 active:scale-95"
                              title="Hapus"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-1-2H10a1 1 0 00-1 1v1h8V6a1 1 0 00-1-1z"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              </div>
              
              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    ← Sebelumnya
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Selanjutnya →
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Menampilkan <span className="font-medium">1</span> sampai <span className="font-medium">{filteredVillages.length}</span> dari <span className="font-medium">{filteredVillages.length}</span> hasil
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-100 transition-colors text-black">
                      ← Sebelumnya
                    </button>
                    
                    <button className="px-3 py-2 text-sm border rounded-lg bg-blue-600 text-white border-blue-600">
                      1
                    </button>
                    
                    <button className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-100 transition-colors text-black">
                      Selanjutnya →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {quickViewItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setQuickViewItem(null)}></div>
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Quick View</h4>
              <button onClick={() => setQuickViewItem(null)} className="p-2 rounded hover:bg-gray-100">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <img src={quickViewItem.img_sm || '/placeholder.jpg'} alt={quickViewItem.title} className="w-16 h-16 rounded-lg object-cover border" />
                <div>
                  <div className="text-lg font-bold text-gray-900">{quickViewItem.title}</div>
                  <div className="text-sm text-gray-500">{quickViewItem.location}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="text-sm"><span className="text-gray-500">Tipe:</span> <span className="font-medium text-gray-900">{quickViewItem.type}</span></div>
                <div className="text-sm"><span className="text-gray-500">Kategori:</span> <span className="font-medium text-gray-900">{quickViewItem.category || 'Desa Wisata'}</span></div>
                <div className="text-sm"><span className="text-gray-500">Biaya Masuk:</span> <span className="font-medium text-gray-900">{quickViewItem.entrance_fee || 'Gratis'}</span></div>
                <div className="text-sm"><span className="text-gray-500">Kontak:</span> <span className="font-medium text-gray-900">{quickViewItem.contact || 'Tidak ada'}</span></div>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">{quickViewItem.short_description || 'Tidak ada deskripsi'}</div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
              <a href={`/admin/villages/${quickViewItem.id}/view`} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Lihat Detail</a>
              <a href={`/admin/villages/${quickViewItem.id}`} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">Edit</a>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)}></div>
          <div className="relative max-w-md w-full mx-4 bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900">{modal.title}</h4>
                <button onClick={() => setModal(null)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 whitespace-pre-wrap">{modal.message}</p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              {modal.cancelText && (
                <button onClick={() => setModal(null)} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium">{modal.cancelText}</button>
              )}
              <button onClick={modal.onConfirm} disabled={isModalLoading} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200 font-medium flex items-center gap-2">
                {isModalLoading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Loading...</>) : (modal.confirmText)}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

// Modals
// Quick View
// Rendered near the bottom of the component return above would be better,
// but for simplicity we append here using conditional blocks below.
