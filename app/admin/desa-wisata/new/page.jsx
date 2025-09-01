'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function NewDesaWisata() {
  const router = useRouter();
  
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
    recommended: false,
    price_range: 'Rp 0 - Rp 50.000',
    coordinates: {
      latitude: '',
      longitude: ''
    },
    operating_hours: {
      open: '08:00',
      close: '17:00',
      days: 'Senin - Minggu'
    },
    gallery: [],
    packages: [],
    activities: [],
    transportation: '',
    accommodation: '',
    weather_info: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (arrayName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (arrayName, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultValue]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
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
      const submitFormData = new FormData();
      
      // Basic fields
      submitFormData.append('title', formData.title);
      submitFormData.append('type', formData.type);
      submitFormData.append('location', formData.location);
      submitFormData.append('category', formData.category);
      submitFormData.append('short_description', formData.short_description);
      submitFormData.append('description', formData.description);
      submitFormData.append('entrance_fee', formData.entrance_fee);
      submitFormData.append('contact', formData.contact);
      submitFormData.append('address', formData.address);
      submitFormData.append('price_range', formData.price_range);
      
      // Coordinates
      submitFormData.append('latitude', formData.coordinates.latitude);
      submitFormData.append('longitude', formData.coordinates.longitude);
      
      // Operating hours
      submitFormData.append('operating_hours_open', formData.operating_hours.open);
      submitFormData.append('operating_hours_close', formData.operating_hours.close);
      submitFormData.append('operating_hours_days', formData.operating_hours.days);
      
      // Arrays
      submitFormData.append('facilities', formData.facilities.join(','));
      submitFormData.append('packages', formData.packages.join(','));
      submitFormData.append('activities', formData.activities.join(','));
      
      // Other fields
      submitFormData.append('transportation', formData.transportation);
      submitFormData.append('accommodation', formData.accommodation);
      submitFormData.append('weather_info', formData.weather_info);
      submitFormData.append('recommended', formData.recommended);

      const response = await fetch('/api/desa_wisata', {
        method: 'POST',
        body: submitFormData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Desa wisata berhasil ditambahkan!');
        router.push('/admin/desa-wisata');
      } else {
        alert('Gagal menambahkan desa wisata: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating desa wisata:', error);
      alert('Terjadi kesalahan saat menambahkan desa wisata');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Tambah Desa Wisata Baru</h1>
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
                  <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    id="short_description"
                    name="short_description"
                    rows={2}
                    value={formData.short_description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan deskripsi singkat"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Deskripsi Lengkap *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
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
                    placeholder="Masukkan alamat lengkap desa wisata"
                  />
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
                    value={formData.price_range}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Rp 10.000 - Rp 25.000"
                  />
                </div>

                {/* Koordinat GPS */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Koordinat GPS (untuk akurasi peta)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="latitude" className="block text-xs text-gray-500 mb-1">Latitude</label>
                      <input
                        type="text"
                        id="latitude"
                        value={formData.coordinates.latitude}
                        onChange={(e) => handleNestedInputChange('coordinates', 'latitude', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="-7.431391"
                      />
                    </div>
                    <div>
                      <label htmlFor="longitude" className="block text-xs text-gray-500 mb-1">Longitude</label>
                      <input
                        type="text"
                        id="longitude"
                        value={formData.coordinates.longitude}
                        onChange={(e) => handleNestedInputChange('coordinates', 'longitude', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="109.247833"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Tip: Gunakan Google Maps untuk mendapatkan koordinat yang akurat
                  </p>
                </div>

                {/* Jam Operasional */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jam Operasional
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="open_time" className="block text-xs text-gray-500 mb-1">Jam Buka</label>
                      <input
                        type="time"
                        id="open_time"
                        value={formData.operating_hours.open}
                        onChange={(e) => handleNestedInputChange('operating_hours', 'open', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="close_time" className="block text-xs text-gray-500 mb-1">Jam Tutup</label>
                      <input
                        type="time"
                        id="close_time"
                        value={formData.operating_hours.close}
                        onChange={(e) => handleNestedInputChange('operating_hours', 'close', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="operating_days" className="block text-xs text-gray-500 mb-1">Hari Operasional</label>
                      <select
                        id="operating_days"
                        value={formData.operating_hours.days}
                        onChange={(e) => handleNestedInputChange('operating_hours', 'days', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Senin - Minggu">Senin - Minggu</option>
                        <option value="Senin - Sabtu">Senin - Sabtu</option>
                        <option value="Senin - Jumat">Senin - Jumat</option>
                        <option value="Sabtu - Minggu">Sabtu - Minggu</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Transportasi */}
                <div>
                  <label htmlFor="transportation" className="block text-sm font-medium text-gray-700">
                    Informasi Transportasi
                  </label>
                  <textarea
                    id="transportation"
                    name="transportation"
                    rows={3}
                    value={formData.transportation}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Cara mencapai lokasi, transportasi umum yang tersedia, dll"
                  />
                </div>

                {/* Akomodasi */}
                <div>
                  <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700">
                    Akomodasi Terdekat
                  </label>
                  <textarea
                    id="accommodation"
                    name="accommodation"
                    rows={3}
                    value={formData.accommodation}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Hotel, homestay, atau penginapan terdekat"
                  />
                </div>

                {/* Paket Wisata */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paket Wisata yang Tersedia
                  </label>
                  {formData.packages.map((pkg, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={pkg}
                        onChange={(e) => handleArrayInputChange('packages', index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contoh: Paket Day Trip Rp 150.000/orang"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('packages', index)}
                        className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('packages')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm"
                  >
                    + Tambah Paket
                  </button>
                </div>

                {/* Aktivitas/Event */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aktivitas/Event yang Bisa Diikuti
                  </label>
                  {formData.activities.map((activity, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={activity}
                        onChange={(e) => handleArrayInputChange('activities', index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contoh: Workshop batik, Membuat kerajinan bambu"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('activities', index)}
                        className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('activities')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm"
                  >
                    + Tambah Aktivitas
                  </button>
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

                <div className="space-y-4">
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
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="weather_info"
                      name="weather_info"
                      checked={formData.weather_info}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="weather_info" className="ml-2 block text-sm text-gray-900">
                      Tampilkan informasi cuaca real-time
                    </label>
                  </div>
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
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Desa Wisata'}
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
