'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function EditRoom() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [accommodations, setAccommodations] = useState([]);
  const [room, setRoom] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: '',
    size: '',
    bedType: '',
    price: '',
    accommodationId: '',
    isPopular: false,
    available: true,
    facilities: []
  });

  const bedTypes = [
    '1 Single Bed',
    '1 Queen Bed', 
    '1 King Bed',
    '2 Single Beds',
    '2 Queen Beds',
    '1 Queen + 1 Single',
    '1 King + 1 Single',
    'Bunk Bed'
  ];

  const roomFacilities = [
    'AC', 'TV', 'WiFi', 'Kamar Mandi Dalam', 'Air Panas', 'Balkon', 
    'Ruang Tamu', 'Mini Bar', 'Safe Deposit', 'Coffee Maker'
  ];

  useEffect(() => {
    fetchData();
  }, [roomId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch accommodations
      const accommodationsResponse = await fetch('/api/accommodation');
      const accommodationsData = await accommodationsResponse.json();

      if (accommodationsData.success) {
        setAccommodations(accommodationsData.penginapan || []);
      }

      // Fetch room data by ID
      const roomResponse = await fetch(`/api/rooms?id=${roomId}`);
      const roomData = await roomResponse.json();

      if (roomData.success && roomData.rooms.length > 0) {
        const roomItem = roomData.rooms.find(r => r.id === roomId) || roomData.rooms[0];
        if (roomItem) {
          setRoom(roomItem);
          setFormData({
            name: roomItem.name || '',
            description: roomItem.description || '',
            capacity: roomItem.capacity || '',
            size: roomItem.size || '',
            bedType: roomItem.bedType || '',
            price: roomItem.price || '',
            accommodationId: roomItem.accommodationId || '',
            isPopular: roomItem.isPopular || false,
            available: roomItem.available !== false,
            facilities: roomItem.facilities || []
          });
        } else {
          setError('Kamar tidak ditemukan');
        }
      } else {
        setError('Gagal memuat data kamar');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Terjadi kesalahan saat mengambil data');
    } finally {
      setIsLoading(false);
    }
  };

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

    if (!formData.name || !formData.price || !formData.accommodationId) {
      alert('Nama kamar, harga, dan penginapan harus diisi');
      return;
    }

    try {
      setIsSubmitting(true);

      const selectedAccommodation = accommodations.find(acc => acc.id === formData.accommodationId);
      
      const formDataToSend = new FormData();
      formDataToSend.append('id', roomId);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('capacity', formData.capacity);
      formDataToSend.append('size', formData.size);
      formDataToSend.append('bedType', formData.bedType);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('accommodationId', formData.accommodationId);
      formDataToSend.append('accommodationSlug', selectedAccommodation?.slug || '');
      formDataToSend.append('accommodationTitle', selectedAccommodation?.title || '');
      formDataToSend.append('isPopular', formData.isPopular.toString());
      formDataToSend.append('available', formData.available.toString());
      formDataToSend.append('facilities', JSON.stringify(formData.facilities));

      const response = await fetch('/api/rooms', {
        method: 'PUT',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        alert('Kamar berhasil diperbarui!');
        router.push('/admin/rooms');
      } else {
        alert('Gagal memperbarui kamar: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Terjadi kesalahan saat memperbarui kamar');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data kamar..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={fetchData}
          message="Gagal memuat data kamar"
        />
      </ProtectedRoute>
    );
  }

  if (!room) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Kamar Tidak Ditemukan</h2>
            <Link 
              href="/admin/rooms"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Kembali ke Daftar Kamar
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Edit Tipe Kamar</h1>
              <Link 
                href="/admin/rooms" 
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Kembali ke Daftar Kamar
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Dasar</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nama Tipe Kamar *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Standard Room"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="accommodationId" className="block text-sm font-medium text-gray-700">
                      Pilih Penginapan *
                    </label>
                    <select
                      id="accommodationId"
                      name="accommodationId"
                      value={formData.accommodationId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Pilih penginapan</option>
                      {accommodations.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                          {acc.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                      Kapasitas (orang)
                    </label>
                    <input
                      type="number"
                      id="capacity"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="2"
                    />
                  </div>

                  <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                      Ukuran (m²)
                    </label>
                    <input
                      type="text"
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="24m²"
                    />
                  </div>

                  <div>
                    <label htmlFor="bedType" className="block text-sm font-medium text-gray-700">
                      Tipe Tempat Tidur
                    </label>
                    <select
                      id="bedType"
                      name="bedType"
                      value={formData.bedType}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Pilih tipe tempat tidur</option>
                      {bedTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Harga per Malam (Rp) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="150000"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Deskripsi Kamar
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Deskripsi singkat tentang kamar"
                  />
                </div>
              </div>

              {/* Facilities */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Fasilitas Kamar</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {roomFacilities.map(facility => (
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

              {/* Options */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Opsi</h3>
                
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPopular"
                      checked={formData.isPopular}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">Kamar Populer</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="available"
                      checked={formData.available}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-900">Tersedia</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <Link
                  href="/admin/rooms"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
