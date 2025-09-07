'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function AdminTravelAgencyPrices() {
  const [prices, setPrices] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAgency, setFilterAgency] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAgencyOpen, setIsAgencyOpen] = useState(false);
  const [isAgencyShown, setIsAgencyShown] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCategoryShown, setIsCategoryShown] = useState(false);
  const agencyRef = useRef(null);
  const categoryRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch prices
        const pricesResponse = await fetch('/api/travel-agencies/prices');
        const pricesData = await pricesResponse.json();
        
        // Fetch agencies for filter
        const agenciesResponse = await fetch('/api/biro_perjalanan');
        const agenciesData = await agenciesResponse.json();
        
        if (pricesData.success) {
          setPrices(pricesData.prices || []);
        } else {
          setError(pricesData.message || 'Gagal memuat data harga biro perjalanan');
        }
        
        if (agenciesData.success) {
          setAgencies(agenciesData.biro_perjalanan || []);
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
      if (agencyRef.current && !agencyRef.current.contains(e.target)) {
        setIsAgencyOpen(false);
        setIsAgencyShown(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryOpen(false);
        setIsCategoryShown(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') {
        setIsAgencyOpen(false);
        setIsCategoryOpen(false);
        setIsAgencyShown(false);
        setIsCategoryShown(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const openAgencyMenu = () => {
    setIsAgencyOpen(true);
    requestAnimationFrame(() => setIsAgencyShown(true));
  };
  const closeAgencyMenu = () => {
    setIsAgencyShown(false);
    setTimeout(() => setIsAgencyOpen(false), 120);
  };
  const openCategoryMenu = () => {
    setIsCategoryOpen(true);
    requestAnimationFrame(() => setIsCategoryShown(true));
  };
  const closeCategoryMenu = () => {
    setIsCategoryShown(false);
    setTimeout(() => setIsCategoryOpen(false), 120);
  };

  const getAgencyLabel = () => {
    if (filterAgency === 'all') return 'Semua Agency';
    const a = agencies.find(x => x.id === filterAgency);
    return a ? a.title : 'Semua Agency';
  };

  const categoryOptions = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'domestik', label: 'Domestik' },
    { value: 'internasional', label: 'Internasional' },
    { value: 'haji-umrah', label: 'Haji & Umrah' },
    { value: 'corporate', label: 'Corporate' },
  ];

  const filteredPrices = prices.filter(price => {
    const matchesSearch = price.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         price.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgency = filterAgency === 'all' || price.agencyId === filterAgency;
    const matchesCategory = filterCategory === 'all' || price.category === filterCategory;
    return matchesSearch && matchesAgency && matchesCategory;
  });

  const handleDeletePrice = async (priceId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus harga ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/travel-agencies/prices/${priceId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPrices(prices.filter(price => price.id !== priceId));
        alert('Harga berhasil dihapus!');
      } else {
        alert('Gagal menghapus harga: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting price:', error);
      alert('Terjadi kesalahan saat menghapus harga: ' + error.message);
    }
  };

  const handleToggleStatus = async (priceId, currentStatus) => {
    try {
      const formData = new FormData();
      formData.append('available', (!currentStatus).toString());
      
      const response = await fetch(`/api/travel-agencies/prices/${priceId}`, {
        method: 'PUT',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPrices(prices.map(price => 
          price.id === priceId 
            ? { ...price, available: !currentStatus }
            : price
        ));
        alert('Status harga berhasil diubah!');
      } else {
        alert('Gagal mengubah status harga: ' + data.message);
      }
    } catch (error) {
      console.error('Error toggling price status:', error);
      alert('Terjadi kesalahan saat mengubah status harga: ' + error.message);
    }
  };

  const getAgencyName = (agencyId) => {
    const agency = agencies.find(a => a.id === agencyId);
    return agency ? agency.title : 'Agency tidak ditemukan';
  };

  const formatPrice = (price) => {
    if (!price) return '-';
    return price;
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data harga biro perjalanan..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data harga biro perjalanan"
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
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Kelola Harga Biro Perjalanan</h1>
              <Link 
                href="/admin/travel-agencies/prices/new" 
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-4 py-2.5 text-white shadow-sm hover:from-indigo-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                Tambah Harga
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
                    placeholder="Cari harga..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="relative" ref={agencyRef}>
                  <button
                    type="button"
                    onClick={() => (isAgencyOpen ? closeAgencyMenu() : openAgencyMenu())}
                    className={`inline-flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-white shadow-sm min-w-[240px] ${isAgencyOpen ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-300 hover:border-gray-400'} transition-all duration-150`}
                    aria-haspopup="listbox"
                    aria-expanded={isAgencyOpen}
                  >
                    <span className="text-gray-900 font-medium truncate">{getAgencyLabel()}</span>
                    <span className={`p-1.5 rounded-md border ${isAgencyOpen ? 'border-orange-300 bg-orange-50 text-orange-600' : 'border-gray-200 bg-gray-50 text-gray-600'} transition-colors`}>
                      <svg className={`w-4 h-4 transition-transform ${isAgencyOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </span>
                  </button>
                  {isAgencyOpen && (
                    <div className="relative">
                      <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl origin-top transform transition duration-150 ease-out scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${isAgencyShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`} style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }} role="listbox">
                        <li>
                          <button type="button" onClick={() => { setFilterAgency('all'); closeAgencyMenu(); }} className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-orange-50 ${filterAgency === 'all' ? 'bg-orange-50' : ''}`}>
                            <span className={`text-sm ${filterAgency === 'all' ? 'text-orange-700 font-semibold' : 'text-gray-800'}`}>Semua Agency</span>
                            {filterAgency === 'all' && (<svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>)}
                          </button>
                        </li>
                        {agencies.map((a) => (
                          <li key={a.id}>
                            <button type="button" onClick={() => { setFilterAgency(a.id); closeAgencyMenu(); }} className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-orange-50 ${filterAgency === a.id ? 'bg-orange-50' : ''}`}>
                              <span className={`text-sm truncate ${filterAgency === a.id ? 'text-orange-700 font-semibold' : 'text-gray-800'}`}>{a.title}</span>
                              {filterAgency === a.id && (<svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>)}
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
                    <span className="text-gray-900 font-medium truncate">{categoryOptions.find(c => c.value === filterCategory)?.label || 'Semua Kategori'}</span>
                    <span className={`p-1.5 rounded-md border ${isCategoryOpen ? 'border-orange-300 bg-orange-50 text-orange-600' : 'border-gray-200 bg-gray-50 text-gray-600'} transition-colors`}>
                      <svg className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </span>
                  </button>
                  {isCategoryOpen && (
                    <div className="relative">
                      <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl origin-top transform transition duration-150 ease-out scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${isCategoryShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`} style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }} role="listbox">
                        {categoryOptions.map(opt => (
                          <li key={opt.value}>
                            <button type="button" onClick={() => { setFilterCategory(opt.value); closeCategoryMenu(); }} className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-orange-50 ${filterCategory === opt.value ? 'bg-orange-50' : ''}`}>
                              <span className={`text-sm ${filterCategory === opt.value ? 'text-orange-700 font-semibold' : 'text-gray-800'}`}>{opt.label}</span>
                              {filterCategory === opt.value && (<svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>)}
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
                        <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.21 0-4 1.343-4 3s1.79 3 4 3 4 1.343 4 3-1.79 3-4 3m0-12c2.21 0 4-1.343 4-3s-1.79-3-4-3-4 1.343-4 3 1.79 3 4 3z"/></svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Harga</dt>
                        <dd className="text-lg font-medium text-gray-900">{prices.length}</dd>
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
                          {prices.filter(price => price.available).length}
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
                          {prices.filter(price => price.popular).length}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AGENCY</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KATEGORI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HARGA</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DURASI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPrices.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                          Tidak ada data harga yang ditemukan
                        </td>
                      </tr>
                    ) : (
                      filteredPrices.map((price, index) => (
                        <tr key={price.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{price.name}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {price.description}
                              </div>
                              {price.popular && (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                  Populer
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getAgencyName(price.agencyId)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {price.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {formatPrice(price.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {price.duration || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              price.available 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              <span className={`inline-block w-1.5 h-1.5 rounded-full ${price.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              {price.available ? 'Tersedia' : 'Tidak Tersedia'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-1.5">
                              <Link
                                href={`/admin/travel-agencies/prices/${price.id}`}
                                className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4h2m-6 8h8M7 20h10M16.5 3.5l4 4-11 11H5v-4l11.5-11z"/></svg>
                              </Link>
                              <button 
                                onClick={() => handleDeletePrice(price.id)}
                                className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                title="Hapus"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3m-9 0h12"/></svg>
                              </button>
                              <button 
                                onClick={() => handleToggleStatus(price.id, price.available)}
                                className={`p-2 rounded-lg transition-colors duration-200 ${
                                  price.available
                                    ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50'
                                    : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                }`}
                                title={price.available ? 'Set Tidak Tersedia' : 'Set Tersedia'}
                              >
                                {price.available ? (
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
