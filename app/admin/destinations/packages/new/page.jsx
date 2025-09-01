'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function NewDestinationPackage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [form, setForm] = useState({
    destinationId: '',
    name: '',
    description: '',
    category: 'Paket Wisata',
    price: '',
    duration: '',
    capacity: '',
    facilities: '',
    available: true,
    popular: false
  });

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/wisata');
        const data = await response.json();
        
        if (data.success) {
          setDestinations(data.wisata);
        } else {
          setError('Gagal memuat data destinasi');
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setError('Terjadi kesalahan saat memuat data destinasi');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.destinationId || !form.name || !form.price) {
      alert('Destination, name, dan price harus diisi');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('destinationId', form.destinationId);
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('price', form.price);
      formData.append('facilities', form.facilities);
      formData.append('duration', form.duration);
      formData.append('capacity', form.capacity);
      formData.append('available', form.available.toString());
      formData.append('popular', form.popular.toString());
      
      const response = await fetch('/api/destinations/packages', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Paket destinasi berhasil ditambahkan!');
        router.push('/admin/destinations/packages');
      } else {
        alert('Gagal menambahkan paket: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating package:', error);
      alert('Terjadi kesalahan saat menambahkan paket');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data destinasi..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data destinasi"
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
              <h1 className="text-3xl font-bold text-gray-900">Tambah Paket Wisata Baru</h1>
              <Link
                href="/admin/destinations/packages"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <span>←</span>
                Kembali
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Destination Selection */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">📍 Pilih Destinasi</h3>
                <div>
                  <label htmlFor="destinationId" className="block text-sm font-medium text-gray-700 mb-2">
                    Destinasi <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="destinationId"
                    name="destinationId"
                    value={form.destinationId}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Pilih destinasi...</option>
                    {destinations.map(dest => (
                      <option key={dest.id} value={dest.id}>
                        {dest.title} - {dest.location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Package Details */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">📦 Detail Paket</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Paket <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contoh: Paket Standar"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={form.category}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Paket Standar">Paket Standar</option>
                      <option value="Paket Deluxe">Paket Deluxe</option>
                      <option value="Paket Keluarga">Paket Keluarga</option>
                      <option value="Paket Premium">Paket Premium</option>
                      <option value="Paket Adventure">Paket Adventure</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Paket
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Jelaskan detail paket wisata..."
                  />
                </div>
              </div>

              {/* Pricing & Duration */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">💰 Harga & Durasi</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Harga (IDR) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={form.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contoh: 150000"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Masukkan angka tanpa titik atau koma (contoh: 150000 untuk Rp 150.000)
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                      Durasi
                    </label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={form.duration}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contoh: 1 hari, 2 hari 1 malam"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Durasi perjalanan wisata
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                      Kapasitas
                    </label>
                    <input
                      type="text"
                      id="capacity"
                      name="capacity"
                      value={form.capacity}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contoh: 2-4 orang, 4-8 orang"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Jumlah peserta yang dapat mengikuti paket
                    </p>
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">✅ Fasilitas Paket</h3>
                <div>
                  <label htmlFor="facilities" className="block text-sm font-medium text-gray-700 mb-2">
                    Fasilitas yang termasuk dalam paket
                  </label>
                  <textarea
                    id="facilities"
                    name="facilities"
                    value={form.facilities}
                    onChange={handleInputChange}
                    rows={4}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh:&#10;• Tiket masuk&#10;• Pemandu lokal&#10;• Makan siang&#10;• Transportasi&#10;• Akomodasi (untuk paket multi-hari)"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Pisahkan setiap fasilitas dengan baris baru atau koma
                  </p>
                </div>
              </div>

              {/* Status Options */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">⚙️ Status Paket</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="available"
                      name="available"
                      type="checkbox"
                      checked={form.available}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                      Paket tersedia untuk pemesanan
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="popular"
                      name="popular"
                      type="checkbox"
                      checked={form.popular}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="popular" className="ml-2 block text-sm text-gray-900">
                      Tandai sebagai paket populer (akan menampilkan badge "POPULAR")
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <Link
                  href="/admin/destinations/packages"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Paket Wisata'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
