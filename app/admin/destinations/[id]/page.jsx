'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminMapSelector from '@/components/AdminMapSelector';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function EditDestinationPage() {
  const router = useRouter();
  const params = useParams();
  const destinationId = params.id;
  
  // Get default coordinates based on location name
  const getDefaultCoordinates = (locationName) => {
    if (!locationName) return { lat: -7.4211, lng: 109.2344 }; // Default to Purwokerto
    
    const loc = locationName.toLowerCase();
    if (loc.includes('baturraden')) {
      return { lat: -7.3056, lng: 109.2194 };
    } else if (loc.includes('purwokerto')) {
      return { lat: -7.4211, lng: 109.2344 };
    } else if (loc.includes('ajibarang')) {
      return { lat: -7.4167, lng: 109.0667 };
    } else if (loc.includes('wangon')) {
      return { lat: -7.5167, lng: 109.0500 };
    }
    
    return { lat: -7.4211, lng: 109.2344 }; // Default to Purwokerto
  };
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'objek-wisata',
    entrance_fee: '',
    manager: '', // Pengelola Wisata
    contact: '', // Kontak (phone/whatsapp)
    address: '', // Alamat lengkap
    features: [], // Fitur & fasilitas
    recommended: false,
    date: '',
    short_description: ''
  });
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [imageFiles, setImageFiles] = useState({
    img_sm: null,
    img_lg: null
  });
  const [imagePreviews, setImagePreviews] = useState({
    img_sm: null,
    img_lg: null
  });
  const [pricing, setPricing] = useState({
    type: 'free', // 'free' | 'single' | 'packages'
    unit: 'per_tiket',
    value: '',
    packages: [] // { name, price, unit, imageFile, imagePreview, includes, terms }
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
            entrance_fee: destination.entrance_fee || '',
            manager: destination.manager || '', // Pengelola Wisata
            contact: destination.contact || '', // Kontak
            address: destination.address || '', // Alamat
            features: destination.features || [], // Fitur & fasilitas
            recommended: destination.recommended || false,
            short_description: destination.short_description || '',
            date: destination.date || ''
          });
          
          // Set coordinates if available
          if (destination.coordinates) {
            setCoordinates(destination.coordinates);
          } else {
            // Set default coordinates based on location
            const defaultCoords = getDefaultCoordinates(destination.location);
            setCoordinates(defaultCoords);
          }
          // Seed pricing from destination if exists
          if (destination.pricing) {
            const p = destination.pricing;
            setPricing({
              type: p.type || 'free',
              unit: p.unit || 'per_tiket',
              value: p.value != null ? String(p.value) : '',
              packages: Array.isArray(p.packages)
                ? p.packages.map((pkg) => ({
                    name: pkg.name || '',
                    price: pkg.price != null ? String(pkg.price) : '',
                    unit: pkg.unit || 'per_paket',
                    imageFile: null,
                    imagePreview: null,
                    includes: Array.isArray(pkg.includes) ? pkg.includes.join(', ') : (pkg.includes || ''),
                    terms: Array.isArray(pkg.terms) ? pkg.terms.join('\n') : (pkg.terms || '')
                  }))
                : []
            });
          }
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

  // Handle coordinates change
  const handleCoordinatesChange = (newCoordinates) => {
    setCoordinates(newCoordinates);
  };

  // Handle location change
  const handleLocationChange = (newLocation) => {
    setFormData(prev => ({
      ...prev,
      location: newLocation
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
        if (key === 'features') {
          // Send features as JSON string
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add coordinates if available
      if (coordinates.lat && coordinates.lng) {
        formDataToSend.append('coordinates', JSON.stringify(coordinates));
      }
      
      // Add image files
      if (imageFiles.img_sm) {
        formDataToSend.append('img_sm', imageFiles.img_sm);
      }
      if (imageFiles.img_lg) {
        formDataToSend.append('img_lg', imageFiles.img_lg);
      }

      // Attach pricing JSON
      formDataToSend.append('pricing', JSON.stringify({
        ...pricing,
        packages: pricing.packages.map(p => ({
          name: p.name || '',
          price: p.price ? Number(p.price) : null,
          unit: p.unit || 'per_paket',
          includes: p.includes ? p.includes.split(',').map(s => s.trim()).filter(Boolean) : [],
          terms: p.terms ? p.terms.split('\n').map(s => s.trim()).filter(Boolean) : []
        }))
      }));

      // Attach package images
      pricing.packages.forEach((p, idx) => {
        if (p.imageFile) {
          formDataToSend.append(`package_image_${idx}`, p.imageFile);
        }
      });

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

                  {/* Lokasi dengan Map Selector */}
                  <div className="md:col-span-2">
                    <AdminMapSelector
                      location={formData.location}
                      onLocationChange={handleLocationChange}
                      onCoordinatesChange={handleCoordinatesChange}
                      initialCoordinates={coordinates}
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



                  {/* Biaya Masuk */}
                  <div>
                    <label htmlFor="entrance_fee" className="block text-sm font-medium text-gray-700 mb-2">
                      Biaya Masuk
                    </label>
                    <input
                      type="text"
                      id="entrance_fee"
                      name="entrance_fee"
                      value={formData.entrance_fee}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Contoh: Rp 10.000 atau Gratis"
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

                  {/* Kontak */}
                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                      Kontak (Phone/WhatsApp)
                    </label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Contoh: 08123456789 atau +628123456789"
                    />
                    <p className="text-xs text-gray-500 mt-1">Masukkan nomor telepon atau WhatsApp</p>
                  </div>

                  {/* Alamat Lengkap */}
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Alamat Lengkap
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Alamat lengkap destinasi wisata..."
                    />
                  </div>

                  {/* Fitur & Fasilitas */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fitur & Fasilitas
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          'Parkir Luas',
                          'Toilet Umum',
                          'Musholla',
                          'Warung Makan',
                          'Tempat Istirahat',
                          'Pemandu Wisata',
                          'WiFi',
                          'Area Camping',
                          'Trekking Path',
                          'Photo Spot',
                          'Souvenir Shop',
                          'First Aid'
                        ].map((feature) => (
                          <label key={feature} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.features.includes(feature)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    features: [...prev.features, feature]
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    features: prev.features.filter(f => f !== feature)
                                  }));
                                }
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{feature}</span>
                          </label>
                        ))}
                      </div>
                      <div className="mt-3">
                        <input
                          type="text"
                          placeholder="Tambah fitur lain..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const newFeature = e.target.value.trim();
                              if (newFeature && !formData.features.includes(newFeature)) {
                                setFormData(prev => ({
                                  ...prev,
                                  features: [...prev.features, newFeature]
                                }));
                                e.target.value = '';
                              }
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400 text-sm"
                        />
                      </div>
                      {formData.features.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-600 mb-2">Fitur yang dipilih:</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.features.map((feature, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {feature}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      features: prev.features.filter((_, i) => i !== index)
                                    }));
                                  }}
                                  className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing (Baru) */}
                  <div className="md:col-span-2">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-3">Pricing</h3>
                      <div className="flex flex-wrap items-center gap-4 mb-3">
                        <label className="inline-flex items-center gap-2 text-gray-700 font-medium">
                          <input
                            type="radio"
                            name="pricing_type"
                            value="free"
                            checked={pricing.type === 'free'}
                            onChange={() => setPricing(prev => ({ ...prev, type: 'free' }))}
                          />
                          <span className="select-none">Gratis</span>
                        </label>
                        <label className="inline-flex items-center gap-2 text-gray-700 font-medium">
                          <input
                            type="radio"
                            name="pricing_type"
                            value="single"
                            checked={pricing.type === 'single'}
                            onChange={() => setPricing(prev => ({ ...prev, type: 'single' }))}
                          />
                          <span className="select-none">Satu Harga</span>
                        </label>
                        <label className="inline-flex items-center gap-2 text-gray-700 font-medium">
                          <input
                            type="radio"
                            name="pricing_type"
                            value="packages"
                            checked={pricing.type === 'packages'}
                            onChange={() => setPricing(prev => ({ ...prev, type: 'packages' }))}
                          />
                          <span className="select-none">Paket</span>
                        </label>
                        <select
                          value={pricing.unit}
                          onChange={(e) => setPricing(prev => ({ ...prev, unit: e.target.value }))}
                          className="ml-auto px-3 py-2 border border-gray-300 rounded-md text-sm"
                          title="Unit standar"
                        >
                          <option value="per_tiket">/ tiket</option>
                          <option value="per_orang">/ orang</option>
                          <option value="per_paket">/ paket</option>
                        </select>
                      </div>

                      {pricing.type === 'single' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Harga (IDR)</label>
                            <input
                              type="number"
                              min="0"
                              value={pricing.value}
                              onChange={(e) => setPricing(prev => ({ ...prev, value: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              placeholder="cth: 75000"
                            />
                          </div>
                          <div className="flex items-end">
                            <div className="text-sm text-gray-600 bg-white border rounded-md px-3 py-2">Ditampilkan sebagai: Rp X {pricing.unit.replace('_', ' ')}</div>
                          </div>
                        </div>
                      )}

                      {pricing.type === 'packages' && (
                        <div className="space-y-4">
                          {pricing.packages.map((pkg, idx) => (
                            <div key={idx} className="border rounded-md p-3 bg-white">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Paket</label>
                                  <input
                                    type="text"
                                    value={pkg.name || ''}
                                    onChange={(e) => setPricing(prev => ({
                                      ...prev,
                                      packages: prev.packages.map((p, i) => i === idx ? { ...p, name: e.target.value } : p)
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="cth: Paket Family"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Harga (IDR)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={pkg.price || ''}
                                    onChange={(e) => setPricing(prev => ({
                                      ...prev,
                                      packages: prev.packages.map((p, i) => i === idx ? { ...p, price: e.target.value } : p)
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="cth: 250000"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                  <select
                                    value={pkg.unit || 'per_paket'}
                                    onChange={(e) => setPricing(prev => ({
                                      ...prev,
                                      packages: prev.packages.map((p, i) => i === idx ? { ...p, unit: e.target.value } : p)
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  >
                                    <option value="per_paket">/ paket</option>
                                    <option value="per_orang">/ orang</option>
                                    <option value="per_tiket">/ tiket</option>
                                  </select>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Foto Paket (opsional)</label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      const reader = new FileReader();
                                      reader.onload = (ev) => {
                                        setPricing(prev => ({
                                          ...prev,
                                          packages: prev.packages.map((p, i) => i === idx ? { ...p, imageFile: file, imagePreview: ev.target?.result } : p)
                                        }));
                                      };
                                      reader.readAsDataURL(file);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                  />
                                  {pkg.imagePreview && (
                                    <img src={pkg.imagePreview} alt="preview" className="mt-2 w-24 h-16 object-cover rounded" />
                                  )}
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Termasuk (pisahkan dengan koma)</label>
                                  <input
                                    type="text"
                                    value={pkg.includes || ''}
                                    onChange={(e) => setPricing(prev => ({
                                      ...prev,
                                      packages: prev.packages.map((p, i) => i === idx ? { ...p, includes: e.target.value } : p)
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Guide, Snack, Transport"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Syarat & Ketentuan (1 per baris)</label>
                                  <textarea
                                    rows={3}
                                    value={pkg.terms || ''}
                                    onChange={(e) => setPricing(prev => ({
                                      ...prev,
                                      packages: prev.packages.map((p, i) => i === idx ? { ...p, terms: e.target.value } : p)
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    placeholder="Minimal 4 orang\nDP 50%"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-between mt-3">
                                <button
                                  type="button"
                                  onClick={() => setPricing(prev => ({ ...prev, packages: prev.packages.filter((_, i) => i !== idx) }))}
                                  className="text-red-600 hover:text-red-700 text-sm"
                                >
                                  Hapus Paket
                                </button>
                                <div className="text-xs text-gray-500 self-center">Preview: {pkg.name || 'Paket'} • Rp {pkg.price || '—'} {pkg.unit || '/paket'}</div>
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => setPricing(prev => ({ ...prev, packages: [...prev.packages, { name: '', price: '', unit: 'per_paket', imageFile: null, imagePreview: null, includes: '', terms: '' }] }))}
                            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                          >
                            + Tambah Paket
                          </button>
                        </div>
                      )}

                      {pricing.type === 'free' && (
                        <p className="text-sm text-gray-600">Harga akan ditampilkan sebagai <strong>Gratis</strong>.</p>
                      )}
                    </div>
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
