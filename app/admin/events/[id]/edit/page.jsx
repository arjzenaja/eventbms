'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function EditEvent() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    type: 'festival',
    category: 'Events',
    date: '',
    time: '',
    location: '',
    venue: '',
    contact: '',
    address: '',
    features: ['Hiburan', 'Makanan'],
    recommended: false,
    seats: []
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
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${id}`);
        const data = await response.json();
        
        if (data.success) {
          const event = data.event;
          setFormData({
            title: event.title || '',
            description: event.description || '',
            short_description: event.short_description || '',
            type: event.type || 'festival',
            category: event.category || 'Events',
            date: event.date || '',
            time: event.time || '',
            location: event.location || '',
            venue: event.venue || '',
            contact: event.contact || '',
            address: event.address || '',
            features: event.features || ['Hiburan', 'Makanan'],
            recommended: event.recommended || false,
            seats: Array.isArray(event.seats) ? event.seats : []
          });
          setCurrentImages({
            img_sm: event.img_sm || '',
            img_lg: event.img_lg || ''
          });
        } else {
          setError(data.message || 'Gagal memuat data event');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Terjadi kesalahan saat memuat data event');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

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
    
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        if (key === 'features' || key === 'seats') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add image files
      if (imageFiles.img_sm) {
        formDataToSend.append('img_sm', imageFiles.img_sm);
      }
      if (imageFiles.img_lg) {
        formDataToSend.append('img_lg', imageFiles.img_lg);
      }

      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        alert('Event berhasil diperbarui!');
        router.push('/admin/events');
      } else {
        alert(data.message || 'Gagal memperbarui event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Terjadi kesalahan saat memperbarui event');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Seats form helpers
  const addSeat = () => {
    setFormData(prev => ({
      ...prev,
      seats: [...prev.seats, { seat: '', price: '', desc: '', includes: [], terms_requirements: [], terms_cancellation: [] }]
    }));
  };
  const removeSeat = (index) => {
    setFormData(prev => ({ ...prev, seats: prev.seats.filter((_,i)=>i!==index) }));
  };
  const updateSeatField = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      seats: prev.seats.map((s,i)=> i===index ? { ...s, [field]: value } : s)
    }));
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data event..." />
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
                  href="/admin/events"
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Kembali ke Events
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
              <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
              <div className="flex space-x-3">
                <Link 
                  href={`/admin/events/${id}/view`}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  👁️ Lihat
                </Link>
                <Link 
                  href="/admin/events"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  ← Kembali ke Events
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Event *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan judul event"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan lokasi event"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipe Event
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="festival">Festival</option>
                      <option value="konser">Konser</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="exhibition">Pameran</option>
                      <option value="event">Event Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Kategori event"
                    />
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tanggal dan Waktu</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Event
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waktu Event
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Deskripsi</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Singkat
                    </label>
                    <textarea
                      name="short_description"
                      value={formData.short_description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Deskripsi singkat event"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Lengkap
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Deskripsi lengkap event"
                    />
                  </div>
                </div>
              </div>

              {/* Venue and Contact */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Venue dan Kontak</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Venue
                    </label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama venue atau tempat"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kontak
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nomor telepon atau email"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Lengkap
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Alamat lengkap event"
                    />
                  </div>
                </div>
              </div>

              {/* Seats / Packages */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Paket / Seats</h2>
                <div className="space-y-4">
                  {formData.seats.map((s, idx) => (
                    <div key={idx} className="border rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" placeholder="Nama paket" value={s.seat}
                          onChange={(e)=>updateSeatField(idx,'seat',e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg" />
                        <input type="number" placeholder="Harga" value={s.price}
                          onChange={(e)=>updateSeatField(idx,'price',e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg" />
                        <input type="text" placeholder="Deskripsi" value={s.desc}
                          onChange={(e)=>updateSeatField(idx,'desc',e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" placeholder="Fitur termasuk (koma)" value={Array.isArray(s.includes)? s.includes.join(', ') : s.includes}
                          onChange={(e)=>updateSeatField(idx,'includes', e.target.value.split(',').map(t=>t.trim()).filter(Boolean))}
                          className="w-full px-3 py-2 border rounded-lg" />
                        <input type="text" placeholder="Syarat (koma)" value={Array.isArray(s.terms_requirements)? s.terms_requirements.join(', ') : s.terms_requirements}
                          onChange={(e)=>updateSeatField(idx,'terms_requirements', e.target.value.split(',').map(t=>t.trim()).filter(Boolean))}
                          className="w-full px-3 py-2 border rounded-lg" />
                        <input type="text" placeholder="Pembatalan (koma)" value={Array.isArray(s.terms_cancellation)? s.terms_cancellation.join(', ') : s.terms_cancellation}
                          onChange={(e)=>updateSeatField(idx,'terms_cancellation', e.target.value.split(',').map(t=>t.trim()).filter(Boolean))}
                          className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div className="flex justify-end">
                        <button type="button" onClick={()=>removeSeat(idx)} className="text-red-600 text-sm">Hapus Paket</button>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addSeat} className="px-4 py-2 bg-blue-600 text-white rounded-lg">+ Tambah Paket</button>
                </div>
              </div>

              {/* Images */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Gambar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Kecil
                    </label>
                    <input
                      type="file"
                      name="img_sm"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {(imagePreviews.img_sm || currentImages.img_sm) && (
                      <div className="mt-2 relative">
                        <img
                          src={imagePreviews.img_sm || currentImages.img_sm}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded border"
                        />
                        {imagePreviews.img_sm && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('img_sm')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Besar
                    </label>
                    <input
                      type="file"
                      name="img_lg"
                      onChange={handleImageChange}
                      accept="image/*"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {(imagePreviews.img_lg || currentImages.img_lg) && (
                      <div className="mt-2 relative">
                        <img
                          src={imagePreviews.img_lg || currentImages.img_lg}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded border"
                        />
                        {imagePreviews.img_lg && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('img_lg')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Features and Status */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Fitur dan Status</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fitur (pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      name="features"
                      value={Array.isArray(formData.features) ? formData.features.join(', ') : formData.features}
                      onChange={(e) => {
                        const features = e.target.value.split(',').map(f => f.trim()).filter(f => f);
                        setFormData(prev => ({ ...prev, features }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Hiburan, Makanan, Musik, Workshop"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="recommended"
                      checked={formData.recommended}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Direkomendasikan
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Link
                  href="/admin/events"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
