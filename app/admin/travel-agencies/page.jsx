'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

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
          <svg className={`w-4 h-4 ${open ? 'text-indigo-600' : 'text-gray-600'} transition-transform duration-150 ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" d="M6 9l6 6 6-6"/></svg>
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

export default function AdminTravelAgencies() {
  const [travelAgencies, setTravelAgencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [modal, setModal] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [quickViewItem, setQuickViewItem] = useState(null);

  useEffect(() => {
    const fetchTravelAgencies = async () => {
      try {
        const response = await fetch('/api/biro_perjalanan');
        const data = await response.json();
        
        if (data.success) {
          setTravelAgencies(data.biro_perjalanan);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching travel agencies:', error);
        setError('Terjadi kesalahan saat mengambil data biro perjalanan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravelAgencies();
  }, []);

  const filteredTravelAgencies = travelAgencies.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDeleteTravelAgency = async (itemId) => {
    try {
      const response = await fetch(`/api/biro_perjalanan/${itemId}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setTravelAgencies(travelAgencies.filter(item => item.id !== itemId));
        setModal({ title: 'Berhasil', message: 'Biro perjalanan berhasil dihapus!', confirmText: 'OK', onConfirm: () => setModal(null) });
      } else {
        setModal({ title: 'Gagal', message: 'Gagal menghapus biro perjalanan: ' + data.message, confirmText: 'OK', onConfirm: () => setModal(null) });
      }
    } catch (error) {
      console.error('Error deleting travel agency:', error);
      setModal({ title: 'Error', message: 'Terjadi kesalahan saat menghapus biro perjalanan', confirmText: 'OK', onConfirm: () => setModal(null) });
    }
  };

  const confirmDeleteTravelAgency = (itemId) => {
    setModal({
      title: 'Hapus Biro Perjalanan',
      message: 'Apakah Anda yakin ingin menghapus biro perjalanan ini? ',
      confirmText: 'Hapus',
      cancelText: 'Batal',
      onConfirm: async () => { setModal(null); await handleDeleteTravelAgency(itemId); }
    });
  };

  const handleExportData = () => {
    const exportData = filteredTravelAgencies.map(item => ({
      ID: item.id,
      Nama: item.title,
      Lokasi: item.location,
      Tipe: item.type,
      Kategori: item.category || 'Biro Perjalanan',
      Deskripsi: item.short_description || '',
      Biaya: item.price_range || 'Tidak ada info',
      Kontak: (() => {
        try {
          if (typeof item.contact === 'string' && item.contact.startsWith('{')) {
            const contactData = JSON.parse(item.contact);
            return `${contactData.phone || ''} | ${contactData.email || ''} | ${contactData.whatsapp || ''}`;
          } else if (typeof item.contact === 'string') {
            return item.contact;
          } else if (item.contact && typeof item.contact === 'object') {
            return `${item.contact.phone || ''} | ${item.contact.email || ''} | ${item.contact.whatsapp || ''}`;
          }
          return '';
        } catch (e) {
          return item.contact || '';
        }
      })(),
      Alamat: item.address || '',
      Direkomendasikan: item.recommended ? 'Ya' : 'Tidak'
    }));

    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `biro_perjalanan_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/biro_perjalanan');
      const data = await response.json();
      
      if (data.success) {
        setTravelAgencies(data.biro_perjalanan);
        setError('');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error refreshing travel agencies:', error);
      setError('Terjadi kesalahan saat refresh data');
    } finally {
      setIsLoading(false);
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
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <svg className="w-7 h-7 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.5 3a1 1 0 00-.894.553L8.382 6H5a1 1 0 000 2h2.382l1.224 2.447A1 1 0 009.5 11h5a1 1 0 00.894-.553L16.618 8H19a1 1 0 100-2h-2.382l-1.224-2.447A1 1 0 0014.5 3h-4z"/></svg>
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Biro Perjalanan</h1>
                  <p className="text-gray-600 mt-1">Kelola data biro perjalanan, ekspor CSV, dan perapihan data.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link 
                  href="/admin/travel-agencies/prices" 
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg>
                  Kelola Harga
                </Link>
                <Link 
                  href="/admin/travel-agencies/new" 
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                  Tambah Biro
                </Link>
              </div>
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
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <CustomSelect
                  value={filterType}
                  onChange={(v) => setFilterType(v)}
                  options={[
                    { value: 'all', label: 'Semua Tipe', icon: '🗂️' },
                    { value: 'biro-perjalanan', label: 'Biro Perjalanan', icon: '✈️' },
                  ]}
                  className="min-w-[180px]"
                />
                

                
                <button 
                  onClick={refreshData}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-white shadow-sm hover:bg-emerald-700 disabled:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6M5 19a9 9 0 0014-7V5M19 5A9 9 0 005 12v7"/></svg>
                  Refresh
                </button>
                
                <button 
                  onClick={handleExportData}
                  disabled={filteredTravelAgencies.length === 0}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-white shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  title="Export Data Biro Perjalanan ke CSV"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m0 0l-3-3m3 3l3-3M4 4h16v4H4zM4 8v10a2 2 0 002 2h12a2 2 0 002-2V8"/></svg>
                  Export
                </button>
                
                <button 
                  onClick={() => {
                    const uniqueTypes = [...new Set(travelAgencies.map(t => t.type))];
                    setModal({
                      title: 'Debug Info',
                      message: `Total biro perjalanan: ${travelAgencies.length}\nTersaring: ${filteredTravelAgencies.length}\n\nTypes in data: ${uniqueTypes.join(', ')}`,
                      confirmText: 'OK',
                      onConfirm: () => setModal(null)
                    });
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  title="Debug Info"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                  Debug
                </button>
                
                <button 
                  onClick={async () => {
                    if (confirm('Perbaiki ID yang tidak valid? Ini akan membersihkan data yang rusak.')) {
                      try {
                        const response = await fetch('/api/biro_perjalanan/fix-ids', { method: 'POST' });
                        const data = await response.json();
                        if (data.success) {
                          alert('ID berhasil diperbaiki! Memperbarui data...');
                          await refreshData();
                        } else {
                          alert('Gagal memperbaiki ID: ' + data.message);
                        }
                      } catch (error) {
                        alert('Error memperbaiki ID: ' + error.message);
                      }
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2.5 text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  title="Fix Invalid IDs"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 11-3.536 3.536L4 17v3h3l9.196-9.196a2.5 2.5 0 003.536-3.536z"/></svg>
                  Fix IDs
                </button>
                
                <button 
                  onClick={async () => {
                    if (confirm('Migrate types untuk standardisasi data biro perjalanan? Ini akan membuat backup otomatis.')) {
                      try {
                        const response = await fetch('/api/destinations/migrate-types?action=migrate', { 
                          method: 'POST' 
                        });
                        const data = await response.json();
                        if (data.success) {
                          alert(`Migrasi berhasil! ${data.migrated_items} item telah distandarisasi.\nBackup tersimpan di: ${data.backup_file}`);
                          await refreshData();
                        } else {
                          alert('Gagal migrate types: ' + data.message);
                        }
                      } catch (error) {
                        alert('Error migrate types: ' + error.message);
                      }
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  title="Migrate Types Data Biro Perjalanan"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6M20 9a8.003 8.003 0 00-15.5-2M4 15a8.003 8.003 0 0015.5 2"/></svg>
                  Migrate Types
                </button>
              </div>
            </div>

            {/* Summary Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Total Travel Agency Items Card */}
              <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.5 3a1 1 0 00-.894.553L8.382 6H5a1 1 0 000 2h2.382l1.224 2.447A1 1 0 009.5 11h5a1 1 0 00.894-.553L16.618 8H19a1 1 0 100-2h-2.382l-1.224-2.447A1 1 0 0014.5 3h-4z"/></svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Biro Perjalanan</dt>
                        <dd className="text-2xl font-bold text-gray-900">{travelAgencies.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtered Items Card */}
              <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Tersaring</dt>
                        <dd className="text-2xl font-bold text-gray-900">{filteredTravelAgencies.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Travel Agency Types Card */}
              <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h10a2 2 0 012 2v10l-6 6H7a2 2 0 01-2-2V5a2 2 0 012-2z"/></svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Jenis Biro Perjalanan</dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {Array.from(new Set(travelAgencies.map(item => item.type))).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Locations Card */}
              <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Lokasi</dt>
                        <dd className="text-2xl font-bold text-gray-900">
                          {Array.from(new Set(travelAgencies.map(item => item.location))).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Debug Info */}
            <div className="bg-indigo-50 p-4 mb-4 rounded-xl border border-indigo-100">
              <div className="text-sm text-gray-600">
                <strong>Debug Info:</strong> Filter Type: <span className="font-mono">{filterType}</span> | 
                Total Biro Perjalanan: <span className="font-mono">{travelAgencies.length}</span> | 
                Filtered: <span className="font-mono">{filteredTravelAgencies.length}</span>
                {filterType !== 'all' && (
                  <span> | Matching types: {travelAgencies.filter(item => item.type === filterType).length}</span>
                )}
                {travelAgencies.length > 0 && (
                  <span> | Types in data: {Array.from(new Set(travelAgencies.map(item => item.type))).join(', ')}</span>
                )}
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAMA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIPE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KATEGORI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KONTAK</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOKASI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AKSI</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTravelAgencies.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        Tidak ada data biro perjalanan yang ditemukan
                      </td>
                    </tr>
                  ) : (
                    filteredTravelAgencies.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={item.img_sm || '/placeholder.jpg'} 
                                alt={item.title}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.title}</div>
                              <div className="text-sm text-gray-500">{item.short_description?.substring(0, 50)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {item.type === 'biro-perjalanan' ? 'Biro Perjalanan' : 
                             item.type === 'travel-agent' ? 'Travel Agent' : 
                             item.type === 'tour-operator' ? 'Tour Operator' : 
                             item.type === 'online-travel' ? 'Online Travel' : item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(() => {
                            try {
                              if (typeof item.contact === 'string' && item.contact.startsWith('{')) {
                                const contactData = JSON.parse(item.contact);
                                return (
                                  <div className="text-xs">
                                    <div>📱 {contactData.phone || '-'}</div>
                                    <div>📧 {contactData.email || '-'}</div>
                                    <div>📱 {contactData.whatsapp || '-'}</div>
                                  </div>
                                );
                              } else if (typeof item.contact === 'string') {
                                return item.contact;
                              } else if (item.contact && typeof item.contact === 'object') {
                                return (
                                  <div className="text-xs">
                                    <div>📱 {item.contact.phone || '-'}</div>
                                    <div>📧 {item.contact.email || '-'}</div>
                                    <div>📱 {item.contact.whatsapp || '-'}</div>
                                  </div>
                                );
                              }
                              return '-';
                            } catch (e) {
                              return item.contact || '-';
                            }
                          })()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setQuickViewItem(item)}
                              className="text-purple-600 hover:text-purple-900 p-2 rounded-full hover:bg-purple-50 transition-transform duration-150 hover:scale-105 active:scale-95"
                              title="Quick View"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            </button>
                            <Link
                              href={`/admin/travel-agencies/${item.id}/view`}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-transform duration-150 hover:scale-105 active:scale-95"
                              title="Lihat Detail"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </Link>
                            <Link
                              href={`/admin/travel-agencies/${item.id}/edit`}
                              className="text-emerald-600 hover:text-emerald-900 p-2 rounded-full hover:bg-emerald-50 transition-transform duration-150 hover:scale-105 active:scale-95"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            </Link>
                            <button 
                              onClick={() => confirmDeleteTravelAgency(item.id)}
                              className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-transform duration-150 hover:scale-105 active:scale-95"
                              title="Hapus"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-1-2H10a1 1 0 00-1 1v1h8V6a1 1 0 00-1-1z"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              </div>
              
              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    ← Sebelumnya
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Selanjutnya →
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Menampilkan <span className="font-medium">1</span> sampai <span className="font-medium">{filteredTravelAgencies.length}</span> dari <span className="font-medium">{filteredTravelAgencies.length}</span> hasil
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-100 transition-colors text-black">
                      ← Sebelumnya
                    </button>
                    
                    <button className="px-2 py-2 text-sm border rounded-lg bg-blue-600 text-white border-blue-600">
                      1
                    </button>
                    
                    <button className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-100 transition-colors text-black">
                      Selanjutnya →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {quickViewItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setQuickViewItem(null)}></div>
          <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Quick View</h4>
              <button onClick={() => setQuickViewItem(null)} className="p-2 rounded hover:bg-gray-100">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <img src={quickViewItem.img_sm || '/placeholder.jpg'} alt={quickViewItem.title} className="w-16 h-16 rounded-lg object-cover border" />
                <div>
                  <div className="text-lg font-bold text-gray-900">{quickViewItem.title}</div>
                  <div className="text-sm text-gray-500">{quickViewItem.location}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="text-sm"><span className="text-gray-500">Tipe:</span> <span className="font-medium text-gray-900">{quickViewItem.type}</span></div>
                <div className="text-sm"><span className="text-gray-500">Kategori:</span> <span className="font-medium text-gray-900">{quickViewItem.category || 'Biro Perjalanan'}</span></div>
                <div className="text-sm"><span className="text-gray-500">Kontak:</span> <span className="font-medium text-gray-900">{(quickViewItem.contact && typeof quickViewItem.contact === 'object') ? (quickViewItem.contact.phone || quickViewItem.contact.email || quickViewItem.contact.whatsapp || '-') : (quickViewItem.contact || '-')}</span></div>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">{quickViewItem.short_description || 'Tidak ada deskripsi'}</div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
              <a href={`/admin/travel-agencies/${quickViewItem.id}/view`} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Lihat Detail</a>
              <a href={`/admin/travel-agencies/${quickViewItem.id}/edit`} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">Edit</a>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)}></div>
          <div className="relative max-w-md w-full mx-4 bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">{modal.title}</h4>
              <button onClick={() => setModal(null)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6"><p className="text-gray-700 whitespace-pre-wrap">{modal.message}</p></div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              {modal.cancelText && (
                <button onClick={() => setModal(null)} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium">{modal.cancelText}</button>
              )}
              <button onClick={modal.onConfirm} disabled={isModalLoading} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200 font-medium flex items-center gap-2">
                {isModalLoading ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Loading...</>) : (modal.confirmText || 'OK')}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

// Modals & Quick View overlays
