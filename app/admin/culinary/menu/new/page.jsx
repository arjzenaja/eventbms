'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

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

export default function NewMenuItem() {
  const router = useRouter();
  const [culinaryDestinations, setCulinaryDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    priceIced: '',
    priceHot: '',
    cookingTime: '',
    category: 'Makanan Utama',
    destinationId: '',
    destinationSlug: '',
    destinationTitle: '',
    rating: '',
    isPopular: false,
    isSpicy: false,
    halal: true,
    available: true,
    additionalInfo: [],
    flavorOptions: []
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newAdditionalInfo, setNewAdditionalInfo] = useState('');
  const [newFlavorOption, setNewFlavorOption] = useState('');

  // Dynamic categories based on selected culinary destination
  const getCategories = () => {
    const baseCategories = [
      'Makanan Utama',
      'Makanan Ringan',
      'Minuman',
      'Dessert',
      'Sate',
      'Soto',
      'Nasi',
      'Mie',
      'Seafood',
      'Ayam',
      'Daging',
      'Sayuran',
      'Sup',
      'Gorengan',
      'Bakso',
      'Es',
      'Kopi',
      'Teh',
      'Jus',
      'Lainnya'
    ];

    // Add specific categories for The Soeds
    if (formData.destinationTitle === 'The Soeds') {
      return [
        'THE BMS Fizz n Breeze',
        'SMOOTHIES the nature is calling',
        'SINGLE ORIGIN',
        'SOED\'S Signature',
        'THE ESPRESSO BASED',
        'ARTISAN TEA',
        'BUTTER RICE WITH DAUN JERUK',
        'SNACKS',
        'MAGICAL INSIDE & HAPPIER Oatside',
        'SOEDS Signature PLATTER',
        'SHAKEN SWEET & CREAMY Series',
        'SUPREMO PIZZARIO SERIES',
        'DELIGHTFUL & COMFORTING Sweet Treats',
        'TRULY FANTASTEAK',
        'Wafflicious',
        'SHAKEN FRESH Presso',
        'Crawfflicious',
        ...baseCategories
      ];
    }

    // Add specific categories for Loma Cafe
    if (formData.destinationTitle === 'Loma Cafe') {
      return [
        'Makanan Utama',
        'Nasi & Mie',
        'Tea Series',
        'Coffee Series',
        'Milk Series',
        'Fruits Series',
        'Pastry',
        'Snack',
        'Minuman',
        // Filter out duplicates from baseCategories
        ...baseCategories.filter(cat => 
          !['Makanan Utama', 'Minuman'].includes(cat)
        )
      ];
    }

    // Add specific categories for Hourts/Houtrs
    if (formData.destinationTitle === 'Hourts' || formData.destinationTitle === 'Houtrs') {
      return [
        'Main Course',
        'Finger',
        'Coffee',
        'Milk Base',
        'Mocktail',
        'Artisan Tea',
        ...baseCategories
      ];
    }

    // Add specific categories for Els Koffie
    if (formData.destinationTitle === 'Els Koffie') {
      return [
        'Non Coffe+',
        'Kopi susu',
        ...baseCategories
      ];
    }

    return baseCategories;
  };

  const categories = getCategories();

  // Predefined additional info options
  const additionalInfoOptions = [
    'Halal',
    'Fresh',
    'Traditional',
    'Signature',
    'Local',
    'Comfort',
    'Refresh',
    'Spicy',
    'Sweet',
    'Sour',
    'Crispy',
    'Soft',
    'Hot',
    'Cold',
    'Vegetarian',
    'Vegan',
    'Gluten Free',
    'Dairy Free',
    'Nut Free',
    'Budget',
    'Premium',
    'Quick',
    'Healthy',
    'Organic'
  ];

  useEffect(() => {
    fetchCulinaryDestinations();
  }, []);

  const fetchCulinaryDestinations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/kuliner');
      const data = await response.json();

      if (data.success) {
        setCulinaryDestinations(data.kuliner || []);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error fetching culinary destinations:', error);
              setError('Terjadi kesalahan saat mengambil data kuliner');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-fill destination info when destination is selected
    if (name === 'destinationId') {
      const selectedDestination = culinaryDestinations.find(dest => dest.id === value);
      if (selectedDestination) {
        setFormData(prev => ({
          ...prev,
          destinationId: value,
          destinationSlug: selectedDestination.slug || '',
          destinationTitle: selectedDestination.title || ''
        }));
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
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
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAddAdditionalInfo = () => {
    if (newAdditionalInfo.trim() && !formData.additionalInfo.includes(newAdditionalInfo.trim())) {
      setFormData(prev => ({
        ...prev,
        additionalInfo: [...prev.additionalInfo, newAdditionalInfo.trim()]
      }));
      setNewAdditionalInfo('');
    }
  };

  const handleRemoveAdditionalInfo = (info) => {
    setFormData(prev => ({
      ...prev,
      additionalInfo: prev.additionalInfo.filter(item => item !== info)
    }));
  };

  const handleAddPredefinedInfo = (info) => {
    if (!formData.additionalInfo.includes(info)) {
      setFormData(prev => ({
        ...prev,
        additionalInfo: [...prev.additionalInfo, info]
      }));
    }
  };

  const handleAddFlavorOption = () => {
    if (newFlavorOption.trim() && !formData.flavorOptions.includes(newFlavorOption.trim())) {
      setFormData(prev => ({
        ...prev,
        flavorOptions: [...prev.flavorOptions, newFlavorOption.trim()]
      }));
      setNewFlavorOption('');
    }
  };

  const handleRemoveFlavorOption = (option) => {
    setFormData(prev => ({
      ...prev,
      flavorOptions: prev.flavorOptions.filter(item => item !== option)
    }));
  };

  const handleAddPredefinedFlavor = (option) => {
    if (!formData.flavorOptions.includes(option)) {
      setFormData(prev => ({
        ...prev,
        flavorOptions: [...prev.flavorOptions, option]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.cookingTime || 
          !formData.category || !formData.destinationId) {
        alert('Semua field wajib diisi (nama, deskripsi, waktu memasak, kategori, kuliner)');
        return;
      }

      // Validate pricing based on category
      const dualPricingCategories = [
        'THE ESPRESSO BASED',
        'Senja Espresso Based',
        'Tea Series',
        'Coffee Series',
        'Milk Series',
        'Fruits Series',
        'Non Coffee',
        'Tea',
        'Classic Coffee',
        'Milk Base',
        'Non Coffe+',
        'Minuman',
        'Kopi'
      ];
      
      if (dualPricingCategories.includes(formData.category)) {
        if (!formData.priceIced && !formData.priceHot) {
          alert('Untuk minuman dengan dual pricing, minimal salah satu harga (Iced atau Hot) harus diisi');
          return;
        }
      } else {
        if (!formData.price) {
          alert('Harga wajib diisi');
          return;
        }
      }

      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        if (key === 'additionalInfo' || key === 'flavorOptions') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add image file
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      console.log('Sending form data:', formData);
      console.log('FormDataToSend keys:', Array.from(formDataToSend.keys()));
      console.log('FormDataToSend values:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }
      
      const response = await fetch('/api/kuliner/menu', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (data.success) {
        alert('Menu berhasil ditambahkan!');
        router.push('/admin/culinary/menu');
      } else {
        alert('Gagal menambahkan menu: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating menu item:', error);
      alert('Terjadi kesalahan saat membuat menu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data kuliner..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={fetchCulinaryDestinations}
          message="Gagal memuat data kuliner"
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <svg className="w-7 h-7 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Tambah Menu Baru</h1>
                  <p className="text-gray-600 mt-1">Buat menu baru untuk ditambahkan ke kuliner terpilih</p>
                </div>
              </div>
              <Link 
                href="/admin/culinary/menu" 
                className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Kembali
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
              <form onSubmit={handleSubmit} className="space-y-8 p-8">
                {/* Basic Information */}
                <div className="border-b border-gray-200 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Informasi Dasar</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nama Menu *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">🏷️</div>
                        <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                        placeholder="Contoh: Nasi Goreng Spesial"
                        />
                      </div>
                    </div>

                    <div>
                      <CustomSelect
                        label="Kategori *"
                        value={formData.category}
                        onChange={(v) => setFormData(prev => ({ ...prev, category: v }))}
                        options={categories.map(c => ({ value: c, label: c, icon: '🍽️' }))}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Deskripsi Menu *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Deskripsi singkat tentang menu, bahan-bahan, atau cara penyajian"
                    />
                  </div>
                </div>

                {/* Pricing and Time */}
                <div className="border-b border-gray-200 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Harga dan Waktu</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(formData.category === 'THE ESPRESSO BASED' || formData.category === 'Senja Espresso Based' || formData.category === 'SHAKEN SWEET & CREAMY Series' || formData.category === 'SHAKEN FRESH Presso' || formData.category === 'Tea Series' || formData.category === 'Coffee Series' || formData.category === 'Milk Series' || formData.category === 'Fruits Series' || formData.category === 'Non Coffee' || formData.category === 'Tea' || formData.category === 'Classic Coffee' || formData.category === 'Milk Base' || formData.category === 'Non Coffe+' || formData.category === 'Minuman' || formData.category === 'Kopi') ? (
                      <>
                        <div>
                          <label htmlFor="priceIced" className="block text-sm font-medium text-gray-700">
                            Harga Iced (Rp) *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">🧊</div>
                            <input
                            type="number"
                            id="priceIced"
                            name="priceIced"
                            min="0"
                            value={formData.priceIced}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                            placeholder="26000"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="priceHot" className="block text-sm font-medium text-gray-700">
                            Harga Hot (Rp) *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">☕</div>
                            <input
                            type="number"
                            id="priceHot"
                            name="priceHot"
                            min="0"
                            value={formData.priceHot}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                            placeholder="24000"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Harga (Rp) *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">💵</div>
                          <input
                          type="number"
                          id="price"
                          name="price"
                          required
                          min="0"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                          placeholder="25000"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700">
                        Estimasi Waktu *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">⏱️</div>
                        <input
                        type="text"
                        id="cookingTime"
                        name="cookingTime"
                        required
                        value={formData.cookingTime}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                        placeholder="Contoh: 10-15 menit"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Destination */}
                <div className="border-b border-gray-200 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <svg className="w-6 h-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Kuliner</h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Kuliner *</label>
                    <CustomSelect
                      value={formData.destinationId}
                      onChange={(v) => handleInputChange({ target: { name: 'destinationId', value: v } })}
                      options={[{ value: '', label: 'Pilih kuliner', icon: '🔎' }, ...culinaryDestinations.map(d => ({ value: d.id, label: d.title, icon: '📍' }))]}
                    />
                  </div>
                </div>

                {/* Rating and Status */}
                <div className="border-b border-gray-200 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Rating dan Status</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                        Rating (1-5)
                      </label>
                      <input
                        type="number"
                        id="rating"
                        name="rating"
                        min="1"
                        max="5"
                        step="0.1"
                        value={formData.rating}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="4.5"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isPopular"
                          name="isPopular"
                          checked={formData.isPopular}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isPopular" className="ml-2 block text-sm text-gray-900">
                          Menu Populer
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isSpicy"
                          name="isSpicy"
                          checked={formData.isSpicy}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isSpicy" className="ml-2 block text-sm text-gray-900">
                          Menu Pedas
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="halal"
                          name="halal"
                          checked={formData.halal}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="halal" className="ml-2 block text-sm text-gray-900">
                          Halal
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="available"
                          name="available"
                          checked={formData.available}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                          Tersedia
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="border-b border-gray-200 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <svg className="w-6 h-6 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Informasi Tambahan</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tambah Informasi Kustom
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newAdditionalInfo}
                          onChange={(e) => setNewAdditionalInfo(e.target.value)}
                          placeholder="Contoh: Fresh, Traditional, dll"
                          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={handleAddAdditionalInfo}
                          className="px-4 py-2 rounded-xl bg-orange-500 text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pilih dari Opsi yang Tersedia
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {additionalInfoOptions.map((info) => (
                          <button
                            key={info}
                            type="button"
                            onClick={() => handleAddPredefinedInfo(info)}
                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full"
                          >
                            {info}
                          </button>
                        ))}
                      </div>
                    </div>

                    {formData.additionalInfo.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Informasi yang Dipilih
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {formData.additionalInfo.map((info, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                              {info}
                              <button
                                type="button"
                                onClick={() => handleRemoveAdditionalInfo(info)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
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

                {/* Flavor Options - Only show for BUTTER RICE WITH DAUN JERUK */}
                {formData.category === 'BUTTER RICE WITH DAUN JERUK' && (
                  <div className="border-b border-gray-200 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Pilihan Rasa (Flavor Options)</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tambah Pilihan Rasa Kustom
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newFlavorOption}
                            onChange={(e) => setNewFlavorOption(e.target.value)}
                            placeholder="Contoh: Sambal Geprek, Lada Hitam, dll"
                            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={handleAddFlavorOption}
                            className="px-4 py-2 rounded-xl bg-red-500 text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            Tambah
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pilih dari Opsi yang Tersedia
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['Sambal Geprek', 'Lada Hitam', 'Honey Sauce', 'Sambal Matah', 'Sambal Terasi', 'Sambal Ijo'].map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleAddPredefinedFlavor(option)}
                              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>

                      {formData.flavorOptions.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pilihan Rasa yang Dipilih
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {formData.flavorOptions.map((option, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                              >
                                {option}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFlavorOption(option)}
                                  className="ml-2 text-red-600 hover:text-red-800"
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
                )}

                {/* Image Upload */}
                <div className="border-b border-gray-200 pb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <svg className="w-6 h-6 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Gambar Menu</h3>
                  </div>
                  
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                      Upload Gambar Menu
                    </label>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimal 5MB</p>
                  </div>

                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="mt-2 inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        Hapus Gambar
                      </button>
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="pt-6 border-t border-gray-200 flex justify-end space-x-4">
                  <Link
                    href="/admin/culinary/menu"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform transition-all duration-200 hover:scale-105 active:scale-95 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        Simpan Menu
                      </>
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
