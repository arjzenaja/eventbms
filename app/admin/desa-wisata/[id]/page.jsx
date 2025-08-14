'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function EditDesaWisata() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'desa wisata',
    location: '',
    category: 'Desa Wisata',
    short_description: '',
    description: '',
    entrance_fee: '',
    contact: '',
    address: '',
    facilities: [],
    recommended: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const desaWisataTypes = [
    { value: 'desa wisata', label: 'Desa Wisata' },
    { value: 'kampung wisata', label: 'Kampung Wisata' },
    { value: 'ecotourism', label: 'Ecotourism' },
    { value: 'cultural village', label: 'Cultural Village' },
    { value: 'heritage village', label: 'Heritage Village' }
  ];

  const categories = [
    { value: 'Desa Wisata', label: 'Desa Wisata' },
    { value: 'Kampung Wisata', label: 'Kampung Wisata' },
    { value: 'Ecotourism', label: 'Ecotourism' },
    { value: 'Cultural Tourism', label: 'Cultural Tourism' }
  ];

  const availableFacilities = [
    'Parkir', 'Toilet', 'Musholla', 'Warung', 'Penginapan', 'Restoran', 'Taman', 'Tempat Bermain', 'Galeri', 'Workshop'
  ];

  useEffect(() => {
    const fetchDesaWisata = async () => {
      try {
        const response = await fetch(`/api/desa_wisata/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setFormData({
            title: data.desa_wisata.title || '',
            type: data.desa_wisata.type || 'desa wisata',
            location: data.desa_wisata.location || '',
            category: data.desa_wisata.category || 'Desa Wisata',
            short_description: data.desa_wisata.short_description || '',
            description: data.desa_wisata.description || '',
            entrance_fee: data.desa_wisata.entrance_fee || '',
            contact: data.desa_wisata.contact || '',
            address: data.desa_wisata.address || '',
            facilities: data.desa_wisata.facilities || [],
            recommended: data.desa_wisata.recommended || false
          });
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching desa wisata:', error);
        setError('Terjadi kesalahan saat mengambil data desa wisata');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDesaWisata();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/desa_wisata/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Desa wisata berhasil diperbarui!');
        router.push('/admin/desa-wisata');
      } else {
        alert('Gagal memperbarui desa wisata: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating desa wisata:', error);
      alert('Terjadi kesalahan saat memperbarui desa wisata');
    } finally {
      setIsSubmitting(false);
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
          onRetry={() => window.location.reload()}
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
              <h1 className="text-3xl font-bold text-gray-900">Edit Desa Wisata</h1>
              <Link 
                href="/admin/desa-wisata" 
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
                    Nama Desa Wisata * 
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan nama desa wisata"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Tipe Desa Wisata *
                    </label>
                    <select
                      id="type"
                      name="type"
                      required
                      value={formData.type}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {desaWisataTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Kategori *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
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
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Alamat Lengkap
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan alamat lengkap"
                  />
                </div>

                <div>
                  <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">
                    Deskripsi Singkat *
                  </label>
                  <textarea
                    id="short_description"
                    name="short_description"
                    required
                    rows={3}
                    value={formData.short_description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan deskripsi singkat"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Deskripsi Lengkap
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan deskripsi lengkap"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="entrance_fee" className="block text-sm font-medium text-gray-700">
                      Biaya Masuk
                    </label>
                    <input
                      type="text"
                      id="entrance_fee"
                      name="entrance_fee"
                      value={formData.entrance_fee}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Contoh: Rp 10.000 atau Gratis"
                    />
                  </div>

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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fasilitas yang Tersedia
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableFacilities.map(facility => (
                      <label key={facility} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(facility)}
                          onChange={() => handleFacilityChange(facility)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">{facility}</span>
                      </label>
                    ))}
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
                    Rekomendasikan desa wisata ini
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href="/admin/desa-wisata"
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









