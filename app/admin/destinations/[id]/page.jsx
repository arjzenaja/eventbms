'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function EditDestinationPage() {
  const router = useRouter();
  const params = useParams();
  const destinationId = params.id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'objek-wisata',
    price: '',
    manager: '', // Pengelola Wisata
    recommended: false,
    date: '',
    short_description: ''
  });
  const [imageFiles, setImageFiles] = useState({
    img_sm: null,
    img_lg: null
  });
  const [imagePreviews, setImagePreviews] = useState({
    img_sm: null,
    img_lg: null
  });
  const [currentImages, setCurrentImages] = useState({
    img_sm: '',
    img_lg: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`/api/destinations/${destinationId}`);
        const data = await response.json();
        
        if (data.success) {
          const destination = data.destination;
          setFormData({
            title: destination.title || '',
            description: destination.description || '',
            location: destination.location || '',
            type: destination.type || 'objek-wisata',
            price: destination.seats?.[0]?.price || '',
            manager: destination.manager || '', // Pengelola Wisata
            recommended: destination.recommended || false,
            short_description: destination.short_description || '',
            date: destination.date || ''
          });
          setCurrentImages({
            img_sm: destination.img_sm || '',
            img_lg: destination.img_lg || ''
          });
        } else {
          setError(data.message || 'Gagal memuat data destinasi');
        }
      } catch (error) {
        console.error('Error fetching destination:', error);
        setError('Terjadi kesalahan saat memuat data destinasi');
      } finally {
        setIsLoading(false);
      }
    };

    if (destinationId) {
      fetchDestination();
    }
  }, [destinationId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

      const response = await fetch(`/api/destinations/${destinationId}`, {
        method: 'PUT',
        body: formDataToSend, // Don't set Content-Type header, let browser set it with boundary
      });

      const data = await response.json();

      if (data.success) {
        alert('Objek wisata berhasil diperbarui!');
        router.push('/admin/destinations');
      } else {
        setError(data.message || 'Gagal memperbarui objek wisata');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Terjadi kesalahan saat memperbarui objek wisata');
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Error</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <div className="space-x-3">
                <Link
                  href="/admin/destinations"
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Kembali ke Destinasi
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
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
              <h1 className="text-3xl font-bold text-gray-900">Edit Destinasi</h1>
              <Link 
                href="/admin/destinations"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                ← Kembali ke Destinasi
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nama Destinasi */}
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Destinasi *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Contoh: Hutan Pinus Limpakuwus"
                    />
                  </div>

                  {/* Deskripsi Singkat */}
                  <div className="md:col-span-2">
                    <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Singkat *
                    </label>
                    <textarea
                      id="short_description"
                      name="short_description"
                      value={formData.short_description}
                      onChange={handleInputChange}
                      required
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Deskripsi singkat destinasi wisata..."
                    />
                  </div>

                  {/* Deskripsi Lengkap */}
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Lengkap *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Deskripsi lengkap tentang destinasi wisata..."
                    />
                  </div>

                  {/* Lokasi */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Contoh: Banyumas, Indonesia"
                    />
                  </div>

                  {/* Tipe */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Tipe Destinasi *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    >
                      <option value="wisata-alam">Wisata Alam</option>
                      <option value="wisata-taman">Wisata Taman</option>
                      <option value="wisata-budaya">Wisata Budaya</option>
                      <option value="wisata-sejarah">Wisata Sejarah</option>
                      <option value="wisata-buatan">Wisata Buatan</option>
                      <option value="wisata-minat-khusus">Wisata Minat Khusus</option>
                      <option value="wisata-religi">Wisata Religi</option>
                    </select>
                  </div>

                  {/* Harga Tiket */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Harga Tiket (Rp) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="25000"
                    />
                  </div>

                  {/* Pengelola Wisata */}
                  <div>
                    <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-2">
                      Pengelola Wisata
                    </label>
                    <input
                      type="text"
                      id="manager"
                      name="manager"
                      value={formData.manager}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Nama pengelola atau kontak"
                    />
                  </div>

                  {/* Tanggal */}
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                  </div>

                  {/* Gambar Kecil */}
                  <div>
                    <label htmlFor="img_sm" className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Kecil
                    </label>
                    <input
                      type="file"
                      id="img_sm"
                      name="img_sm"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                    {/* Show current image or preview */}
                    {(imagePreviews.img_sm || currentImages.img_sm) && (
                      <div className="mt-2">
                        <img 
                          src={imagePreviews.img_sm || currentImages.img_sm} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                        {currentImages.img_sm && !imagePreviews.img_sm && (
                          <p className="text-xs text-gray-500 mt-1">Gambar saat ini</p>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimal 5MB</p>
                  </div>

                  {/* Gambar Besar */}
                  <div>
                    <label htmlFor="img_lg" className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Besar
                    </label>
                    <input
                      type="file"
                      id="img_lg"
                      name="img_lg"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                    {/* Show current image or preview */}
                    {(imagePreviews.img_lg || currentImages.img_lg) && (
                      <div className="mt-2">
                        <img 
                          src={imagePreviews.img_lg || currentImages.img_lg} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                        {currentImages.img_lg && !imagePreviews.img_lg && (
                          <p className="text-xs text-gray-500 mt-1">Gambar saat ini</p>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimal 5MB</p>
                  </div>

                  {/* Recommended */}
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
                      <label htmlFor="recommended" className="ml-2 block text-sm text-gray-700">
                        Tandai sebagai destinasi yang direkomendasikan
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Link
                    href="/admin/destinations"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
