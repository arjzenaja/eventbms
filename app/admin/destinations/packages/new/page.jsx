'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

function CustomSelect({ label, value, onChange, options, placeholder = 'Pilih...', className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const current = options.find(o => o.value === value);

  return (
    <div className={className} ref={ref}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <button type="button" onClick={() => setOpen(o => !o)} className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 flex items-center justify-between shadow-sm ${open ? 'border-indigo-500' : 'border-gray-300'}`}>
        <span className="flex items-center gap-3">
          <span className="text-xl leading-none">{current?.icon ?? '🔎'}</span>
          <span className="font-medium truncate">{current?.label ?? placeholder}</span>
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

export default function NewDestinationPackage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isDestOpen, setIsDestOpen] = useState(false);
  const [isDestShown, setIsDestShown] = useState(false);
  const destRef = useRef(null);
  
  const [form, setForm] = useState({
    destinationId: '',
    name: '',
    description: '',
    category: 'Paket Wisata',
    price: '',
    duration: '',
    capacity: '',
    facilities: '',
    available: true,
    popular: false
  });

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('/api/wisata');
        const data = await response.json();
        
        if (data.success) {
          setDestinations(data.wisata);
        } else {
          setError('Gagal memuat data destinasi');
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setError('Terjadi kesalahan saat memuat data destinasi');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Close destination dropdown on outside click or ESC
  useEffect(() => {
    const handleClick = (e) => {
      if (destRef.current && !destRef.current.contains(e.target)) {
        if (isDestOpen) {
          setIsDestShown(false);
          setTimeout(() => setIsDestOpen(false), 150);
        }
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape' && isDestOpen) {
        setIsDestShown(false);
        setTimeout(() => setIsDestOpen(false), 150);
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isDestOpen]);

  const openDest = () => { if (!isDestOpen) { setIsDestOpen(true); setTimeout(() => setIsDestShown(true), 0);} };
  const closeDest = () => { if (isDestOpen) { setIsDestShown(false); setTimeout(() => setIsDestOpen(false), 150);} };
  const selectedDestinationLabel = () => {
    const found = destinations.find(d => String(d.id) === String(form.destinationId));
    return found ? `${found.title} - ${found.location}` : 'Pilih destinasi...';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.destinationId || !form.name || !form.price) {
      alert('Destination, name, dan price harus diisi');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('destinationId', form.destinationId);
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('price', form.price);
      formData.append('facilities', form.facilities);
      formData.append('duration', form.duration);
      formData.append('capacity', form.capacity);
      formData.append('available', form.available.toString());
      formData.append('popular', form.popular.toString());
      
      const response = await fetch('/api/destinations/packages', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Paket destinasi berhasil ditambahkan!');
        router.push('/admin/destinations/packages');
      } else {
        alert('Gagal menambahkan paket: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating package:', error);
      alert('Terjadi kesalahan saat menambahkan paket');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data destinasi..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data destinasi"
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7l9-4 9 4-9 4-9-4z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7v10l-9 4-9-4V7"/></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Tambah Paket Wisata Baru</h1>
                  <p className="mt-1 text-sm text-gray-500">Isi detail paket, harga, durasi, dan status ketersediaan.</p>
                </div>
              </div>
              <Link
                href="/admin/destinations/packages"
                className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                Kembali
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Destination Selection */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>Pilih Destinasi</h3>
                <div ref={destRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destinasi <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => (isDestOpen ? closeDest() : openDest())}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 flex items-center justify-between shadow-sm"
                    aria-haspopup="listbox"
                    aria-expanded={isDestOpen}
                  >
                    <span className="text-black font-medium truncate text-left">
                      {selectedDestinationLabel()}
                    </span>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isDestOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  {isDestOpen && (
                    <div className="relative">
                      <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl transform transition duration-150 ease-out origin-top ${isDestShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`}>
                        <li>
                          <button
                            type="button"
                            onClick={() => { setForm(prev => ({ ...prev, destinationId: '' })); closeDest(); }}
                            className={`w-full px-4 py-3 text-left hover:bg-indigo-50 text-black ${form.destinationId === '' ? 'bg-indigo-50' : ''}`}
                          >
                            Pilih destinasi...
                          </button>
                        </li>
                        {destinations.map((dest) => (
                          <li key={dest.id}>
                            <button
                              type="button"
                              onClick={() => { setForm(prev => ({ ...prev, destinationId: String(dest.id) })); closeDest(); }}
                              className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-indigo-50 text-black ${String(form.destinationId) === String(dest.id) ? 'bg-indigo-50' : ''}`}
                            >
                              <span className="truncate mr-2 text-black">{dest.title} - {dest.location}</span>
                              {String(form.destinationId) === String(dest.id) && (
                                <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Package Details */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">📦 Detail Paket</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Paket <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">🏷️</div>
                      <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Contoh: Paket Standar"
                      />
                    </div>
                  </div>
                  
                  <CustomSelect
                    label="Kategori"
                    value={form.category}
                    onChange={(v) => setForm(prev => ({ ...prev, category: v }))}
                    options={[
                      { value: 'Paket Standar', label: 'Paket Standar', icon: '📦' },
                      { value: 'Paket Deluxe', label: 'Paket Deluxe', icon: '💎' },
                      { value: 'Paket Keluarga', label: 'Paket Keluarga', icon: '👨‍👩‍👧‍👦' },
                      { value: 'Paket Premium', label: 'Paket Premium', icon: '⭐' },
                      { value: 'Paket Adventure', label: 'Paket Adventure', icon: '🧭' },
                    ]}
                  />
                </div>

                <div className="mt-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Paket
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Jelaskan detail paket wisata..."
                  />
                </div>
              </div>

              {/* Pricing & Duration */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">💰 Harga & Durasi</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Harga (IDR) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">💵</div>
                      <input
                      type="number"
                      id="price"
                      name="price"
                      value={form.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Contoh: 150000"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Masukkan angka tanpa titik atau koma (contoh: 150000 untuk Rp 150.000)
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                      Durasi
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">⏱️</div>
                      <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={form.duration}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Contoh: 1 hari, 2 hari 1 malam"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Durasi perjalanan wisata
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
                      Kapasitas
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">👥</div>
                      <input
                      type="text"
                      id="capacity"
                      name="capacity"
                      value={form.capacity}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Contoh: 2-4 orang, 4-8 orang"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Jumlah peserta yang dapat mengikuti paket
                    </p>
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">✅ Fasilitas Paket</h3>
                <div>
                  <label htmlFor="facilities" className="block text-sm font-medium text-gray-700 mb-2">
                    Fasilitas yang termasuk dalam paket
                  </label>
                  <textarea
                    id="facilities"
                    name="facilities"
                    value={form.facilities}
                    onChange={handleInputChange}
                    rows={4}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Contoh:&#10;• Tiket masuk&#10;• Pemandu lokal&#10;• Makan siang&#10;• Transportasi&#10;• Akomodasi (untuk paket multi-hari)"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Pisahkan setiap fasilitas dengan baris baru atau koma
                  </p>
                </div>
              </div>

              {/* Status Options */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">⚙️ Status Paket</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="available"
                      name="available"
                      type="checkbox"
                      checked={form.available}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                      Paket tersedia untuk pemesanan
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="popular"
                      name="popular"
                      type="checkbox"
                      checked={form.popular}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="popular" className="ml-2 block text-sm text-gray-900">
                      Tandai sebagai paket populer (akan menampilkan badge "POPULAR")
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <Link
                  href="/admin/destinations/packages"
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-transform duration-150 hover:scale-105 active:scale-95 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Paket Wisata'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
