'use client';

import { useState, useEffect } from 'react';
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
    const message = `
Nama: ${destination.title}
Lokasi: ${destination.location}
Tipe: ${destination.type}
Kategori: ${destination.category || 'Wisata'}
Deskripsi: ${destination.short_description || 'Tidak ada deskripsi'}
Biaya Masuk: ${destination.entrance_fee || 'Gratis'}
Kontak: ${destination.contact || 'Tidak ada'}
    `.trim();
    
    alert(message);
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
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Data Wisata</h1>
              <div className="flex gap-2">
                <Link
                  href="/admin/destinations/packages"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <span>📦</span>
                  Kelola Paket
                </Link>
                <Link 
                  href="/admin/destinations/new" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <span>+</span>
                  Add New
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="wisata alam">Wisata Alam</option>
                  <option value="wisata taman">Wisata Taman</option>
                  <option value="wisata budaya">Wisata Budaya</option>
                  <option value="wisata sejarah">Wisata Sejarah</option>
                  <option value="wisata buatan">Wisata Buatan</option>
                  <option value="wisata minat khusus">Wisata Minat Khusus</option>
                  <option value="wisata religi">Wisata Religi</option>
                </select>
                
                <button 
                  onClick={refreshData}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2"
                >
                  <span>🔄</span>
                  Refresh
                </button>
                
                <button 
                  onClick={handleExportData}
                  disabled={filteredDestinations.length === 0}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2"
                  title="Export Data"
                >
                  <span>📊</span>
                  Export
                </button>
                
                <button 
                  onClick={() => {
                    console.log('Current destinations state:', destinations);
                    console.log('Filtered destinations:', filteredDestinations);
                    
                    // Get unique types from destinations
                    const uniqueTypes = [...new Set(destinations.map(d => d.type))];
                    console.log('Unique types in data:', uniqueTypes);
                    
                    alert(`Total destinations: ${destinations.length}\nFiltered: ${filteredDestinations.length}\n\nTypes in data: ${uniqueTypes.join(', ')}\n\nCurrent filterType: ${filterType}`);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
                  title="Debug Info"
                >
                  <span>🐛</span>
                  Debug
                </button>
                
                <button 
                  onClick={async () => {
                    if (confirm('Fix invalid IDs? This will clean up any corrupted data.')) {
                      try {
                        const response = await fetch('/api/wisata/fix-ids', { method: 'POST' });
                        
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
                          alert('IDs fixed successfully! Refreshing data...');
                          await refreshData();
                        } else {
                          alert('Failed to fix IDs: ' + data.message);
                        }
                      } catch (error) {
                        alert('Error fixing IDs: ' + error.message);
                      }
                    }
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center gap-2"
                  title="Fix Invalid IDs"
                >
                  <span>🔧</span>
                  Fix IDs
                </button>
                
                <button 
                  onClick={async () => {
                    if (confirm('Migrate types untuk standardisasi data destinasi? Ini akan membuat backup otomatis.')) {
                      try {
                        const response = await fetch('/api/destinations/migrate-types?action=migrate', { 
                          method: 'POST' 
                        });
                        const data = await response.json();
                        if (data.success) {
                          alert(`Migrasi berhasil! ${data.migrated_items} item telah distandarisasi.\nBackup tersimpan di: ${data.backup_file}`);
                          await refreshData();
                        } else {
                          alert('Gagal migrate types: ' + data.message);
                        }
                      } catch (error) {
                        alert('Error migrate types: ' + error.message);
                      }
                    }
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center gap-2"
                  title="Migrate Types Data Destinasi"
                >
                  <span>🔄</span>
                  Migrate Types
                </button>
              </div>
            </div>

            {/* Summary Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Total Destinations Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-lg">🏔️</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Objek Wisata</dt>
                        <dd className="text-lg font-medium text-gray-900">{destinations.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtered Destinations Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-lg">🔍</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Tersaring</dt>
                        <dd className="text-lg font-medium text-gray-900">{filteredDestinations.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Destination Types Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-lg">🏷️</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Jenis Wisata</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {Array.from(new Set(destinations.map(dest => dest.type))).length}
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
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-lg">📍</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Lokasi</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {Array.from(new Set(destinations.map(dest => dest.location))).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Debug Info */}
            <div className="bg-gray-100 p-4 mb-4 rounded-md">
              <div className="text-sm text-gray-600">
                <strong>Debug Info:</strong> Filter Type: <span className="font-mono">{filterType}</span> | 
                Total Destinations: <span className="font-mono">{destinations.length}</span> | 
                Filtered: <span className="font-mono">{filteredDestinations.length}</span>
                {filterType !== 'all' && (
                  <span> | Matching types: {destinations.filter(d => d.type === filterType).length}</span>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAMA</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOKASI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KATEGORI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIPE</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BIAYA MASUK</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDestinations.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                          Tidak ada data yang ditemukan
                        </td>
                      </tr>
                    ) : (
                      filteredDestinations.map((destination, index) => (
                        <tr key={destination.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{destination.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img 
                                  className="h-10 w-10 rounded-full object-cover" 
                                  src={destination.img_sm || '/placeholder.jpg'} 
                                  alt={destination.title}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{destination.title}</div>
                                <div className="text-sm text-gray-500">{destination.short_description?.substring(0, 50)}...</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <span className="text-red-500 mr-2">📍</span>
                              {destination.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <span className="mr-1">🏔️</span>
                              {destination.category || 'Wisata'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              destination.type === 'alam' ? 'bg-green-100 text-green-800' :
                              destination.type === 'sejarah' ? 'bg-yellow-100 text-yellow-800' :
                              destination.type === 'penginapan' ? 'bg-blue-100 text-blue-800' :
                              destination.type === 'taman' ? 'bg-purple-100 text-purple-800' :
                              destination.type === 'budaya' ? 'bg-indigo-100 text-indigo-800' :
                              destination.type === 'religi' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {destination.type === 'alam' ? 'Wisata Alam' :
                               destination.type === 'sejarah' ? 'Wisata Sejarah' :
                               destination.type === 'penginapan' ? 'Penginapan' :
                               destination.type === 'taman' ? 'Taman Rekreasi' :
                               destination.type === 'budaya' ? 'Wisata Budaya' :
                               destination.type === 'religi' ? 'Wisata Religi' :
                               destination.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {destination.entrance_fee || 'Gratis'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuickView(destination)}
                                className="text-purple-600 hover:text-purple-900 p-2 rounded-full hover:bg-purple-50 transition-colors duration-200"
                                title="Quick View"
                              >
                                👀
                              </button>
                              <Link
                                href={`/admin/destinations/${destination.id}/view`}
                                className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                                title="Lihat Detail"
                              >
                                👁️
                              </Link>
                              <Link
                                href={`/admin/destinations/${destination.id}`}
                                className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50 transition-colors duration-200"
                                title="Edit"
                              >
                                ✏️
                              </Link>
                              <button 
                                onClick={() => handleDeleteDestination(destination.id)}
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
                      Menampilkan <span className="font-medium">1</span> sampai <span className="font-medium">{filteredDestinations.length}</span> dari <span className="font-medium">{filteredDestinations.length}</span> hasil
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
    </ProtectedRoute>
  );
}
