'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function AdminSouvenirs() {
  const [souvenirs, setSouvenirs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
  const [isTypeMenuShown, setIsTypeMenuShown] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const typeDropdownRef = useRef(null);

  const typeOptions = [
    { value: 'all', label: 'Semua Tipe', icon: '🔍' },
    { value: 'batik', label: 'Batik', icon: '🎨' },
    { value: 'keramik', label: 'Keramik', icon: '🏺' },
    { value: 'kerajinan', label: 'Kerajinan', icon: '🛠️' },
    { value: 'makanan', label: 'Makanan', icon: '🍪' },
    { value: 'minuman', label: 'Minuman', icon: '🥤' },
    { value: 'pakaian', label: 'Pakaian', icon: '👕' },
    { value: 'aksesoris', label: 'Aksesoris', icon: '💍' },
    { value: 'dekorasi', label: 'Dekorasi', icon: '🏠' },
    { value: 'mainan', label: 'Mainan', icon: '🧸' },
    { value: 'buku', label: 'Buku', icon: '📚' },
    { value: 'musik', label: 'Musik', icon: '🎵' },
    { value: 'seni', label: 'Seni', icon: '🎭' },
    { value: 'tradisional', label: 'Tradisional', icon: '🏮' },
    { value: 'modern', label: 'Modern', icon: '✨' }
  ];

  const getTypeLabel = (value) => {
    const found = typeOptions.find(o => o.value === value);
    return found ? found.label : value;
  };

  useEffect(() => {
    const fetchSouvenirs = async () => {
      try {
        const response = await fetch('/api/oleh_oleh');
        const data = await response.json();
        
        if (data.success) {
          setSouvenirs(data.oleh_oleh || []);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching souvenirs:', error);
        setError('Terjadi kesalahan saat mengambil data oleh-oleh');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSouvenirs();
  }, []);

  // Dropdown management
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        if (isTypeMenuOpen) {
          setIsTypeMenuShown(false);
          setTimeout(() => setIsTypeMenuOpen(false), 150);
        }
      }
    };
    
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isTypeMenuOpen) {
        setIsTypeMenuShown(false);
        setTimeout(() => setIsTypeMenuOpen(false), 150);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isTypeMenuOpen]);

  const openTypeMenu = () => {
    if (!isTypeMenuOpen) {
      setIsTypeMenuOpen(true);
      setTimeout(() => setIsTypeMenuShown(true), 0);
    }
  };

  const closeTypeMenu = () => {
    if (isTypeMenuOpen) {
      setIsTypeMenuShown(false);
      setTimeout(() => setIsTypeMenuOpen(false), 150);
    }
  };

  const filteredSouvenirs = souvenirs.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleQuickView = (item) => {
    setQuickViewItem(item);
  };

  const handleDuplicateSouvenir = async (itemId) => {
    if (!confirm('Apakah Anda yakin ingin menduplikasi item oleh-oleh ini?')) {
      return;
    }

    try {
      // Get the original item data
      const response = await fetch(`/api/oleh_oleh/${itemId}`);
      const data = await response.json();
      
      if (!data.success) {
        alert('Gagal mengambil data oleh-oleh: ' + data.message);
        return;
      }

      const originalItem = data.oleh_oleh;
      
      // Create FormData for the new item
      const formData = new FormData();
      formData.append('title', originalItem.title + ' (Copy)');
      formData.append('type', originalItem.type);
      formData.append('location', originalItem.location);
      formData.append('category', originalItem.category);
      formData.append('short_description', originalItem.short_description);
      formData.append('description', originalItem.description);
      formData.append('price_range', originalItem.price_range);
      formData.append('contact', originalItem.contact);
      formData.append('address', originalItem.address);
      formData.append('features', originalItem.features ? originalItem.features.join(',') : '');
      formData.append('recommended', originalItem.recommended ? 'true' : 'false');
      formData.append('img_sm', originalItem.img_sm);
      formData.append('img_lg', originalItem.img_lg);

      // Create the new item
      const createResponse = await fetch('/api/oleh_oleh', {
        method: 'POST',
        body: formData,
      });

      const createData = await createResponse.json();

      if (createData.success) {
        alert('Oleh-oleh berhasil diduplikasi!');
        await refreshData();
      } else {
        alert('Gagal menduplikasi oleh-oleh: ' + createData.message);
      }
    } catch (error) {
      console.error('Error duplicating souvenir:', error);
      alert('Terjadi kesalahan saat menduplikasi oleh-oleh: ' + error.message);
    }
  };

  const handleDeleteSouvenir = async (itemId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus oleh-oleh ini?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/oleh_oleh/${itemId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSouvenirs(souvenirs.filter(item => item.id !== itemId));
        alert('Oleh-oleh berhasil dihapus!');
      } else {
        alert('Gagal menghapus oleh-oleh: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting souvenir:', error);
      alert('Terjadi kesalahan saat menghapus oleh-oleh');
    } finally {
      setIsDeleting(false);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/oleh_oleh');
      const data = await response.json();
      
      if (data.success) {
        setSouvenirs(data.oleh_oleh || []);
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error refreshing souvenirs:', error);
      setError('Terjadi kesalahan saat refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data oleh-oleh..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={refreshData}
          message="Gagal memuat data oleh-oleh"
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header - Same as Destinations */}
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4 8 4-8 4-8-4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7v10l-9 4-9-4V7" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Data Oleh-oleh</h1>
                </div>
                <p className="mt-2 text-sm text-gray-500">Kelola data oleh-oleh, souvenir, dan informasi detail.</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/souvenirs/packages"
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12l-8 4-8-4m16 0V7l-8 4m8 1l-8 4m0-5L4 7v5" />
                  </svg>
                  <span className="font-medium">Kelola Paket</span>
                </Link>

                <Link 
                  href="/admin/souvenirs/new" 
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-medium">Add New</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Search and Filter - Same as Destinations */}
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                {/* Search and Filter Row */}
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cari Oleh-oleh
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
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
                  
                  <div className="lg:w-72" ref={typeDropdownRef}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Filter Tipe
                    </label>
                    <button
                      type="button"
                      onClick={() => (isTypeMenuOpen ? closeTypeMenu() : openTypeMenu())}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between shadow-sm transform hover:scale-[1.01] active:scale-95"
                      aria-haspopup="listbox"
                      aria-expanded={isTypeMenuOpen}
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M3 12h18M3 20h18" />
                        </svg>
                        <span className="text-gray-900 font-medium">{getTypeLabel(filterType)}</span>
                      </span>
                      <svg className={`w-4 h-4 text-gray-500 transition-transform ${isTypeMenuOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isTypeMenuOpen && (
                      <div className="relative">
                        <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl transform transition duration-150 ease-out origin-top ${isTypeMenuShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`}> 
                          {typeOptions.map((opt) => (
                            <li key={opt.value}>
                              <button
                                type="button"
                                onClick={() => { setFilterType(opt.value); closeTypeMenu(); }}
                                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 outline-none ${filterType === opt.value ? 'bg-blue-50' : ''}`}
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-xl leading-none">{opt.icon}</span>
                                  <span className={`text-sm ${filterType === opt.value ? 'text-blue-700 font-semibold' : 'text-gray-800'}`}>{opt.label}</span>
                                </span>
                                {filterType === opt.value && (
                                  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons Row */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    {/* Refresh Button */}
                    <button 
                      onClick={refreshData}
                      disabled={isLoading}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95 disabled:bg-green-400 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                      </svg>
                      <span className="font-medium">Refresh</span>
                    </button>
                    
                    {/* Export Button */}
                    <button 
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/destinations/export?format=csv&category=oleh_oleh');
                          if (response.ok) {
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `oleh_oleh_${new Date().toISOString().split('T')[0]}.csv`;
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            document.body.removeChild(a);
                            alert('Data oleh-oleh berhasil diexport ke CSV!');
                          } else {
                            alert('Gagal export data: ' + response.statusText);
                          }
                        } catch (error) {
                        console.error('Error exporting data:', error);
                        alert('Terjadi kesalahan saat export data');
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-medium">Export</span>
                    </button>
                    
                    {/* Debug Button */}
                    <button 
                      onClick={() => {
                      const uniqueTypes = [...new Set(souvenirs.map(s => s.type))];
                      setDialog({
                        title: 'Debug Info',
                        message: `Total oleh-oleh: ${souvenirs.length}\nTersaring: ${filteredSouvenirs.length}\n\nTypes in data: ${uniqueTypes.join(', ')}\n\nCurrent filterType: ${filterType}`,
                        confirmText: 'OK'
                      });
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                      </svg>
                      <span className="font-medium">Debug</span>
                    </button>
                    
                    {/* Fix IDs Button */}
                    <button 
                    onClick={() => {
                      setDialog({
                        title: 'Fix Invalid IDs',
                        message: 'Perbaiki ID tidak valid? Ini akan membersihkan data yang korup.',
                        confirmText: 'Perbaiki',
                        cancelText: 'Batal',
                        onConfirm: async () => {
                          setDialog(null);
                          try {
                            const response = await fetch('/api/oleh_oleh/fix-ids', { method: 'POST' });
                            if (!response.ok) {
                              const errorText = await response.text();
                              throw new Error(`HTTP ${response.status}: ${errorText}`);
                            }
                            const data = await response.json();
                            if (data.success) {
                              setDialog({ title: 'Sukses', message: 'IDs berhasil diperbaiki. Refreshing data...', confirmText: 'OK' });
                              await refreshData();
                            } else {
                              setDialog({ title: 'Gagal', message: 'Gagal memperbaiki IDs: ' + data.message, confirmText: 'OK' });
                            }
                          } catch (err) {
                            setDialog({ title: 'Error', message: 'Error fixing IDs: ' + err.message, confirmText: 'OK' });
                          }
                        }
                      });
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2.5 text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826-3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      <span className="font-medium">Fix IDs</span>
                    </button>
                  
                    {/* Migrate Types Button */}
                    <button 
                    onClick={() => {
                      setDialog({
                        title: 'Migrasi Tipe',
                        message: 'Migrasi tipe untuk standarisasi data oleh-oleh? Backup akan dibuat otomatis.',
                        confirmText: 'Migrasi',
                        cancelText: 'Batal',
                        onConfirm: async () => {
                          setDialog(null);
                          try {
                            const response = await fetch('/api/destinations/migrate-types?action=migrate', { 
                              method: 'POST' 
                            });
                            const data = await response.json();
                            if (data.success) {
                              setDialog({ title: 'Sukses', message: `Migrasi berhasil! ${data.migrated_items} item distandarisasi.\nBackup: ${data.backup_file}`, confirmText: 'OK' });
                              await refreshData();
                            } else {
                              setDialog({ title: 'Gagal', message: 'Gagal migrate types: ' + data.message, confirmText: 'OK' });
                            }
                          } catch (err) {
                            setDialog({ title: 'Error', message: 'Error migrate types: ' + err.message, confirmText: 'OK' });
                          }
                        }
                      });
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                      </svg>
                      <span className="font-medium">Migrate Types</span>
                    </button>
                </div>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Items Card */}
              <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Oleh-oleh</dt>
                        <dd className="text-2xl font-bold text-gray-900">{souvenirs.length}</dd>
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
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Tersaring</dt>
                        <dd className="text-2xl font-bold text-gray-900">{filteredSouvenirs.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Types Card */}
              <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Jenis Oleh-oleh</dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {Array.from(new Set(souvenirs.map(item => item.type))).length}
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
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Lokasi</dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {Array.from(new Set(souvenirs.map(item => item.location))).length}
                        </dd>
                      </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Data Table - Same as Destinations */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">NO</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">NAMA</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">TIPE</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">KATEGORI</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">RENTANG HARGA</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">LOKASI</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">AKSI</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSouvenirs.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada data oleh-oleh</h3>
                          <p className="text-gray-500 mb-4 max-w-md">
                            {searchTerm || filterType !== 'all' 
                              ? 'Tidak ada oleh-oleh yang sesuai dengan filter yang dipilih. Coba ubah filter atau kata kunci pencarian.'
                              : 'Belum ada data oleh-oleh yang ditambahkan. Mulai dengan menambahkan oleh-oleh pertama.'
                            }
                          </p>
                          {!searchTerm && filterType === 'all' && (
                            <Link 
                              href="/admin/souvenirs/new"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                              </svg>
                              Tambah Oleh-oleh Pertama
                            </Link>
                          )}
                          {(searchTerm || filterType !== 'all') && (
                            <button
                              onClick={() => {
                                setSearchTerm('');
                                setFilterType('all');
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Reset Filter
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSouvenirs.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <img 
                                className="h-12 w-12 rounded-xl object-cover border border-gray-200" 
                                src={item.img_sm || '/placeholder.jpg'} 
                                alt={item.title}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900">{item.title}</div>
                              <div className="text-sm text-gray-500">{item.short_description?.substring(0, 60)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                            {item.type === 'batik' ? 'Batik' : 
                             item.type === 'keramik' ? 'Keramik' : 
                             item.type === 'kerajinan' ? 'Kerajinan' : 
                             item.type === 'makanan' ? 'Makanan' : 
                             item.type === 'minuman' ? 'Minuman' : 
                             item.type === 'pakaian' ? 'Pakaian' : item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{item.category || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{item.price_range || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{item.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              onClick={() => handleQuickView(item)}
                              className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-95"
                              title="Quick View"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <Link
                              href={`/admin/souvenirs/${item.id}/view`}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-95"
                              title="Lihat Detail"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </Link>
                            <Link
                              href={`/admin/souvenirs/${item.id}`}
                              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-95"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            <button 
                              onClick={() => handleDeleteSouvenir(item.id)}
                              disabled={isDeleting}
                              className={`p-2 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-95 ${
                                isDeleting 
                                  ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                                  : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                              }`}
                              title="Hapus"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
              
              {/* Enhanced Pagination */}
              <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                    ← Sebelumnya
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                    Selanjutnya →
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Menampilkan <span className="font-semibold">1</span> sampai <span className="font-semibold">{filteredSouvenirs.length}</span> dari <span className="font-semibold">{filteredSouvenirs.length}</span> hasil
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700 font-medium">
                      ← Sebelumnya
                    </button>
                    
                    <button className="px-4 py-2 text-sm border rounded-lg bg-blue-600 text-white border-blue-600 font-semibold">
                      1
                    </button>
                    
                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700 font-medium">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                  <h5 className="font-semibold text-gray-900">{quickViewItem.title}</h5>
                  <p className="text-sm text-gray-600">{quickViewItem.location}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Tipe:</span> {quickViewItem.type}</div>
                <div><span className="font-medium">Kategori:</span> {quickViewItem.category || '-'}</div>
                <div><span className="font-medium">Harga:</span> {quickViewItem.price_range || '-'}</div>
                <div><span className="font-medium">Kontak:</span> {quickViewItem.contact || '-'}</div>
                <div><span className="font-medium">Deskripsi:</span> {quickViewItem.short_description || '-'}</div>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
              <Link href={`/admin/souvenirs/${quickViewItem.id}/view`} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Lihat Detail</Link>
              <Link href={`/admin/souvenirs/${quickViewItem.id}`} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">Edit</Link>
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
