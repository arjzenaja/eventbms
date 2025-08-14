'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function AdminDesaWisata() {
  const [desaWisataItems, setDesaWisataItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchDesaWisataItems = async () => {
      try {
        const response = await fetch('/api/desa_wisata');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setDesaWisataItems(data.desa_wisata || []);
        } else {
          setError(data.message || 'Gagal memuat data desa wisata');
        }
      } catch (error) {
        console.error('Error fetching desa wisata items:', error);
        setError('Terjadi kesalahan saat mengambil data desa wisata: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDesaWisataItems();
  }, []);

  const filteredDesaWisataItems = desaWisataItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDeleteDesaWisataItem = async (itemId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus desa wisata ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/desa_wisata/${itemId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setDesaWisataItems(desaWisataItems.filter(item => item.id !== itemId));
        alert('Desa wisata berhasil dihapus!');
      } else {
        alert('Gagal menghapus desa wisata: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting desa wisata item:', error);
      alert('Terjadi kesalahan saat menghapus desa wisata: ' + error.message);
    }
  };

  const handleQuickView = (item) => {
    const message = `
Nama: ${item.title}
Lokasi: ${item.location}
Tipe: ${item.type}
Kategori: ${item.category || 'Desa Wisata'}
Deskripsi: ${item.short_description || 'Tidak ada deskripsi'}
Biaya: ${item.entrance_fee || 'Gratis'}
Kontak: ${item.contact || 'Tidak ada'}
    `.trim();
    
    alert(message);
  };

  const handleDuplicateDesaWisata = async (itemId) => {
    if (!confirm('Apakah Anda yakin ingin menduplikasi item desa wisata ini?')) {
      return;
    }

    try {
      // Get the original item data
      const response = await fetch(`/api/desa_wisata/${itemId}`);
      const data = await response.json();
      
      if (!data.success) {
        alert('Gagal mengambil data desa wisata: ' + data.message);
        return;
      }

      const originalItem = data.desa_wisata;
      
      // Create FormData for the new item
      const formData = new FormData();
      formData.append('title', originalItem.title + ' (Copy)');
      formData.append('type', originalItem.type);
      formData.append('location', originalItem.location);
      formData.append('category', originalItem.category);
      formData.append('short_description', originalItem.short_description);
      formData.append('description', originalItem.description);
      formData.append('entrance_fee', originalItem.entrance_fee);
      formData.append('contact', originalItem.contact);
      formData.append('address', originalItem.address);
      formData.append('features', originalItem.features ? originalItem.features.join(',') : '');
      formData.append('recommended', originalItem.recommended ? 'true' : 'false');
      formData.append('img_sm', originalItem.img_sm);
      formData.append('img_lg', originalItem.img_lg);

      // Create the new item
      const createResponse = await fetch('/api/desa_wisata', {
        method: 'POST',
        body: formData,
      });

      const createData = await createResponse.json();

      if (createData.success) {
        alert('Desa wisata berhasil diduplikasi!');
        await refreshData();
      } else {
        alert('Gagal menduplikasi desa wisata: ' + createData.message);
      }
    } catch (error) {
      console.error('Error duplicating desa wisata:', error);
      alert('Terjadi kesalahan saat menduplikasi desa wisata: ' + error.message);
    }
  };

  const handleExportData = () => {
    const exportData = filteredDesaWisataItems.map(item => ({
      ID: item.id,
      Nama: item.title,
      Lokasi: item.location,
      Tipe: item.type,
      Kategori: item.category || 'Desa Wisata',
      Deskripsi: item.short_description || '',
      Biaya_Masuk: item.entrance_fee || 'Gratis',
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
        setDesaWisataItems(data.desa_wisata || []);
        setError('');
      } else {
        setError(data.message || 'Gagal memuat data desa wisata');
      }
    } catch (error) {
      console.error('Error refreshing desa wisata:', error);
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
          onRetry={refreshData}
          message="Gagal memuat data desa wisata"
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
              <h1 className="text-3xl font-bold text-gray-900">Data Desa Wisata</h1>
              <Link 
                href="/admin/desa-wisata/new" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <span>+</span>
                Add New
              </Link>
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
                  <option value="desa wisata">Desa Wisata</option>
                  <option value="kampung wisata">Kampung Wisata</option>
                  <option value="ecotourism">Ecotourism</option>
                  <option value="cultural village">Cultural Village</option>
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
                  onClick={() => {
                    console.log('Current desa wisata state:', desaWisataItems);
                    console.log('Filtered desa wisata:', filteredDesaWisataItems);
                    alert(`Total desa wisata: ${desaWisataItems.length}\nTersaring: ${filteredDesaWisataItems.length}`);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
                  title="Debug Info"
                >
                  <span>🐛</span>
                  Debug
                </button>
                
                <button 
                  onClick={async () => {
                    if (confirm('Perbaiki ID yang tidak valid? Ini akan membersihkan data yang rusak.')) {
                      try {
                        const response = await fetch('/api/desa_wisata/fix-ids', { method: 'POST' });
                        const data = await response.json();
                        if (data.success) {
                          alert('ID berhasil diperbaiki! Memperbarui data...');
                          await refreshData();
                        } else {
                          alert('Gagal memperbaiki ID: ' + data.message);
                        }
                      } catch (error) {
                        alert('Error memperbaiki ID: ' + error.message);
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
                  onClick={handleExportData}
                  disabled={filteredDesaWisataItems.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 flex items-center gap-2"
                  title="Export Data Desa Wisata ke CSV"
                >
                  <span>📊</span>
                  Export
                </button>
                
                <button 
                  onClick={async () => {
                    if (confirm('Migrate types untuk standardisasi data desa wisata? Ini akan membuat backup otomatis.')) {
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
                  title="Migrate Types Data Desa Wisata"
                >
                  <span>🔄</span>
                  Migrate Types
                </button>
              </div>
            </div>

            {/* Summary Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-lg">🏘️</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Desa Wisata</dt>
                        <dd className="text-lg font-medium text-gray-900">{desaWisataItems.length}</dd>
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
                        <span className="text-white text-lg">🔍</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Tersaring</dt>
                        <dd className="text-lg font-medium text-gray-900">{filteredDesaWisataItems.length}</dd>
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
                        <span className="text-white text-lg">🏷️</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Jenis</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {Array.from(new Set(desaWisataItems.map(item => item.type))).length}
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
                Total Desa Wisata: <span className="font-mono">{desaWisataItems.length}</span> | 
                Filtered: <span className="font-mono">{filteredDesaWisataItems.length}</span>
                {filterType !== 'all' && (
                  <span> | Matching types: {desaWisataItems.filter(item => item.type === filterType).length}</span>
                )}
                {desaWisataItems.length > 0 && (
                  <span> | Types in data: {Array.from(new Set(desaWisataItems.map(item => item.type))).join(', ')}</span>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIPE</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KATEGORI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredDesaWisataItems.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          Tidak ada data yang ditemukan
                        </td>
                      </tr>
                    ) : (
                      filteredDesaWisataItems.map((item, index) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{item.id}</td>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <span className="text-red-500 mr-2">📍</span>
                              {item.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {item.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {item.category || 'Desa Wisata'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuickView(item)}
                                className="text-purple-600 hover:text-purple-900 p-2 rounded-full hover:bg-purple-50 transition-colors duration-200"
                                title="Quick View"
                              >
                                👀
                              </button>
                              <Link
                                href={`/admin/desa-wisata/${item.id}/view`}
                                className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                                title="Lihat Detail"
                              >
                                👁️
                              </Link>
                              <Link
                                href={`/admin/desa-wisata/${item.id}`}
                                className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50 transition-colors duration-200"
                                title="Edit"
                              >
                                ✏️
                              </Link>
                              <button
                                onClick={() => handleDuplicateDesaWisata(item.id)}
                                className="text-orange-600 hover:text-orange-900 p-2 rounded-full hover:bg-orange-50 transition-colors duration-200"
                                title="Duplikasi"
                              >
                                📋
                              </button>
                              <button 
                                onClick={() => handleDeleteDesaWisataItem(item.id)}
                                className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
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
    </ProtectedRoute>
  );
}
