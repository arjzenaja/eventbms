'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function NewSouvenirPackage() {
  const router = useRouter();
  const [souvenirs, setSouvenirs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Dropdown states
  const [isSouvenirDropdownOpen, setIsSouvenirDropdownOpen] = useState(false);
  const [isSouvenirDropdownShown, setIsSouvenirDropdownShown] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isCategoryDropdownShown, setIsCategoryDropdownShown] = useState(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isTypeDropdownShown, setIsTypeDropdownShown] = useState(false);
  
  const souvenirDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const typeDropdownRef = useRef(null);

  // Options for dropdowns
  const categoryOptions = [
    { value: '', label: 'Pilih Kategori Toko', icon: '🏪' },
    { value: 'Toko Batik', label: 'Toko Batik', icon: '🎨' },
    { value: 'Toko Kerajinan', label: 'Toko Kerajinan', icon: '🛠️' },
    { value: 'Toko Makanan', label: 'Toko Makanan', icon: '🍽️' },
    { value: 'Toko Minuman', label: 'Toko Minuman', icon: '🥤' },
    { value: 'Toko Oleh-oleh Umum', label: 'Toko Oleh-oleh Umum', icon: '🛍️' }
  ];

  const typeOptions = [
    { value: '', label: 'Pilih Tipe Toko', icon: '🏷️' },
    { value: 'Toko Batik', label: 'Toko Batik', icon: '🎨' },
    { value: 'Toko Kerajinan', label: 'Toko Kerajinan', icon: '🛠️' },
    { value: 'Toko Makanan', label: 'Toko Makanan', icon: '🍽️' },
    { value: 'Toko Minuman', label: 'Toko Minuman', icon: '🥤' },
    { value: 'Toko Oleh-oleh Umum', label: 'Toko Oleh-oleh Umum', icon: '🛍️' }
  ];

  // Get current labels
  const getSouvenirLabel = (value) => {
    if (!value) return 'Pilih Toko Oleh-oleh';
    const souvenir = souvenirs.find(s => s.id === value);
    return souvenir ? souvenir.title : 'Pilih Toko Oleh-oleh';
  };

  const getCategoryLabel = (value) => {
    const option = categoryOptions.find(opt => opt.value === value);
    return option ? option.label : 'Pilih Kategori Toko';
  };

  const getTypeLabel = (value) => {
    const option = typeOptions.find(opt => opt.value === value);
    return option ? option.label : 'Pilih Tipe Toko';
  };

  // Dropdown management functions
  const openSouvenirDropdown = () => {
    setIsSouvenirDropdownOpen(true);
  };

  const closeSouvenirDropdown = () => {
    setIsSouvenirDropdownShown(false);
    setTimeout(() => setIsSouvenirDropdownOpen(false), 150);
  };

  const openCategoryDropdown = () => {
    setIsCategoryDropdownOpen(true);
  };

  const closeCategoryDropdown = () => {
    setIsCategoryDropdownShown(false);
    setTimeout(() => setIsCategoryDropdownOpen(false), 150);
  };

  const openTypeDropdown = () => {
    setIsTypeDropdownOpen(true);
  };

  const closeTypeDropdown = () => {
    setIsTypeDropdownShown(false);
    setTimeout(() => setIsTypeDropdownOpen(false), 150);
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    souvenirId: '',
    souvenirTitle: '',
    available: true,
    category: '',
    type: ''
  });

  useEffect(() => {
    fetchSouvenirs();
  }, []);

  // Dropdown management
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (souvenirDropdownRef.current && !souvenirDropdownRef.current.contains(event.target)) {
        closeSouvenirDropdown();
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        closeCategoryDropdown();
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        closeTypeDropdown();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeSouvenirDropdown();
        closeCategoryDropdown();
        closeTypeDropdown();
      }
    };

    if (isSouvenirDropdownOpen || isCategoryDropdownOpen || isTypeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      
      // Trigger animations
      if (isSouvenirDropdownOpen) {
        setTimeout(() => setIsSouvenirDropdownShown(true), 10);
      }
      if (isCategoryDropdownOpen) {
        setTimeout(() => setIsCategoryDropdownShown(true), 10);
      }
      if (isTypeDropdownOpen) {
        setTimeout(() => setIsTypeDropdownShown(true), 10);
      }
    } else {
      setIsSouvenirDropdownShown(false);
      setIsCategoryDropdownShown(false);
      setIsTypeDropdownShown(false);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSouvenirDropdownOpen, isCategoryDropdownOpen, isTypeDropdownOpen]);

  const fetchSouvenirs = async () => {
    try {
      const response = await fetch('/api/souvenirs');
      const data = await response.json();
      
      if (data.success) {
        setSouvenirs(data.souvenirs || []);
      }
    } catch (error) {
      console.error('Error fetching souvenirs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Buat FormData
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('price', formData.price.toString());
      submitFormData.append('souvenirId', formData.souvenirId);
      submitFormData.append('souvenirTitle', formData.souvenirTitle);
      submitFormData.append('available', formData.available.toString());
      submitFormData.append('category', formData.category);
      submitFormData.append('type', formData.type);

      const response = await fetch('/api/souvenirs/packages', {
        method: 'POST',
        body: submitFormData,
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Paket berhasil ditambahkan!');
        router.push('/admin/souvenirs/packages');
      } else {
        alert('Gagal menambahkan paket: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating package:', error);
      alert('Terjadi kesalahan saat menambahkan paket');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data..." />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-600 flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4 8 4-8 4-8-4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7v10l-9 4-9-4V7" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Tambah Paket Toko Oleh-oleh</h1>
                </div>
                <p className="mt-2 text-sm text-gray-500">Buat paket menarik untuk toko oleh-oleh Banyumas.</p>
              </div>
              <Link
                href="/admin/souvenirs/packages"
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
                {/* Basic Information Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Informasi Dasar Paket</h2>
                  </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Paket Toko <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Contoh: Paket Hemat Toko Batik Banyumas"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                    />
                  </div>

                  <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Harga Paket <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder="150000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                    />
                    </div>
                  </div>
                  </div>

                {/* Store Information Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Informasi Toko</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative" ref={souvenirDropdownRef}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Toko Oleh-oleh <span className="text-red-500">*</span>
                    </label>
                      <button
                        type="button"
                        onClick={() => (isSouvenirDropdownOpen ? closeSouvenirDropdown() : openSouvenirDropdown())}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between shadow-sm transform hover:scale-[1.01] active:scale-95"
                        aria-haspopup="listbox"
                        aria-expanded={isSouvenirDropdownOpen}
                      >
                        <span className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                          </svg>
                          <span className="text-xl leading-none">🛍️</span>
                          <span className="text-gray-900 font-medium">{getSouvenirLabel(formData.souvenirId)}</span>
                        </span>
                        <svg className={`w-4 h-4 text-gray-500 transition-transform ${isSouvenirDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isSouvenirDropdownOpen && (
                        <div className="relative">
                          <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl transform transition duration-150 ease-out origin-top scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${isSouvenirDropdownShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`} style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }}>
                            <li>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData(prev => ({ ...prev, souvenirId: '' }));
                                  closeSouvenirDropdown();
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 outline-none ${formData.souvenirId === '' ? 'bg-blue-50' : ''}`}
                              >
                                <span className="flex items-center gap-3">
                                  <span className="text-xl leading-none">🛍️</span>
                                  <span className={`text-sm ${formData.souvenirId === '' ? 'text-blue-700 font-semibold' : 'text-gray-800'}`}>Pilih Toko Oleh-oleh</span>
                                </span>
                                {formData.souvenirId === '' && (
                                  <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                            </li>
                      {souvenirs.map((souvenir) => (
                              <li key={souvenir.id}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, souvenirId: souvenir.id }));
                                    closeSouvenirDropdown();
                                  }}
                                  className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 outline-none ${formData.souvenirId === souvenir.id ? 'bg-blue-50' : ''}`}
                                >
                                  <span className="flex items-center gap-3">
                                    <span className="text-xl leading-none">{souvenir.type === 'makanan' ? '🍽️' : souvenir.type === 'pakaian' ? '👕' : '🎁'}</span>
                                    <span className={`text-sm ${formData.souvenirId === souvenir.id ? 'text-blue-700 font-semibold' : 'text-gray-800'}`}>{souvenir.title}</span>
                                  </span>
                                  {formData.souvenirId === souvenir.id && (
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
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Toko
                    </label>
                    <input
                      type="text"
                      name="souvenirTitle"
                      value={formData.souvenirTitle}
                      onChange={handleInputChange}
                      placeholder="Contoh: Toko Batik Banyumas"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                    />
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Deskripsi Paket</h2>
                  </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi Paket
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Contoh: Paket hemat berisi batik, keripik, dan oleh-oleh lainnya dari toko ini"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 resize-none"
                  />
                  </div>
                </div>

                {/* Category & Settings Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Kategori & Pengaturan</h2>
                  </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative" ref={categoryDropdownRef}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori Toko
                    </label>
                      <button
                        type="button"
                        onClick={() => (isCategoryDropdownOpen ? closeCategoryDropdown() : openCategoryDropdown())}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between shadow-sm transform hover:scale-[1.01] active:scale-95"
                        aria-haspopup="listbox"
                        aria-expanded={isCategoryDropdownOpen}
                      >
                        <span className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                          </svg>
                          <span className="text-xl leading-none">🏪</span>
                          <span className="text-gray-900 font-medium">{getCategoryLabel(formData.category)}</span>
                        </span>
                        <svg className={`w-4 h-4 text-gray-500 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isCategoryDropdownOpen && (
                        <div className="relative">
                          <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl transform transition duration-150 ease-out origin-top scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${isCategoryDropdownShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`} style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }}>
                            {categoryOptions.map((option) => (
                              <li key={option.value}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, category: option.value }));
                                    closeCategoryDropdown();
                                  }}
                                  className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 outline-none ${formData.category === option.value ? 'bg-blue-50' : ''}`}
                                >
                                  <span className="flex items-center gap-3">
                                    <span className="text-xl leading-none">{option.icon}</span>
                                    <span className={`text-sm ${formData.category === option.value ? 'text-blue-700 font-semibold' : 'text-gray-800'}`}>{option.label}</span>
                                  </span>
                                  {formData.category === option.value && (
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

                    <div className="relative" ref={typeDropdownRef}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipe Toko
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                          </svg>
                          <span className="text-xl leading-none">🏷️</span>
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
                  </div>
                </div>

                {/* Availability Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Ketersediaan Paket</h2>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                    <label className="ml-3 block text-sm font-semibold text-gray-900">
                    Paket toko tersedia untuk dipesan
                  </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <Link
                    href="/admin/souvenirs/packages"
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 font-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
                  >
                    {isSaving ? (
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
                        Simpan Paket Toko
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
