'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

function CustomSelect({ label, value, onChange, options, className = '' }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find(o => o.value === value) || options[0];

  return (
    <div className={className} ref={containerRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full text-left bg-white border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 flex items-center justify-between ${open ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-gray-300'}`}
      >
        <span className="flex items-center gap-3">
          <span className="text-xl leading-none">{selected.icon}</span>
          <span className="text-gray-900 font-semibold">{selected.label}</span>
        </span>
        <svg className={`h-5 w-5 text-gray-500 transform transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="relative">
          <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="max-h-72 overflow-y-auto">
              {options.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-indigo-50 ${value === opt.value ? 'bg-indigo-50' : ''}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl leading-none">{opt.icon}</span>
                    <span className={`font-medium ${value === opt.value ? 'text-indigo-700' : 'text-gray-900'}`}>{opt.label}</span>
                  </span>
                  {value === opt.value && (
                    <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDestinationPackages() {
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDestination, setFilterDestination] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDemoData, setIsDemoData] = useState(false);

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDestination = filterDestination === 'all' || pkg.destinationId === filterDestination;
    const matchesCategory = filterCategory === 'all' || pkg.category === filterCategory;
    
    return matchesSearch && matchesDestination && matchesCategory;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch packages
        const packagesResponse = await fetch('/api/destinations/packages');
        const packagesData = await packagesResponse.json();
        
        if (packagesData.success && packagesData.packages && packagesData.packages.length > 0) {
          setPackages(packagesData.packages);
          setIsDemoData(false);
        } else {
          // Use demo data if no packages found
          setIsDemoData(true);
          const demoPackages = [
            {
              id: "1",
              name: "Paket Standar",
              description: "Paket wisata standar dengan fasilitas lengkap dan pemandu lokal",
              category: "Paket Standar",
              price: 150000,
              facilities: "Tiket masuk, Pemandu lokal, Makan siang, Transportasi",
              duration: "1 hari",
              capacity: "2-4 orang",
              available: true,
              popular: false,
              destinationId: "35",
              destinationTitle: "dwawdawd",
              destinationLocation: "Baturaden, Banyumas, Indonesia",
              created_at: "2025-01-27T10:00:00.000Z",
              updated_at: "2025-01-27T10:00:00.000Z"
            },
            {
              id: "2",
              name: "Paket Deluxe",
              description: "Paket wisata premium dengan akomodasi dan fasilitas lengkap",
              category: "Paket Deluxe",
              price: 450000,
              facilities: "Tiket masuk, Pemandu profesional, Akomodasi, Makan 3x, Transportasi, +1 fasilitas lainnya",
              duration: "2 hari 1 malam",
              capacity: "2-6 orang",
              available: true,
              popular: true,
              destinationId: "35",
              destinationTitle: "dwawdawd",
              destinationLocation: "Baturaden, Banyumas, Indonesia",
              created_at: "2025-01-27T10:00:00.000Z",
              updated_at: "2025-01-27T10:00:00.000Z"
            },
            {
              id: "3",
              name: "Paket Keluarga",
              description: "Paket wisata keluarga dengan aktivitas khusus anak-anak",
              category: "Paket Keluarga",
              price: 750000,
              facilities: "Tiket masuk, Pemandu keluarga, Akomodasi, Makan 3x, Aktivitas anak, Transportasi, +1 fasilitas lainnya",
              duration: "3 hari 2 malam",
              capacity: "4-8 orang",
              available: true,
              popular: false,
              destinationId: "35",
              destinationTitle: "dwawdawd",
              destinationLocation: "Baturaden, Banyumas, Indonesia",
              created_at: "2025-01-27T10:00:00.000Z",
              updated_at: "2025-01-27T10:00:00.000Z"
            }
          ];
          setPackages(demoPackages);
        }

        // Fetch destinations for filter
        const destinationsResponse = await fetch('/api/wisata');
        const destinationsData = await destinationsResponse.json();
        
        if (destinationsData.success) {
          setDestinations(destinationsData.wisata);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use demo data on error
        setIsDemoData(true);
        const demoPackages = [
          {
            id: "1",
            name: "Paket Standar",
            description: "Paket wisata standar dengan fasilitas lengkap dan pemandu lokal",
            category: "Paket Standar",
            price: 150000,
            facilities: "Tiket masuk, Pemandu lokal, Makan siang, Transportasi",
            duration: "1 hari",
            capacity: "2-4 orang",
            available: true,
            popular: false,
            destinationId: "35",
            destinationTitle: "dwawdawd",
            destinationLocation: "Baturaden, Banyumas, Indonesia",
            created_at: "2025-01-27T10:00:00.000Z",
            updated_at: "2025-01-27T10:00:00.000Z"
          },
          {
            id: "2",
            name: "Paket Deluxe",
            description: "Paket wisata premium dengan akomodasi dan fasilitas lengkap",
            category: "Paket Deluxe",
            price: 450000,
            facilities: "Tiket masuk, Pemandu profesional, Akomodasi, Makan 3x, Transportasi, +1 fasilitas lainnya",
            duration: "2 hari 1 malam",
            capacity: "2-6 orang",
            available: true,
            popular: true,
            destinationId: "35",
            destinationTitle: "dwawdawd",
            destinationLocation: "Baturaden, Banyumas, Indonesia",
            created_at: "2025-01-27T10:00:00.000Z",
            updated_at: "2025-01-27T10:00:00.000Z"
          },
          {
            id: "3",
            name: "Paket Keluarga",
            description: "Paket wisata keluarga dengan aktivitas khusus anak-anak",
            category: "Paket Keluarga",
            price: 750000,
            facilities: "Tiket masuk, Pemandu keluarga, Akomodasi, Makan 3x, Aktivitas anak, Transportasi, +1 fasilitas lainnya",
            duration: "3 hari 2 malam",
            capacity: "4-8 orang",
            available: true,
            popular: false,
            destinationId: "35",
            destinationTitle: "dwawdawd",
            destinationLocation: "Baturaden, Banyumas, Indonesia",
            created_at: "2025-01-27T10:00:00.000Z",
            updated_at: "2025-01-27T10:00:00.000Z"
          }
        ];
        setPackages(demoPackages);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeletePackage = async (packageId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/destinations/packages/${packageId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPackages(prevPackages => prevPackages.filter(pkg => pkg.id !== packageId));
        alert('Paket berhasil dihapus!');
      } else {
        alert('Gagal menghapus paket: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Terjadi kesalahan saat menghapus paket');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleAvailable = async (packageId, currentAvailable) => {
    try {
      const packageToUpdate = packages.find(pkg => pkg.id === packageId);
      if (!packageToUpdate) return;

      const formData = new FormData();
      formData.append('name', packageToUpdate.name);
      formData.append('description', packageToUpdate.description || '');
      formData.append('category', packageToUpdate.category || '');
      formData.append('price', packageToUpdate.price);
      formData.append('facilities', packageToUpdate.facilities || '');
      formData.append('duration', packageToUpdate.duration || '');
      formData.append('capacity', packageToUpdate.capacity || '');
      formData.append('available', (!currentAvailable).toString());
      formData.append('popular', packageToUpdate.popular ? 'true' : 'false');

      const response = await fetch(`/api/destinations/packages/${packageId}`, {
        method: 'PUT',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPackages(prevPackages => 
          prevPackages.map(pkg => 
            pkg.id === packageId 
              ? { ...pkg, available: !currentAvailable }
              : pkg
          )
        );
      } else {
        alert('Gagal mengubah status paket: ' + data.message);
      }
    } catch (error) {
      console.error('Error toggling package status:', error);
      alert('Terjadi kesalahan saat mengubah status paket');
    }
  };

  const handleTogglePopular = async (packageId, currentPopular) => {
    try {
      const packageToUpdate = packages.find(pkg => pkg.id === packageId);
      if (!packageToUpdate) return;

      const formData = new FormData();
      formData.append('name', packageToUpdate.name);
      formData.append('description', packageToUpdate.description || '');
      formData.append('category', packageToUpdate.category || '');
      formData.append('price', packageToUpdate.price);
      formData.append('facilities', packageToUpdate.facilities || '');
      formData.append('duration', packageToUpdate.duration || '');
      formData.append('capacity', packageToUpdate.capacity || '');
      formData.append('available', packageToUpdate.available ? 'true' : 'false');
      formData.append('popular', (!currentPopular).toString());

      const response = await fetch(`/api/destinations/packages/${packageId}`, {
        method: 'PUT',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPackages(prevPackages => 
          prevPackages.map(pkg => 
            pkg.id === packageId 
              ? { ...pkg, popular: !currentPopular }
              : pkg
          )
        );
      } else {
        alert('Gagal mengubah status popular paket: ' + data.message);
      }
    } catch (error) {
      console.error('Error toggling package popular status:', error);
      alert('Terjadi kesalahan saat mengubah status popular paket');
    }
  };

  const handleExportData = () => {
    if (filteredPackages.length === 0) {
      alert('Tidak ada data untuk diexport');
      return;
    }

    const csvContent = [
      ['ID', 'Nama Paket', 'Destinasi', 'Kategori', 'Harga', 'Durasi', 'Kapasitas', 'Status', 'Popular', 'Deskripsi', 'Fasilitas', 'Created At'],
      ...filteredPackages.map(pkg => [
        pkg.id,
        pkg.name,
        pkg.destinationTitle,
        pkg.category,
        pkg.price,
        pkg.duration,
        pkg.capacity,
        pkg.available ? 'Available' : 'Not Available',
        pkg.popular ? 'Popular' : 'Not Popular',
        pkg.description,
        pkg.facilities,
        pkg.created_at
      ])
    ].map(row => row.map(field => `"${field || ''}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `destination_packages_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data paket destinasi..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data paket destinasi"
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
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7l9-4 9 4-9 4-9-4z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7v10l-9 4-9-4V7" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Kelola Paket Destinasi</h1>
                  <p className="mt-1 text-sm text-gray-500">Atur paket wisata, harga, fasilitas, dan status ketersediaan.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/admin/destinations"
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                  Kembali
                </Link>
                <Link
                  href="/admin/destinations/packages/new"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                  Tambah Paket Baru
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Demo Data Notification */}
            {isDemoData && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Data Demo
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Data yang ditampilkan adalah data demo. Untuk menambahkan paket wisata yang sebenarnya, 
                        silakan gunakan tombol "Tambah Paket Baru" di atas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Search and Filter */}
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cari Paket</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Cari berdasarkan nama paket atau deskripsi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                </div>
                <CustomSelect
                  className="lg:w-72"
                  label="Filter Destinasi"
                  value={filterDestination}
                  onChange={setFilterDestination}
                  options={[{ value: 'all', label: 'Semua Destinasi', icon: '🔎' }, ...destinations.map(d => ({ value: d.id, label: d.title, icon: '📍' }))]}
                />
                <CustomSelect
                  className="lg:w-64"
                  label="Filter Kategori"
                  value={filterCategory}
                  onChange={setFilterCategory}
                  options={[
                    { value: 'all', label: 'Semua Kategori', icon: '🔎' },
                    { value: 'Paket Standar', label: 'Paket Standar', icon: '📦' },
                    { value: 'Paket Deluxe', label: 'Paket Deluxe', icon: '💎' },
                    { value: 'Paket Keluarga', label: 'Paket Keluarga', icon: '👨‍👩‍👧‍👦' },
                    { value: 'Paket Premium', label: 'Paket Premium', icon: '⭐' },
                    { value: 'Paket Adventure', label: 'Paket Adventure', icon: '🧭' },
                  ]}
                />
                <div className="flex items-end">
                  <button
                    onClick={handleExportData}
                    disabled={filteredPackages.length === 0}
                    className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2 transition-all duration-150 transform hover:scale-105 active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7l9-4 9 4-9 4-9-4zM21 7v10l-9 4-9-4V7"/></svg>
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-600 truncate">Total Paket</dt>
                        <dd className="text-2xl font-bold text-gray-900">{packages.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-600 truncate">Available</dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {packages.filter(pkg => pkg.available).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-600 truncate">Popular</dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {packages.filter(pkg => pkg.popular).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 18l6-6 4 4 8-8"/></svg>
                      </div>
                    </div>
                    <div className="ml-4 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-semibold text-gray-600 truncate">Destinasi</dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {new Set(packages.map(pkg => pkg.destinationId)).size}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Packages Table */}
            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Daftar Paket</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">NO</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">PAKET</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">DESTINASI</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">KATEGORI</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">HARGA</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">FASILITAS</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">STATUS</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPackages.length === 0 ? (
                        <tr>
                           <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                            Tidak ada data paket yang ditemukan
                          </td>
                        </tr>
                      ) : (
                        filteredPackages.map((pkg, index) => (
                          <tr key={pkg.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                                  <div className="text-sm text-gray-500">{pkg.description?.substring(0, 50)}...</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                <span className="text-red-500 mr-2">📍</span>
                                {pkg.destinationTitle}
                              </div>
                              <div className="text-xs text-gray-500">{pkg.destinationLocation}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {pkg.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className="font-semibold text-green-600">Rp {new Intl.NumberFormat('id-ID').format(pkg.price)}</span>
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                               <div className="max-w-xs">
                                 <div className="text-sm text-gray-900">
                                   {pkg.facilities ? (
                                     pkg.facilities.split(/[,\n]/).map((facility, idx) => (
                                       <div key={idx} className="flex items-center mb-1">
                                         <span className="text-green-500 mr-2">✓</span>
                                         <span className="text-xs">{facility.trim()}</span>
                                       </div>
                                     ))
                                   ) : (
                                     <span className="text-gray-400 text-xs">Tidak ada fasilitas</span>
                                   )}
                                 </div>
                               </div>
                             </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleToggleAvailable(pkg.id, pkg.available)}
                                  className={`px-2 py-1 text-xs rounded-full transform transition-transform duration-150 hover:scale-105 active:scale-95 ${
                                    pkg.available 
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                                  }`}
                                >
                                  {pkg.available ? '✅ Available' : '❌ Not Available'}
                                </button>
                                <button
                                  onClick={() => handleTogglePopular(pkg.id, pkg.popular)}
                                  className={`px-2 py-1 text-xs rounded-full transform transition-transform duration-150 hover:scale-105 active:scale-95 ${
                                    pkg.popular 
                                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                  }`}
                                >
                                  {pkg.popular ? '⭐ Popular' : '☆ Not Popular'}
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <Link
                                  href={`/admin/destinations/packages/${pkg.id}`}
                                  className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50 transition-all duration-150 transform hover:scale-110 active:scale-95"
                                  title="Edit"
                                >
                                  ✏️
                                </Link>
                                <button 
                                  onClick={() => handleDeletePackage(pkg.id)}
                                  disabled={isDeleting}
                                  className={`p-2 rounded-full transition-all duration-150 transform hover:scale-110 active:scale-95 ${
                                    isDeleting 
                                      ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
                                      : 'text-red-600 hover:text-red-900 hover:bg-red-50'
                                  }`}
                                  title="Hapus"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
