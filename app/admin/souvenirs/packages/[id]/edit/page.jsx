'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function EditSouvenirPackage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.id;
  
  const [packageData, setPackageData] = useState({
    name: '',
    description: '',
    price: '',
    souvenirId: '',
    souvenirTitle: '',
    available: true,
    category: '',
    type: ''
  });
  const [souvenirs, setSouvenirs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPackageData();
    fetchSouvenirs();
  }, [packageId]);

  const fetchPackageData = async () => {
    try {
      const response = await fetch(`/api/souvenirs/packages/${packageId}`);
      const data = await response.json();
      
      if (data.success) {
        setPackageData({
          name: data.package.name || '',
          description: data.package.description || '',
          price: data.package.price || '',
          souvenirId: data.package.souvenirId || '',
          souvenirTitle: data.package.souvenirTitle || '',
          available: data.package.available !== undefined ? data.package.available : true,
          category: data.package.category || '',
          type: data.package.type || ''
        });
      } else {
        setError(data.message || 'Gagal memuat data paket');
      }
    } catch (error) {
      console.error('Error fetching package:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(`/api/souvenirs/packages/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: packageData.name,
          description: packageData.description,
          price: parseInt(packageData.price),
          souvenirId: packageData.souvenirId,
          souvenirTitle: packageData.souvenirTitle,
          available: packageData.available,
          category: packageData.category,
          type: packageData.type
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Paket berhasil diperbarui!');
        router.push('/admin/souvenirs/packages');
      } else {
        alert('Gagal memperbarui paket: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating package:', error);
      alert('Terjadi kesalahan saat memperbarui paket');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPackageData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data paket..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={fetchPackageData}
          message="Gagal memuat data paket"
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
              <h1 className="text-3xl font-bold text-gray-900">Edit Paket Toko Oleh-oleh</h1>
              <Link
                href="/admin/souvenirs/packages"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                ← Kembali
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Paket Toko *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={packageData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Contoh: Paket Hemat Toko Batik Banyumas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga Paket *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={packageData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="150000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Toko Oleh-oleh *
                    </label>
                    <select
                      name="souvenirId"
                      value={packageData.souvenirId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Pilih Toko Oleh-oleh</option>
                      {souvenirs.map((souvenir) => (
                        <option key={souvenir.id} value={souvenir.id}>
                          {souvenir.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Toko
                    </label>
                    <input
                      type="text"
                      name="souvenirTitle"
                      value={packageData.souvenirTitle}
                      onChange={handleInputChange}
                      placeholder="Contoh: Toko Batik Banyumas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Paket
                  </label>
                  <textarea
                    name="description"
                    value={packageData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Contoh: Paket hemat berisi batik, keripik, dan oleh-oleh lainnya dari toko ini"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori Toko
                    </label>
                    <select
                      name="category"
                      value={packageData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Pilih Kategori Toko</option>
                      <option value="Toko Batik">Toko Batik</option>
                      <option value="Toko Kerajinan">Toko Kerajinan</option>
                      <option value="Toko Makanan">Toko Makanan</option>
                      <option value="Toko Minuman">Toko Minuman</option>
                      <option value="Toko Oleh-oleh Umum">Toko Oleh-oleh Umum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipe Toko
                    </label>
                    <select
                      name="type"
                      value={packageData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Pilih Tipe Toko</option>
                      <option value="Toko Batik">Toko Batik</option>
                      <option value="Toko Kerajinan">Toko Kerajinan</option>
                      <option value="Toko Makanan">Toko Makanan</option>
                      <option value="Toko Minuman">Toko Minuman</option>
                      <option value="Toko Oleh-oleh Umum">Toko Oleh-oleh Umum</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="available"
                    checked={packageData.available}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Paket toko tersedia untuk dipesan
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href="/admin/souvenirs/packages"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md"
                  >
                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
