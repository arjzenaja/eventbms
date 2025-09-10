'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function EditSouvenir() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    location: '',
    category: 'souvenir',
    short_description: '',
    description: '',
    price_range: '',
    contact: '',
    address: '',
    coordinates: { lat: '', lng: '' },
    recommended: false,
    packages: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // Package form state
  const [packageForm, setPackageForm] = useState({
    name: '',
    description: '',
    price: '',
    items: []
  });

  const CustomSelect = ({ label, value, onChange, options }) => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        {label && (<label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>)}
        <button type="button" onClick={()=>setOpen(o=>!o)} className={`w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 flex items-center justify-between shadow-sm ${open ? 'border-amber-500 ring-2 ring-amber-500' : 'border-gray-300'}`}>
          <span className="font-medium truncate">{options.find(o=>o.value===value)?.label || value}</span>
          <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        {open && (
          <ul className="mt-2 max-h-64 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl">
            {options.map(opt => (
              <li key={opt.value}>
                <button type="button" onClick={() => { onChange(opt.value); setOpen(false); }} className={`w-full text-left px-4 py-2.5 hover:bg-amber-50 ${value===opt.value ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-gray-800'}`}>{opt.label}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const souvenirTypes = [
    { value: 'makanan', label: 'Makanan' },
    { value: 'pakaian', label: 'Pakaian' }
  ];

  const categories = [
    { value: 'souvenir', label: 'Souvenir' },
    { value: 'handicraft', label: 'Handicraft' },
    { value: 'local-product', label: 'Local Product' },
    { value: 'oleh-oleh', label: 'Oleh-oleh' }
  ];

  useEffect(() => {
    const fetchSouvenir = async () => {
      try {
        const response = await fetch(`/api/oleh_oleh/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setFormData({
            title: data.oleh_oleh.title || '',
            type: data.oleh_oleh.type || '',
            location: data.oleh_oleh.location || '',
            category: data.oleh_oleh.category || 'oleh-oleh',
            short_description: data.oleh_oleh.short_description || '',
            description: data.oleh_oleh.description || '',
            price_range: data.oleh_oleh.price_range || '',
            contact: data.oleh_oleh.contact || '',
            address: data.oleh_oleh.address || '',
            coordinates: data.oleh_oleh.coordinates || { lat: '', lng: '' },
            recommended: data.oleh_oleh.recommended || false,
            packages: data.oleh_oleh.packages || []
          });
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching souvenir:', error);
        setError('Terjadi kesalahan saat mengambil data oleh-oleh');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchSouvenir();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCoordinateChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [field]: value
      }
    }));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`File ${file.name} bukan gambar`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} terlalu besar (maksimal 5MB)`);
        return false;
      }
      return true;
    });

    setGalleryFiles(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGalleryPreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Package handlers
  const handlePackageInputChange = (e) => {
    const { name, value } = e.target;
    setPackageForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addPackage = () => {
    if (!packageForm.name || !packageForm.price) {
      alert('Nama paket dan harga harus diisi');
      return;
    }

    const newPackage = {
      id: Date.now().toString(),
      ...packageForm,
      price: parseInt(packageForm.price)
    };

    setFormData(prev => ({
      ...prev,
      packages: [...prev.packages, newPackage]
    }));

    // Reset package form
    setPackageForm({
      name: '',
      description: '',
      price: '',
      items: []
    });
  };

  const removePackage = (packageId) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.filter(pkg => pkg.id !== packageId)
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
        if (key === 'coordinates' || key === 'packages') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add gallery files
      galleryFiles.forEach((file, index) => {
        formDataToSend.append(`gallery_${index}`, file);
      });

      const response = await fetch(`/api/oleh_oleh/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        alert('Oleh-oleh berhasil diperbarui!');
        router.push('/admin/souvenirs');
      } else {
        alert('Gagal memperbarui oleh-oleh: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating souvenir:', error);
      alert('Terjadi kesalahan saat memperbarui oleh-oleh');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data oleh-oleh..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data oleh-oleh"
        />
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
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8l-2 4h4l-2 4"/></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Edit Oleh-Oleh</h1>
                  <p className="mt-1 text-sm text-gray-500">Perbarui data toko oleh-oleh, harga, dan galeri.</p>
                </div>
              </div>
              <Link href="/admin/souvenirs" className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">← Kembali</Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                                     <label className="block text-sm font-medium text-gray-700 mb-2">
                     Nama Oleh-Oleh *
                   </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                         placeholder="Masukkan nama oleh-oleh"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan lokasi"
                  />
                </div>

                <div>
                  <CustomSelect
                    label="Tipe *"
                    value={formData.type}
                    onChange={(v)=>handleInputChange({ target:{ name:'type', value:v }})}
                    options={souvenirTypes}
                  />
                </div>

                <div>
                  <CustomSelect
                    label="Kategori"
                    value={formData.category}
                    onChange={(v)=>handleInputChange({ target:{ name:'category', value:v }})}
                    options={categories}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Range Harga
                  </label>
                  <input
                    type="text"
                    name="price_range"
                    value={formData.price_range}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Rp 10.000 - 50.000"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nomor telepon atau email"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Lengkap
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan alamat lengkap"
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <input
                    type="text"
                    name="lat"
                    value={formData.coordinates.lat}
                    onChange={(e)=>handleCoordinateChange('lat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="-7.123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="text"
                    name="lng"
                    value={formData.coordinates.lng}
                    onChange={(e)=>handleCoordinateChange('lng', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="109.123456"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Deskripsi singkat (maksimal 100 karakter)"
                    maxLength={100}
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
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                         placeholder="Deskripsi lengkap tentang oleh-oleh"
                  />
                </div>
              </div>

              {/* Gallery */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Galeri Gambar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {galleryPreviews.map((src, idx) => (
                      <div key={idx} className="relative group">
                        <img src={src} alt={`preview-${idx}`} className="w-full h-32 object-cover rounded-lg border" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="recommended"
                  checked={formData.recommended}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Tandai sebagai rekomendasi
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <Link
                  href="/admin/souvenirs"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
