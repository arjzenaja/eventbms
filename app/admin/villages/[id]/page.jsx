'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function EditVillagePage() {
  const router = useRouter();
  const params = useParams();
  const villageId = params.id;
  
  const [form, setForm] = useState({
    title: '',
    location: '',
    short_description: '',
    description: '',
    type: 'desa',
    category: 'Desa Wisata',
    contact: '',
    address: '',
    coordinates: { lat: '', lng: '' },
    features: ['Budaya Lokal', 'Akomodasi Homestay'],
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
  const [currentImages, setCurrentImages] = useState({
    img_sm: '',
    img_lg: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const CustomSelect = ({ label, value, onChange, options }) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        {label && (<label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>)}
        <button type="button" onClick={()=>setOpen(o=>!o)} className={`w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 flex items-center justify-between shadow-sm ${open ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-gray-300'}`}>
          <span className="font-medium truncate">{options.find(o=>o.value===value)?.label || value}</span>
          <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        {open && (
          <ul className="mt-2 max-h-64 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl">
            {options.map(opt => (
              <li key={opt.value}>
                <button type="button" onClick={() => { onChange(opt.value); setOpen(false); }} className={`w-full text-left px-4 py-2.5 hover:bg-indigo-50 ${value===opt.value ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-800'}`}>{opt.label}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  useEffect(() => {
    const fetchVillage = async () => {
      try {
        const response = await fetch(`/api/villages/${villageId}`);
        const data = await response.json();
        
        if (data.success) {
          const village = data.village;
          setForm({
            title: village.title || '',
            location: village.location || '',
            short_description: village.short_description || '',
            description: village.description || '',
            type: village.type || 'desa',
            category: village.category || 'Desa Wisata',
            contact: village.contact || '',
            address: village.address || '',
            coordinates: {
              lat: village.coordinates?.latitude || village.coordinates?.lat || '',
              lng: village.coordinates?.longitude || village.coordinates?.lng || ''
            },
            features: village.features || ['Budaya Lokal', 'Akomodasi Homestay'],
            recommended: village.recommended || false,
          });
          setCurrentImages({
            img_sm: village.img_sm || '',
            img_lg: village.img_lg || ''
          });
        } else {
          setError(data.message || 'Gagal memuat data desa wisata');
        }
      } catch (error) {
        console.error('Error fetching village:', error);
        setError('Terjadi kesalahan saat memuat data desa wisata');
      } finally {
        setIsLoading(false);
      }
    };

    if (villageId) {
      fetchVillage();
    }
  }, [villageId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCoordinateChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [field]: value
      }
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
      Object.keys(form).forEach(key => {
        if (key === 'features') {
          formDataToSend.append(key, JSON.stringify(form[key]));
        } else {
          formDataToSend.append(key, form[key]);
        }
      });
      
      // Add image files
      if (imageFiles.img_sm) {
        formDataToSend.append('img_sm', imageFiles.img_sm);
      }
      if (imageFiles.img_lg) {
        formDataToSend.append('img_lg', imageFiles.img_lg);
      }

      const response = await fetch(`/api/villages/${villageId}`, {
        method: 'PUT',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        alert('Desa wisata berhasil diperbarui!');
        router.push('/admin/villages');
      } else {
        alert(data.message || 'Gagal memperbarui desa wisata');
      }
    } catch (error) {
      console.error('Error updating village:', error);
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Error</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <div className="space-x-3">
                <Link
                  href="/admin/villages"
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Kembali ke Desa Wisata
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
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7l9-4 9 4-9 4-9-4z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7v10l-9 4-9-4V7"/></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Edit Desa Wisata</h1>
                  <p className="mt-1 text-sm text-gray-500">Perbarui info desa wisata, koordinat, gambar, dan fitur.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/villages/${villageId}/view`} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Lihat</Link>
                <Link href="/admin/villages" className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">← Kembali</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Desa Wisata *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan judul desa wisata"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan lokasi desa wisata"
                    />
                  </div>

                  <div>
                    <CustomSelect
                      label="Tipe Desa"
                      value={form.type}
                      onChange={(v)=>handleChange({ target:{ name:'type', value:v }})}
                      options={[
                        { value:'desa', label:'Desa Wisata' },
                        { value:'kampung', label:'Kampung Wisata' },
                        { value:'kelurahan', label:'Kelurahan Wisata' }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Kategori desa wisata"
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
                      value={form.short_description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Deskripsi singkat desa wisata"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Lengkap
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Deskripsi lengkap desa wisata"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Kontak</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kontak
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value={form.contact}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nomor telepon atau email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Lengkap
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Alamat lengkap desa wisata"
                    />
                  </div>
                </div>
              </div>

              {/* Koordinat Lokasi */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">📍 Koordinat Lokasi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude (Latitude)
                    </label>
                    <input
                      type="text"
                      value={form.coordinates.lat}
                      onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: -7.123456"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: -7.123456 (negatif untuk belahan bumi selatan)</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude (Longitude)
                    </label>
                    <input
                      type="text"
                      value={form.coordinates.lng}
                      onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: 109.123456"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: 109.123456 (positif untuk belahan bumi timur)</p>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Cara mendapatkan koordinat:</strong>
                  </p>
                  <ul className="text-xs text-blue-700 mt-1 space-y-1">
                    <li>• Buka Google Maps dan cari lokasi desa wisata</li>
                    <li>• Klik kanan pada lokasi dan pilih "What's here?"</li>
                    <li>• Koordinat akan muncul di bagian bawah</li>
                    <li>• Atau gunakan aplikasi GPS di smartphone</li>
                  </ul>
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
                      value={Array.isArray(form.features) ? form.features.join(', ') : form.features}
                      onChange={(e) => {
                        const features = e.target.value.split(',').map(f => f.trim()).filter(f => f);
                        setForm(prev => ({ ...prev, features }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Budaya Lokal, Akomodasi Homestay, Kuliner Tradisional"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="recommended"
                      checked={form.recommended}
                      onChange={handleChange}
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
                  href="/admin/villages"
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
