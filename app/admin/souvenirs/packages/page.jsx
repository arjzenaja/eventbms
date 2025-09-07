'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function SouvenirPackagesManagement() {
  const router = useRouter();
  const [packages, setPackages] = useState([]);
  const [souvenirs, setSouvenirs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSouvenir, setSelectedSouvenir] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dropdown state
  const [isSouvenirDropdownOpen, setIsSouvenirDropdownOpen] = useState(false);
  const [isSouvenirDropdownShown, setIsSouvenirDropdownShown] = useState(false);
  const souvenirDropdownRef = useRef(null);

  // Souvenir options for dropdown
  const souvenirOptions = [
    { value: 'all', label: 'Semua Oleh-oleh', icon: '📊' },
    ...souvenirs.map(souvenir => ({
      value: souvenir.id,
      label: souvenir.title,
      icon: souvenir.type === 'makanan' ? '🍽️' : souvenir.type === 'pakaian' ? '👕' : '🎁'
    }))
  ];

  // Get current souvenir label
  const getSouvenirLabel = (value) => {
    const option = souvenirOptions.find(opt => opt.value === value);
    return option ? option.label : 'Semua Oleh-oleh';
  };

  // Dropdown management
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (souvenirDropdownRef.current && !souvenirDropdownRef.current.contains(event.target)) {
        closeSouvenirDropdown();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeSouvenirDropdown();
      }
    };

    if (isSouvenirDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      // Trigger animation after state update
      setTimeout(() => setIsSouvenirDropdownShown(true), 10);
    } else {
      setIsSouvenirDropdownShown(false);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSouvenirDropdownOpen]);

  const openSouvenirDropdown = () => {
    setIsSouvenirDropdownOpen(true);
  };

  const closeSouvenirDropdown = () => {
    setIsSouvenirDropdownShown(false);
    setTimeout(() => setIsSouvenirDropdownOpen(false), 150);
  };

  useEffect(() => {
    fetchPackages();
    fetchSouvenirs();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/souvenirs/packages');
      const data = await response.json();
      
      if (data.success) {
        setPackages(data.packages || []);
      } else {
        setError(data.message || 'Gagal memuat data paket');
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setError('Terjadi kesalahan saat memuat data paket');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSouvenirs = async () => {
    try {
      const response = await fetch('/api/souvenirs');
      const data = await response.json();
      
      if (data.success) {
        setSouvenirs(data.souvenirs || []);
      }
    } catch (error) {
      console.error('Error fetching souvenirs:', error);
    }
  };

  const handleDelete = async (packageId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/souvenirs/packages/${packageId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Paket berhasil dihapus!');
        fetchPackages();
      } else {
        alert('Gagal menghapus paket: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Terjadi kesalahan saat menghapus paket');
    }
  };

  const handleToggleStatus = async (packageId, currentStatus) => {
    try {
      const response = await fetch(`/api/souvenirs/packages/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          available: !currentStatus
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Status paket berhasil diperbarui!');
        fetchPackages();
      } else {
        alert('Gagal memperbarui status paket: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating package status:', error);
      alert('Terjadi kesalahan saat memperbarui status paket');
    }
  };

  // Filter packages based on selected souvenir and search term
  const filteredPackages = packages.filter(pkg => {
    const matchesSouvenir = selectedSouvenir === 'all' || pkg.souvenirId === selectedSouvenir;
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSouvenir && matchesSearch;
  });

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data paket oleh-oleh..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={fetchPackages}
          message="Gagal memuat data paket oleh-oleh"
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-600 flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4 8 4-8 4-8-4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7v10l-9 4-9-4V7" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Paket Oleh-oleh</h1>
                </div>
                <p className="mt-2 text-sm text-gray-500">Kelola paket-paket menarik untuk oleh-oleh Banyumas.</p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/admin/souvenirs"
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="font-medium">Kembali ke Oleh-oleh</span>
                </Link>
                <Link
                  href="/admin/souvenirs/packages/new"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="font-medium">Tambah Paket</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4 8 4-8 4-8-4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7v10l-9 4-9-4V7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Paket</p>
                    <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Tersedia</p>
                    <p className="text-2xl font-bold text-gray-900">{packages.filter(p => p.available).length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Tidak Tersedia</p>
                    <p className="text-2xl font-bold text-gray-900">{packages.filter(p => !p.available).length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Tersaring</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredPackages.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Filter & Pencarian</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative" ref={souvenirDropdownRef}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Filter Oleh-oleh
                  </label>
                  <button
                    type="button"
                    onClick={() => (isSouvenirDropdownOpen ? closeSouvenirDropdown() : openSouvenirDropdown())}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between shadow-sm transform hover:scale-[1.01] active:scale-95"
                    aria-haspopup="listbox"
                    aria-expanded={isSouvenirDropdownOpen}
                  >
                    <span className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                      </svg>
                      <span className="text-xl leading-none">📊</span>
                      <span className="text-gray-900 font-medium">{getSouvenirLabel(selectedSouvenir)}</span>
                    </span>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isSouvenirDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isSouvenirDropdownOpen && (
                    <div className="relative">
                      <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl transform transition duration-150 ease-out origin-top scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${isSouvenirDropdownShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`} style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }}>
                        {souvenirOptions.map((option) => (
                          <li key={option.value}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSouvenir(option.value);
                                closeSouvenirDropdown();
                              }}
                              className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 outline-none ${selectedSouvenir === option.value ? 'bg-blue-50' : ''}`}
                            >
                              <span className="flex items-center gap-3">
                                <span className="text-xl leading-none">{option.icon}</span>
                                <span className={`text-sm ${selectedSouvenir === option.value ? 'text-blue-700 font-semibold' : 'text-gray-800'}`}>{option.label}</span>
                              </span>
                              {selectedSouvenir === option.value && (
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
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cari Paket
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cari berdasarkan nama atau deskripsi..."
                      className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Packages Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4 8 4-8 4-8-4z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7v10l-9 4-9-4V7" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Daftar Paket Toko Oleh-oleh
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {filteredPackages.length} paket
                    </span>
                  </div>
                </div>
              </div>
              
              {filteredPackages.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada paket toko</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      {searchTerm || selectedSouvenir !== 'all' 
                        ? 'Tidak ada paket toko yang sesuai dengan filter Anda.'
                        : 'Belum ada paket toko oleh-oleh yang ditambahkan.'
                      }
                    </p>
                    {!searchTerm && selectedSouvenir === 'all' && (
                      <Link
                        href="/admin/souvenirs/packages/new"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Tambah Paket Toko Pertama
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Nama Paket Toko
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Toko Oleh-oleh
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Deskripsi Paket
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Harga Paket
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPackages.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4 8 4-8 4-8-4z" />
                                </svg>
                              </div>
                              <div className="text-sm font-semibold text-gray-900">{pkg.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{pkg.souvenirTitle || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 max-w-xs truncate">
                              {pkg.description || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-green-600">
                              Rp {pkg.price?.toLocaleString() || '0'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              pkg.available 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                pkg.available ? 'bg-green-400' : 'bg-red-400'
                              }`}></div>
                              {pkg.available ? 'Tersedia' : 'Tidak Tersedia'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleToggleStatus(pkg.id, pkg.available)}
                                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 transform hover:scale-105 active:scale-95 ${
                                  pkg.available
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                                title={pkg.available ? 'Nonaktifkan paket' : 'Aktifkan paket'}
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  {pkg.available ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  )}
                                </svg>
                                {pkg.available ? 'Nonaktifkan' : 'Aktifkan'}
                              </button>
                              <Link
                                href={`/admin/souvenirs/packages/${pkg.id}/edit`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all duration-150 transform hover:scale-105 active:scale-95"
                                title="Edit paket"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(pkg.id)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-all duration-150 transform hover:scale-105 active:scale-95"
                                title="Hapus paket"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
