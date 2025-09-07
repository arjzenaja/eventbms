'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function AdminDestinations() {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isDeleting, setIsDeleting] = useState(false);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [dialog, setDialog] = useState(null);
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false); // mounted state
  const [isTypeMenuShown, setIsTypeMenuShown] = useState(false); // animated visibility
  const typeDropdownRef = useRef(null);

  const typeOptions = [
    { value: 'all', label: 'Semua Tipe', icon: '🔎' },
    { value: 'wisata alam', label: 'Wisata Alam', icon: '🏞️' },
    { value: 'wisata taman', label: 'Wisata Taman', icon: '🌳' },
    { value: 'wisata budaya', label: 'Wisata Budaya', icon: '🏛️' },
    { value: 'wisata sejarah', label: 'Wisata Sejarah', icon: '🕰️' },
    { value: 'wisata buatan', label: 'Wisata Buatan', icon: '🎡' },
    { value: 'wisata minat khusus', label: 'Wisata Minat Khusus', icon: '🎯' },
    { value: 'wisata religi', label: 'Wisata Religi', icon: '🕌' }
  ];

  const getTypeLabel = (value) => {
    const found = typeOptions.find(o => o.value === value);
    return found ? found.label : value;
  };

  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || destination.type === filterType;
    
    // Debug logging
    if (filterType !== 'all') {
      console.log(`Filtering: ${destination.title} - type: ${destination.type}, filterType: ${filterType}, matches: ${matchesType}`);
    }
    
    return matchesSearch && matchesType;
  });

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        // Add cache-busting parameter
        const response = await fetch(`/api/wisata?t=${Date.now()}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
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
          console.log('Initial destinations loaded:', data.wisata);
          console.log('Initial destination IDs:', data.wisata.map(d => ({ id: d.id, type: typeof d.id, title: d.title })));
          setDestinations(data.wisata);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setError('Terjadi kesalahan saat mengambil data objek wisata: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Debug useEffect to log filterType changes
  useEffect(() => {
    console.log('filterType changed to:', filterType);
    console.log('Total destinations:', destinations.length);
    console.log('Filtered destinations:', filteredDestinations.length);
  }, [filterType, destinations, filteredDestinations]);

  // Close custom dropdown on outside click or ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        // start closing animation
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
      // next tick to trigger transition
      setTimeout(() => setIsTypeMenuShown(true), 0);
    }
  };

  const closeTypeMenu = () => {
    if (isTypeMenuOpen) {
      setIsTypeMenuShown(false);
      setTimeout(() => setIsTypeMenuOpen(false), 150);
    }
  };

    const handleDeleteDestination = async (destinationId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus objek wisata ini?')) {
      return;
    }
    
    console.log('Attempting to delete destination with ID:', destinationId);
    console.log('Destination ID type:', typeof destinationId);
    console.log('Destination ID value:', destinationId);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/wisata/${destinationId}`, {
        method: 'DELETE',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
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
        // Update local state immediately
        setDestinations(prevDestinations => 
          prevDestinations.filter(dest => dest.id !== destinationId)
        );
        
        // Show success message
        alert('Objek wisata berhasil dihapus!');
        
        // Refresh data from server to ensure consistency
        await refreshData();
      } else {
        console.error('Delete failed:', data.message);
        alert('Gagal menghapus objek wisata: ' + data.message);
        
        // Refresh data to ensure UI is in sync
        await refreshData();
      }
    } catch (error) {
      console.error('Error deleting destination:', error);
      alert('Terjadi kesalahan saat menghapus objek wisata. Silakan coba lagi.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicateDestination = async (destinationId) => {
    if (!confirm('Apakah Anda yakin ingin menduplikasi objek wisata ini?')) {
      return;
    }

    try {
      // Get the destination data first
      const response = await fetch(`/api/wisata/${destinationId}`);
      
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
        const destination = data.wisata;
        
                 // Create FormData for the new destination
         const formData = new FormData();
         formData.append('title', `${destination.title} (Copy)`);
         formData.append('description', destination.description || '');
         formData.append('short_description', destination.short_description || '');
         formData.append('location', destination.location || '');
         formData.append('type', destination.type || 'wisata alam');
         formData.append('category', destination.category || 'Wisata');
         formData.append('entrance_fee', destination.entrance_fee || 'Gratis');
         formData.append('contact', destination.contact || '');
         formData.append('address', destination.address || '');
         formData.append('recommended', destination.recommended || false);
        
        // Create new destination via API
        const createResponse = await fetch('/api/wisata', {
          method: 'POST',
          body: formData
        });
        
        // Check if response is ok
        if (!createResponse.ok) {
          console.error('Create response not ok:', createResponse.status, createResponse.statusText);
          const errorText = await createResponse.text();
          console.error('Error response body:', errorText);
          throw new Error(`HTTP ${createResponse.status}: ${createResponse.statusText}`);
        }
        
        // Check content type
        const contentType = createResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const errorText = await createResponse.text();
          console.error('Non-JSON response:', contentType, errorText);
          throw new Error('Server returned non-JSON response');
        }
        
        const createData = await createResponse.json();
        
        if (createData.success) {
          alert('Objek wisata berhasil diduplikasi!');
          await refreshData();
        } else {
          alert('Gagal menduplikasi objek wisata: ' + createData.message);
        }
      } else {
        alert('Gagal mengambil data objek wisata: ' + data.message);
      }
    } catch (error) {
      console.error('Error duplicating destination:', error);
      alert('Terjadi kesalahan saat menduplikasi objek wisata.');
    }
  };

  const handleQuickView = (destination) => {
    setQuickViewItem(destination);
  };

  const handleExportData = () => {
    const exportData = filteredDestinations.map(dest => ({
      ID: dest.id,
      Nama: dest.title,
      Lokasi: dest.location,
      Tipe: dest.type,
      Kategori: dest.category || 'Wisata',
      Deskripsi: dest.short_description || '',
      Biaya_Masuk: dest.entrance_fee || 'Gratis',
      Kontak: dest.contact || '',
      Direkomendasikan: dest.recommended ? 'Ya' : 'Tidak'
    }));

    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `destinations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
              // Add cache-busting parameter
        const response = await fetch(`/api/wisata?t=${Date.now()}`, {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
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
          console.log('Refreshed destinations:', data.wisata);
          console.log('Destination IDs:', data.wisata.map(d => ({ id: d.id, type: typeof d.id, title: d.title })));
          setDestinations(data.wisata);
          setError(''); // Clear any previous errors
        } else {
          setError(data.message);
        }
    } catch (error) {
      console.error('Error refreshing destinations:', error);
      setError('Terjadi kesalahan saat refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data objek wisata..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data objek wisata"
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7l9-4 9 4-9 4-9-4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7v10l-9 4-9-4V7" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Data Wisata</h1>
                </div>
                <p className="mt-2 text-sm text-gray-500">Kelola data destinasi wisata, paket, dan informasi detail.</p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/admin/destinations/packages"
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12l-8 4-8-4m16 0V7l-8 4m8 1l-8 4m0-5L4 7v5" />
                  </svg>
                  <span className="font-medium">Kelola Paket</span>
                </Link>

                <Link 
                  href="/admin/destinations/new" 
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
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Search and Filter */}
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                {/* Search and Filter Row */}
                <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cari Destinasi
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
                <div className="flex flex-wrap gap-3 pt-2">
                <button 
                  onClick={refreshData}
                  disabled={isLoading}
                    className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2 transition-all duration-200 text-sm font-medium transform hover:scale-105 active:scale-95"
                    title="Refresh Data"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  Refresh
                </button>
                
                <button 
                  onClick={handleExportData}
                  disabled={filteredDestinations.length === 0}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2 transition-all duration-200 text-sm font-medium transform hover:scale-105 active:scale-95"
                    title="Export Data ke CSV"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  Export
                </button>
                
                <button 
                  onClick={() => {
                    const uniqueTypes = [...new Set(destinations.map(d => d.type))];
                    setDialog({
                      title: 'Debug Info',
                      message: `Total destinations: ${destinations.length}\nFiltered: ${filteredDestinations.length}\n\nTypes in data: ${uniqueTypes.join(', ')}\n\nCurrent filterType: ${filterType}`,
                      confirmText: 'OK'
                    });
                  }}
                    className="px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-all duration-200 text-sm font-medium transform hover:scale-105 active:scale-95"
                  title="Debug Info"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  Debug
                </button>
                
                <button 
                  onClick={async () => {
                    setDialog({
                      title: 'Fix Invalid IDs',
                      message: 'Perbaiki ID tidak valid? Ini akan membersihkan data yang korup.',
                      confirmText: 'Perbaiki',
                      cancelText: 'Batal',
                      onConfirm: async () => {
                        setDialog(null);
                      try {
                        const response = await fetch('/api/wisata/fix-ids', { method: 'POST' });
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
                    className="px-4 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2 transition-all duration-200 text-sm font-medium transform hover:scale-105 active:scale-95"
                  title="Fix Invalid IDs"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  Fix IDs
                </button>
                
                <button 
                  onClick={async () => {
                    setDialog({
                      title: 'Migrasi Tipe',
                      message: 'Migrasi tipe untuk standarisasi data destinasi? Backup akan dibuat otomatis.',
                      confirmText: 'Migrasi',
                      cancelText: 'Batal',
                      onConfirm: async () => {
                        setDialog(null);
                        try {
                          const response = await fetch('/api/destinations/migrate-types?action=migrate', { method: 'POST' });
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
                    className="px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 transition-all duration-200 text-sm font-medium transform hover:scale-105 active:scale-95"
                  title="Migrate Types Data Destinasi"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  Migrate Types
                </button>
                </div>
              </div>
            </div>

            {/* Summary Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Total Destinations Card */}
              <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-600 truncate">Total Objek Wisata</dt>
                        <dd className="text-2xl font-bold text-gray-900">{destinations.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtered Destinations Card */}
              <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-600 truncate">Tersaring</dt>
                        <dd className="text-2xl font-bold text-gray-900">{filteredDestinations.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Destination Types Card */}
              <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-600 truncate">Jenis Wisata</dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {Array.from(new Set(destinations.map(dest => dest.type))).length}
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-600 truncate">Lokasi</dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {Array.from(new Set(destinations.map(dest => dest.location))).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    Daftar Destinasi Wisata
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {filteredDestinations.length} dari {destinations.length} total
                  </span>
              </div>
            </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Destinasi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Lokasi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Tipe
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Biaya Masuk
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDestinations.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709" />
                            </svg>
                            <p className="text-gray-500 text-lg font-medium">Tidak ada data yang ditemukan</p>
                            <p className="text-gray-400 text-sm mt-1">
                              {searchTerm || filterType !== 'all' 
                                ? 'Coba ubah filter atau kata kunci pencarian' 
                                : 'Belum ada destinasi wisata yang tersedia'
                              }
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredDestinations.map((destination, index) => (
                        <tr key={destination.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <img 
                                  className="h-12 w-12 rounded-lg object-cover border border-gray-200" 
                                  src={destination.img_sm || '/placeholder.jpg'} 
                                  alt={destination.title}
                                  onError={(e) => {
                                    e.target.src = '/placeholder.jpg';
                                  }}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900">{destination.title}</div>
                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                  {destination.short_description || 'Tidak ada deskripsi'}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  ID: #{destination.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-sm text-gray-900">{destination.location}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {destination.category || 'Wisata'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              destination.type === 'wisata alam' ? 'bg-green-100 text-green-800' :
                              destination.type === 'wisata sejarah' ? 'bg-yellow-100 text-yellow-800' :
                              destination.type === 'wisata taman' ? 'bg-purple-100 text-purple-800' :
                              destination.type === 'wisata budaya' ? 'bg-indigo-100 text-indigo-800' :
                              destination.type === 'wisata religi' ? 'bg-red-100 text-red-800' :
                              destination.type === 'wisata buatan' ? 'bg-orange-100 text-orange-800' :
                              destination.type === 'wisata minat khusus' ? 'bg-pink-100 text-pink-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {destination.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900 font-medium">
                            {destination.entrance_fee || 'Gratis'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <button
                                onClick={() => handleQuickView(destination)}
                                className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-95"
                                title="Quick View"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <Link
                                href={`/admin/destinations/${destination.id}/view`}
                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-95"
                                title="Lihat Detail"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </Link>
                              <Link
                                href={`/admin/destinations/${destination.id}`}
                                className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-95"
                                title="Edit"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </Link>
                              <button 
                                onClick={() => handleDeleteDestination(destination.id)}
                                disabled={isDeleting}
                                className={`p-2 rounded-lg transition-all duration-150 transform hover:scale-110 active:scale-95 ${
                                  isDeleting 
                                    ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                                    : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                                }`}
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
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200">
                    ← Sebelumnya
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200">
                    Selanjutnya →
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Menampilkan <span className="font-semibold text-gray-900">1</span> sampai <span className="font-semibold text-gray-900">{filteredDestinations.length}</span> dari <span className="font-semibold text-gray-900">{filteredDestinations.length}</span> hasil
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
                <div className="text-sm"><span className="text-gray-500">Kategori:</span> <span className="font-medium text-gray-900">{quickViewItem.category || 'Wisata'}</span></div>
                <div className="text-sm"><span className="text-gray-500">Biaya Masuk:</span> <span className="font-medium text-gray-900">{quickViewItem.entrance_fee || 'Gratis'}</span></div>
                <div className="text-sm"><span className="text-gray-500">Kontak:</span> <span className="font-medium text-gray-900">{quickViewItem.contact || 'Tidak ada'}</span></div>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">
                {quickViewItem.short_description || 'Tidak ada deskripsi'}
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
              <a href={`/admin/destinations/${quickViewItem.id}/view`} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Lihat Detail</a>
              <a href={`/admin/destinations/${quickViewItem.id}`} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">Edit</a>
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
