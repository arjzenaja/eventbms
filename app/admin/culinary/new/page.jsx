'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import GalleryUploader from '@/components/GalleryUploader';

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
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Tambah Item Kuliner Baru</h1>
              <Link 
                href="/admin/culinary" 
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Kembali
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow sm:rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-6 p-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Nama Kuliner *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan nama kuliner"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Lokasi *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan lokasi"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Deskripsi *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan deskripsi kuliner"
                  />
                </div>

                <div>
                  <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">
                    Deskripsi Singkat
                  </label>
                  <textarea
                    id="short_description"
                    name="short_description"
                    rows={2}
                    value={formData.short_description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan deskripsi singkat (opsional)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Deskripsi singkat akan digunakan untuk preview di card dan list</p>
                </div>

                {/* Tipe Kuliner */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Tipe Kuliner *
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="cafe">Cafe</option>
                    <option value="resto">Resto</option>
                    <option value="kedai">Kedai</option>
                    <option value="warung">Warung</option>
                    <option value="rumah-makan">Rumah Makan</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="price_range" className="block text-sm font-medium text-gray-700">
                    Range Harga *
                  </label>
                  <input
                    type="text"
                    id="price_range"
                    name="price_range"
                    required
                    value={formData.price_range}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: 25.000 - 50.000"
                  />
                </div>

                <div>
                  <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700">
                    Jenis Masakan *
                  </label>
                  <input
                    type="text"
                    id="cuisine"
                    name="cuisine"
                    required
                    value={formData.cuisine}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: Indonesia, Jawa, Chinese, Western"
                  />
                </div>

                {/* Rating */}
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
                    placeholder="Contoh: 4.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">Rating kuliner dari 1-5 (opsional)</p>
                </div>

                {/* Instagram */}
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                    Instagram
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: @kulinerbanyumas atau username tanpa @"
                  />
                  <p className="text-xs text-gray-500 mt-1">Username Instagram kuliner (opsional)</p>
                </div>

                {/* Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: warung-mendoan-banyumas"
                  />
                  <p className="text-xs text-gray-500 mt-1">URL slug untuk routing (akan dibuat otomatis jika kosong)</p>
                </div>

                {/* Koordinat Lokasi */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Koordinat Lokasi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="lat" className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contoh: -7.3056"
                      />
                    </div>
                    <div>
                      <label htmlFor="lng" className="block text-sm font-medium text-gray-700">
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
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contoh: 109.2194"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Koordinat untuk menampilkan lokasi di peta (opsional)</p>
                </div>

                {/* Status Kuliner */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Kuliner</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="halal_status"
                        name="halal_status"
                        checked={formData.halal_status}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor="halal_status" className="ml-2 block text-sm text-gray-900">
                        Makanan Halal
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="delivery_available"
                        name="delivery_available"
                        checked={formData.delivery_available}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="delivery_available" className="ml-2 block text-sm text-gray-900">
                        Tersedia Delivery
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="reservation_available"
                        name="reservation_available"
                        checked={formData.reservation_available}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="reservation_available" className="ml-2 block text-sm text-gray-900">
                        Tersedia Reservasi
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="opening_hours" className="block text-sm font-medium text-gray-700">
                    Jam Operasional *
                  </label>
                  <input
                    type="text"
                    id="opening_hours"
                    name="opening_hours"
                    required
                    value={formData.opening_hours}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Contoh: 10:00 - 22:00"
                  />
                </div>

                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                    Kontak
                  </label>
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nomor telepon atau WhatsApp"
                  />
                </div>

                                 <div>
                   <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                     Alamat Lengkap
                   </label>
                   <textarea
                     id="address"
                     name="address"
                     rows={2}
                     value={formData.address}
                     onChange={handleInputChange}
                     className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                     placeholder="Alamat lengkap (opsional, akan menggunakan lokasi jika kosong)"
                   />
                 </div>

                 {/* Informasi Pengelola */}
                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pengelola</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label htmlFor="manager" className="block text-sm font-medium text-gray-700">
                         Nama Pengelola
                       </label>
                       <input
                         type="text"
                         id="manager"
                         name="manager"
                         value={formData.manager}
                         onChange={handleInputChange}
                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Nama pemilik atau pengelola"
                       />
                     </div>

                     <div>
                       <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                         Nomor Telepon
                       </label>
                       <input
                         type="text"
                         id="phone"
                         name="phone"
                         value={formData.phone}
                         onChange={handleInputChange}
                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Nomor telepon utama"
                       />
                     </div>

                     <div>
                       <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
                         WhatsApp
                       </label>
                       <input
                         type="text"
                         id="whatsapp"
                         name="whatsapp"
                         value={formData.whatsapp}
                         onChange={handleInputChange}
                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Nomor WhatsApp"
                       />
                     </div>

                     <div>
                       <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                         Email
                       </label>
                       <input
                         type="email"
                         id="email"
                         name="email"
                         value={formData.email}
                         onChange={handleInputChange}
                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Email pengelola"
                       />
                     </div>

                     <div className="md:col-span-2">
                       <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                         Website
                       </label>
                       <input
                         type="url"
                         id="website"
                         name="website"
                         value={formData.website}
                         onChange={handleInputChange}
                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                         placeholder="https://website.com"
                       />
                     </div>
                   </div>
                 </div>

                 {/* Menu Section */}
                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Makanan</h3>
                   <div className="space-y-4">
                     <div>
                       <label htmlFor="menu" className="block text-sm font-medium text-gray-700 mb-2">
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
                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                         placeholder="Masukkan menu satu per baris&#10;Contoh:&#10;Mendoan Tempe - Rp 8.000&#10;Soto Sokaraja - Rp 18.000&#10;Getuk Goreng - Rp 10.000"
                       />
                       <p className="text-xs text-gray-500 mt-1">Masukkan menu satu per baris. Format: Nama Menu - Harga</p>
                     </div>
                   </div>
                 </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fitur & Fasilitas
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Masakan Tradisional', 'Harga Terjangkau', 'Suasana Nyaman', 'Parkir Luas', 'WiFi Gratis', 'Live Music', 'Delivery', 'Reservasi'].map(feature => (
                      <label key={feature} className="flex items-center">
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
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Gambar Kuliner</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="img_sm" className="block text-sm font-medium text-gray-700 mb-2">
                        Gambar Kecil (untuk Card/Thumbnail)
                      </label>
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                        <p className="text-sm text-blue-800 font-medium mb-1">📱 Digunakan untuk:</p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          <li>• Card kuliner di halaman utama</li>
                          <li>• Thumbnail di list pencarian</li>
                          <li>• Preview di kategori makanan</li>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      />
                      {imagePreviews.img_sm && (
                        <div className="mt-2 relative">
                          <img 
                            src={imagePreviews.img_sm} 
                            alt="Preview Gambar Kecil" 
                            className="w-32 h-32 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('img_sm')}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold"
                            title="Hapus gambar"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimal 5MB</p>
                    </div>

                    <div>
                      <label htmlFor="img_lg" className="block text-sm font-medium text-gray-700 mb-2">
                        Gambar Besar (untuk Detail/Hero)
                      </label>
                      <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                        <p className="text-sm text-green-800 font-medium mb-1">🖼️ Digunakan untuk:</p>
                        <ul className="text-xs text-green-700 space-y-1">
                          <li>• Halaman detail kuliner</li>
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      />
                      {imagePreviews.img_lg && (
                        <div className="mt-2 relative">
                          <img 
                            src={imagePreviews.img_lg} 
                            alt="Preview Gambar Besar" 
                            className="w-32 h-32 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage('img_lg')}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-sm font-bold"
                            title="Hapus gambar"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimal 5MB</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <GalleryUploader files={galleryFiles} setFiles={setGalleryFiles} />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="recommended"
                    name="recommended"
                    checked={formData.recommended}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="recommended" className="ml-2 block text-sm text-gray-900">
                    Rekomendasikan item ini
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href="/admin/culinary"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
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
