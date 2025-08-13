'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function NewSouvenirPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    short_description: '',
    description: '',
    type: 'makanan',
    category: 'Makanan',
    price_range: '25.000 - 100.000',
    contact: '',
    address: '',
    features: ['Produk Lokal', 'Kualitas Terjamin'],
    recommended: false,
  });
  const [imageFiles, setImageFiles] = useState({
    img_sm: null,
    img_lg: null
  });
  const [imagePreviews, setImagePreviews] = useState({
    img_sm: null,
    img_lg: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      
      setImageFiles(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => ({
          ...prev,
          [name]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (name) => {
    setImageFiles(prev => ({
      ...prev,
      [name]: null
    }));
    setImagePreviews(prev => ({
      ...prev,
      [name]: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Add image files
      if (imageFiles.img_sm) {
        formDataToSend.append('img_sm', imageFiles.img_sm);
      }
      if (imageFiles.img_lg) {
        formDataToSend.append('img_lg', imageFiles.img_lg);
      }

      const response = await fetch('/api/souvenirs', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.success) {
        alert('Oleh-oleh berhasil ditambahkan!');
        router.push('/admin/souvenirs');
      } else {
        setError(data.message || 'Gagal menambahkan oleh-oleh');
      }
    } catch (err) {
      console.error('Error creating souvenir:', err);
      setError('Terjadi kesalahan saat menambahkan oleh-oleh');
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
              <h1 className="text-3xl font-bold text-gray-900">Tambah Oleh-oleh Baru</h1>
              <Link
                href="/admin/souvenirs"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Kembali
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Oleh-oleh
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    >
                      <option value="makanan">Makanan</option>
                      <option value="pakaian">Pakaian</option>
                      <option value="kerajinan">Kerajinan</option>
                      <option value="aksesoris">Aksesoris</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Produk *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder={formData.type === 'makanan' ? 'Contoh: Getuk Goreng Sokaraja' : 'Contoh: Batik Gajah Uling'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-2">
                      Penjelasan Singkat
                    </label>
                    <input
                      type="text"
                      id="short_description"
                      name="short_description"
                      value={formData.short_description}
                      onChange={handleInputChange}
                      placeholder="Ringkas: 1-2 kalimat"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Lengkap
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder={
                        formData.type === 'makanan'
                          ? 'Bahan dasar, rasa, ciri khas, sejarah/asal-usul'
                          : 'Ciri khas motif, bahan, filosofi, keunikan'
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi Toko/Produsen
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder={formData.type === 'makanan' ? 'Contoh: Sentra Oleh-oleh ...' : 'Contoh: Galeri Batik ...'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                      Kontak Penjual
                    </label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="HP/WA/Instagram/Marketplace"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Lengkap
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={2}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Alamat toko/sentra oleh-oleh"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="price_range" className="block text-sm font-medium text-gray-700 mb-2">
                      Range Harga
                    </label>
                    <input
                      type="text"
                      id="price_range"
                      name="price_range"
                      value={formData.price_range}
                      onChange={handleInputChange}
                      placeholder="Contoh: 25.000 - 100.000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="Contoh: Makanan, Pakaian, Kerajinan"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Gambar Oleh-oleh</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="img_sm" className="block text-sm font-medium text-gray-700 mb-2">
                        Gambar Kecil (untuk Card/Thumbnail)
                      </label>
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                        <p className="text-sm text-blue-800 font-medium mb-1">📱 Digunakan untuk:</p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>• Card oleh-oleh di halaman utama</li>
                          <li>• Thumbnail di list pencarian</li>
                          <li>• Preview di kategori makanan/pakaian</li>
                          <li>• Tampilan mobile yang responsif</li>
                        </ul>
                        <p className="text-xs text-blue-600 mt-2">💡 <strong>Rekomendasi:</strong> Gunakan gambar dengan rasio 1:1 (persegi) untuk hasil terbaik</p>
                      </div>
                      <input
                        type="file"
                        id="img_sm"
                        name="img_sm"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      />
                      {imagePreviews.img_sm && (
                        <div className="mt-2 relative">
                          <img 
                            src={imagePreviews.img_sm} 
                            alt="Preview Gambar Kecil" 
                            className="w-32 h-32 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('img_sm')}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold"
                            title="Hapus gambar"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimal 5MB</p>
                    </div>

                    <div>
                      <label htmlFor="img_lg" className="block text-sm font-medium text-gray-700 mb-2">
                        Gambar Besar (untuk Detail/Hero)
                      </label>
                      <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                        <p className="text-sm text-green-800 font-medium mb-1">🖼️ Digunakan untuk:</p>
                        <ul className="text-xs text-green-700 space-y-1">
                          <li>• Halaman detail oleh-oleh</li>
                          <li>• Hero section yang menarik</li>
                          <li>• Galeri foto berkualitas tinggi</li>
                          <li>• Tampilan desktop yang optimal</li>
                        </ul>
                        <p className="text-xs text-green-600 mt-2">💡 <strong>Rekomendasi:</strong> Gunakan gambar landscape (16:9) atau portrait (4:3) dengan resolusi tinggi</p>
                      </div>
                      <input
                        type="file"
                        id="img_lg"
                        name="img_lg"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      />
                      {imagePreviews.img_lg && (
                        <div className="mt-2 relative">
                          <img 
                            src={imagePreviews.img_lg} 
                            alt="Preview Gambar Besar" 
                            className="w-32 h-32 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('img_lg')}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold"
                            title="Hapus gambar"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimal 5MB</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">
                    Fitur/Keunggulan
                  </label>
                  <textarea
                    id="features"
                    name="features"
                    rows={2}
                    value={formData.features.join(', ')}
                    onChange={(e) => {
                      const featuresArray = e.target.value.split(',').map(f => f.trim()).filter(f => f);
                      setFormData(prev => ({
                        ...prev,
                        features: featuresArray
                      }));
                    }}
                    placeholder="Contoh: Produk Lokal, Kualitas Terjamin, Halal, Bisa Dipesan Online"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma untuk multiple fitur</p>
                </div>

                <div className="md:col-span-2">
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
                      Tandai sebagai oleh-oleh yang direkomendasikan
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Link
                    href="/admin/souvenirs"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Oleh-oleh'}
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


