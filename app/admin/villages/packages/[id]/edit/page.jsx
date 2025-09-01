'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function EditVillagePackage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [villages, setVillages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Aktivitas',
    duration: '',
    villageId: '',
    features: '',
    popular: false,
    available: true,
    rating: '4.8',
    // Field baru yang ditambahkan
    image: '',
    maxCapacity: '',
    minOrder: '1',
    terms: '',
    contact: '',
    location: '',
    availableTime: '',
    discount: '',
    discountType: 'percentage',
    discountValue: '',
    discountValidUntil: '',
    highlights: '',
    includedItems: '',
    excludedItems: '',
    cancellationPolicy: '',
    ageRestriction: '',
    difficultyLevel: 'Mudah',
    seasonality: 'Sepanjang Tahun'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch villages
        const villagesResponse = await fetch('/api/desa_wisata');
        const villagesData = await villagesResponse.json();
        
        if (villagesData.success) {
          setVillages(villagesData.desa_wisata || []);
        }

        // Fetch package data
        const packageResponse = await fetch(`/api/villages/packages/${id}`);
        const packageData = await packageResponse.json();
        
        if (packageData.success) {
          const packageItem = packageData.package;
          setForm({
            title: packageItem.title || '',
            description: packageItem.description || '',
            price: packageItem.price || '',
            category: packageItem.category || 'Aktivitas',
            duration: packageItem.duration || '',
            villageId: packageItem.villageId || '',
            features: Array.isArray(packageItem.features) ? packageItem.features.join(', ') : packageItem.features || '',
            popular: packageItem.popular || false,
            available: packageItem.available !== false,
            rating: packageItem.rating?.toString() || '4.8',
            // Field baru yang ditambahkan
            image: packageItem.image || '',
            maxCapacity: packageItem.maxCapacity || '',
            minOrder: packageItem.minOrder?.toString() || '1',
            terms: packageItem.terms || '',
            contact: packageItem.contact || '',
            location: packageItem.location || '',
            availableTime: packageItem.availableTime || '',
            discount: packageItem.discount || '',
            discountType: packageItem.discountType || 'percentage',
            discountValue: packageItem.discountValue || '',
            discountValidUntil: packageItem.discountValidUntil || '',
            highlights: packageItem.highlights || '',
            includedItems: Array.isArray(packageItem.includedItems) ? packageItem.includedItems.join(', ') : packageItem.includedItems || '',
            excludedItems: Array.isArray(packageItem.excludedItems) ? packageItem.excludedItems.join(', ') : packageItem.excludedItems || '',
            cancellationPolicy: packageItem.cancellationPolicy || '',
            ageRestriction: packageItem.ageRestriction || '',
            difficultyLevel: packageItem.difficultyLevel || 'Mudah',
            seasonality: packageItem.seasonality || 'Sepanjang Tahun'
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Add form data
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });
      
      // Add village slug if village is selected
      if (form.villageId) {
        const selectedVillage = villages.find(v => v.id === form.villageId);
        if (selectedVillage) {
          formData.append('villageSlug', selectedVillage.title.toLowerCase().replace(/\s+/g, '-'));
        }
      }

      const response = await fetch(`/api/villages/packages/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Layanan desa wisata berhasil diperbarui!');
        router.push('/admin/villages/packages');
      } else {
        alert('Gagal memperbarui layanan: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat menyimpan layanan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data layanan...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Edit Layanan Desa Wisata</h1>
              <Link 
                href="/admin/villages/packages"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                ← Kembali ke Layanan
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Layanan *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Tiket Masuk, Jasa Pemandu, Paket Berkebun"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desa Wisata *
                    </label>
                    <select
                      name="villageId"
                      value={form.villageId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Desa Wisata</option>
                      {villages.map(village => (
                        <option key={village.id} value={village.id}>
                          {village.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori *
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Tiket & Parkir">Tiket & Parkir</option>
                      <option value="Aktivitas">Aktivitas</option>
                      <option value="Penginapan">Penginapan</option>
                      <option value="Layanan">Layanan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga (Rp) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="10000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Isi 0 jika gratis</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durasi
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: 2-3 jam, Seharian, 1-2 jam"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <select
                      name="rating"
                      value={form.rating}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="4.5">4.5 ⭐</option>
                      <option value="4.7">4.7 ⭐</option>
                      <option value="4.8">4.8 ⭐</option>
                      <option value="4.9">4.9 ⭐</option>
                      <option value="5.0">5.0 ⭐</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kapasitas Maksimal
                    </label>
                    <input
                      type="text"
                      name="maxCapacity"
                      value={form.maxCapacity}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: 10 orang, 20 orang"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Pemesanan
                    </label>
                    <input
                      type="number"
                      name="minOrder"
                      value={form.minOrder}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tingkat Kesulitan
                    </label>
                    <select
                      name="difficultyLevel"
                      value={form.difficultyLevel}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Mudah">Mudah</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Sulit">Sulit</option>
                      <option value="Sangat Sulit">Sangat Sulit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Musim Tersedia
                    </label>
                    <select
                      name="seasonality"
                      value={form.seasonality}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Sepanjang Tahun">Sepanjang Tahun</option>
                      <option value="Musim Kemarau">Musim Kemarau</option>
                      <option value="Musim Hujan">Musim Hujan</option>
                      <option value="Musim Semi">Musim Semi</option>
                      <option value="Musim Gugur">Musim Gugur</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Media & Visual */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Media & Visual</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Gambar/Thumbnail
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Link gambar untuk layanan ini</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Highlights/Poin Unggulan
                    </label>
                    <input
                      type="text"
                      name="highlights"
                      value={form.highlights}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Pemandangan indah, Pengalaman unik, Lokasi strategis"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Deskripsi</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Layanan *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Jelaskan detail layanan, apa yang didapat, dll."
                  />
                </div>
              </div>

              {/* Features & Inclusions */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Fitur & Inklusi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fitur (pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      name="features"
                      value={form.features}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Gratis anak &lt; 3 tahun, Diskon pelajar 50%, Max 10 orang"
                    />
                    <p className="text-xs text-gray-500 mt-1">Contoh: Gratis anak &lt; 3 tahun, Diskon pelajar 50%, Max 10 orang, Termasuk sejarah, Bahasa Indonesia</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item yang Disediakan
                    </label>
                    <input
                      type="text"
                      name="includedItems"
                      value={form.includedItems}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Alat berkebun, Bahan memasak, Tenda camping"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item yang Tidak Disediakan
                    </label>
                    <input
                      type="text"
                      name="excludedItems"
                      value={form.excludedItems}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Makanan pribadi, Pakaian ganti, Transportasi"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Contact */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Lokasi & Kontak</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi Spesifik
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Area camping, Rumah warga, Pusat desa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Informasi Kontak
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value={form.contact}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: 0812-3456-7890, pemandu@desa.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waktu Tersedia
                    </label>
                    <input
                      type="text"
                      name="availableTime"
                      value={form.availableTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: 08:00-17:00, 24 jam, Setelah Maghrib"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Batasan Usia
                    </label>
                    <input
                      type="text"
                      name="ageRestriction"
                      value={form.ageRestriction}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: 5+ tahun, 12+ tahun, Semua umur"
                    />
                  </div>
                </div>
              </div>

              {/* Discount & Special Offers */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Diskon & Penawaran Khusus</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Diskon
                    </label>
                    <select
                      name="discountType"
                      value={form.discountType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage">Persentase (%)</option>
                      <option value="fixed">Nominal (Rp)</option>
                      <option value="none">Tidak Ada Diskon</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nilai Diskon
                    </label>
                    <input
                      type="text"
                      name="discountValue"
                      value={form.discountValue}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: 10, 50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Berlaku Sampai
                    </label>
                    <input
                      type="date"
                      name="discountValidUntil"
                      value={form.discountValidUntil}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Terms & Policies */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Syarat & Ketentuan</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Syarat & Ketentuan
                    </label>
                    <textarea
                      name="terms"
                      value={form.terms}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Wajib membawa KTP, Minimal pemesanan 1 hari sebelumnya, Pembayaran di muka"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kebijakan Pembatalan
                    </label>
                    <textarea
                      name="cancellationPolicy"
                      value={form.cancellationPolicy}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Bisa dibatalkan 24 jam sebelumnya, Refund 50% jika dibatalkan H-1"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="popular"
                      checked={form.popular}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Tandai sebagai Layanan Populer
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="available"
                      checked={form.available}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Layanan Tersedia
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Link
                  href="/admin/villages/packages"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Update Layanan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
