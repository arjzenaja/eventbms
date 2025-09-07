'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

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
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
      <button type="button" aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(o => !o)} className={`w-full px-4 py-2.5 border rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-150 flex items-center justify-between shadow-sm ${open ? 'border-indigo-500' : 'border-gray-300'}`}>
        <span className="flex items-center gap-3">
          {current?.icon && <span className="text-lg leading-none">{current.icon}</span>}
          <span className="font-medium truncate">{current?.label}</span>
        </span>
        <span className={`shrink-0 rounded-full border ${open ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200'} p-1.5 transition-colors`}>
          <svg className={`w-4 h-4 ${open ? 'text-indigo-600' : 'text-gray-600'} transition-transform duration-150 ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="relative">
          <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="max-h-72 overflow-y-auto">
              {options.map(opt => (
                <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setOpen(false); }} className={`w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-indigo-50 ${value === opt.value ? 'bg-indigo-50' : ''}`}>
                  <span className="flex items-center gap-3">
                    {opt.icon && <span className="text-lg leading-none">{opt.icon}</span>}
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

export default function NewVillagePackage() {
  const router = useRouter();
  const [villages, setVillages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Aktivitas',
    duration: '',
    villageId: '',
    features: '',
    popular: false,
    available: true,
    rating: '4.8',
    // Field baru yang ditambahkan
    image: '',
    maxCapacity: '',
    minOrder: '1',
    terms: '',
    contact: '',
    location: '',
    availableTime: '',
    discount: '',
    discountType: 'percentage',
    discountValue: '',
    discountValidUntil: '',
    highlights: '',
    includedItems: '',
    excludedItems: '',
    cancellationPolicy: '',
    ageRestriction: '',
    difficultyLevel: 'Mudah',
    seasonality: 'Sepanjang Tahun'
  });

  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const response = await fetch('/api/desa_wisata');
        const data = await response.json();
        
        if (data.success) {
          setVillages(data.desa_wisata || []);
        }
      } catch (error) {
        console.error('Error fetching villages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVillages();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Add form data
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });
      
      // Add village slug if village is selected
      if (form.villageId) {
        const selectedVillage = villages.find(v => v.id === form.villageId);
        if (selectedVillage) {
          formData.append('villageSlug', selectedVillage.title.toLowerCase().replace(/\s+/g, '-'));
        }
      }

      const response = await fetch('/api/villages/packages', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Layanan desa wisata berhasil ditambahkan!');
        router.push('/admin/villages/packages');
      } else {
        alert('Gagal menambahkan layanan: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat menyimpan layanan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data desa wisata...</p>
          </div>
        </div>
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
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <svg className="w-7 h-7 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V7a2 2 0 00-2-2h-4l-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4"/></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Tambah Layanan Desa Wisata</h1>
                  <p className="text-gray-600 mt-1">Isi info layanan, pilih desa & kategori, atur harga dan status.</p>
                </div>
              </div>
              <Link 
                href="/admin/villages/packages"
                className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                Kembali
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Layanan *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: Tiket Masuk, Jasa Pemandu, Paket Berkebun"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desa Wisata *
                    </label>
                    <CustomSelect
                      label="Desa Wisata *"
                      value={form.villageId || ''}
                      onChange={(v) => setForm(prev => ({ ...prev, villageId: v }))}
                      options={[{ value: '', label: 'Pilih Desa Wisata', icon: '🗂️' }, ...villages.map(v => ({ value: v.id, label: v.title, icon: '🏘️' }))]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori *
                    </label>
                    <CustomSelect
                      label="Kategori *"
                      value={form.category}
                      onChange={(v) => setForm(prev => ({ ...prev, category: v }))}
                      options={[
                        { value: 'Tiket & Parkir', label: 'Tiket & Parkir', icon: '🎟️' },
                        { value: 'Aktivitas', label: 'Aktivitas', icon: '🏞️' },
                        { value: 'Penginapan', label: 'Penginapan', icon: '🛏️' },
                        { value: 'Layanan', label: 'Layanan', icon: '🧰' },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga (Rp) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="10000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Isi 0 jika gratis</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durasi
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: 2-3 jam, Seharian, 1-2 jam"
                    />
                  </div>

                  <div>
                    <CustomSelect
                      label="Rating"
                      value={form.rating}
                      onChange={(v) => setForm(prev => ({ ...prev, rating: v }))}
                      options={[
                        { value: '4.5', label: '4.5 ⭐', icon: '⭐' },
                        { value: '4.7', label: '4.7 ⭐', icon: '⭐' },
                        { value: '4.8', label: '4.8 ⭐', icon: '⭐' },
                        { value: '4.9', label: '4.9 ⭐', icon: '⭐' },
                        { value: '5.0', label: '5.0 ⭐', icon: '⭐' },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kapasitas Maksimal
                    </label>
                    <input
                      type="text"
                      name="maxCapacity"
                      value={form.maxCapacity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: 10 orang, 20 orang"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Pemesanan
                    </label>
                    <input
                      type="number"
                      name="minOrder"
                      value={form.minOrder}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm appearance-none"
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <CustomSelect
                      label="Tingkat Kesulitan"
                      value={form.difficultyLevel}
                      onChange={(v) => setForm(prev => ({ ...prev, difficultyLevel: v }))}
                      options={[
                        { value: 'Mudah', label: 'Mudah', icon: '😊' },
                        { value: 'Sedang', label: 'Sedang', icon: '😅' },
                        { value: 'Sulit', label: 'Sulit', icon: '😮‍💨' },
                        { value: 'Sangat Sulit', label: 'Sangat Sulit', icon: '💪' },
                      ]}
                    />
                  </div>

                  <div>
                    <CustomSelect
                      label="Musim Tersedia"
                      value={form.seasonality}
                      onChange={(v) => setForm(prev => ({ ...prev, seasonality: v }))}
                      options={[
                        { value: 'Sepanjang Tahun', label: 'Sepanjang Tahun', icon: '📅' },
                        { value: 'Musim Kemarau', label: 'Musim Kemarau', icon: '☀️' },
                        { value: 'Musim Hujan', label: 'Musim Hujan', icon: '🌧️' },
                        { value: 'Musim Semi', label: 'Musim Semi', icon: '🌸' },
                        { value: 'Musim Gugur', label: 'Musim Gugur', icon: '🍂' },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Media & Visual */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Media & Visual</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Gambar/Thumbnail
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Link gambar untuk layanan ini</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Highlights/Poin Unggulan
                    </label>
                    <input
                      type="text"
                      name="highlights"
                      value={form.highlights}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: Pemandangan indah, Pengalaman unik, Lokasi strategis"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Deskripsi</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Layanan *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                    placeholder="Jelaskan detail layanan, apa yang didapat, dll."
                  />
                </div>
              </div>

              {/* Features & Inclusions */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Fitur & Inklusi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fitur (pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      name="features"
                      value={form.features}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: Gratis anak &lt; 3 tahun, Diskon pelajar 50%, Max 10 orang"
                    />
                    <p className="text-xs text-gray-500 mt-1">Contoh: Gratis anak &lt; 3 tahun, Diskon pelajar 50%, Max 10 orang, Termasuk sejarah, Bahasa Indonesia</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item yang Disediakan
                    </label>
                    <input
                      type="text"
                      name="includedItems"
                      value={form.includedItems}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: Alat berkebun, Bahan memasak, Tenda camping"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item yang Tidak Disediakan
                    </label>
                    <input
                      type="text"
                      name="excludedItems"
                      value={form.excludedItems}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: Makanan pribadi, Pakaian ganti, Transportasi"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Contact */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Lokasi & Kontak</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi Spesifik
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: Area camping, Rumah warga, Pusat desa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Informasi Kontak
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value={form.contact}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: 0812-3456-7890, pemandu@desa.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waktu Tersedia
                    </label>
                    <input
                      type="text"
                      name="availableTime"
                      value={form.availableTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: 08:00-17:00, 24 jam, Setelah Maghrib"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Batasan Usia
                    </label>
                    <input
                      type="text"
                      name="ageRestriction"
                      value={form.ageRestriction}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: 5+ tahun, 12+ tahun, Semua umur"
                    />
                  </div>
                </div>
              </div>

              {/* Discount & Special Offers */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Diskon & Penawaran Khusus</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <CustomSelect
                      label="Jenis Diskon"
                      value={form.discountType}
                      onChange={(v) => setForm(prev => ({ ...prev, discountType: v }))}
                      options={[
                        { value: 'percentage', label: 'Persentase (%)', icon: '％' },
                        { value: 'fixed', label: 'Nominal (Rp)', icon: '💵' },
                        { value: 'none', label: 'Tidak Ada Diskon', icon: '⛔' },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nilai Diskon
                    </label>
                    <input
                      type="text"
                      name="discountValue"
                      value={form.discountValue}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: 10, 50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Berlaku Sampai
                    </label>
                    <input
                      type="date"
                      name="discountValidUntil"
                      value={form.discountValidUntil}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Terms & Policies */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Syarat & Ketentuan</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Syarat & Ketentuan
                    </label>
                    <textarea
                      name="terms"
                      value={form.terms}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Wajib membawa KTP, Minimal pemesanan 1 hari sebelumnya, Pembayaran di muka"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kebijakan Pembatalan
                    </label>
                    <textarea
                      name="cancellationPolicy"
                      value={form.cancellationPolicy}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Bisa dibatalkan 24 jam sebelumnya, Refund 50% jika dibatalkan H-1"
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="popular"
                      checked={form.popular}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Tandai sebagai Layanan Populer
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="available"
                      checked={form.available}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Layanan Tersedia
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link
                  href="/admin/villages/packages"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transform transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center gap-2 px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (<><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Menyimpan...</>) : (<>Simpan Layanan</>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
