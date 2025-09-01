'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function NewSouvenirPackage() {
  const router = useRouter();
  const [souvenirs, setSouvenirs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    souvenirId: '',
    souvenirTitle: '',
    available: true,
    category: '',
    type: ''
  });

  useEffect(() => {
    fetchSouvenirs();
  }, []);

  const fetchSouvenirs = async () => {
    try {
      const response = await fetch('/api/souvenirs');
      const data = await response.json();
      
      if (data.success) {
        setSouvenirs(data.souvenirs || []);
      }
    } catch (error) {
      console.error('Error fetching souvenirs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Buat FormData
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('price', formData.price.toString());
      submitFormData.append('souvenirId', formData.souvenirId);
      submitFormData.append('souvenirTitle', formData.souvenirTitle);
      submitFormData.append('available', formData.available.toString());
      submitFormData.append('category', formData.category);
      submitFormData.append('type', formData.type);

      const response = await fetch('/api/souvenirs/packages', {
        method: 'POST',
        body: submitFormData,
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Paket berhasil ditambahkan!');
        router.push('/admin/souvenirs/packages');
      } else {
        alert('Gagal menambahkan paket: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating package:', error);
      alert('Terjadi kesalahan saat menambahkan paket');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data..." />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Tambah Paket Toko Oleh-oleh</h1>
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
                      value={formData.name}
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
                      value={formData.price}
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
                      value={formData.souvenirId}
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
                      value={formData.souvenirTitle}
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
                    value={formData.description}
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
                      value={formData.category}
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
                      value={formData.type}
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
                    checked={formData.available}
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
                    {isSaving ? 'Menyimpan...' : 'Simpan Paket Toko'}
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
