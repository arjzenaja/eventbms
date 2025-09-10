'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import GalleryUploader from '@/components/GalleryUploader';

function CustomSelect({ label, value, onChange, options, className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const current = options.find(o => o.value === value) || options[0];
  return (
    <div className={className} ref={ref}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <button type="button" onClick={() => setOpen(o => !o)} className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 flex items-center justify-between shadow-sm ${open ? 'border-indigo-500' : 'border-gray-300'}`}>
        <span className="flex items-center gap-3">
          <span className="text-xl leading-none">{current?.icon}</span>
          <span className="font-medium truncate">{current?.label}</span>
        </span>
        <svg className={`w-5 h-5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd"/></svg>
      </button>
      {open && (
        <div className="relative">
          <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="max-h-72 overflow-y-auto">
              {options.map(opt => (
                <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setOpen(false); }} className={`w-full px-4 py-3 flex items-center justify-between text-left hover:bg-indigo-50 ${value === opt.value ? 'bg-indigo-50' : ''}`}>
                  <span className="flex items-center gap-3">
                    <span className="text-xl leading-none">{opt.icon}</span>
                    <span className={`font-medium ${value === opt.value ? 'text-indigo-700' : 'text-gray-900'}`}>{opt.label}</span>
                  </span>
                  {value === opt.value && <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewCulinaryItem() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    short_description: '',
    type: 'cafe',
    price_range: '25.000 - 50.000',
    cuisine: 'Indonesia',
    opening_hours: '10:00 - 22:00',
    contact: '',
    address: '',
    features: ['Masakan Indonesia', 'Suasana Nyaman'],
    recommended: false,
    // Field tambahan yang ada di halaman detail
    manager: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    gallery: [],
    menu: [],
    category: 'Kuliner',
    // Field baru yang perlu ditambahkan
    rating: '',
    instagram: '',
    slug: '',
    coordinates: { lat: '', lng: '' },
    halal_status: false,
    delivery_available: false,
    reservation_available: false
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
  const [galleryFiles, setGalleryFiles] = useState([]);

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
        if (key === 'features') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'coordinates') {
          // Handle coordinates specially
          if (formData[key] && typeof formData[key] === 'object') {
            formDataToSend.append('latitude', formData[key].lat || '');
            formDataToSend.append('longitude', formData[key].lng || '');
            formDataToSend.append('coordinates', JSON.stringify(formData[key]));
          }
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
      // Add gallery files
      if (galleryFiles && galleryFiles.length > 0) {
        galleryFiles.forEach((file) => formDataToSend.append('gallery[]', file));
      }

      const response = await fetch('/api/kuliner', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        alert('Item kuliner berhasil ditambahkan!');
        router.push('/admin/culinary');
      } else {
        alert('Gagal menambahkan item kuliner: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating culinary item:', error);
      alert('Terjadi kesalahan saat membuat item kuliner');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <svg className="w-8 h-8 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Tambah Item Kuliner Baru</h1>
                  <p className="text-gray-600 mt-1">Buat item kuliner baru untuk ditambahkan ke sistem</p>
                </div>
              </div>
              <Link 
                href="/admin/culinary" 
                className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <form onSubmit={handleSubmit} className="space-y-8 p-8">
                {/* Basic Information Section */}
                <div className="border-b border-gray-200 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Informasi Dasar</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Kuliner <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          required
                          value={formData.title}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                          placeholder="Masukkan nama kuliner"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                        Lokasi <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          required
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                          placeholder="Masukkan lokasi"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                      Deskripsi <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200 resize-none"
                      placeholder="Masukkan deskripsi kuliner yang lengkap"
                    />
                  </div>

                  <div className="mt-6">
                    <label htmlFor="short_description" className="block text-sm font-semibold text-gray-700 mb-2">
                      Deskripsi Singkat
                    </label>
                    <textarea
                      id="short_description"
                      name="short_description"
                      rows={2}
                      value={formData.short_description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200 resize-none"
                      placeholder="Masukkan deskripsi singkat (opsional)"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Deskripsi singkat akan digunakan untuk preview di card dan list
                    </p>
                  </div>
                </div>

                {/* Category & Type Section */}
                <div className="border-b border-gray-200 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Kategori & Jenis Kuliner</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomSelect
                      label="Tipe Kuliner *"
                      value={formData.type}
                      onChange={(v) => setFormData(prev => ({ ...prev, type: v }))}
                      options={[
                        { value: 'cafe', label: 'Cafe', icon: '☕' },
                        { value: 'resto', label: 'Resto', icon: '🍽️' },
                        { value: 'kedai', label: 'Kedai', icon: '🥤' },
                        { value: 'warung', label: 'Warung', icon: '🍛' },
                        { value: 'rumah-makan', label: 'Rumah Makan', icon: '🏠' },
                      ]}
                    />

                    <div>
                      <label htmlFor="price_range" className="block text-sm font-semibold text-gray-700 mb-2">
                        Range Harga <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="price_range"
                          name="price_range"
                          required
                          value={formData.price_range}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                          placeholder="Contoh: 25.000 - 50.000"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="cuisine" className="block text-sm font-semibold text-gray-700 mb-2">
                        Jenis Masakan <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="cuisine"
                          name="cuisine"
                          required
                          value={formData.cuisine}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                          placeholder="Contoh: Indonesia, Jawa, Chinese, Western"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="border-b border-gray-200 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Informasi Tambahan</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="rating" className="block text-sm font-semibold text-gray-700 mb-2">
                        Rating (1-5)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                        <input
                          type="number"
                          id="rating"
                          name="rating"
                          min="1"
                          max="5"
                          step="0.1"
                          value={formData.rating}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                          placeholder="Contoh: 4.5"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Rating kuliner dari 1-5 (opsional)
                      </p>
                    </div>

                    <div>
                      <label htmlFor="instagram" className="block text-sm font-semibold text-gray-700 mb-2">
                        Instagram
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="instagram"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                          placeholder="Contoh: @kulinerbanyumas atau username tanpa @"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Username Instagram kuliner (opsional)
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-2">
                        URL Slug
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="slug"
                          name="slug"
                          value={formData.slug}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                          placeholder="Contoh: warung-mendoan-banyumas"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        URL slug untuk routing (akan dibuat otomatis jika kosong)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location & Contact Section */}
                <div className="border-b border-gray-200 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Lokasi & Kontak</h2>
                  </div>
                  
                  {/* Koordinat Lokasi */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Koordinat Lokasi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="lat" className="block text-sm font-semibold text-gray-700 mb-2">
                          Latitude
                        </label>
                        <input
                          type="number"
                          id="lat"
                          name="lat"
                          step="any"
                          value={formData.coordinates?.lat || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            coordinates: { ...prev.coordinates, lat: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                          placeholder="Contoh: -7.3056"
                        />
                      </div>
                      <div>
                        <label htmlFor="lng" className="block text-sm font-semibold text-gray-700 mb-2">
                          Longitude
                        </label>
                        <input
                          type="number"
                          id="lng"
                          name="lng"
                          step="any"
                          value={formData.coordinates?.lng || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            coordinates: { ...prev.coordinates, lng: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                          placeholder="Contoh: 109.2194"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Koordinat untuk menampilkan lokasi di peta (opsional)
                    </p>
                  </div>

                  {/* Status Kuliner */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Status Kuliner
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <input
                          type="checkbox"
                          id="halal_status"
                          name="halal_status"
                          checked={formData.halal_status}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="halal_status" className="ml-3 block text-sm font-medium text-gray-900">
                          Makanan Halal
                        </label>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <input
                          type="checkbox"
                          id="delivery_available"
                          name="delivery_available"
                          checked={formData.delivery_available}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="delivery_available" className="ml-3 block text-sm font-medium text-gray-900">
                          Tersedia Delivery
                        </label>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <input
                          type="checkbox"
                          id="reservation_available"
                          name="reservation_available"
                          checked={formData.reservation_available}
                          onChange={handleInputChange}
                          className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor="reservation_available" className="ml-3 block text-sm font-medium text-gray-900">
                          Tersedia Reservasi
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Jam Operasional & Kontak */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="opening_hours" className="block text-sm font-semibold text-gray-700 mb-2">
                        Jam Operasional <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="opening_hours"
                          name="opening_hours"
                          required
                          value={formData.opening_hours}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                          placeholder="Contoh: 10:00 - 22:00"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact" className="block text-sm font-semibold text-gray-700 mb-2">
                        Kontak
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="contact"
                          name="contact"
                          value={formData.contact}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                          placeholder="Nomor telepon atau WhatsApp"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Manager Information Section */}
                <div className="border-b border-gray-200 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <svg className="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Informasi Pengelola</h2>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                      Alamat Lengkap
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={2}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200 resize-none"
                      placeholder="Alamat lengkap (opsional, akan menggunakan lokasi jika kosong)"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Detail Pengelola
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="manager" className="block text-sm font-semibold text-gray-700 mb-2">
                          Nama Pengelola
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="manager"
                            name="manager"
                            value={formData.manager}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                            placeholder="Nama pemilik atau pengelola"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                          Nomor Telepon
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                            placeholder="Nomor telepon utama"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 mb-2">
                          WhatsApp
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="whatsapp"
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                            placeholder="Nomor WhatsApp"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                            placeholder="Email pengelola (opsional)"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Email pengelola kuliner (opsional - bisa dikosongkan jika tidak ada)
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">
                          Website <span className="text-gray-500 text-sm font-normal">(opsional)</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                            </svg>
                          </div>
                          <input
                            type="url"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                            placeholder="https://website.com (kosongkan jika tidak ada)"
                          />
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Kosongkan jika kuliner tidak memiliki website
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu & Features Section */}
                <div className="border-b border-gray-200 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <svg className="w-6 h-6 text-pink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Menu & Fitur</h2>
                  </div>
                  
                  {/* Menu Section */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Menu Makanan
                    </h3>
                    <div>
                      <label htmlFor="menu" className="block text-sm font-semibold text-gray-700 mb-2">
                        Daftar Menu (Opsional)
                      </label>
                      <textarea
                        id="menu"
                        name="menu"
                        rows={4}
                        value={formData.menu.join('\n')}
                        onChange={(e) => {
                          const menuArray = e.target.value.split('\n').map(item => item.trim()).filter(item => item);
                          setFormData(prev => ({ ...prev, menu: menuArray }));
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200 resize-none"
                        placeholder="Masukkan menu satu per baris&#10;Contoh:&#10;Mendoan Tempe - Rp 8.000&#10;Soto Sokaraja - Rp 18.000&#10;Getuk Goreng - Rp 10.000"
                      />
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Masukkan menu satu per baris. Format: Nama Menu - Harga
                      </p>
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Fitur & Fasilitas
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {['Masakan Tradisional', 'Harga Terjangkau', 'Suasana Nyaman', 'Parkir Luas', 'WiFi Gratis', 'Live Music', 'Delivery', 'Reservasi'].map(feature => (
                        <label key={feature} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.features.includes(feature)}
                            onChange={() => {
                              setFormData(prev => ({
                                ...prev,
                                features: prev.features.includes(feature)
                                  ? prev.features.filter(f => f !== feature)
                                  : [...prev.features, feature]
                              }));
                            }}
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm font-medium text-gray-900">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="border-b border-gray-200 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <svg className="w-6 h-6 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Gambar Kuliner</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="img_sm" className="block text-sm font-semibold text-gray-700 mb-2">
                        Gambar Kecil (untuk Card/Thumbnail)
                      </label>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                        <p className="text-sm text-blue-800 font-semibold mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          Digunakan untuk:
                        </p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>• Card kuliner di halaman utama</li>
                          <li>• Thumbnail di list pencarian</li>
                          <li>• Preview di kategori makanan</li>
                          <li>• Tampilan mobile yang responsif</li>
                        </ul>
                        <p className="text-xs text-blue-600 mt-3 flex items-center gap-1">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 shadow-sm transition-all duration-200"
                      />
                      {imagePreviews.img_sm && (
                        <div className="mt-3 relative inline-block">
                          <img 
                            src={imagePreviews.img_sm} 
                            alt="Preview Gambar Kecil" 
                            className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('img_sm')}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold shadow-lg"
                            title="Hapus gambar"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Format: JPG, PNG, GIF. Maksimal 5MB
                      </p>
                    </div>

                    <div>
                      <label htmlFor="img_lg" className="block text-sm font-semibold text-gray-700 mb-2">
                        Gambar Besar (untuk Detail/Hero)
                      </label>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                        <p className="text-sm text-green-800 font-semibold mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Digunakan untuk:
                        </p>
                        <ul className="text-xs text-green-700 space-y-1">
                          <li>• Halaman detail kuliner</li>
                          <li>• Hero section yang menarik</li>
                          <li>• Galeri foto berkualitas tinggi</li>
                          <li>• Tampilan desktop yang optimal</li>
                        </ul>
                        <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 shadow-sm transition-all duration-200"
                      />
                      {imagePreviews.img_lg && (
                        <div className="mt-3 relative inline-block">
                          <img 
                            src={imagePreviews.img_lg} 
                            alt="Preview Gambar Besar" 
                            className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('img_lg')}
                            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold shadow-lg"
                            title="Hapus gambar"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Format: JPG, PNG, GIF. Maksimal 5MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <GalleryUploader files={galleryFiles} setFiles={setGalleryFiles} />
                  </div>
                </div>

                {/* Submit Section */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <input
                        type="checkbox"
                        id="recommended"
                        name="recommended"
                        checked={formData.recommended}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <label htmlFor="recommended" className="ml-3 block text-sm font-semibold text-gray-900">
                        Rekomendasikan item ini
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Link
                      href="/admin/culinary"
                      className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Batal
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform transition-all duration-200 hover:scale-105 active:scale-95 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Simpan Item Kuliner
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
