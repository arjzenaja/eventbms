'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function NewEventPackage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isEventShown, setIsEventShown] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCategoryShown, setIsCategoryShown] = useState(false);
  const eventRef = useRef(null);
  const categoryRef = useRef(null);
  const [form, setForm] = useState({
    seat: '',
    desc: '',
    category: 'regular',
    price: '',
    eventId: '',
    includes: '',
    terms_requirements: '',
    terms_cancellation: '',
    capacity: '',
    sold: '0',
    popular: false,
    available: true
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        
        if (data.success) {
          setEvents(data.events || []);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (eventRef.current && !eventRef.current.contains(e.target)) {
        setIsEventShown(false);
        setTimeout(() => setIsEventOpen(false), 120);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryShown(false);
        setTimeout(() => setIsCategoryOpen(false), 120);
      }
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') {
        setIsEventShown(false);
        setIsCategoryShown(false);
        setTimeout(() => { setIsEventOpen(false); setIsCategoryOpen(false); }, 120);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const openEventMenu = () => { setIsEventOpen(true); requestAnimationFrame(() => setIsEventShown(true)); };
  const closeEventMenu = () => { setIsEventShown(false); setTimeout(() => setIsEventOpen(false), 120); };
  const openCategoryMenu = () => { setIsCategoryOpen(true); requestAnimationFrame(() => setIsCategoryShown(true)); };
  const closeCategoryMenu = () => { setIsCategoryShown(false); setTimeout(() => setIsCategoryOpen(false), 120); };

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

      const response = await fetch('/api/events/packages', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Paket event berhasil ditambahkan!');
        router.push('/admin/events/packages');
      } else {
        alert('Gagal menambahkan paket: ' + data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat menyimpan paket');
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
            <p className="mt-4 text-gray-600">Memuat data event...</p>
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
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Tambah Paket Event</h1>
              <Link 
                href="/admin/events/packages"
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
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 space-y-8">
              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Dasar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Paket *
                    </label>
                    <input
                      type="text"
                      name="seat"
                      value={form.seat}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: VIP, Regular, Early Bird"
                    />
                  </div>
                  
                  <div className="relative" ref={eventRef}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event *
                    </label>
                    <button type="button" onClick={() => (isEventOpen ? closeEventMenu() : openEventMenu())} className={`w-full inline-flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-white shadow-sm ${isEventOpen ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-300 hover:border-gray-400'} transition-all`} aria-haspopup="listbox" aria-expanded={isEventOpen}>
                      <span className={`text-gray-900 font-medium truncate ${!form.eventId ? 'text-gray-500' : ''}`}>{form.eventId ? (events.find(e => e.id === form.eventId)?.title || 'Pilih Event') : 'Pilih Event'}</span>
                      <span className={`p-1.5 rounded-md border ${isEventOpen ? 'border-orange-300 bg-orange-50 text-orange-600' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                        <svg className={`w-4 h-4 transition-transform ${isEventOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                      </span>
                    </button>
                    {isEventOpen && (
                      <div className="relative">
                        <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl origin-top transform transition duration-150 ease-out scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${isEventShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`} style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }} role="listbox">
                          <li>
                            <button type="button" onClick={() => { setForm(prev => ({ ...prev, eventId: '' })); closeEventMenu(); }} className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-orange-50 ${!form.eventId ? 'bg-orange-50' : ''}`}>
                              <span className={`${!form.eventId ? 'text-orange-700 font-semibold' : 'text-gray-800'} text-sm`}>Pilih Event</span>
                              {!form.eventId && (<svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>)}
                            </button>
                          </li>
                          {events.map((e) => (
                            <li key={e.id}>
                              <button type="button" onClick={() => { setForm(prev => ({ ...prev, eventId: e.id })); closeEventMenu(); }} className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-orange-50 ${form.eventId === e.id ? 'bg-orange-50' : ''}`}>
                                <span className={`text-sm truncate ${form.eventId === e.id ? 'text-orange-700 font-semibold' : 'text-gray-800'}`}>{e.title}</span>
                                {form.eventId === e.id && (<svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>)}
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
                    <button type="button" onClick={() => (isCategoryOpen ? closeCategoryMenu() : openCategoryMenu())} className={`w-full inline-flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-white shadow-sm ${isCategoryOpen ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-300 hover:border-gray-400'} transition-all`} aria-haspopup="listbox" aria-expanded={isCategoryOpen}>
                      <span className="text-gray-900 font-medium truncate">{form.category ? form.category.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Pilih Kategori'}</span>
                      <span className={`p-1.5 rounded-md border ${isCategoryOpen ? 'border-orange-300 bg-orange-50 text-orange-600' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                        <svg className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                      </span>
                    </button>
                    {isCategoryOpen && (
                      <div className="relative">
                        <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl origin-top transform transition duration-150 ease-out scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${isCategoryShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`} style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }} role="listbox">
                          {['regular','vip','premium','early-bird','group'].map(opt => (
                            <li key={opt}>
                              <button type="button" onClick={() => { setForm(prev => ({ ...prev, category: opt })); closeCategoryMenu(); }} className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-orange-50 ${form.category === opt ? 'bg-orange-50' : ''}`}>
                                <span className={`text-sm ${form.category === opt ? 'text-orange-700 font-semibold' : 'text-gray-800'}`}>{opt.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                                {form.category === opt && (<svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>)}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                      placeholder="Contoh: 150000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kapasitas
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={form.capacity}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                      placeholder="Contoh: 100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sudah Terjual
                    </label>
                    <input
                      type="number"
                      name="sold"
                      value={form.sold}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Deskripsi</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Paket *
                  </label>
                  <textarea
                    name="desc"
                    value={form.desc}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Jelaskan detail paket, apa yang didapat, dll."
                  />
                </div>
              </div>

              {/* Package Details */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Detail Paket</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yang Termasuk (pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      name="includes"
                      value={form.includes}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Tiket Masuk, Makan Siang, Merchandise"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Syarat & Ketentuan (pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      name="terms_requirements"
                      value={form.terms_requirements}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Min. 1 orang, Bayar full H-7"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kebijakan Pembatalan (pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      name="terms_cancellation"
                      value={form.terms_cancellation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: H-7: 100%, H-3: 50%, H-1: 0%"
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
                  href="/admin/events/packages"
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
                  {isSubmitting ? (<><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Menyimpan...</>) : (<>Simpan Paket</>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
