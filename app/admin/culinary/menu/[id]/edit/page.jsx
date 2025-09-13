  'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function EditMenuItem() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
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
    priceBrown: '',
    priceCheese: '',
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
  const [currentImage, setCurrentImage] = useState('');
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
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch culinary destinations
      const destinationsResponse = await fetch('/api/kuliner');
      const destinationsData = await destinationsResponse.json();

      if (destinationsData.success) {
        setCulinaryDestinations(destinationsData.kuliner || []);
      }

      // Fetch menu item data
      const menuResponse = await fetch(`/api/kuliner/menu?id=${id}`);
      const menuData = await menuResponse.json();

      if (menuData.success && menuData.menu_items && menuData.menu_items.length > 0) {
        const menuItem = menuData.menu_items[0];
        setFormData({
          name: menuItem.name || '',
          description: menuItem.description || '',
          price: menuItem.price || '',
          priceIced: menuItem.priceIced || '',
          priceHot: menuItem.priceHot || '',
          priceBrown: menuItem.priceBrown || '',
          priceCheese: menuItem.priceCheese || '',
          cookingTime: menuItem.cookingTime || '',
          category: menuItem.category || 'Makanan Utama',
          destinationId: menuItem.destinationId || '',
          destinationSlug: menuItem.destinationSlug || '',
          destinationTitle: menuItem.destinationTitle || '',
          rating: menuItem.rating || '',
          isPopular: menuItem.isPopular || false,
          isSpicy: menuItem.isSpicy || false,
          halal: menuItem.halal !== undefined ? menuItem.halal : true,
          available: menuItem.available !== undefined ? menuItem.available : true,
          additionalInfo: menuItem.additionalInfo || [],
          flavorOptions: menuItem.flavorOptions || []
        });
        setCurrentImage(menuItem.image || '');
        setImagePreview(menuItem.image || null);
      } else {
        setError('Menu tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Terjadi kesalahan saat mengambil data');
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
    setImagePreview(currentImage);
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
      
      const steakDualPricingCategories = [
        'Steak Ala Waroeng'
      ];
      
      if (dualPricingCategories.includes(formData.category)) {
        if (!formData.priceIced && !formData.priceHot) {
          alert('Untuk minuman dengan dual pricing, minimal salah satu harga (Iced atau Hot) harus diisi');
          return;
        }
      } else if (steakDualPricingCategories.includes(formData.category)) {
        if (!formData.priceBrown && !formData.priceCheese) {
          alert('Untuk Steak Ala Waroeng, minimal salah satu harga (Brown Sauce atau Cheese Sauce) harus diisi');
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
      formDataToSend.append('id', id);
      Object.keys(formData).forEach(key => {
        if (key === 'additionalInfo' || key === 'flavorOptions') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add image file if new one is selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const response = await fetch('/api/kuliner/menu', {
        method: 'PUT',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        alert('Menu berhasil diperbarui!');
        // Option to go back to list or stay on edit page
        if (confirm('Menu berhasil diperbarui! Apakah Anda ingin kembali ke halaman list menu?')) {
          router.push('/admin/culinary/menu');
        }
      } else {
        alert('Gagal memperbarui menu: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
      alert('Terjadi kesalahan saat memperbarui menu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data menu..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={fetchData}
          message="Gagal memuat data menu"
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Edit Menu</h1>
              <Link 
                href="/admin/culinary/menu" 
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Kembali
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow sm:rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-6 p-6">
                {/* Basic Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Dasar</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nama Menu *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contoh: Nasi Goreng Spesial"
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Kategori *
                      </label>
                      <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
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
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Deskripsi singkat tentang menu, bahan-bahan, atau cara penyajian"
                    />
                  </div>
                </div>

                {/* Pricing and Time */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Harga dan Waktu</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(formData.category === 'THE ESPRESSO BASED' || formData.category === 'Senja Espresso Based' || formData.category === 'SHAKEN SWEET & CREAMY Series' || formData.category === 'SHAKEN FRESH Presso' || formData.category === 'Tea Series' || formData.category === 'Coffee Series' || formData.category === 'Milk Series' || formData.category === 'Fruits Series' || formData.category === 'Non Coffee' || formData.category === 'Tea' || formData.category === 'Classic Coffee' || formData.category === 'Milk Base' || formData.category === 'Non Coffe+' || formData.category === 'Minuman' || formData.category === 'Kopi') ? (
                      <>
                        <div>
                          <label htmlFor="priceIced" className="block text-sm font-medium text-gray-700">
                            Harga Iced (Rp) *
                          </label>
                          <input
                            type="number"
                            id="priceIced"
                            name="priceIced"
                            min="0"
                            value={formData.priceIced}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="26000"
                          />
                        </div>
                        <div>
                          <label htmlFor="priceHot" className="block text-sm font-medium text-gray-700">
                            Harga Hot (Rp) *
                          </label>
                          <input
                            type="number"
                            id="priceHot"
                            name="priceHot"
                            min="0"
                            value={formData.priceHot}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="24000"
                          />
                        </div>
                      </>
                    ) : (formData.category === 'Steak Ala Waroeng') ? (
                      <>
                        <div>
                          <label htmlFor="priceBrown" className="block text-sm font-medium text-gray-700">
                            Harga Brown Sauce (Rp) *
                          </label>
                          <input
                            type="number"
                            id="priceBrown"
                            name="priceBrown"
                            min="0"
                            value={formData.priceBrown}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="21818"
                          />
                        </div>
                        <div>
                          <label htmlFor="priceCheese" className="block text-sm font-medium text-gray-700">
                            Harga Cheese Sauce (Rp) *
                          </label>
                          <input
                            type="number"
                            id="priceCheese"
                            name="priceCheese"
                            min="0"
                            value={formData.priceCheese}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="25455"
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Harga (Rp) *
                        </label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          required
                          min="0"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="25000"
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700">
                        Estimasi Waktu *
                      </label>
                      <input
                        type="text"
                        id="cookingTime"
                        name="cookingTime"
                        required
                        value={formData.cookingTime}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contoh: 10-15 menit"
                      />
                    </div>
                  </div>
                </div>

                {/* Destination */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Kuliner</h3>
                  
                  <div>
                    <label htmlFor="destinationId" className="block text-sm font-medium text-gray-700">
                      Pilih Kuliner *
                    </label>
                    <select
                      id="destinationId"
                      name="destinationId"
                      required
                      value={formData.destinationId}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                                              <option value="">Pilih kuliner</option>
                      {culinaryDestinations.map((dest) => (
                        <option key={dest.id} value={dest.id}>
                          {dest.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rating and Status */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Rating dan Status</h3>
                  
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
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Tambahan</h3>
                  
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
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddAdditionalInfo}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
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

                    {formData.additionalInfo && formData.additionalInfo.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Informasi yang Dipilih
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {formData.additionalInfo && formData.additionalInfo.map((info, index) => (
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
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Pilihan Rasa (Flavor Options)</h3>
                    
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
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                          />
                          <button
                            type="button"
                            onClick={handleAddFlavorOption}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
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

                      {formData.flavorOptions && formData.flavorOptions.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pilihan Rasa yang Dipilih
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {formData.flavorOptions && formData.flavorOptions.map((option, index) => (
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
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Gambar Menu</h3>
                  
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                      Upload Gambar Menu Baru (Opsional)
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
                        className="h-32 w-32 object-cover rounded-lg"
                      />
                      {imageFile && (
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="mt-2 text-red-600 hover:text-red-800 text-sm"
                        >
                          Hapus Gambar Baru
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3">
                  <Link
                    href="/admin/culinary/menu"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md"
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
