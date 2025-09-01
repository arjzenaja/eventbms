'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Calendar, MapPin, Users, DollarSign, Info } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import GalleryUploader from '@/components/GalleryUploader';

export default function NewEvent() {
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
    event_type: '',
    category: '',
    date: '',
    time: '',
    end_date: '',
    end_time: '',
    location: '',
    organizer: '',
    highlights: [],
    performers: [],
    pricing: {
      presale: '',
      normal: '',
      vip: '',
      free: false
    },
    facilities: [],
    poster_link: '',
    ticket_link: '',
    additional_info: '',
    latitude: '',
    longitude: '',
    opening_hours: '',
    recommended: false,
    seats: []
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const eventTypeOptions = [
    'Tradisi budaya',
    'Karnaval',
    'Pawai',
    'Lomba desa',
    'Hari jadi kabupaten',
    'Konser musik',
    'Festival seni',
    'Bazar UMKM',
    'Pameran teknologi',
    'Lomba cosplay',
    'Festival kuliner',
    'Workshop',
    'Seminar',
    'Pertunjukan',
    'Lainnya'
  ];

  const highlightOptions = [
    'Kirab budaya',
    'Pertunjukan tari tradisional',
    'Stand UMKM lokal',
    'Festival kuliner',
    'Lomba kostum tradisional',
    'Parade musik',
    'Pameran seni',
    'Workshop kreatif',
    'Kompetisi',
    'Meet & Greet',
    'Live music',
    'Food festival',
    'Art exhibition',
    'Cultural performance',
    'Lainnya'
  ];

  const facilityOptions = [
    'Area parkir',
    'Toilet',
    'Booth makanan',
    'Petugas keamanan',
    'Ambulans / P3K',
    'Spot foto',
    'Area duduk',
    'WiFi',
    'Charging station',
    'First aid',
    'Lost & found',
    'Information desk',
    'Lainnya'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePricingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const handleHighlightChange = (highlight) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.includes(highlight)
        ? prev.highlights.filter(h => h !== highlight)
        : [...prev.highlights, highlight]
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

  const handlePerformerChange = (e) => {
    const { value } = e.target;
    if (value && !formData.performers.includes(value)) {
      setFormData(prev => ({
        ...prev,
        performers: [...prev.performers, value]
      }));
      e.target.value = '';
    }
  };

  // Seats handlers
  const addSeat = () => {
    setFormData(prev => ({
      ...prev,
      seats: [
        ...prev.seats,
        { seat: '', price: '', desc: '', includes: [], terms_requirements: [], terms_cancellation: [] }
      ]
    }));
  };

  const removeSeat = (index) => {
    setFormData(prev => ({
      ...prev,
      seats: prev.seats.filter((_, i) => i !== index)
    }));
  };

  const updateSeatField = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      seats: prev.seats.map((s, i) => i === index ? { ...s, [field]: value } : s)
    }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      setImageFiles(prev => ({
        ...prev,
        [name]: file
      }));
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

  const removePerformer = (index) => {
    setFormData(prev => ({
      ...prev,
      performers: prev.performers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'pricing') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'seats') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (Array.isArray(formData[key])) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (imageFiles.img_sm) formDataToSend.append('img_sm', imageFiles.img_sm);
      if (imageFiles.img_lg) formDataToSend.append('img_lg', imageFiles.img_lg);
      if (galleryFiles && galleryFiles.length > 0) {
        galleryFiles.forEach((file) => formDataToSend.append('gallery[]', file));
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Event berhasil dibuat!');
        // Reset minimal
        setFormData({
          title: '', short_description: '', description: '', event_type: '', category: '', date: '', time: '', end_date: '', end_time: '', location: '', organizer: '', highlights: [], performers: [], pricing: { presale: '', normal: '', vip: '', free: false }, facilities: [], poster_link: '', ticket_link: '', additional_info: '', latitude: '', longitude: '', opening_hours: '', recommended: false, seats: []
        });
        setImageFiles({ img_sm: null, img_lg: null });
        setImagePreviews({ img_sm: null, img_lg: null });
        setGalleryFiles([]);
      } else {
        setError(data.message || 'Gagal membuat event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Terjadi kesalahan saat membuat event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/dashboard"
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Tambah Event Baru</h1>
                  <p className="text-sm text-gray-500">Tambah event baru ke platform</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Informasi Dasar</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Event *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Contoh: Festival Kenthongan Banyumas"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipe Event *
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer hover:border-gray-400"
                      required
                    >
                      <option value="">Pilih tipe event</option>
                      <option value="event-rakyat">Event Rakyat</option>
                      <option value="event-banyumas">Event Banyumas</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="event_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Event *
                  </label>
                  <div className="relative">
                    <select
                      id="event_type"
                      name="event_type"
                      value={formData.event_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white cursor-pointer hover:border-gray-400"
                      required
                    >
                      <option value="">Pilih jenis event</option>
                      {eventTypeOptions.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Singkat Event *
                  </label>
                  <textarea
                    id="short_description"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Jelaskan isi acaranya, sejarah atau latar belakang, tujuan, siapa penyelenggaranya, dan nilai budaya/lokal yang diangkat..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Lengkap
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Deskripsi lengkap tentang event..."
                  />
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Tanggal & Waktu
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Mulai *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    Waktu Mulai *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                    Waktu Selesai
                  </label>
                  <input
                    type="time"
                    id="end_time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Location & Organizer */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Lokasi & Penyelenggara
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi / Tempat Pelaksanaan *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Contoh: Alun-Alun Purwokerto"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-2">
                    Penyelenggara / Promotor *
                  </label>
                  <input
                    type="text"
                    id="organizer"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Contoh: Dinas Kebudayaan Banyumas"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Highlights / Rangkaian Acara */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Rangkaian Acara / Highlight Kegiatan</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {highlightOptions.map((highlight) => (
                  <div key={highlight} className="flex items-center">
                    <input
                      type="checkbox"
                      id={highlight}
                      checked={formData.highlights.includes(highlight)}
                      onChange={() => handleHighlightChange(highlight)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={highlight} className="ml-2 block text-sm text-gray-700">
                      {highlight}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Performers / Pengisi Acara */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Daftar Pengisi Acara / Bintang Tamu</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="performer" className="block text-sm font-medium text-gray-700 mb-2">
                    Tambah Pengisi Acara
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="performer"
                      name="performer"
                      onKeyPress={(e) => e.key === 'Enter' && handlePerformerChange(e)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Contoh: Fiersa Besari"
                    />
                    <button
                      type="button"
                      onClick={handlePerformerChange}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Tambah
                    </button>
                  </div>
                </div>

                {formData.performers.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Daftar Pengisi Acara:</h4>
                    <div className="space-y-2">
                      {formData.performers.map((performer, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-700">{performer}</span>
                          <button
                            type="button"
                            onClick={() => removePerformer(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                Biaya Masuk
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="free"
                    name="free"
                    checked={formData.pricing.free}
                    onChange={handlePricingChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="free" className="ml-2 block text-sm text-gray-700">
                    Event Gratis
                  </label>
                </div>

                {!formData.pricing.free && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="presale" className="block text-sm font-medium text-gray-700 mb-2">
                        Harga Presale (Rp)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                        <input
                          type="text"
                          id="presale"
                          name="presale"
                          value={formData.pricing.presale}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setFormData(prev => ({
                              ...prev,
                              pricing: {
                                ...prev.pricing,
                                presale: value
                              }
                            }));
                          }}
                          onBlur={(e) => {
                            if (formData.pricing.presale) {
                              const formattedValue = `${formData.pricing.presale}000`;
                              setFormData(prev => ({
                                ...prev,
                                pricing: {
                                  ...prev.pricing,
                                  presale: formattedValue
                                }
                              }));
                            }
                          }}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="25000"
                          maxLength="6"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="normal" className="block text-sm font-medium text-gray-700 mb-2">
                        Harga Normal (Rp) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                        <input
                          type="text"
                          id="normal"
                          name="normal"
                          value={formData.pricing.normal}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setFormData(prev => ({
                              ...prev,
                              pricing: {
                                ...prev.pricing,
                                normal: value
                              }
                            }));
                          }}
                          onBlur={(e) => {
                            if (formData.pricing.normal) {
                              const formattedValue = `${formData.pricing.normal}000`;
                              setFormData(prev => ({
                                ...prev,
                                pricing: {
                                  ...prev.pricing,
                                  normal: formattedValue
                                }
                              }));
                            }
                          }}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="40000"
                          maxLength="6"
                          required={!formData.pricing.free}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="vip" className="block text-sm font-medium text-gray-700 mb-2">
                        Harga VIP (Rp)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
                        <input
                          type="text"
                          id="vip"
                          name="vip"
                          value={formData.pricing.vip}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setFormData(prev => ({
                              ...prev,
                              pricing: {
                                ...prev.pricing,
                                vip: value
                              }
                            }));
                          }}
                          onBlur={(e) => {
                            if (formData.pricing.vip) {
                              const formattedValue = `${formData.pricing.vip}000`;
                              setFormData(prev => ({
                                ...prev,
                                pricing: {
                                  ...prev.pricing,
                                  vip: formattedValue
                                }
                              }));
                            }
                          }}
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="75000"
                          maxLength="6"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Paket / Seats */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Paket / Seats</h2>
              <div className="space-y-4">
                {formData.seats.map((s, idx) => (
                  <div key={idx} className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input type="text" placeholder="Nama paket (VIP/Reguler)" value={s.seat}
                        onChange={(e)=>updateSeatField(idx,'seat',e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg" />
                      <input type="number" placeholder="Harga (angka)" value={s.price}
                        onChange={(e)=>updateSeatField(idx,'price',e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg" />
                      <input type="text" placeholder="Deskripsi singkat" value={s.desc}
                        onChange={(e)=>updateSeatField(idx,'desc',e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input type="text" placeholder="Fitur termasuk (pisahkan koma)" value={Array.isArray(s.includes)? s.includes.join(', ') : s.includes}
                        onChange={(e)=>updateSeatField(idx,'includes', e.target.value.split(',').map(t=>t.trim()).filter(Boolean))}
                        className="w-full px-3 py-2 border rounded-lg" />
                      <input type="text" placeholder="Syarat (pisahkan koma)" value={Array.isArray(s.terms_requirements)? s.terms_requirements.join(', ') : s.terms_requirements}
                        onChange={(e)=>updateSeatField(idx,'terms_requirements', e.target.value.split(',').map(t=>t.trim()).filter(Boolean))}
                        className="w-full px-3 py-2 border rounded-lg" />
                      <input type="text" placeholder="Pembatalan (pisahkan koma)" value={Array.isArray(s.terms_cancellation)? s.terms_cancellation.join(', ') : s.terms_cancellation}
                        onChange={(e)=>updateSeatField(idx,'terms_cancellation', e.target.value.split(',').map(t=>t.trim()).filter(Boolean))}
                        className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div className="flex justify-end">
                      <button type="button" onClick={()=>removeSeat(idx)} className="text-red-600 text-sm">Hapus Paket</button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addSeat} className="px-4 py-2 bg-blue-600 text-white rounded-lg">+ Tambah Paket</button>
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Fasilitas & Keamanan</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {facilityOptions.map((facility) => (
                  <div key={facility} className="flex items-center">
                    <input
                      type="checkbox"
                      id={facility}
                      checked={formData.facilities.includes(facility)}
                      onChange={() => handleFacilityChange(facility)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={facility} className="ml-2 block text-sm text-gray-700">
                      {facility}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Link & Dokumentasi</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="poster_link" className="block text-sm font-medium text-gray-700 mb-2">
                    Link Poster / Dokumentasi
                  </label>
                  <input
                    type="url"
                    id="poster_link"
                    name="poster_link"
                    value={formData.poster_link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Google Drive, Instagram, atau Youtube"
                  />
                </div>

                <div>
                  <label htmlFor="ticket_link" className="block text-sm font-medium text-gray-700 mb-2">
                    Link Tiket Online
                  </label>
                  <input
                    type="url"
                    id="ticket_link"
                    name="ticket_link"
                    value={formData.ticket_link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Tiket.com, Loket.com, dll"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-600" />
                Info Tambahan
              </h2>
              
              <div>
                <label htmlFor="additional_info" className="block text-sm font-medium text-gray-700 mb-2">
                  Informasi Tambahan
                </label>
                <textarea
                  id="additional_info"
                  name="additional_info"
                  value={formData.additional_info}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Contoh: Akses transportasi, info stand pendaftaran, live streaming, parkir gratis, dresscode, larangan bawa makanan, akses untuk difabel, live TikTok/IG, dll."
                />
              </div>
            </div>

            {/* Lokasi & Penyelenggara */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Koordinat & Jam Operasional
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" name="latitude" value={formData.latitude} onChange={handleInputChange} placeholder="Latitude" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                <input type="text" name="longitude" value={formData.longitude} onChange={handleInputChange} placeholder="Longitude" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                <input type="text" name="opening_hours" value={formData.opening_hours} onChange={handleInputChange} placeholder="09:00 - 21:00" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              </div>
            </div>

            {/* Event Images */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-600" />
                Gambar Event
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="img_sm" className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Depan (untuk Card)
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                    <p className="text-sm text-blue-800 font-medium mb-1">📱 Digunakan untuk:</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Card event di halaman utama</li>
                      <li>• Thumbnail di list pencarian</li>
                      <li>• Preview di kategori event</li>
                      <li>• Tampilan mobile yang responsif</li>
                    </ul>
                    <p className="text-xs text-blue-600 mt-2">💡 <strong>Rekomendasi:</strong> Gunakan gambar dengan rasio 1:1 (persegi) untuk hasil terbaik</p>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="file"
                      id="img_sm"
                      name="img_sm"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    {imagePreviews.img_sm && (
                      <div className="relative">
                        <img 
                          src={imagePreviews.img_sm} 
                          alt="Preview Gambar Depan" 
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
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimal 5MB</p>
                </div>

                <div>
                  <label htmlFor="img_lg" className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Galeri (untuk Detail)
                  </label>
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                    <p className="text-sm text-green-800 font-medium mb-1">🖼️ Digunakan untuk:</p>
                    <ul className="text-xs text-green-700 space-y-1">
                      <li>• Halaman detail event</li>
                      <li>• Hero section yang menarik</li>
                      <li>• Galeri foto berkualitas tinggi</li>
                      <li>• Tampilan desktop yang optimal</li>
                    </ul>
                    <p className="text-xs text-green-600 mt-2">💡 <strong>Rekomendasi:</strong> Gunakan gambar landscape (16:9) atau portrait (4:3) dengan resolusi tinggi</p>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="file"
                      id="img_lg"
                      name="img_lg"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    {imagePreviews.img_lg && (
                      <div className="relative">
                        <img 
                          src={imagePreviews.img_lg} 
                          alt="Preview Gambar Galeri" 
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
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF. Maksimal 5MB</p>
                </div>
              </div>
            </div>

            {/* Recommended */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
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
                  Tandai sebagai event yang direkomendasikan
                </label>
              </div>
            </div>

            {/* Galeri Event */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Galeri Event</h2>
              <GalleryUploader files={galleryFiles} setFiles={setGalleryFiles} />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/dashboard"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Membuat Event...
                  </div>
                ) : (
                  'Buat Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
