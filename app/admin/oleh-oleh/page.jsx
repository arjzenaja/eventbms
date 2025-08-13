'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function AdminOlehOleh() {
  const [olehOlehItems, setOlehOlehItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchOlehOlehItems = async () => {
      try {
        const response = await fetch('/api/oleh_oleh');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setOlehOlehItems(data.oleh_oleh || []);
        } else {
          setError(data.message || 'Gagal memuat data oleh-oleh');
        }
      } catch (error) {
        console.error('Error fetching oleh-oleh items:', error);
        setError('Terjadi kesalahan saat mengambil data oleh-oleh: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOlehOlehItems();
  }, []);

  const filteredOlehOlehItems = olehOlehItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDeleteOlehOlehItem = async (itemId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item oleh-oleh ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/oleh_oleh/${itemId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setOlehOlehItems(olehOlehItems.filter(item => item.id !== itemId));
        alert('Item oleh-oleh berhasil dihapus!');
      } else {
        alert('Gagal menghapus item oleh-oleh: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting oleh-oleh item:', error);
      alert('Terjadi kesalahan saat menghapus item oleh-oleh: ' + error.message);
    }
  };

  const handleQuickView = (item) => {
    const message = `
Nama: ${item.title}
Lokasi: ${item.location}
Tipe: ${item.type}
Kategori: ${item.category || 'Oleh-oleh'}
Deskripsi: ${item.short_description || 'Tidak ada deskripsi'}
Biaya: ${item.price_range || item.entrance_fee || 'Tidak ada'}
Kontak: ${item.contact || 'Tidak ada'}
    `.trim();
    
    alert(message);
  };

  const handleDuplicateOlehOleh = async (itemId) => {
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
      console.error('Error duplicating oleh-oleh:', error);
      alert('Terjadi kesalahan saat menduplikasi oleh-oleh: ' + error.message);
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/oleh_oleh');
      const data = await response.json();
      
      if (data.success) {
        setOlehOlehItems(data.oleh_oleh || []);
        setError('');
      } else {
        setError(data.message || 'Gagal memuat data oleh-oleh');
      }
    } catch (error) {
      console.error('Error refreshing oleh-oleh:', error);
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
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Data Oleh-Oleh</h1>
              <Link 
                href="/admin/oleh-oleh/new" 
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
                  <option value="makanan">Makanan</option>
                  <option value="pakaian">Pakaian</option>
                  <option value="kerajinan">Kerajinan</option>
                  <option value="aksesoris">Aksesoris</option>
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
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/oleh_oleh/fix-ids', { 
                        method: 'POST' 
                      });
                      const data = await response.json();
                      if (data.success) {
                        alert(`Fix IDs berhasil! ${data.fixed_count} item telah diperbaiki.`);
                        await refreshData();
                      } else {
                        alert('Gagal fix IDs: ' + data.message);
                      }
                    } catch (error) {
                      alert('Error fix IDs: ' + error.message);
                    }
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center gap-2"
                  title="Fix IDs untuk standardisasi data"
                >
                  <span>🔧</span>
                  Fix IDs
                </button>
                
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
                      alert('Error export data: ' + error.message);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  title="Export Data Oleh-Oleh"
                >
                  <span>📊</span>
                  Export
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
                        <span className="text-white text-lg">🛍️</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Oleh-Oleh</dt>
                        <dd className="text-lg font-medium text-gray-900">{olehOlehItems.length}</dd>
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
                        <dd className="text-lg font-medium text-gray-900">{filteredOlehOlehItems.length}</dd>
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
                          {Array.from(new Set(olehOlehItems.map(item => item.type))).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
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
                    {filteredOlehOlehItems.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                          Tidak ada data yang ditemukan
                        </td>
                      </tr>
                    ) : (
                      filteredOlehOlehItems.map((item, index) => (
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
                              {item.category || 'Oleh-oleh'}
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
                                href={`/admin/oleh-oleh/${item.id}/view`}
                                className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                                title="Lihat Detail"
                              >
                                👁️
                              </Link>
                              <Link
                                href={`/admin/oleh-oleh/${item.id}`}
                                className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50 transition-colors duration-200"
                                title="Edit"
                              >
                                ✏️
                              </Link>
                              <button
                                onClick={() => handleDuplicateOlehOleh(item.id)}
                                className="text-orange-600 hover:text-orange-900 p-2 rounded-full hover:bg-orange-50 transition-colors duration-200"
                                title="Duplikasi"
                              >
                                📋
                              </button>
                              <button 
                                onClick={() => handleDeleteOlehOlehItem(item.id)}
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
