'use client';

import { useState, useRef, useEffect } from 'react';
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
    coordinates: { lat: '', lng: '' },
    features: ['Produk Lokal', 'Kualitas Terjamin'],
    recommended: false,
    packages: []
  });
  const [imageFiles, setImageFiles] = useState({
    img_sm: null,
    img_lg: null
  });
  const [imagePreviews, setImagePreviews] = useState({
    img_sm: null,
    img_lg: null
  });
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Dropdown state
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isTypeDropdownShown, setIsTypeDropdownShown] = useState(false);
  const typeDropdownRef = useRef(null);
  
  // Package form state
  const [packageForm, setPackageForm] = useState({
    name: '',
    description: '',
    price: '',
    items: []
  });

  // Type options for dropdown
  const typeOptions = [
    { value: '', label: 'Pilih jenis', icon: '📋' },
    { value: 'makanan', label: 'Makanan', icon: '🍽️' },
    { value: 'pakaian', label: 'Pakaian', icon: '👕' },
    { value: 'kerajinan', label: 'Kerajinan', icon: '🎨' },
    { value: 'aksesoris', label: 'Aksesoris', icon: '💍' }
  ];

  // Get current type label
  const getTypeLabel = (value) => {
    const option = typeOptions.find(opt => opt.value === value);
    return option ? option.label : 'Pilih jenis';
  };

  // Dropdown management
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        closeTypeDropdown();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeTypeDropdown();
      }
    };

    if (isTypeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      // Trigger animation after state update
      setTimeout(() => setIsTypeDropdownShown(true), 10);
    } else {
      setIsTypeDropdownShown(false);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isTypeDropdownOpen]);

  const openTypeDropdown = () => {
    setIsTypeDropdownOpen(true);
  };

  const closeTypeDropdown = () => {
    setIsTypeDropdownShown(false);
    setTimeout(() => setIsTypeDropdownOpen(false), 150);
  };

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

      // Add gallery files
      galleryFiles.forEach((file, index) => {
        formDataToSend.append(`gallery_${index}`, file);
      });

      // Add coordinates as JSON string
      formDataToSend.append('coordinates', JSON.stringify(formData.coordinates));
      
      // Add packages as JSON string
      formDataToSend.append('packages', JSON.stringify(formData.packages));

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
        {/* Header */}
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4 8 4-8 4-8-4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7v10l-9 4-9-4V7" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Tambah Oleh-oleh Baru</h1>
                </div>
                <p className="mt-2 text-sm text-gray-500">Buat oleh-oleh baru dengan informasi lengkap dan menarik.</p>
              </div>
              <Link
                href="/admin/souvenirs"
                className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Kembali</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <form onSubmit={handleSubmit} className="p-8">
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Basic Information Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Informasi Dasar</h2>
                  </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative" ref={typeDropdownRef}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Jenis Oleh-oleh
                    </label>
                      <button
                        type="button"
                        onClick={() => (isTypeDropdownOpen ? closeTypeDropdown() : openTypeDropdown())}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between shadow-sm transform hover:scale-[1.01] active:scale-95"
                        aria-haspopup="listbox"
                        aria-expanded={isTypeDropdownOpen}
                      >
                        <span className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M3 12h18M3 20h18" />
                          </svg>
                          <span className="text-gray-900 font-medium">{getTypeLabel(formData.type)}</span>
                        </span>
                        <svg className={`w-4 h-4 text-gray-500 transition-transform ${isTypeDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isTypeDropdownOpen && (
                        <div className="relative">
                          <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl transform transition duration-150 ease-out origin-top scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${isTypeDropdownShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`} style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }}>
                            {typeOptions.map((option) => (
                              <li key={option.value}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, type: option.value }));
                                    closeTypeDropdown();
                                  }}
                                  className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 outline-none ${formData.type === option.value ? 'bg-blue-50' : ''}`}
                                >
                                  <span className="flex items-center gap-3">
                                    <span className="text-xl leading-none">{option.icon}</span>
                                    <span className={`text-sm ${formData.type === option.value ? 'text-blue-700 font-semibold' : 'text-gray-800'}`}>{option.label}</span>
                                  </span>
                                  {formData.type === option.value && (
                                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>

                  <div>
                      <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Produk <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder={formData.type === 'makanan' ? 'Contoh: Getuk Goreng Sokaraja' : 'Contoh: Batik Gajah Uling'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                    />
                  </div>

                  <div className="md:col-span-2">
                      <label htmlFor="short_description" className="block text-sm font-semibold text-gray-700 mb-2">
                      Penjelasan Singkat
                    </label>
                    <input
                      type="text"
                      id="short_description"
                      name="short_description"
                      value={formData.short_description}
                      onChange={handleInputChange}
                      placeholder="Ringkas: 1-2 kalimat"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                    />
                  </div>

                  <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 resize-none"
                    />
                  </div>
                  </div>
                </div>

                {/* Location & Contact Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Lokasi & Kontak</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                      <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                        Lokasi Toko/Produsen <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder={formData.type === 'makanan' ? 'Contoh: Sentra Oleh-oleh ...' : 'Contoh: Galeri Batik ...'}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                      <label htmlFor="contact" className="block text-sm font-semibold text-gray-700 mb-2">
                      Kontak Penjual
                    </label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="HP/WA/Instagram/Marketplace"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                    />
                  </div>

                  <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Koordinat Lokasi
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                        <input
                          type="text"
                          value={formData.coordinates.lat}
                          onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                          placeholder="Contoh: -6.2088"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Longitude</label>
                        <input
                          type="text"
                          value={formData.coordinates.lng}
                          onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                          placeholder="Contoh: 106.8456"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                      Alamat Lengkap
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={2}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Alamat toko/sentra oleh-oleh"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 resize-none"
                    />
                  </div>

                  <div>
                      <label htmlFor="price_range" className="block text-sm font-semibold text-gray-700 mb-2">
                      Range Harga
                    </label>
                    <input
                      type="text"
                      id="price_range"
                      name="price_range"
                      value={formData.price_range}
                      onChange={handleInputChange}
                      placeholder="Contoh: 25.000 - 100.000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                    />
                  </div>

                  <div>
                      <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      placeholder="Contoh: Makanan, Pakaian, Kerajinan"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                    />
                    </div>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Gambar Oleh-oleh</h2>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="img_sm" className="block text-sm font-semibold text-gray-700 mb-2">
                        Gambar Kecil (untuk Card/Thumbnail)
                      </label>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <p className="text-sm text-blue-800 font-medium mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Digunakan untuk:
                          </p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>• Card oleh-oleh di halaman utama</li>
                          <li>• Thumbnail di list pencarian</li>
                          <li>• Preview di kategori makanan/pakaian</li>
                          <li>• Tampilan mobile yang responsif</li>
                        </ul>
                          <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <strong>Rekomendasi:</strong> Gunakan gambar dengan rasio 1:1 (persegi) untuk hasil terbaik
                          </p>
                      </div>
                      <input
                        type="file"
                        id="img_sm"
                        name="img_sm"
                        accept="image/*"
                        onChange={handleImageChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm transition-all duration-200"
                      />
                      {imagePreviews.img_sm && (
                          <div className="mt-3 relative inline-block">
                          <img 
                            src={imagePreviews.img_sm} 
                            alt="Preview Gambar Kecil" 
                              className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('img_sm')}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold shadow-sm"
                            title="Hapus gambar"
                          >
                            ×
                          </button>
                        </div>
                      )}
                        <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG, GIF. Maksimal 5MB</p>
                    </div>

                    <div>
                        <label htmlFor="img_lg" className="block text-sm font-semibold text-gray-700 mb-2">
                        Gambar Besar (untuk Detail/Hero)
                      </label>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <p className="text-sm text-green-800 font-medium mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Digunakan untuk:
                          </p>
                        <ul className="text-xs text-green-700 space-y-1">
                          <li>• Halaman detail oleh-oleh</li>
                          <li>• Hero section yang menarik</li>
                          <li>• Galeri foto berkualitas tinggi</li>
                          <li>• Tampilan desktop yang optimal</li>
                        </ul>
                          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <strong>Rekomendasi:</strong> Gunakan gambar landscape (16:9) atau portrait (4:3) dengan resolusi tinggi
                          </p>
                      </div>
                      <input
                        type="file"
                        id="img_lg"
                        name="img_lg"
                        accept="image/*"
                        onChange={handleImageChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm transition-all duration-200"
                      />
                      {imagePreviews.img_lg && (
                          <div className="mt-3 relative inline-block">
                          <img 
                            src={imagePreviews.img_lg} 
                            alt="Preview Gambar Besar" 
                              className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('img_lg')}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold shadow-sm"
                            title="Hapus gambar"
                          >
                            ×
                          </button>
                        </div>
                      )}
                        <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG, GIF. Maksimal 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gallery Upload Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Galeri Foto</h2>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-purple-800 font-medium mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Galeri Foto:
                      </p>
                    <ul className="text-xs text-purple-700 space-y-1">
                      <li>• Tambahkan foto-foto produk dari berbagai sudut</li>
                      <li>• Foto proses pembuatan/produksi</li>
                      <li>• Foto suasana toko/sentra</li>
                      <li>• Maksimal 10 foto per oleh-oleh</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm transition-all duration-200"
                    />
                      <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG, GIF. Maksimal 5MB per foto. Pilih multiple file untuk upload sekaligus.</p>
                  </div>

                  {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {galleryPreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={preview} 
                            alt={`Gallery ${index + 1}`} 
                              className="w-full h-24 object-cover rounded-lg border shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold shadow-sm"
                            title="Hapus foto"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  </div>
                </div>

                {/* Package Management Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4 8 4-8 4-8-4z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7v10l-9 4-9-4V7" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Paket Oleh-oleh / Daftar Harga</h2>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                      <p className="text-sm text-orange-800 font-medium mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4 8 4-8 4-8-4z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7v10l-9 4-9-4V7" />
                        </svg>
                        Paket Oleh-oleh:
                      </p>
                    <ul className="text-xs text-orange-700 space-y-1">
                      <li>• Buat paket dengan berbagai kombinasi produk</li>
                      <li>• Setiap paket bisa berisi multiple item</li>
                      <li>• Harga paket biasanya lebih hemat dari beli satuan</li>
                      <li>• Contoh: Paket Batik 3 Pcs, Paket Makanan Khas</li>
                    </ul>
                  </div>

                  {/* Package Form */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Tambah Paket Baru</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Paket</label>
                        <input
                          type="text"
                          name="name"
                          value={packageForm.name}
                          onChange={handlePackageInputChange}
                          placeholder="Contoh: Paket Batik 3 Pcs"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                        />
                      </div>
                      <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Harga (Rp)</label>
                        <input
                          type="number"
                          name="price"
                          value={packageForm.price}
                          onChange={handlePackageInputChange}
                          placeholder="150000"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={addPackage}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
                        >
                          + Tambah Paket
                        </button>
                      </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Paket</label>
                      <textarea
                        name="description"
                        value={packageForm.description}
                        onChange={handlePackageInputChange}
                        placeholder="Contoh: Paket berisi 3 pcs batik dengan motif berbeda, cocok untuk oleh-oleh keluarga"
                        rows={2}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 resize-none"
                      />
                    </div>
                  </div>

                  {/* Package List */}
                  {formData.packages.length > 0 && (
                      <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Paket yang Ditambahkan</h4>
                        <div className="space-y-4">
                        {formData.packages.map((pkg, index) => (
                            <div key={pkg.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex-1">
                                <h5 className="font-semibold text-gray-900">{pkg.name}</h5>
                              {pkg.description && (
                                <p className="text-sm text-gray-600 mt-1">{pkg.description}</p>
                              )}
                                <p className="text-sm font-semibold text-green-600 mt-2">
                                Rp {pkg.price.toLocaleString()}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removePackage(pkg.id)}
                                className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Hapus paket"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  </div>
                </div>

                {/* Additional Settings Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Pengaturan Tambahan</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="features" className="block text-sm font-semibold text-gray-700 mb-2">
                    Fitur/Keunggulan
                  </label>
                  <textarea
                    id="features"
                    name="features"
                        rows={3}
                    value={formData.features.join(', ')}
                    onChange={(e) => {
                      const featuresArray = e.target.value.split(',').map(f => f.trim()).filter(f => f);
                      setFormData(prev => ({
                        ...prev,
                        features: featuresArray
                      }));
                    }}
                    placeholder="Contoh: Produk Lokal, Kualitas Terjamin, Halal, Bisa Dipesan Online"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 resize-none"
                  />
                      <p className="text-xs text-gray-500 mt-2">Pisahkan dengan koma untuk multiple fitur</p>
                </div>

                    <div>
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      id="recommended"
                      name="recommended"
                      checked={formData.recommended}
                      onChange={handleInputChange}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                        <label htmlFor="recommended" className="ml-3 block text-sm font-semibold text-gray-900">
                      Tandai sebagai oleh-oleh yang direkomendasikan
                    </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Link
                    href="/admin/souvenirs"
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menyimpan...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Simpan Oleh-oleh
                      </span>
                    )}
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


