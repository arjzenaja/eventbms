'use client';

import { useState, useEffect } from 'react';
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

  const filteredCulinaryItems = culinaryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDeleteCulinaryItem = async (itemId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item kuliner ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/kuliner/${itemId}`, {
        method: 'DELETE',
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
        setCulinaryItems(culinaryItems.filter(item => item.id !== itemId));
        alert('Item kuliner berhasil dihapus!');
      } else {
        alert('Gagal menghapus item kuliner: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting culinary item:', error);
      alert('Terjadi kesalahan saat menghapus item kuliner: ' + error.message);
    }
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
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Kuliner</h1>
              <Link 
                href="/admin/culinary/new" 
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
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white !bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white !bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="cafe">Cafe</option>
                  <option value="resto">Resto</option>
                  <option value="kedai">Kedai</option>
                  <option value="rumah-makan">Rumah Makan</option>
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
                  disabled={filteredCulinaryItems.length === 0}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2"
                  title="Export Data Kuliner ke CSV"
                >
                  <span>📊</span>
                  Export
                </button>
                
                <button 
                  onClick={() => {
                    console.log('Current culinary items state:', culinaryItems);
                    console.log('Filtered culinary items:', filteredCulinaryItems);
                    alert(`Total kuliner: ${culinaryItems.length}\nTersaring: ${filteredCulinaryItems.length}`);
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
                        const response = await fetch('/api/kuliner/fix-ids', { method: 'POST' });
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
                  onClick={async () => {
                    if (confirm('Migrate types untuk standardisasi data kuliner? Ini akan membuat backup otomatis.')) {
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
                  title="Migrate Types Data Kuliner"
                >
                  <span>🔄</span>
                  Migrate Types
                </button>
              </div>
            </div>

            {/* Summary Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Total Culinary Items Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-lg">🍽️</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Kuliner</dt>
                        <dd className="text-lg font-medium text-gray-900">{culinaryItems.length}</dd>
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
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-lg">🔍</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Tersaring</dt>
                        <dd className="text-lg font-medium text-gray-900">{filteredCulinaryItems.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Culinary Types Card */}
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
                        <dt className="text-sm font-medium text-gray-500 truncate">Jenis Kuliner</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {Array.from(new Set(culinaryItems.map(item => item.type))).length}
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
                          {Array.from(new Set(culinaryItems.map(item => item.location))).length}
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
                Total Kuliner: <span className="font-mono">{culinaryItems.length}</span> | 
                Filtered: <span className="font-mono">{filteredCulinaryItems.length}</span>
                {filterType !== 'all' && (
                  <span> | Matching types: {culinaryItems.filter(item => item.type === filterType).length}</span>
                )}
                {culinaryItems.length > 0 && (
                  <span> | Types in data: {Array.from(new Set(culinaryItems.map(item => item.type))).join(', ')}</span>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAMA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIPE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">JENIS MASAKAN</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RENTANG HARGA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOKASI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AKSI</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCulinaryItems.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        Tidak ada data kuliner yang ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredCulinaryItems.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/admin/culinary/${item.id}/view`}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                              title="Lihat Detail"
                            >
                              👁️
                            </Link>
                            <Link
                              href={`/admin/culinary/${item.id}`}
                              className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50 transition-colors duration-200"
                              title="Edit"
                            >
                              ✏️
                            </Link>
                            <button 
                              onClick={() => handleDeleteCulinaryItem(item.id)}
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
                      Menampilkan <span className="font-medium">1</span> sampai <span className="font-medium">{filteredCulinaryItems.length}</span> dari <span className="font-medium">{filteredCulinaryItems.length}</span> hasil
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
