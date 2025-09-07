'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function NewTravelAgencyPrice() {
  const router = useRouter();
  const [agencies, setAgencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAgencyOpen, setIsAgencyOpen] = useState(false);
  const [isAgencyShown, setIsAgencyShown] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCategoryShown, setIsCategoryShown] = useState(false);
  const agencyRef = useRef(null);
  const categoryRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'domestik',
    duration: '',
    price: '',
    originalPrice: '',
    agencyId: '',
    includes: '',
    excludes: '',
    departure: '',
    capacity: '',
    vehicle: '',
    rating: '4.5',
    reviews: '0',
    popular: false,
    available: true
  });

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await fetch('/api/biro_perjalanan');
        const data = await response.json();
        
        if (data.success) {
          setAgencies(data.biro_perjalanan || []);
        }
      } catch (error) {
        console.error('Error fetching agencies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgencies();
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (agencyRef.current && !agencyRef.current.contains(e.target)) {
        setIsAgencyShown(false);
        setTimeout(() => setIsAgencyOpen(false), 100);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryShown(false);
        setTimeout(() => setIsCategoryOpen(false), 100);
      }
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') {
        setIsAgencyShown(false);
        setIsCategoryShown(false);
        setTimeout(() => { setIsAgencyOpen(false); setIsCategoryOpen(false); }, 100);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const openAgencyMenu = () => { setIsAgencyOpen(true); requestAnimationFrame(() => setIsAgencyShown(true)); };
  const closeAgencyMenu = () => { setIsAgencyShown(false); setTimeout(() => setIsAgencyOpen(false), 120); };
  const openCategoryMenu = () => { setIsCategoryOpen(true); requestAnimationFrame(() => setIsCategoryShown(true)); };
  const closeCategoryMenu = () => { setIsCategoryShown(false); setTimeout(() => setIsCategoryOpen(false), 120); };

  const getAgencyLabel = () => {
    if (!form.agencyId) return 'Pilih Biro Perjalanan';
    const a = agencies.find(x => x.id === form.agencyId);
    return a ? a.title : 'Pilih Biro Perjalanan';
  };

  const categoryOptions = [
    { value: 'domestik', label: 'Domestik' },
    { value: 'internasional', label: 'Internasional' },
    { value: 'haji-umrah', label: 'Haji & Umrah' },
    { value: 'corporate', label: 'Corporate' },
  ];

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

      const response = await fetch('/api/travel-agencies/prices', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Harga biro perjalanan berhasil ditambahkan!');
        router.push('/admin/travel-agencies/prices');
      } else {
        alert('Gagal menambahkan harga: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat menyimpan harga');
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
            <p className="mt-4 text-gray-600">Memuat data biro perjalanan...</p>
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
                  <svg className="w-7 h-7 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.343-4 3s1.79 3 4 3 4 1.343 4 3-1.79 3-4 3m0-12c2.21 0 4-1.343 4-3s-1.79-3-4-3-4 1.343-4 3 1.79 3 4 3z"/></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Tambah Harga Biro Perjalanan</h1>
                  <p className="text-gray-600 mt-1">Isi informasi paket, kategori, harga, dan status.</p>
                </div>
              </div>
              <Link 
                href="/admin/travel-agencies/prices"
                className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                Kembali
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Paket *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: Paket Wisata Banyumas 1 Hari"
                    />
                  </div>
                  
                  <div className="relative" ref={agencyRef}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Biro Perjalanan *
                    </label>
                    <button
                      type="button"
                      onClick={() => (isAgencyOpen ? closeAgencyMenu() : openAgencyMenu())}
                      className={`w-full inline-flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-white shadow-sm ${isAgencyOpen ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-300 hover:border-gray-400'} transition-all`}
                      aria-haspopup="listbox"
                      aria-expanded={isAgencyOpen}
                    >
                      <span className={`text-gray-900 font-medium truncate ${!form.agencyId ? 'text-gray-500' : ''}`}>{getAgencyLabel()}</span>
                      <span className={`p-1.5 rounded-md border ${isAgencyOpen ? 'border-orange-300 bg-orange-50 text-orange-600' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                        <svg className={`w-4 h-4 transition-transform ${isAgencyOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                      </span>
                    </button>
                    {isAgencyOpen && (
                      <div className="relative">
                        <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl origin-top transform transition duration-150 ease-out scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${isAgencyShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`} style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }} role="listbox">
                          <li>
                            <button type="button" onClick={() => { setForm(prev => ({ ...prev, agencyId: '' })); closeAgencyMenu(); }} className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-orange-50 ${!form.agencyId ? 'bg-orange-50' : ''}`}>
                              <span className={`${!form.agencyId ? 'text-orange-700 font-semibold' : 'text-gray-800'} text-sm`}>Pilih Biro Perjalanan</span>
                              {!form.agencyId && (<svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>)}
                            </button>
                          </li>
                          {agencies.map((a) => (
                            <li key={a.id}>
                              <button type="button" onClick={() => { setForm(prev => ({ ...prev, agencyId: a.id })); closeAgencyMenu(); }} className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-orange-50 ${form.agencyId === a.id ? 'bg-orange-50' : ''}`}>
                                <span className={`text-sm truncate ${form.agencyId === a.id ? 'text-orange-700 font-semibold' : 'text-gray-800'}`}>{a.title}</span>
                                {form.agencyId === a.id && (<svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>)}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={categoryRef}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kategori *
                    </label>
                    <button
                      type="button"
                      onClick={() => (isCategoryOpen ? closeCategoryMenu() : openCategoryMenu())}
                      className={`w-full inline-flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-white shadow-sm ${isCategoryOpen ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-300 hover:border-gray-400'} transition-all`}
                      aria-haspopup="listbox"
                      aria-expanded={isCategoryOpen}
                    >
                      <span className="text-gray-900 font-medium truncate">{categoryOptions.find(c => c.value === form.category)?.label || 'Pilih Kategori'}</span>
                      <span className={`p-1.5 rounded-md border ${isCategoryOpen ? 'border-orange-300 bg-orange-50 text-orange-600' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                        <svg className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                      </span>
                    </button>
                    {isCategoryOpen && (
                      <div className="relative">
                        <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl origin-top transform transition duration-150 ease-out scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${isCategoryShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`} style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }} role="listbox">
                          {categoryOptions.map(opt => (
                            <li key={opt.value}>
                              <button type="button" onClick={() => { setForm(prev => ({ ...prev, category: opt.value })); closeCategoryMenu(); }} className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-orange-50 ${form.category === opt.value ? 'bg-orange-50' : ''}`}>
                                <span className={`text-sm ${form.category === opt.value ? 'text-orange-700 font-semibold' : 'text-gray-800'}`}>{opt.label}</span>
                                {form.category === opt.value && (<svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>)}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Harga (Rp) *
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: Rp 350.000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Harga Asli
                    </label>
                    <input
                      type="text"
                      name="originalPrice"
                      value={form.originalPrice}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: Rp 400.000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Durasi
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: 1 hari, 2 hari 1 malam"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Deskripsi</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi Paket *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                    placeholder="Jelaskan detail paket, apa yang didapat, dll."
                  />
                </div>
              </div>

              {/* Package Details */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Detail Paket</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Yang Termasuk (pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      name="includes"
                      value={form.includes}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: Transportasi AC, Makan Siang, Tiket Masuk"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Yang Tidak Termasuk (pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      name="excludes"
                      value={form.excludes}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: Makan Pagi, Pengeluaran Pribadi"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Jam Keberangkatan
                    </label>
                    <input
                      type="text"
                      name="departure"
                      value={form.departure}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: 08:00 WIB"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kapasitas
                    </label>
                    <input
                      type="text"
                      name="capacity"
                      value={form.capacity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: Min. 10 orang"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Kendaraan
                    </label>
                    <input
                      type="text"
                      name="vehicle"
                      value={form.vehicle}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: Bus AC"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rating
                    </label>
                    <select
                      name="rating"
                      value={form.rating}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                    >
                      <option value="4.0">4.0 ⭐</option>
                      <option value="4.5">4.5 ⭐</option>
                      <option value="4.8">4.8 ⭐</option>
                      <option value="4.9">4.9 ⭐</option>
                      <option value="5.0">5.0 ⭐</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Jumlah Review
                    </label>
                    <input
                      type="number"
                      name="reviews"
                      value={form.reviews}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="0"
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
                      Tandai sebagai Paket Populer
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
                      Paket Tersedia
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link
                  href="/admin/travel-agencies/prices"
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
                  {isSubmitting ? (<><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Menyimpan...</>) : (<>Simpan Harga</>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
