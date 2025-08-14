'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function EditTravelAgency() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'biro-perjalanan',
    location: '',
    category: 'Biro Perjalanan',
    short_description: '',
    description: '',
    contact: '',
    address: '',
    services: [],
    facilities: [],
    recommended: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const travelAgencyTypes = [
    { value: 'biro-perjalanan', label: 'Biro Perjalanan' },
    { value: 'travel-agent', label: 'Travel Agent' },
    { value: 'tour-operator', label: 'Tour Operator' },
    { value: 'online-travel', label: 'Online Travel' }
  ];

  const categories = [
    { value: 'Biro Perjalanan', label: 'Biro Perjalanan' },
    { value: 'Travel Agent', label: 'Travel Agent' },
    { value: 'Tour Operator', label: 'Tour Operator' },
    { value: 'Online Travel', label: 'Online Travel' }
  ];

  const availableServices = [
    'Paket Wisata', 'Tiket Pesawat', 'Tiket Kereta', 'Hotel Booking', 'Rental Mobil', 'Tour Guide', 'Visa Service', 'Travel Insurance'
  ];

  const availableFacilities = [
    'Kantor Cabang', 'Online Booking', '24/7 Support', 'Mobile App', 'Loyalty Program', 'Corporate Travel', 'Group Tours', 'Custom Packages'
  ];

  useEffect(() => {
    const fetchTravelAgency = async () => {
      try {
        const response = await fetch(`/api/biro_perjalanan/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setFormData({
            title: data.biro_perjalanan.title || '',
            type: data.biro_perjalanan.type || 'biro-perjalanan',
            location: data.biro_perjalanan.location || '',
            category: data.biro_perjalanan.category || 'Biro Perjalanan',
            short_description: data.biro_perjalanan.short_description || '',
            description: data.biro_perjalanan.description || '',
            contact: data.biro_perjalanan.contact || '',
            address: data.biro_perjalanan.address || '',
            services: data.biro_perjalanan.services || [],
            facilities: data.biro_perjalanan.facilities || [],
            recommended: data.biro_perjalanan.recommended || false
          });
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching travel agency:', error);
        setError('Terjadi kesalahan saat mengambil data biro perjalanan');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTravelAgency();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleServiceChange = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
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
      const response = await fetch(`/api/biro_perjalanan/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Biro perjalanan berhasil diperbarui!');
        router.push('/admin/travel-agencies');
      } else {
        alert('Gagal memperbarui biro perjalanan: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating travel agency:', error);
      alert('Terjadi kesalahan saat memperbarui biro perjalanan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data biro perjalanan..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data biro perjalanan"
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
              <h1 className="text-3xl font-bold text-gray-900">Edit Biro Perjalanan</h1>
              <Link 
                href="/admin/travel-agencies" 
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
                    Nama Biro Perjalanan * 
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan nama biro perjalanan"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      Tipe Layanan *
                    </label>
                    <select
                      id="type"
                      name="type"
                      required
                      value={formData.type}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      {travelAgencyTypes.map(type => (
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
                    Alamat Kantor
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan alamat kantor"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Layanan yang Ditawarkan
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableServices.map(service => (
                      <label key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={() => handleServiceChange(service)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">{service}</span>
                      </label>
                    ))}
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
                    Rekomendasikan biro perjalanan ini
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href="/admin/travel-agencies"
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









