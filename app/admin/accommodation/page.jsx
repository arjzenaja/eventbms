'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function AdminAccommodation() {
  const [accommodations, setAccommodations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isTypeShown, setIsTypeShown] = useState(false);
  const [modal, setModal] = useState(null);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const typeRef = useRef(null);
  const typeOptions = [
    { value: 'all', label: 'Semua Tipe', icon: '🏷️' },
    { value: 'hotel', label: 'Hotel', icon: '🏨' },
    { value: 'resort', label: 'Resort', icon: '🏝️' },
    { value: 'villa', label: 'Vila', icon: '🏡' },
    { value: 'guesthouse', label: 'Guesthouse', icon: '🏘️' },
    { value: 'homestay', label: 'Homestay', icon: '🛏️' },
    { value: 'hostel', label: 'Hostel', icon: '🧳' }
  ];
  const getTypeLabel = (v) => typeOptions.find(o => o.value === v)?.label || v;

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch('/api/penginapan');
        const data = await response.json();
        
        if (data.success) {
          setAccommodations(data.penginapan);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching accommodations:', error);
        setError('Terjadi kesalahan saat mengambil data penginapan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  // Close dropdown on outside click or Esc
  useEffect(() => {
    const onDown = (e) => {
      if (typeRef.current && !typeRef.current.contains(e.target)) {
        if (isTypeOpen) {
          setIsTypeShown(false);
          setTimeout(() => setIsTypeOpen(false), 150);
        }
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape' && isTypeOpen) {
        setIsTypeShown(false);
        setTimeout(() => setIsTypeOpen(false), 150);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isTypeOpen]);

  const openType = () => { if (!isTypeOpen) { setIsTypeOpen(true); setTimeout(() => setIsTypeShown(true), 0);} };
  const closeType = () => { if (isTypeOpen) { setIsTypeShown(false); setTimeout(() => setIsTypeOpen(false), 150);} };

  const filteredAccommodations = accommodations.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDeleteAccommodation = async (itemId) => {
    try {
      const response = await fetch(`/api/penginapan/${itemId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setAccommodations(accommodations.filter(item => item.id !== itemId));
        setModal({
          title: 'Berhasil',
          message: 'Penginapan berhasil dihapus!',
          confirmText: 'OK',
          onConfirm: () => setModal(null)
        });
      } else {
        setModal({
          title: 'Gagal',
          message: 'Gagal menghapus penginapan: ' + data.message,
          confirmText: 'OK',
          onConfirm: () => setModal(null)
        });
      }
    } catch (error) {
      console.error('Error deleting accommodation:', error);
      setModal({
        title: 'Error',
        message: 'Terjadi kesalahan saat menghapus penginapan',
        confirmText: 'OK',
        onConfirm: () => setModal(null)
      });
    }
  };

  const confirmDeleteAccommodation = (itemId) => {
    setModal({
      title: 'Hapus Penginapan',
      message: 'Apakah Anda yakin ingin menghapus penginapan ini?',
      confirmText: 'Hapus',
      cancelText: 'Batal',
      onConfirm: async () => {
        setModal(null);
        await handleDeleteAccommodation(itemId);
      }
    });
  };

  const handleExportData = () => {
    const exportData = filteredAccommodations.map(item => ({
      ID: item.id,
      Nama: item.title,
      Lokasi: item.location,
      Tipe: item.type,
      Kategori: item.category || 'Penginapan',
      Deskripsi: item.short_description || '',
      Biaya: item.price_range || 'Tidak ada info',
      Kontak: item.contact || '',
      Alamat: item.address || '',
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
    link.setAttribute('download', `penginapan_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/penginapan');
      const data = await response.json();
      
      if (data.success) {
        setAccommodations(data.penginapan);
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error refreshing accommodations:', error);
      setError('Terjadi kesalahan saat refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFixIds = () => {
    setModal({
      title: 'Fix Invalid IDs',
      message: 'Perbaiki ID tidak valid? Ini akan membersihkan data yang korup.',
      confirmText: 'Perbaiki',
      cancelText: 'Batal',
      onConfirm: async () => {
        setModal(null);
        try {
          setIsModalLoading(true);
          const response = await fetch('/api/penginapan/fix-ids', { method: 'POST' });
          const data = await response.json();
          
          if (data.success) {
            setModal({
              title: 'Berhasil',
              message: 'ID berhasil diperbaiki. Data akan diperbarui.',
              confirmText: 'OK',
              onConfirm: () => {
                setModal(null);
                refreshData();
              }
            });
          } else {
            setModal({
              title: 'Gagal',
              message: `Gagal: ${data.message}`,
              confirmText: 'OK',
              onConfirm: () => setModal(null)
            });
          }
        } catch (err) {
          setModal({
            title: 'Error',
            message: `Error: ${String(err)}`,
            confirmText: 'OK',
            onConfirm: () => setModal(null)
          });
        } finally {
          setIsModalLoading(false);
        }
      }
    });
  };

  const handleMigrateTypes = () => {
    setModal({
      title: 'Migrasi Jenis Penginapan',
      message: 'Jalankan migrasi tipe untuk standardisasi data penginapan? Sistem akan membuat backup otomatis terlebih dahulu.',
      confirmText: 'Migrasi',
      cancelText: 'Batal',
      onConfirm: async () => {
        setModal(null);
        try {
          setIsModalLoading(true);
          const response = await fetch('/api/destinations/migrate-types?action=migrate', { method: 'POST' });
          const data = await response.json();
          
          if (data.success) {
            setModal({
              title: 'Migrasi Berhasil',
              message: `Migrasi berhasil. Item distandarisasi: ${data.migrated_items}. Backup: ${data.backup_file}`,
              confirmText: 'OK',
              onConfirm: () => {
                setModal(null);
                refreshData();
              }
            });
          } else {
            setModal({
              title: 'Migrasi Gagal',
              message: `Migrasi gagal: ${data.message}`,
              confirmText: 'OK',
              onConfirm: () => setModal(null)
            });
          }
        } catch (err) {
          setModal({
            title: 'Error',
            message: `Error: ${String(err)}`,
            confirmText: 'OK',
            onConfirm: () => setModal(null)
          });
        } finally {
          setIsModalLoading(false);
        }
      }
    });
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data penginapan..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data penginapan"
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7l9-4 9 4-9 4-9-4z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7v10l-9 4-9-4V7" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Penginapan</h1>
                  <p className="mt-1 text-sm text-gray-500">Kelola data penginapan, kamar, dan informasi detail.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/admin/rooms"
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10a2 2 0 012-2h3a3 3 0 013 3v1H3v-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10a2 2 0 00-2-2h-4a3 3 0 00-3 3v1h9v-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 18v-4m18 4v-4" />
                  </svg>
                  Kelola Kamar
                </Link>
                <Link 
                  href="/admin/accommodation/new" 
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <span>+</span>
                  Add New
                </Link>
              </div>
            </div>

            {/* removed debug modal */}
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Search and Filter */}
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cari Penginapan</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Cari berdasarkan nama atau lokasi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="lg:w-72" ref={typeRef}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Filter Tipe</label>
                  <button
                    type="button"
                    onClick={() => (isTypeOpen ? closeType() : openType())}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between shadow-sm"
                    aria-haspopup="listbox"
                    aria-expanded={isTypeOpen}
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M3 12h18M3 20h18"/></svg>
                      <span className="text-gray-900 font-medium">{getTypeLabel(filterType)}</span>
                    </span>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isTypeOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  {isTypeOpen && (
                    <div className="relative">
                      <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl transform transition duration-150 ease-out origin-top ${isTypeShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`}>
                        {typeOptions.map((opt) => (
                          <li key={opt.value}>
                            <button
                              type="button"
                              onClick={() => { setFilterType(opt.value); closeType(); }}
                              className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 outline-none ${filterType === opt.value ? 'bg-blue-50' : ''}`}
                            >
                              <span className="flex items-center gap-3">
                                <span className="text-xl leading-none">{opt.icon}</span>
                                <span className={`text-sm ${filterType === opt.value ? 'text-blue-700 font-semibold' : 'text-gray-800'}`}>{opt.label}</span>
                              </span>
                              {filterType === opt.value && (
                                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                <button onClick={refreshData} disabled={isLoading} className="w-full h-14 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 shadow-sm transition-all duration-150 flex items-center justify-center gap-2 font-semibold" title="Refresh Data">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  <span>Refresh</span>
                </button>
                <button onClick={handleExportData} disabled={filteredAccommodations.length === 0} className="w-full h-14 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 shadow-sm transition-all duration-150 flex items-center justify-center gap-2 font-semibold" title="Export Data Penginapan ke CSV">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  <span>Export</span>
                </button>
                <button onClick={() => setShowDebugInfo(v => !v)} className="w-full h-14 rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow-sm transition-all duration-150 flex items-center justify-center gap-2 font-semibold" title="Tampilkan/Sembunyikan Debug Info">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                  <span>Debug</span>
                </button>
                <button onClick={handleFixIds} className="w-full h-14 rounded-xl bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition-all duration-150 flex items-center justify-center gap-2 font-semibold" title="Fix Invalid IDs">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 11-3.536 3.536L4 17v3h3l9.196-9.196a2.5 2.5 0 003.536-3.536z"/></svg>
                  <span>Fix IDs</span>
                </button>
                <button onClick={handleMigrateTypes} className="w-full h-14 rounded-xl bg-orange-600 text-white hover:bg-orange-700 shadow-sm transition-all duration-150 flex items-center justify-center gap-2 font-semibold" title="Migrate Types Data Penginapan">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  <span>Migrate Types</span>
                </button>
              </div>
            </div>

            {/* Summary Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Total Accommodation Items Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Penginapan</dt>
                        <dd className="text-lg font-medium text-gray-900">{accommodations.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtered Items Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Tersaring</dt>
                        <dd className="text-lg font-medium text-gray-900">{filteredAccommodations.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accommodation Types Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5l7 7-7 7-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Jenis Penginapan</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {Array.from(new Set(accommodations.map(item => item.type))).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Locations Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Lokasi</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {Array.from(new Set(accommodations.map(item => item.location))).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Debug Info Panel (toggleable) */}
            {showDebugInfo && (
              <div className="bg-purple-50 border border-purple-200 p-4 mb-4 rounded-lg flex items-start justify-between">
                <div className="text-sm">
                  <div className="font-semibold text-purple-800 mb-1">Debug Info</div>
                  <div className="text-purple-900">
                    Filter Type: <span className="font-mono">{filterType}</span> | Total Penginapan: <span className="font-mono">{accommodations.length}</span> | Tersaring: <span className="font-mono">{filteredAccommodations.length}</span>
                    {filterType !== 'all' && (
                      <span> | Matching types: {accommodations.filter(item => item.type === filterType).length}</span>
                    )}
                    {accommodations.length > 0 && (
                      <span> | Types in data: {Array.from(new Set(accommodations.map(item => item.type))).join(', ')}</span>
                    )}
                  </div>
                </div>
                <button onClick={() => setShowDebugInfo(false)} className="ml-4 px-3 py-1.5 text-xs rounded-md bg-purple-600 text-white hover:bg-purple-700">Tutup</button>
              </div>
            )}

            {/* Data Table */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Daftar Penginapan</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">{filteredAccommodations.length} dari {accommodations.length} total</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAMA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIPE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RATING BINTANG</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RENTANG HARGA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOKASI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AKSI</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAccommodations.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709"/></svg>
                          <p className="text-gray-500 text-lg font-medium">Tidak ada data yang ditemukan</p>
                          <p className="text-gray-400 text-sm mt-1">{searchTerm || filterType !== 'all' ? 'Coba ubah filter atau kata kunci pencarian' : 'Belum ada data penginapan yang tersedia'}</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAccommodations.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <img className="h-12 w-12 rounded-lg object-cover border border-gray-200" src={item.img_sm || '/placeholder.jpg'} alt={item.title} onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">{item.short_description || 'Tidak ada deskripsi'}</div>
                              <div className="text-xs text-gray-400 mt-1">ID: #{item.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{item.type === 'hotel' ? 'Hotel' : item.type === 'resort' ? 'Resort' : item.type === 'villa' ? 'Vila' : item.type === 'guesthouse' ? 'Guesthouse' : item.type === 'homestay' ? 'Homestay' : item.type === 'hostel' ? 'Hostel' : item.type}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.star_rating ? '⭐'.repeat(item.star_rating) : '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.price_range || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button onClick={() => setQuickViewItem(item)} className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-95" title="Quick View">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            </button>
                            <Link href={`/admin/accommodation/${item.id}/view`} className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-95" title="Lihat Detail">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </Link>
                            <Link href={`/admin/accommodation/${item.id}`} className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-95" title="Edit">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            </Link>
                            <button onClick={() => confirmDeleteAccommodation(item.id)} className="p-2 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-95 text-red-600 hover:text-red-900 hover:bg-red-50" title="Hapus">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
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
                      Menampilkan <span className="font-medium">1</span> sampai <span className="font-medium">{filteredAccommodations.length}</span> dari <span className="font-medium">{filteredAccommodations.length}</span> hasil
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

        {/* Quick View Modal */}
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
                  <div className="text-sm"><span className="text-gray-500">Kategori:</span> <span className="font-medium text-gray-900">{quickViewItem.category || 'Penginapan'}</span></div>
                  <div className="text-sm"><span className="text-gray-500">Rentang Harga:</span> <span className="font-medium text-gray-900">{quickViewItem.price_range || '-'}</span></div>
                  <div className="text-sm"><span className="text-gray-500">Kontak:</span> <span className="font-medium text-gray-900">{quickViewItem.contact || 'Tidak ada'}</span></div>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">{quickViewItem.short_description || 'Tidak ada deskripsi'}</div>
              </div>
              <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
                <a href={`/admin/accommodation/${quickViewItem.id}/view`} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Lihat Detail</a>
                <a href={`/admin/accommodation/${quickViewItem.id}`} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">Edit</a>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop with blur */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)}></div>
            
            {/* Modal content */}
            <div className="relative max-w-md w-full mx-4 bg-white rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900">{modal.title}</h4>
                  <button 
                    onClick={() => setModal(null)} 
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Body */}
              <div className="p-6">
                <p className="text-gray-700 whitespace-pre-wrap">{modal.message}</p>
              </div>
              
              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                {modal.cancelText && (
                  <button 
                    onClick={() => setModal(null)} 
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                  >
                    {modal.cancelText}
                  </button>
                )}
                <button 
                  onClick={modal.onConfirm} 
                  disabled={isModalLoading}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200 font-medium flex items-center gap-2"
                >
                  {isModalLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    modal.confirmText
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
