'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function EditCulinaryItem() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    short_description: '',
    type: 'cafe',
    price_range: '25.000 - 50.000',
    cuisine: 'Indonesia',
    opening_hours: '10:00 - 22:00',
    contact: '',
    address: '',
    features: ['Masakan Indonesia', 'Suasana Nyaman'],
    img_sm: '',
    img_lg: '',
    recommended: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCulinaryItem = async () => {
      try {
        const response = await fetch(`/api/culinary/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setFormData({
            title: data.kuliner.title || '',
            location: data.kuliner.location || '',
            description: data.kuliner.description || '',
            short_description: data.kuliner.short_description || '',
            type: data.kuliner.type || 'cafe',
            price_range: data.kuliner.price_range || '25.000 - 50.000',
            cuisine: data.kuliner.cuisine || 'Indonesia',
            opening_hours: data.kuliner.opening_hours || '10:00 - 22:00',
            contact: data.kuliner.contact || '',
            address: data.kuliner.address || '',
            features: data.kuliner.features || ['Masakan Indonesia', 'Suasana Nyaman'],
            img_sm: data.kuliner.img_sm || '',
            img_lg: data.kuliner.img_lg || '',
            recommended: data.kuliner.recommended || false
          });
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching culinary item:', error);
        setError('Terjadi kesalahan saat mengambil data item kuliner');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCulinaryItem();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/culinary/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Item kuliner berhasil diperbarui!');
        router.push('/admin/culinary');
      } else {
        alert('Gagal memperbarui item kuliner: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating culinary item:', error);
      alert('Terjadi kesalahan saat memperbarui item kuliner');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data item kuliner..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data item kuliner"
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
              <h1 className="text-3xl font-bold text-gray-900">Edit Item Kuliner</h1>
              <Link 
                href="/admin/culinary" 
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Kembali
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow sm:rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-6 p-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Nama Kuliner *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan nama kuliner"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Lokasi *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan lokasi"
                  />
                </div>

                <div>
                  <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">
                    Deskripsi Singkat *
                  </label>
                  <input
                    type="text"
                    id="short_description"
                    name="short_description"
                    required
                    value={formData.short_description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan deskripsi singkat kuliner"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Deskripsi *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan deskripsi lengkap kuliner"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Tipe Kuliner *
                    </label>
                    <select
                      id="type"
                      name="type"
                      required
                      value={formData.type}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="cafe">Cafe</option>
                      <option value="resto">Restoran</option>
                      <option value="rumah makan">Rumah Makan</option>
                      <option value="kedai">Kedai</option>
                      <option value="warung">Warung</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="price_range" className="block text-sm font-medium text-gray-700">
                      Kisaran Harga *
                    </label>
                    <input
                      type="text"
                      id="price_range"
                      name="price_range"
                      required
                      value={formData.price_range || '0 - 0'}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0 - 0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700">
                      Jenis Masakan *
                    </label>
                    <input
                      type="text"
                      id="cuisine"
                      name="cuisine"
                      required
                      value={formData.cuisine}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contoh: Indonesia, Jawa, Sunda"
                    />
                  </div>

                  <div>
                    <label htmlFor="opening_hours" className="block text-sm font-medium text-gray-700">
                      Jam Buka *
                    </label>
                    <input
                      type="text"
                      id="opening_hours"
                      name="opening_hours"
                      required
                      value={formData.opening_hours}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contoh: 10:00 - 22:00"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                      Kontak
                    </label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nomor telepon atau email"
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Alamat Lengkap
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={2}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Alamat lengkap lokasi kuliner"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="features" className="block text-sm font-medium text-gray-700">
                    Fitur-fitur
                  </label>
                  <textarea
                    id="features"
                    name="features"
                    rows={3}
                    value={formData.features.join(', ')}
                    onChange={(e) => {
                      const featuresArray = e.target.value.split(',').map(f => f.trim()).filter(f => f);
                      setFormData(prev => ({ ...prev, features: featuresArray }));
                    }}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan fitur-fitur, pisahkan dengan koma (contoh: WiFi Gratis, Suasana Nyaman, Parkir Luas)"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Pisahkan setiap fitur dengan koma
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="img_sm" className="block text-sm font-medium text-gray-700">
                      Gambar Kecil
                    </label>
                    <input
                      type="text"
                      id="img_sm"
                      name="img_sm"
                      value={formData.img_sm}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="URL gambar kecil"
                    />
                  </div>

                  <div>
                    <label htmlFor="img_lg" className="block text-sm font-medium text-gray-700">
                      Gambar Besar
                    </label>
                    <input
                      type="text"
                      id="img_lg"
                      name="img_lg"
                      value={formData.img_lg}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="URL gambar besar"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="recommended"
                    name="recommended"
                    checked={formData.recommended}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="recommended" className="ml-2 block text-sm text-gray-900">
                    Rekomendasikan item ini
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href="/admin/culinary"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
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
