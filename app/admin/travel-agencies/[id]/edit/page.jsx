'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function EditTravelAgency() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'biro-perjalanan',
    location: '',
    category: 'Biro Perjalanan',
    short_description: '',
    description: '',
    contact: '',
    address: '',
    services: [],
    facilities: [],
    features: [],
    price_range: '',
    opening_hours: '',
    rating: '',
    coordinates: {
      lat: '',
      lng: ''
    },
    gallery: [],
    manager: {
      name: '',
      phone: '',
      email: '',
      whatsapp: '',
      instagram: '',
      website: '',
      position: '',
      experience: '',
      rating: '',
      availability: ''
    },
    prices: [],
    recommended: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState({ img_sm: null, img_lg: null });
  const [galleryFiles, setGalleryFiles] = useState([]);

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

  const travelAgencyTypes = [
    { value: 'biro-perjalanan', label: 'Biro Perjalanan' },
    { value: 'travel-agent', label: 'Travel Agent' },
    { value: 'tour-operator', label: 'Tour Operator' },
    { value: 'online-travel', label: 'Online Travel' }
  ];

  const categories = [
    { value: 'Biro Perjalanan', label: 'Biro Perjalanan' },
    { value: 'Travel Agent', label: 'Travel Agent' },
    { value: 'Tour Operator', label: 'Tour Operator' },
    { value: 'Online Travel', label: 'Online Travel' }
  ];

  const availableServices = [
    'Paket Wisata', 'Tiket Pesawat', 'Tiket Kereta', 'Hotel Booking', 'Rental Mobil', 'Tour Guide', 'Visa Service', 'Travel Insurance',
    'Paket wisata lokal (one day trip, city tour)', 'Layanan sewa mobil', 'Open trip / private trip', 'Paket Honeymoon', 'Paket Keluarga'
  ];

  const availableFacilities = [
    'Kantor Cabang', 'Online Booking', '24/7 Support', 'Mobile App', 'Loyalty Program', 'Corporate Travel', 'Group Tours', 'Custom Packages',
    'WiFi', 'Parkir Luas', 'Ruang Tunggu', 'Konsultasi Gratis', 'Asuransi Perjalanan'
  ];

  const availableFeatures = [
    'Fasilitas Dasar', 'Masakan Indonesia', 'Suasana Nyaman', 'Masakan Tradisional', 'Parkir Luas',
    'Tour Guide Berpengalaman', 'Transportasi Nyaman', 'Akomodasi Berkualitas', 'Makanan Halal', 'Asuransi Perjalanan'
  ];

  useEffect(() => {
    const fetchTravelAgency = async () => {
      try {
        const response = await fetch(`/api/biro_perjalanan/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setFormData({
            title: data.biro_perjalanan.title || '',
            type: data.biro_perjalanan.type || 'biro-perjalanan',
            location: data.biro_perjalanan.location || '',
            category: data.biro_perjalanan.category || 'Biro Perjalanan',
            short_description: data.biro_perjalanan.short_description || '',
            description: data.biro_perjalanan.description || '',
            contact: data.biro_perjalanan.contact || '',
            address: data.biro_perjalanan.address || '',
            services: data.biro_perjalanan.services || [],
            facilities: data.biro_perjalanan.facilities || [],
            features: data.biro_perjalanan.features || [],
            price_range: data.biro_perjalanan.price_range || '',
            opening_hours: data.biro_perjalanan.opening_hours || '',
            rating: data.biro_perjalanan.rating || '',
            coordinates: data.biro_perjalanan.coordinates || { lat: '', lng: '' },
            gallery: data.biro_perjalanan.gallery || [],
            manager: data.biro_perjalanan.manager || {
              name: '',
              phone: '',
              email: '',
              whatsapp: '',
              instagram: '',
              website: '',
              position: '',
              experience: '',
              rating: '',
              availability: ''
            },
            prices: data.biro_perjalanan.prices || [],
            recommended: data.biro_perjalanan.recommended || false
          });
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching travel agency:', error);
        setError('Terjadi kesalahan saat mengambil data biro perjalanan');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTravelAgency();
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

  const handleManagerChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      manager: {
        ...prev.manager,
        [field]: value
      }
    }));
  };

  const handleServiceChange = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleFacilityChange = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleFeatureChange = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = files?.[0];
    if (!file) return;
    setImageFiles(prev => ({ ...prev, [name]: file }));
  };
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    setGalleryFiles(prev => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([k,v])=>{
        if (k === 'coordinates') { form.append('lat', formData.coordinates.lat || ''); form.append('lng', formData.coordinates.lng || ''); }
        else if (Array.isArray(v)) { form.append(k, JSON.stringify(v)); }
        else if (typeof v === 'object' && v !== null) { form.append(k, JSON.stringify(v)); }
        else { form.append(k, v ?? ''); }
      });
      if (imageFiles.img_sm) form.append('img_sm', imageFiles.img_sm);
      if (imageFiles.img_lg) form.append('img_lg', imageFiles.img_lg);
      galleryFiles.forEach((f,i)=> form.append('gallery[]', f));

      const response = await fetch(`/api/biro_perjalanan/${id}`, { method: 'PUT', body: form });
      const data = await response.json();

      if (data.success) {
        alert('Biro perjalanan berhasil diperbarui!');
        router.push('/admin/travel-agencies');
      } else {
        alert('Gagal memperbarui biro perjalanan: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating travel agency:', error);
      alert('Terjadi kesalahan saat memperbarui biro perjalanan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data biro perjalanan..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data biro perjalanan"
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
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.5 3a1 1 0 00-.894.553L8.382 6H5a1 1 0 000 2h2.382l1.224 2.447A1 1 0 009.5 11h5a1 1 0 00.894-.553L16.618 8H19a1 1 0 100-2h-2.382l-1.224-2.447A1 1 0 0014.5 3h-4z"/></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Edit Biro Perjalanan</h1>
                  <p className="mt-1 text-sm text-gray-500">Perbarui informasi layanan, fasilitas, pengelola, dan lokasi.</p>
                </div>
              </div>
              <Link href="/admin/travel-agencies" className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">← Kembali</Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-6 p-6">
                {/* Basic Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Dasar</h3>
                  
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Nama Biro Perjalanan * 
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Masukkan nama biro perjalanan"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <CustomSelect
                        label="Tipe Layanan *"
                        value={formData.type}
                        onChange={(v)=>handleInputChange({ target:{ name:'type', value:v }})}
                        options={travelAgencyTypes}
                      />
                    </div>

                    <div>
                      <CustomSelect
                        label="Kategori *"
                        value={formData.category}
                        onChange={(v)=>handleInputChange({ target:{ name:'category', value:v }})}
                        options={categories}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Alamat Lengkap
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Masukkan alamat lengkap"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label htmlFor="price_range" className="block text-sm font-medium text-gray-700">
                        Kisaran Harga
                      </label>
                      <input
                        type="text"
                        id="price_range"
                        name="price_range"
                        value={formData.price_range}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contoh: 500.000 - 1.000.000"
                      />
                    </div>

                    <div>
                      <label htmlFor="opening_hours" className="block text-sm font-medium text-gray-700">
                        Jam Operasional
                      </label>
                      <input
                        type="text"
                        id="opening_hours"
                        name="opening_hours"
                        value={formData.opening_hours}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contoh: 08:00 - 17:00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                        Rating
                      </label>
                      <input
                        type="text"
                        id="rating"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contoh: 4.5"
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
                        placeholder="Nomor telepon atau email"
                      />
                    </div>
                  </div>
                </div>

                {/* Coordinates */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Koordinat Lokasi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="lat" className="block text-sm font-medium text-gray-700">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        id="lat"
                        value={formData.coordinates.lat}
                        onChange={(e) => handleCoordinateChange('lat', e.target.value)}
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
                        step="any"
                        id="lng"
                        value={formData.coordinates.lng}
                        onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contoh: 109.2194"
                      />
                    </div>
                  </div>
                </div>

                {/* Manager Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Pengelola</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="manager_name" className="block text-sm font-medium text-gray-700">
                        Nama Pengelola
                      </label>
                      <input
                        type="text"
                        id="manager_name"
                        value={formData.manager.name}
                        onChange={(e) => handleManagerChange('name', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nama pengelola"
                      />
                    </div>
                    <div>
                      <label htmlFor="manager_position" className="block text-sm font-medium text-gray-700">
                        Jabatan
                      </label>
                      <input
                        type="text"
                        id="manager_position"
                        value={formData.manager.position}
                        onChange={(e) => handleManagerChange('position', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Jabatan pengelola"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label htmlFor="manager_phone" className="block text-sm font-medium text-gray-700">
                        Telepon Pengelola
                      </label>
                      <input
                        type="text"
                        id="manager_phone"
                        value={formData.manager.phone}
                        onChange={(e) => handleManagerChange('phone', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nomor telepon"
                      />
                    </div>
                    <div>
                      <label htmlFor="manager_email" className="block text-sm font-medium text-gray-700">
                        Email Pengelola
                      </label>
                      <input
                        type="email"
                        id="manager_email"
                        value={formData.manager.email}
                        onChange={(e) => handleManagerChange('email', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Email pengelola"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label htmlFor="manager_whatsapp" className="block text-sm font-medium text-gray-700">
                        WhatsApp Pengelola
                      </label>
                      <input
                        type="text"
                        id="manager_whatsapp"
                        value={formData.manager.whatsapp}
                        onChange={(e) => handleManagerChange('whatsapp', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nomor WhatsApp"
                      />
                    </div>
                    <div>
                      <label htmlFor="manager_instagram" className="block text-sm font-medium text-gray-700">
                        Instagram Pengelola
                      </label>
                      <input
                        type="text"
                        id="manager_instagram"
                        value={formData.manager.instagram}
                        onChange={(e) => handleManagerChange('instagram', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="@username"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label htmlFor="manager_website" className="block text-sm font-medium text-gray-700">
                        Website Pengelola
                      </label>
                      <input
                        type="url"
                        id="manager_website"
                        value={formData.manager.website}
                        onChange={(e) => handleManagerChange('website', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="manager_availability" className="block text-sm font-medium text-gray-700">
                        Ketersediaan
                      </label>
                      <input
                        type="text"
                        id="manager_availability"
                        value={formData.manager.availability}
                        onChange={(e) => handleManagerChange('availability', e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Contoh: 24/7"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Deskripsi</h3>
                  <div>
                    <label htmlFor="short_description" className="block text-sm font-medium text-gray-700">
                      Deskripsi Singkat
                    </label>
                    <textarea
                      id="short_description"
                      name="short_description"
                      rows={3}
                      value={formData.short_description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Masukkan deskripsi singkat"
                    />
                  </div>
                  <div className="mt-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Deskripsi Lengkap *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={6}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Masukkan deskripsi lengkap"
                    />
                  </div>
                </div>

                {/* Services */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Layanan yang Ditawarkan</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableServices.map(service => (
                      <label key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service)}
                          onChange={() => handleServiceChange(service)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Facilities */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Fasilitas yang Tersedia</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableFacilities.map(facility => (
                      <label key={facility} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(facility)}
                          onChange={() => handleFacilityChange(facility)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Fitur & Keunggulan</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableFeatures.map(feature => (
                      <label key={feature} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.features.includes(feature)}
                          onChange={() => handleFeatureChange(feature)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-900">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Recommended */}
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
                    Rekomendasikan biro perjalanan ini
                  </label>
                </div>

                {/* Image Uploads */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Gambar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gambar Kecil (Thumbnail)</label>
                      <input type="file" name="img_sm" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gambar Besar (Header)</label>
                      <input type="file" name="img_lg" accept="image/*" onChange={handleImageChange} className="mt-1 block w-full" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Galeri</label>
                    <input type="file" multiple accept="image/*" onChange={handleGalleryChange} className="mt-1 block w-full" />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href="/admin/travel-agencies"
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









