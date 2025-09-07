'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function AdminEventPackages() {
  const [packages, setPackages] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isEventShown, setIsEventShown] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCategoryShown, setIsCategoryShown] = useState(false);
  const eventRef = useRef(null);
  const categoryRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch packages
        const packagesResponse = await fetch('/api/events/packages');
        const packagesData = await packagesResponse.json();
        
        // Fetch events for filter
        const eventsResponse = await fetch('/api/events');
        const eventsData = await eventsResponse.json();
        
        if (packagesData.success) {
          setPackages(packagesData.packages || []);
        } else {
          setError(packagesData.message || 'Gagal memuat data paket event');
        }
        
        if (eventsData.success) {
          setEvents(eventsData.events || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Terjadi kesalahan saat mengambil data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.seat.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = filterEvent === 'all' || pkg.eventId === filterEvent;
    const matchesCategory = filterCategory === 'all' || pkg.category === filterCategory;
    return matchesSearch && matchesEvent && matchesCategory;
  });

  const handleDeletePackage = async (packageId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus paket ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/events/packages/${packageId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPackages(packages.filter(pkg => (pkg.id || `package-${packages.indexOf(pkg)}`) !== packageId));
        alert('Paket berhasil dihapus!');
      } else {
        alert('Gagal menghapus paket: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Terjadi kesalahan saat menghapus paket: ' + error.message);
    }
  };

  const handleToggleStatus = async (packageId, currentStatus) => {
    try {
      const formData = new FormData();
      formData.append('available', (!currentStatus).toString());
      
      const response = await fetch(`/api/events/packages/${packageId}`, {
        method: 'PUT',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPackages(packages.map(pkg => 
          (pkg.id || `package-${packages.indexOf(pkg)}`) === packageId 
            ? { ...pkg, available: !currentStatus }
            : pkg
        ));
        alert('Status paket berhasil diubah!');
      } else {
        alert('Gagal mengubah status paket: ' + data.message);
      }
    } catch (error) {
      console.error('Error toggling package status:', error);
      alert('Terjadi kesalahan saat mengubah status paket: ' + error.message);
    }
  };

  const getEventTitle = (eventId) => {
    const event = events.find(e => e.id === eventId);
    return event ? event.title : 'Event tidak ditemukan';
  };

  const formatPrice = (price) => {
    if (!price || price === 0) return 'Gratis';
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data paket event..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data paket event"
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
              <h1 className="text-3xl font-bold text-gray-900">Kelola Paket Event</h1>
              <Link 
                href="/admin/events/packages/new" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <span>+</span>
                Tambah Paket
              </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/></svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Cari paket..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="relative" ref={eventRef}>
                  <button
                    type="button"
                    onClick={() => (isEventOpen ? closeEventMenu() : openEventMenu())}
                    className={`inline-flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-white shadow-sm min-w-[240px] ${isEventOpen ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-300 hover:border-gray-400'} transition-all duration-150`}
                    aria-haspopup="listbox"
                    aria-expanded={isEventOpen}
                  >
                    <span className="text-gray-900 font-medium truncate">{filterEvent === 'all' ? 'Semua Event' : (events.find(e => e.id === filterEvent)?.title || 'Semua Event')}</span>
                    <span className={`p-1.5 rounded-md border ${isEventOpen ? 'border-orange-300 bg-orange-50 text-orange-600' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                      <svg className={`w-4 h-4 transition-transform ${isEventOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </span>
                  </button>
                  {isEventOpen && (
                    <div className="relative">
                      <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl origin-top transform transition duration-150 ease-out scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${isEventShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`} style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }} role="listbox">
                        <li>
                          <button type="button" onClick={() => { setFilterEvent('all'); closeEventMenu(); }} className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-orange-50 ${filterEvent === 'all' ? 'bg-orange-50' : ''}`}>
                            <span className={`text-sm ${filterEvent === 'all' ? 'text-orange-700 font-semibold' : 'text-gray-800'}`}>Semua Event</span>
                            {filterEvent === 'all' && (<svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>)}
                          </button>
                        </li>
                        {events.map(e => (
                          <li key={e.id}>
                            <button type="button" onClick={() => { setFilterEvent(e.id); closeEventMenu(); }} className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-orange-50 ${filterEvent === e.id ? 'bg-orange-50' : ''}`}>
                              <span className={`text-sm truncate ${filterEvent === e.id ? 'text-orange-700 font-semibold' : 'text-gray-800'}`}>{e.title}</span>
                              {filterEvent === e.id && (<svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>)}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="relative" ref={categoryRef}>
                  <button
                    type="button"
                    onClick={() => (isCategoryOpen ? closeCategoryMenu() : openCategoryMenu())}
                    className={`inline-flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-white shadow-sm min-w-[220px] ${isCategoryOpen ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-300 hover:border-gray-400'} transition-all duration-150`}
                    aria-haspopup="listbox"
                    aria-expanded={isCategoryOpen}
                  >
                    <span className="text-gray-900 font-medium truncate">{filterCategory === 'all' ? 'Semua Kategori' : filterCategory.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                    <span className={`p-1.5 rounded-md border ${isCategoryOpen ? 'border-orange-300 bg-orange-50 text-orange-600' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                      <svg className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </span>
                  </button>
                  {isCategoryOpen && (
                    <div className="relative">
                      <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl origin-top transform transition duration-150 ease-out scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${isCategoryShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`} style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }} role="listbox">
                        {['all','regular','vip','premium','early-bird','group'].map(opt => (
                          <li key={opt}>
                            <button type="button" onClick={() => { setFilterCategory(opt); closeCategoryMenu(); }} className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-orange-50 ${filterCategory === opt ? 'bg-orange-50' : ''}`}>
                              <span className={`text-sm ${filterCategory === opt ? 'text-orange-700 font-semibold' : 'text-gray-800'}`}>{opt === 'all' ? 'Semua Kategori' : opt.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                              {filterCategory === opt && (<svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>)}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white overflow-hidden shadow rounded-2xl border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Paket</dt>
                        <dd className="text-lg font-medium text-gray-900">{packages.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-2xl border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Tersedia</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {packages.filter(pkg => pkg.available).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-2xl border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3c2.5 2.5 4 5 4 7.5a4 4 0 11-8 0C8 8 9.5 5.5 12 3z"/></svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Populer</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {packages.filter(pkg => pkg.popular).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white shadow-xl border border-gray-200 overflow-hidden sm:rounded-2xl">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAMA PAKET</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EVENT</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KATEGORI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HARGA</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KAPASITAS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPackages.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                          Tidak ada data paket yang ditemukan
                        </td>
                      </tr>
                    ) : (
                      filteredPackages.map((pkg, index) => (
                        <tr key={pkg.id || `package-${index}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{pkg.seat}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {pkg.desc}
                              </div>
                              {pkg.popular && (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                  Populer
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getEventTitle(pkg.eventId)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {pkg.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {formatPrice(pkg.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {pkg.capacity || '-'} / {pkg.sold || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              pkg.available 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              <span className={`inline-block w-1.5 h-1.5 rounded-full ${pkg.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              {pkg.available ? 'Tersedia' : 'Tidak Tersedia'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Link
                                href={`/admin/events/packages/${pkg.id || `package-${index}`}`}
                                className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.5 3.5l4 4-11 11H5v-4l11.5-11z"/></svg>
                              </Link>
                              <button 
                                onClick={() => handleDeletePackage(pkg.id || `package-${index}`)}
                                className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                title="Hapus"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3m-9 0h12"/></svg>
                              </button>
                              <button 
                                onClick={() => handleToggleStatus(pkg.id || `package-${index}`, pkg.available)}
                                className={`p-2 rounded-lg transition-colors duration-200 ${
                                  pkg.available
                                    ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50'
                                    : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                }`}
                                title={pkg.available ? 'Set Tidak Tersedia' : 'Set Tersedia'}
                              >
                                {pkg.available ? (
                                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6"/></svg>
                                ) : (
                                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
