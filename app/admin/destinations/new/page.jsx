'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminMapSelector from '@/components/AdminMapSelector';
import Link from 'next/link';

export default function NewDestinationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
    location: '',
    type: 'wisata-alam',
    category: 'Wisata',
    entrance_fee: '',
    manager: '', // Pengelola Wisata
    contact: '', // Kontak (phone/whatsapp)
    address: '', // Alamat lengkap
    opening_hours: '', // Jam buka
    rating: '', // Rating destinasi
    features: [], // Fitur & fasilitas
    recommended: false
  });
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [imageFiles, setImageFiles] = useState({
    img_sm: null,
    img_lg: null
  });
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState({
    img_sm: null,
    img_lg: null
  });
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [pricing, setPricing] = useState({
    type: 'free', // 'free' | 'single' | 'packages'
    unit: 'per_tiket',
    value: '',
    packages: [] // { name, price, unit, imageFile, imagePreview, includes, terms }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Custom dropdown states
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isTypeShown, setIsTypeShown] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCategoryShown, setIsCategoryShown] = useState(false);
  const typeRef = useRef(null);
  const categoryRef = useRef(null);

  const typeOptions = [
    { value: 'wisata-alam', label: 'Wisata Alam', icon: '🏞️' },
    { value: 'wisata-taman', label: 'Wisata Taman', icon: '🌳' },
    { value: 'wisata-budaya', label: 'Wisata Budaya', icon: '🏛️' },
    { value: 'wisata-sejarah', label: 'Wisata Sejarah', icon: '🕰️' },
    { value: 'wisata-buatan', label: 'Wisata Buatan', icon: '🎡' },
    { value: 'wisata-minat-khusus', label: 'Wisata Minat Khusus', icon: '🎯' },
    { value: 'wisata-religi', label: 'Wisata Religi', icon: '🕌' },
  ];

  const categoryOptions = [
    { value: 'Wisata', label: 'Wisata', icon: '🗺️' },
    { value: 'Kuliner', label: 'Kuliner', icon: '🍜' },
    { value: 'Penginapan', label: 'Penginapan', icon: '🏨' },
    { value: 'Transportasi', label: 'Transportasi', icon: '🚌' },
    { value: 'Edukasi', label: 'Edukasi', icon: '🎓' },
    { value: 'Olahraga', label: 'Olahraga', icon: '🏃' },
    { value: 'Lainnya', label: 'Lainnya', icon: '➕' },
  ];

  const getTypeLabel = (v) => typeOptions.find(o => o.value === v)?.label || v;
  const getCategoryLabel = (v) => categoryOptions.find(o => o.value === v)?.label || v;

  // Outside click / ESC handlers
  useEffect(() => {
    const onDown = (e) => {
      if (typeRef.current && !typeRef.current.contains(e.target)) {
        if (isTypeOpen) {
          setIsTypeShown(false);
          setTimeout(() => setIsTypeOpen(false), 150);
        }
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        if (isCategoryOpen) {
          setIsCategoryShown(false);
          setTimeout(() => setIsCategoryOpen(false), 150);
        }
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (isTypeOpen) {
          setIsTypeShown(false);
          setTimeout(() => setIsTypeOpen(false), 150);
        }
        if (isCategoryOpen) {
          setIsCategoryShown(false);
          setTimeout(() => setIsCategoryOpen(false), 150);
        }
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isTypeOpen, isCategoryOpen]);

  const openType = () => { if (!isTypeOpen) { setIsTypeOpen(true); setTimeout(() => setIsTypeShown(true), 0);} };
  const closeType = () => { if (isTypeOpen) { setIsTypeShown(false); setTimeout(() => setIsTypeOpen(false), 150);} };
  const openCategory = () => { if (!isCategoryOpen) { setIsCategoryOpen(true); setTimeout(() => setIsCategoryShown(true), 0);} };
  const closeCategory = () => { if (isCategoryOpen) { setIsCategoryShown(false); setTimeout(() => setIsCategoryOpen(false), 150);} };

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
      
      // Add gallery images
      if (galleryFiles && galleryFiles.length > 0) {
        galleryFiles.forEach((file, index) => {
          formDataToSend.append('gallery_images', file);
        });
      }

      // Attach pricing JSON (backend can ignore if not implemented yet)
      formDataToSend.append('pricing', JSON.stringify({
        ...pricing,
        // reduce packages before sending
        packages: pricing.packages.map(p => ({
          name: p.name || '',
          price: p.price ? Number(p.price) : null,
          unit: p.unit || 'per_paket',
          includes: p.includes ? p.includes.split(',').map(s => s.trim()).filter(Boolean) : [],
          terms: p.terms ? p.terms.split('\n').map(s => s.trim()).filter(Boolean) : []
        }))
      }));

      // Attach package images separately if any
      pricing.packages.forEach((p, idx) => {
        if (p.imageFile) {
          formDataToSend.append(`package_image_${idx}`, p.imageFile);
        }
      });

      const response = await fetch('/api/destinations', {
        method: 'POST',
        body: formDataToSend, // Don't set Content-Type header, let browser set it with boundary
      });

      const data = await response.json();

      if (data.success) {
        alert('Objek wisata berhasil ditambahkan!');
        router.push('/admin/destinations');
      } else {
        setError(data.message || 'Gagal menambahkan objek wisata');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Terjadi kesalahan saat menambahkan objek wisata');
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7l9-4 9 4-9 4-9-4z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7v10l-9 4-9-4V7" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Tambah Destinasi Baru</h1>
                  <p className="mt-1 text-sm text-gray-500">Lengkapi informasi destinasi, lokasi, gambar, dan harga.</p>
                </div>
              </div>
              <Link 
                href="/admin/destinations"
                className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                Kembali ke Destinasi
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200"
                      placeholder="Deskripsi lengkap tentang destinasi wisata..."
                    />
                  </div>

                  {/* Lokasi dengan Map Selector */}
                  <div className="md:col-span-2">
                    <AdminMapSelector
                      location={formData.location}
                      onLocationChange={handleLocationChange}
                      onCoordinatesChange={handleCoordinatesChange}
                    />
                  </div>

                                    {/* Tipe */}
                  <div ref={typeRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Destinasi *</label>
                    <button
                      type="button"
                      onClick={() => (isTypeOpen ? closeType() : openType())}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 flex items-center justify-between shadow-sm"
                      aria-haspopup="listbox"
                      aria-expanded={isTypeOpen}
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M3 12h18M3 20h18"/></svg>
                        <span className="text-gray-900 font-medium">{getTypeLabel(formData.type)}</span>
                      </span>
                      <svg className={`w-4 h-4 text-gray-500 transition-transform ${isTypeOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    {isTypeOpen && (
                      <div className="relative">
                        <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl transform transition duration-150 ease-out origin-top ${isTypeShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`}>
                          {typeOptions.map((opt) => (
                            <li key={opt.value}>
                              <button
                                type="button"
                                onClick={() => { setFormData(prev => ({ ...prev, type: opt.value })); closeType(); }}
                                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 outline-none ${formData.type === opt.value ? 'bg-blue-50' : ''}`}
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-xl leading-none">{opt.icon}</span>
                                  <span className={`text-sm ${formData.type === opt.value ? 'text-blue-700 font-semibold' : 'text-gray-800'}`}>{opt.label}</span>
                                </span>
                                {formData.type === opt.value && (
                                  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Kategori */}
                  <div ref={categoryRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Destinasi *</label>
                    <button
                      type="button"
                      onClick={() => (isCategoryOpen ? closeCategory() : openCategory())}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between shadow-sm"
                      aria-haspopup="listbox"
                      aria-expanded={isCategoryOpen}
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M3 12h18M3 20h18"/></svg>
                        <span className="text-gray-900 font-medium">{getCategoryLabel(formData.category)}</span>
                      </span>
                      <svg className={`w-4 h-4 text-gray-500 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    {isCategoryOpen && (
                      <div className="relative">
                        <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl transform transition duration-150 ease-out origin-top ${isCategoryShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`}>
                          {categoryOptions.map((opt) => (
                            <li key={opt.value}>
                              <button
                                type="button"
                                onClick={() => { setFormData(prev => ({ ...prev, category: opt.value })); closeCategory(); }}
                                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 outline-none ${formData.category === opt.value ? 'bg-blue-50' : ''}`}
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-xl leading-none">{opt.icon}</span>
                                  <span className={`text-sm ${formData.category === opt.value ? 'text-blue-700 font-semibold' : 'text-gray-800'}`}>{opt.label}</span>
                                </span>
                                {formData.category === opt.value && (
                                  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Biaya Masuk */}
                  <div>
                    <label htmlFor="entrance_fee" className="block text-sm font-medium text-gray-700 mb-2">
                      Biaya Masuk
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V4m0 16v-4"/></svg>
                      </div>
                      <input
                        type="text"
                        id="entrance_fee"
                        name="entrance_fee"
                        value={formData.entrance_fee}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                        placeholder="Contoh: Rp 10.000 atau Gratis"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Isi dengan angka atau tulis “Gratis”.</p>
                  </div>

                  {/* Jam Buka */}
                  <div>
                    <label htmlFor="opening_hours" className="block text-sm font-medium text-gray-700 mb-2">
                      Jam Buka
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      </div>
                      <input
                        type="text"
                        id="opening_hours"
                        name="opening_hours"
                        value={formData.opening_hours}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                        placeholder="Contoh: 08.00 - 17.00"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                      Rating (1-5)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      </div>
                      <input
                        type="number"
                        id="rating"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        min="1"
                        max="5"
                        step="0.1"
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                        placeholder="Contoh: 4.5"
                      />
                    </div>
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
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Nama pengelola atau kontak"
                    />
                  </div>

                  {/* Kontak */}
                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                      Kontak (Phone/WhatsApp)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498A1 1 0 0121 19.72V23a2 2 0 01-2 2h-1C9.163 25 3 18.837 3 11V10a2 2 0 012-2z"/></svg>
                      </div>
                      <input
                        type="text"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                        placeholder="Contoh: 08123456789 atau +628123456789"
                      />
                    </div>
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
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Alamat lengkap destinasi wisata..."
                    />
                  </div>

                  {/* Fitur & Fasilitas */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fitur & Fasilitas
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 text-sm"
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
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
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
                          className="ml-auto px-3 py-2 border border-gray-300 rounded-lg text-sm"
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="cth: 75000"
                            />
                          </div>
                          <div className="flex items-end">
                            <div className="text-sm text-gray-600 bg-white border rounded-lg px-3 py-2">Ditampilkan sebagai: Rp X {pricing.unit.replace('_', ' ')}</div>
                          </div>
                        </div>
                      )}

                      {pricing.type === 'packages' && (
                        <div className="space-y-4">
                          {pricing.packages.map((pkg, idx) => (
                            <div key={idx} className="border rounded-lg p-3 bg-white">
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transform transition-transform duration-150 hover:scale-105 active:scale-95"
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
                      Gambar Kecil (untuk Card/Thumbnail)
                    </label>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-blue-800 font-medium mb-1">📱 Digunakan untuk:</p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Card destinasi di halaman utama</li>
                        <li>• Thumbnail di list pencarian</li>
                        <li>• Preview di kategori wisata</li>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                    {imagePreviews.img_sm && (
                      <div className="mt-2">
                        <img 
                          src={imagePreviews.img_sm} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimal 5MB</p>
                  </div>

                  {/* Gambar Besar */}
                  <div>
                    <label htmlFor="img_lg" className="block text-sm font-medium text-gray-700 mb-2">
                      Gambar Besar (untuk Detail/Hero)
                    </label>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-green-800 font-medium mb-1">🖼️ Digunakan untuk:</p>
                      <ul className="text-xs text-green-700 space-y-1">
                        <li>• Halaman detail destinasi</li>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    />
                    {imagePreviews.img_lg && (
                      <div className="mt-2">
                        <img 
                          src={imagePreviews.img_lg} 
                          alt="Preview" 
                          className="w-32 h-32 object-cover rounded-md border"
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimal 5MB</p>
                  </div>

                  {/* Gallery */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Galeri Foto (opsional)
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <p className="text-sm text-gray-700 mb-2">Tambahkan beberapa foto untuk galeri destinasi.</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {galleryPreviews.map((preview, index) => (
                          <div key={index} className="relative w-full aspect-square rounded-md overflow-hidden">
                            <img src={preview} alt={`Gallery preview ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
                                setGalleryFiles(prev => prev.filter((_, i) => i !== index));
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transform transition-transform duration-150 hover:scale-110 active:scale-95"
                              title="Hapus foto"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <div className="relative w-full aspect-square rounded-md overflow-hidden border-dashed border-2 border-gray-300 flex items-center justify-center text-gray-400">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              
                              // Validate files
                              for (const file of files) {
                                if (!file.type.startsWith('image/')) {
                                  alert('Semua file harus berupa gambar');
                                  return;
                                }
                                if (file.size > 5 * 1024 * 1024) {
                                  alert('Ukuran file maksimal 5MB per file');
                                  return;
                                }
                              }
                              
                              // Add files to galleryFiles
                              setGalleryFiles(prev => [...prev, ...files]);
                              
                              // Create previews
                              files.forEach(file => {
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    setGalleryPreviews(prev => [...prev, ev.target?.result]);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              });
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <span className="text-sm">Tambahkan foto</span>
                        </div>
                      </div>
                    </div>
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
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-transform duration-150 hover:scale-105 active:scale-95"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Destinasi'}
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
