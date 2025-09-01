'use client';

import { useState, useEffect } from 'react';
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
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Paket Oleh-oleh</h1>
              <div className="flex gap-3">
                <Link
                  href="/admin/souvenirs"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <span>←</span>
                  Kembali ke Oleh-oleh
                </Link>
                <Link
                  href="/admin/souvenirs/packages/new"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <span>+</span>
                  Tambah Paket
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter Oleh-oleh
                  </label>
                  <select
                    value={selectedSouvenir}
                    onChange={(e) => setSelectedSouvenir(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Semua Oleh-oleh</option>
                    {souvenirs.map((souvenir) => (
                      <option key={souvenir.id} value={souvenir.id}>
                        {souvenir.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cari Paket
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari berdasarkan nama atau deskripsi..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Packages Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Daftar Paket Toko Oleh-oleh ({filteredPackages.length})
                </h2>
              </div>
              
              {filteredPackages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada paket toko</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm || selectedSouvenir !== 'all' 
                        ? 'Tidak ada paket toko yang sesuai dengan filter Anda.'
                        : 'Belum ada paket toko oleh-oleh yang ditambahkan.'
                      }
                    </p>
                    {!searchTerm && selectedSouvenir === 'all' && (
                      <div className="mt-6">
                        <Link
                          href="/admin/souvenirs/packages/new"
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <span>+</span>
                          Tambah Paket Toko Pertama
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama Paket Toko
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Toko Oleh-oleh
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deskripsi Paket
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Harga Paket
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPackages.map((pkg) => (
                        <tr key={pkg.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{pkg.souvenirTitle || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {pkg.description || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-green-600">
                              Rp {pkg.price?.toLocaleString() || '0'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              pkg.available 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {pkg.available ? 'Tersedia' : 'Tidak Tersedia'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleToggleStatus(pkg.id, pkg.available)}
                                className={`text-sm px-3 py-1 rounded-md ${
                                  pkg.available
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                }`}
                              >
                                {pkg.available ? 'Nonaktifkan' : 'Aktifkan'}
                              </button>
                              <Link
                                href={`/admin/souvenirs/packages/${pkg.id}/edit`}
                                className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(pkg.id)}
                                className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md bg-red-50 hover:bg-red-100"
                              >
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
