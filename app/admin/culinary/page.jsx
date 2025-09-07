'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function AdminCulinary() {
  const [culinaryItems, setCulinaryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isTypeShown, setIsTypeShown] = useState(false);
  const typeRef = useRef(null);
  const typeOptions = [
    { value: 'all', label: 'Semua Tipe', icon: '🍽️' },
    { value: 'cafe', label: 'Cafe', icon: '☕' },
    { value: 'resto', label: 'Resto', icon: '🍱' },
    { value: 'kedai', label: 'Kedai', icon: '🍜' },
    { value: 'rumah-makan', label: 'Rumah Makan', icon: '🍛' },
  ];
  const getTypeLabel = (v) => typeOptions.find(o => o.value === v)?.label || v;
  const [dialog, setDialog] = useState(null); // {title, message, confirmText, cancelText, onConfirm}
  const [quickViewItem, setQuickViewItem] = useState(null);

  useEffect(() => {
    const fetchCulinaryItems = async () => {
      try {
        const response = await fetch('/api/kuliner');
        
        // Check if response is ok
        if (!response.ok) {
          console.error('Response not ok:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Error response body:', errorText);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Check content type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const errorText = await response.text();
          console.error('Non-JSON response:', contentType, errorText);
          throw new Error('Server returned non-JSON response');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setCulinaryItems(data.kuliner);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching culinary items:', error);
        setError('Terjadi kesalahan saat mengambil data kuliner: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCulinaryItems();
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

  const filteredCulinaryItems = culinaryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDeleteCulinaryItem = async (itemId) => {
    setDialog({
      title: 'Hapus Item',
      message: 'Apakah Anda yakin ingin menghapus item kuliner ini?',
      confirmText: 'Hapus',
      cancelText: 'Batal',
      onConfirm: async () => {
        setDialog(null);
        try {
          const response = await fetch(`/api/kuliner/${itemId}`, { method: 'DELETE' });
       
      // Check if response is ok
      if (!response.ok) {
        console.error('Response not ok:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('Non-JSON response:', contentType, errorText);
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCulinaryItems(culinaryItems.filter(item => item.id !== itemId));
        setDialog({ title: 'Sukses', message: 'Item kuliner berhasil dihapus!', confirmText: 'OK', onConfirm: () => setDialog(null) });
      } else {
        setDialog({ title: 'Gagal', message: 'Gagal menghapus item kuliner: ' + data.message, confirmText: 'OK', onConfirm: () => setDialog(null) });
      }
    } catch (error) {
      console.error('Error deleting culinary item:', error);
      setDialog({ title: 'Error', message: 'Terjadi kesalahan saat menghapus item kuliner: ' + error.message, confirmText: 'OK', onConfirm: () => setDialog(null) });
    }
      }
    });
  };

  const handleExportData = () => {
    const exportData = filteredCulinaryItems.map(item => ({
      ID: item.id,
      Nama: item.title,
      Lokasi: item.location,
      Tipe: item.type,
      Kategori: item.category || 'Kuliner',
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
    link.setAttribute('download', `kuliner_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/kuliner');
      
      // Check if response is ok
      if (!response.ok) {
        console.error('Response not ok:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('Non-JSON response:', contentType, errorText);
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Refreshed culinary items:', data.kuliner);
        setCulinaryItems(data.kuliner);
        setError(''); // Clear any previous errors
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error refreshing culinary items:', error);
      setError('Terjadi kesalahan saat refresh data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data kuliner..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data kuliner"
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
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M5 12h14M7 18h10"/></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Kuliner</h1>
                  <p className="mt-1 text-sm text-gray-500">Kelola data kuliner, menu, dan informasi detail.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link 
                  href="/admin/culinary/menu" 
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 4v8m4-8v8m4-8v8M4 12h16m-9 4v4m2-4v4"/></svg>
                  Kelola Menu
                </Link>
                <Link 
                  href="/admin/culinary/new" 
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                  Add New
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Search and Filter */}
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cari Kuliner</label>
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
              
              <div className="flex gap-2 items-end">
                <div className="lg:w-64" ref={typeRef}>
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
                
                {/* Action Buttons Row */}
                <div className="flex flex-wrap gap-3 pt-2">
                <button 
                  onClick={refreshData}
                  disabled={isLoading}
                  className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2 transition-all duration-200 text-sm font-medium transform hover:scale-105 active:scale-95"
                  title="Refresh Data"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  Refresh
                </button>
                
                <button 
                  onClick={handleExportData}
                  disabled={filteredCulinaryItems.length === 0}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2 transition-all duration-200 text-sm font-medium transform hover:scale-105 active:scale-95"
                  title="Export Data ke CSV"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  Export
                </button>
                
                <button 
                  onClick={() => {
                    console.log('Current culinary items state:', culinaryItems);
                    console.log('Filtered culinary items:', filteredCulinaryItems);
                    setDialog({ title: 'Debug Info', message: `Total kuliner: ${culinaryItems.length}\nTersaring: ${filteredCulinaryItems.length}`, confirmText: 'OK' });
                  }}
                  className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-all duration-200 text-sm font-medium transform hover:scale-105 active:scale-95"
                  title="Debug Info"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7a4 4 0 00-2 0m-3 3h8m-9 4h10m-6 4h2M6 7l-2 2m14-2l2 2m-2 8l2 2M6 17l-2 2"/></svg>
                  Debug
                </button>
                
                <button 
                  onClick={async () => {
                    setDialog({
                      title: 'Fix Invalid IDs',
                      message: 'Perbaiki ID tidak valid? Ini akan membersihkan data yang rusak.',
                      confirmText: 'Perbaiki',
                      cancelText: 'Batal',
                      onConfirm: async () => {
                        setDialog(null);
                        try {
                          const response = await fetch('/api/kuliner/fix-ids', { method: 'POST' });
                          const data = await response.json();
                          if (data.success) {
                            setDialog({ title: 'Sukses', message: 'ID berhasil diperbaiki! Memperbarui data...', confirmText: 'OK', onConfirm: () => setDialog(null) });
                            await refreshData();
                          } else {
                            setDialog({ title: 'Gagal', message: 'Gagal memperbaiki ID: ' + data.message, confirmText: 'OK', onConfirm: () => setDialog(null) });
                          }
                        } catch (error) {
                          setDialog({ title: 'Error', message: 'Error memperbaiki ID: ' + error.message, confirmText: 'OK', onConfirm: () => setDialog(null) });
                        }
                      }
                    });
                  }}
                  className="px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2 transition-all duration-200 text-sm font-medium transform hover:scale-105 active:scale-95"
                  title="Fix Invalid IDs"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 11-3.536 3.536L4 17v3h3l9.196-9.196a2.5 2.5 0 003.536-3.536z"/></svg>
                  Fix IDs
                </button>
                
                <button 
                  onClick={async () => {
                    setDialog({
                      title: 'Migrasi Tipe',
                      message: 'Migrasi tipe untuk standarisasi data kuliner? Backup akan dibuat otomatis.',
                      confirmText: 'Migrasi',
                      cancelText: 'Batal',
                      onConfirm: async () => {
                        setDialog(null);
                        try {
                          const response = await fetch('/api/destinations/migrate-types?action=migrate', { method: 'POST' });
                          const data = await response.json();
                          if (data.success) {
                            setDialog({ title: 'Sukses', message: `Migrasi berhasil! ${data.migrated_items} item distandarisasi.\nBackup: ${data.backup_file}`, confirmText: 'OK', onConfirm: () => setDialog(null) });
                            await refreshData();
                          } else {
                            setDialog({ title: 'Gagal', message: 'Gagal migrate types: ' + data.message, confirmText: 'OK', onConfirm: () => setDialog(null) });
                          }
                        } catch (error) {
                          setDialog({ title: 'Error', message: 'Error migrate types: ' + error.message, confirmText: 'OK', onConfirm: () => setDialog(null) });
                        }
                      }
                    });
                  }}
                  className="px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 transition-all duration-200 text-sm font-medium transform hover:scale-105 active:scale-95"
                  title="Migrate Types Data Kuliner"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                  Migrate Types
                </button>
                </div>
              </div>
              </div>
            </div>

            {/* Summary Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Total Culinary Items Card */}
              <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M5 12h14M7 18h10"/></svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-600 truncate">Total Kuliner</dt>
                        <dd className="text-2xl font-bold text-gray-900">{culinaryItems.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtered Items Card */}
              <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-600 truncate">Tersaring</dt>
                        <dd className="text-2xl font-bold text-gray-900">{filteredCulinaryItems.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Culinary Types Card */}
              <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5l7 7-7 7-7-7z"/></svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-600 truncate">Jenis Kuliner</dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {Array.from(new Set(culinaryItems.map(item => item.type))).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Locations Card */}
              <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-600 truncate">Lokasi</dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {Array.from(new Set(culinaryItems.map(item => item.location))).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Header */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Daftar Kuliner</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">{filteredCulinaryItems.length} dari {culinaryItems.length} total</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Kuliner</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tipe</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Jenis Masakan</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Rentang Harga</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Lokasi</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Kontak</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCulinaryItems.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                        Tidak ada data kuliner yang ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredCulinaryItems.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-lg object-cover border border-gray-200" 
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
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.type === 'cafe' ? 'Cafe' : 
                             item.type === 'resto' ? 'Resto' : 
                             item.type === 'kedai' ? 'Kedai' : 
                             item.type === 'warung' ? 'Warung' : 
                             item.type === 'rumah-makan' ? 'Rumah Makan' : item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.cuisine || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.price_range || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.contact || item.phone || item.whatsapp || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={() => setQuickViewItem(item)}
                              className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-95"
                              title="Quick View"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <Link
                              href={`/admin/culinary/${item.id}/view`}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-95"
                              title="Lihat Detail"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </Link>
                            <Link
                              href={`/admin/culinary/${item.id}`}
                              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-95"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            <button 
                              onClick={() => handleDeleteCulinaryItem(item.id)}
                              className="p-2 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-95 text-red-600 hover:text-red-900 hover:bg-red-50"
                              title="Hapus"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
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
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
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
                    <p className="text-sm text-gray-600">
                      Menampilkan <span className="font-semibold text-gray-900">1</span> sampai <span className="font-semibold text-gray-900">{filteredCulinaryItems.length}</span> dari <span className="font-semibold text-gray-900">{filteredCulinaryItems.length}</span> hasil
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white hover:border-gray-400 transition-all duration-200 text-gray-700 bg-white font-medium">
                      ← Sebelumnya
                    </button>
                    
                    <button className="px-4 py-2 text-sm border rounded-lg bg-blue-600 text-white border-blue-600 hover:bg-blue-700 transition-all duration-200 font-medium">
                      1
                    </button>
                    
                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white hover:border-gray-400 transition-all duration-200 text-gray-700 bg-white font-medium">
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
                <div className="text-sm"><span className="text-gray-500">Harga:</span> <span className="font-medium text-gray-900">{quickViewItem.price_range || '-'}</span></div>
                <div className="text-sm"><span className="text-gray-500">Kontak:</span> <span className="font-medium text-gray-900">{quickViewItem.contact || quickViewItem.phone || '-'}</span></div>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">
                {quickViewItem.short_description || 'Tidak ada deskripsi'}
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
              <a href={`/admin/culinary/${quickViewItem.id}/view`} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Lihat Detail</a>
              <a href={`/admin/culinary/${quickViewItem.id}`} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">Edit</a>
            </div>
          </div>
        </div>
      )}
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDialog(null)}></div>
          <div className="relative max-w-lg w-full mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">{dialog.title || 'Info'}</h4>
              <button onClick={() => setDialog(null)} className="p-2 rounded hover:bg-gray-100">✕</button>
            </div>
            <div className="p-6 whitespace-pre-wrap text-gray-800">{dialog.message}</div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
              {dialog.cancelText && (
                <button onClick={() => setDialog(null)} className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-black">{dialog.cancelText}</button>
              )}
              <button onClick={dialog.onConfirm || (() => setDialog(null))} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">{dialog.confirmText || 'OK'}</button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
