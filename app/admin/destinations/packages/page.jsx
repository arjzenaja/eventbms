'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

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
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Kelola Paket Destinasi</h1>
              <div className="flex gap-2">
                <Link
                  href="/admin/destinations"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <span>←</span>
                  Kembali
                </Link>
                <Link
                  href="/admin/destinations/packages/new"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <span>+</span>
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
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="Cari paket..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterDestination}
                  onChange={(e) => setFilterDestination(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Semua Destinasi</option>
                  {destinations.map(dest => (
                    <option key={dest.id} value={dest.id}>
                      {dest.title}
                    </option>
                  ))}
                </select>
                
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Semua Kategori</option>
                   <option value="Paket Standar">Paket Standar</option>
                   <option value="Paket Deluxe">Paket Deluxe</option>
                  <option value="Paket Keluarga">Paket Keluarga</option>
                   <option value="Paket Premium">Paket Premium</option>
                  <option value="Paket Adventure">Paket Adventure</option>
                </select>
                
                <button 
                  onClick={handleExportData}
                  disabled={filteredPackages.length === 0}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2"
                >
                  <span>📊</span>
                  Export
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-lg">📦</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Paket</dt>
                        <dd className="text-lg font-medium text-gray-900">{packages.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-lg">✅</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Available</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {packages.filter(pkg => pkg.available).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-lg">⭐</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Popular</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {packages.filter(pkg => pkg.popular).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-lg">🏔️</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Destinasi</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {new Set(packages.map(pkg => pkg.destinationId)).size}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Packages Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PAKET</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DESTINASI</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KATEGORI</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HARGA</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FASILITAS</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AKSI</th>
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
                              <span className="font-semibold text-green-600">Rp {pkg.price}</span>
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
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    pkg.available 
                                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                      : 'bg-red-100 text-red-800 hover:bg-red-200'
                                  }`}
                                >
                                  {pkg.available ? '✅ Available' : '❌ Not Available'}
                                </button>
                                <button
                                  onClick={() => handleTogglePopular(pkg.id, pkg.popular)}
                                  className={`px-2 py-1 text-xs rounded-full ${
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
                                  className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50 transition-colors duration-200"
                                  title="Edit"
                                >
                                  ✏️
                                </Link>
                                <button 
                                  onClick={() => handleDeletePackage(pkg.id)}
                                  disabled={isDeleting}
                                  className={`p-2 rounded-full transition-colors duration-200 ${
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
