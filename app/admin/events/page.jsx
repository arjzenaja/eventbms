'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isTypeShown, setIsTypeShown] = useState(false);
  const typeRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        
        if (data.success) {
          // Ensure all events have valid IDs and filter out any invalid entries
          const validEvents = data.events.filter(event => {
            // Check if event exists and has required properties
            if (!event || typeof event !== 'object') return false;
            
            // Check if ID is valid
            if (!event.id || event.id === null || event.id === undefined || event.id === '') return false;
            
            // Ensure ID can be converted to a valid number
            const idNum = Number(event.id);
            if (isNaN(idNum) || idNum <= 0) return false;
            
            // Check if title and location exist and are strings
            if (!event.title || typeof event.title !== 'string' || event.title.trim() === '') return false;
            if (!event.location || typeof event.location !== 'string' || event.location.trim() === '') return false;
            
            return true;
          });
          
          console.log('Valid events found:', validEvents.length);
          setEvents(validEvents);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Terjadi kesalahan saat mengambil data events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (typeRef.current && !typeRef.current.contains(e.target)) {
        setIsTypeShown(false);
        setTimeout(() => setIsTypeOpen(false), 120);
      }
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') {
        setIsTypeShown(false);
        setTimeout(() => setIsTypeOpen(false), 120);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, []);

  const openTypeMenu = () => { setIsTypeOpen(true); requestAnimationFrame(() => setIsTypeShown(true)); };
  const closeTypeMenu = () => { setIsTypeShown(false); setTimeout(() => setIsTypeOpen(false), 120); };

  const typeOptions = [
    { value: 'all', label: 'Semua Tipe' },
    { value: 'event-banyumas', label: 'Event Banyumas' },
    { value: 'event', label: 'Event' },
    { value: 'konser', label: 'Konser' },
    { value: 'festival', label: 'Festival' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'exhibition', label: 'Pameran' },
  ];

  const filteredEvents = events.filter((event) => {
    if (!event || !event.title || !event.location) return false;
    
    const s = searchTerm.toLowerCase();
    const matchesTitle = event.title.toLowerCase().includes(s);
    const matchesLocation = event.location.toLowerCase().includes(s);
    const matchesType = filterType === 'all' || event.type === filterType;
    const isTourismType = typeof event.type === 'string' && event.type.startsWith('wisata-');
    if (isTourismType) return false; // exclude tourism/destinasi entries from Events list
    return (matchesTitle || matchesLocation) && matchesType;
  });

  // Debug logging to help identify the issue
  useEffect(() => {
    if (events.length > 0) {
      console.log('Events data:', events);
      console.log('Filtered events:', filteredEvents);
    }
  }, [events, filteredEvents]);

  const [modal, setModal] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [quickViewItem, setQuickViewItem] = useState(null);

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setEvents(events.filter(event => event.id !== eventId));
        setModal({ title: 'Berhasil', message: 'Event berhasil dihapus!', confirmText: 'OK', onConfirm: () => setModal(null) });
      } else {
        setModal({ title: 'Gagal', message: 'Gagal menghapus event: ' + data.message, confirmText: 'OK', onConfirm: () => setModal(null) });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setModal({ title: 'Error', message: 'Terjadi kesalahan saat menghapus event', confirmText: 'OK', onConfirm: () => setModal(null) });
    }
  };

  const confirmDeleteEvent = (eventId) => {
    setModal({
      title: 'Hapus Event',
      message: 'Apakah Anda yakin ingin menghapus event ini?',
      confirmText: 'Hapus',
      cancelText: 'Batal',
      onConfirm: async () => { setModal(null); await handleDeleteEvent(eventId); }
    });
  };

  const handleExportData = () => {
    const exportData = filteredEvents.map(item => ({
      ID: item.id,
      Nama: item.title,
      Lokasi: item.location,
      Tipe: item.type,
      Kategori: item.category || 'Event',
      Deskripsi: item.short_description || '',
      Tanggal: item.date || 'Tidak ada info',
      Waktu: item.time || 'Tidak ada info',
      Biaya: item.price || 'Gratis',
      Kontak: item.contact || '',
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
    link.setAttribute('download', `events_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      
      if (data.success) {
        // Ensure all events have valid IDs and filter out any invalid entries
        const validEvents = data.events.filter(event => {
          // Check if event exists and has required properties
          if (!event || typeof event !== 'object') return false;
          
          // Check if ID is valid
          if (!event.id || event.id === null || event.id === undefined || event.id === '') return false;
          
          // Ensure ID can be converted to a valid number
          const idNum = Number(event.id);
          if (isNaN(idNum) || idNum <= 0) return false;
          
          // Check if title and location exist and are strings
          if (!event.title || typeof event.title !== 'string' || event.title.trim() === '') return false;
          if (!event.location || typeof event.location !== 'string' || event.location.trim() === '') return false;
          
          return true;
        });
        
        console.log('Refreshed events:', validEvents);
        setEvents(validEvents);
        setError(''); // Clear any previous errors
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Error refreshing events:', error);
      setError('Terjadi kesalahan saat refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data events..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data events"
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
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Events</h1>
              <div className="flex gap-2">
                <Link 
                  href="/admin/events/packages" 
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                  Kelola Paket
                </Link>
                <Link 
                  href="/admin/events/new" 
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 px-4 py-2.5 text-white shadow-sm hover:from-indigo-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                  Add New
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
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/></svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="relative" ref={typeRef}>
                  <button
                    type="button"
                    onClick={() => (isTypeOpen ? closeTypeMenu() : openTypeMenu())}
                    className={`inline-flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-white shadow-sm min-w-[220px] ${isTypeOpen ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-300 hover:border-gray-400'} transition-all duration-150`}
                    aria-haspopup="listbox"
                    aria-expanded={isTypeOpen}
                  >
                    <span className="text-gray-900 font-medium truncate">{typeOptions.find(t => t.value === filterType)?.label || 'Semua Tipe'}</span>
                    <span className={`p-1.5 rounded-md border ${isTypeOpen ? 'border-orange-300 bg-orange-50 text-orange-600' : 'border-gray-200 bg-gray-50 text-gray-600'} transition-colors`}>
                      <svg className={`w-4 h-4 transition-transform ${isTypeOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </span>
                  </button>
                  {isTypeOpen && (
                    <div className="relative">
                      <ul className={`absolute z-20 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl origin-top transform transition duration-150 ease-out scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${isTypeShown ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'}`} style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f3f4f6' }} role="listbox">
                        {typeOptions.map(opt => (
                          <li key={opt.value}>
                            <button type="button" onClick={() => { setFilterType(opt.value); closeTypeMenu(); }} className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-orange-50 ${filterType === opt.value ? 'bg-orange-50' : ''}`}>
                              <span className={`text-sm ${filterType === opt.value ? 'text-orange-700 font-semibold' : 'text-gray-800'}`}>{opt.label}</span>
                              {filterType === opt.value && (<svg className="w-5 h-5 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>)}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>


                
                <button 
                  onClick={refreshData}
                  disabled={isLoading}
                  className="px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2 shadow-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6M20 9a8.003 8.003 0 00-15.5-2M4 15a8.003 8.003 0 0015.5 2"/></svg>
                  Refresh
                </button>
                
                <button 
                  onClick={handleExportData}
                  disabled={filteredEvents.length === 0}
                  className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2 shadow-sm"
                  title="Export Data Events ke CSV"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m0 0l-3-3m3 3l3-3M4 4h16v4H4zM4 8v10a2 2 0 002 2h12a2 2 0 002-2V8"/></svg>
                  Export
                </button>
                
                <button 
                  onClick={() => {
                    const uniqueTypes = [...new Set(events.map(e => e.type))];
                    setModal({ title: 'Debug Info', message: `Total events: ${events.length}\nTersaring: ${filteredEvents.length}\n\nTypes in data: ${uniqueTypes.join(', ')}`, confirmText: 'OK', onConfirm: () => setModal(null) });
                  }}
                  className="px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 flex items-center gap-2 shadow-sm"
                  title="Debug Info"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3a1 1 0 012 0v1m4 1l-.707.707M21 11h-1M4 11H3m3.343-5.657l-.707-.707"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8a5 5 0 00-5 5c0 1.657 1.343 3 3 3h4c1.657 0 3-1.343 3-3a5 5 0 00-5-5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19h6"/></svg>
                  Debug
                </button>
                
                <button 
                  onClick={() => {
                    setModal({
                      title: 'Fix Invalid IDs',
                      message: 'Perbaiki ID tidak valid? Ini akan membersihkan data yang korup.',
                      confirmText: 'Perbaiki',
                      cancelText: 'Batal',
                      onConfirm: async () => {
                        setModal(null);
                        try {
                          setIsModalLoading(true);
                          const response = await fetch('/api/events/fix-ids', { method: 'POST' });
                          const data = await response.json();
                          if (data.success) {
                            setModal({ title: 'Sukses', message: 'ID berhasil diperbaiki. Memperbarui data...', confirmText: 'OK', onConfirm: async () => { setModal(null); await refreshData(); } });
                          } else {
                            setModal({ title: 'Gagal', message: 'Gagal memperbaiki ID: ' + data.message, confirmText: 'OK', onConfirm: () => setModal(null) });
                          }
                        } catch (err) {
                          setModal({ title: 'Error', message: 'Error memperbaiki ID: ' + String(err), confirmText: 'OK', onConfirm: () => setModal(null) });
                        } finally {
                          setIsModalLoading(false);
                        }
                      }
                    });
                  }}
                  className="px-4 py-2.5 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 flex items-center gap-2 shadow-sm"
                  title="Fix Invalid IDs"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9a3 3 0 100 6 3 3 0 000-6z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.4 15a1.8 1.8 0 00.33 1.9l.06.06a1 1 0 01-1.42 1.42l-.06-.06a1.8 1.8 0 00-1.9-.33 1.8 1.8 0 00-1.1 1.66V20a1 1 0 01-2 0v-.35a1.8 1.8 0 00-1.1-1.66 1.8 1.8 0 00-1.9.33l-.06.06a1 1 0 01-1.42-1.42l.06-.06a1.8 1.8 0 00.33-1.9 1.8 1.8 0 00-1.66-1.1H4a1 1 0 010-2h.35a1.8 1.8 0 001.66-1.1 1.8 1.8 0 00-.33-1.9l-.06-.06A1 1 0 016.04 6.1l.06.06a1.8 1.8 0 001.9.33A1.8 1.8 0 0010 4.82V4a1 1 0 012 0v.35a1.8 1.8 0 001.1 1.66 1.8 1.8 0 001.9-.33l.06-.06a1 1 0 011.42 1.42l-.06.06a1.8 1.8 0 00-.33 1.9 1.8 1.8 0 001.66 1.1H20a1 1 0 010 2h-.35a1.8 1.8 0 00-1.66 1.1z"/></svg>
                  Fix IDs
                </button>
                
                <button 
                  onClick={() => {
                    setModal({
                      title: 'Migrasi Tipe',
                      message: 'Migrasi tipe untuk standarisasi data events? Backup akan dibuat otomatis.',
                      confirmText: 'Migrasi',
                      cancelText: 'Batal',
                      onConfirm: async () => {
                        setModal(null);
                        try {
                          setIsModalLoading(true);
                          const response = await fetch('/api/destinations/migrate-types?action=migrate', { method: 'POST' });
                          const data = await response.json();
                          if (data.success) {
                            setModal({ title: 'Sukses', message: `Migrasi berhasil! ${data.migrated_items} item distandarisasi.\nBackup: ${data.backup_file}`, confirmText: 'OK', onConfirm: async () => { setModal(null); await refreshData(); } });
                          } else {
                            setModal({ title: 'Gagal', message: 'Gagal migrate types: ' + data.message, confirmText: 'OK', onConfirm: () => setModal(null) });
                          }
                        } catch (err) {
                          setModal({ title: 'Error', message: 'Error migrate types: ' + String(err), confirmText: 'OK', onConfirm: () => setModal(null) });
                        } finally {
                          setIsModalLoading(false);
                        }
                      }
                    });
                  }}
                  className="px-4 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 flex items-center gap-2 shadow-sm"
                  title="Migrate Types Data Events"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6M20 9a8.003 8.003 0 00-15.5-2M4 15a8.003 8.003 0 0015.5 2"/></svg>
                  Migrate Types
                </button>
              </div>
            </div>

            {/* Summary Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Total Events Card */}
              <div className="bg-white overflow-hidden shadow rounded-2xl border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M5 11h14M5 19h14M7 11v8m10-8v8"/></svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Events</dt>
                        <dd className="text-lg font-medium text-gray-900">{events.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtered Events Card */}
              <div className="bg-white overflow-hidden shadow rounded-2xl border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/></svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Tersaring</dt>
                        <dd className="text-lg font-medium text-gray-900">{filteredEvents.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Types Card */}
              <div className="bg-white overflow-hidden shadow rounded-2xl border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10v10H7zM7 7l10 10"/></svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Jenis Event</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {Array.from(new Set(events.map(event => event.type))).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Locations Card */}
              <div className="bg-white overflow-hidden shadow rounded-2xl border border-gray-200">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11a3 3 0 100-6 3 3 0 000 6zm0 0c-4 0-7 2-7 6a7 7 0 0014 0c0-4-3-6-7-6z"/></svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Lokasi</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {Array.from(new Set(events.map(event => event.location))).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Debug Info */}
            <div className="bg-gray-100 p-4 mb-4 rounded-md">
              <div className="text-sm text-gray-600">
                <strong>Debug Info:</strong> Filter Type: <span className="font-mono">{filterType}</span> | 
                Total Events: <span className="font-mono">{events.length}</span> | 
                Filtered: <span className="font-mono">{filteredEvents.length}</span>
                {filterType !== 'all' && (
                  <span> | Matching types: {events.filter(e => e.type === filterType).length}</span>
                )}
                {events.length > 0 && (
                  <span> | Types in data: {Array.from(new Set(events.map(e => e.type))).join(', ')}</span>
                )}
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white shadow-xl border border-gray-200 overflow-hidden sm:rounded-2xl">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAMA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIPE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TANGGAL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TEMPAT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOKASI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AKSI</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        Showing 0 of 0 results
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((event, index) => {
                      // Ensure event has valid data before rendering
                      if (!event || !event.id || !event.title || !event.location) {
                        console.log('Skipping invalid event:', event);
                        return null; // Skip invalid events
                      }
                      
                      // Ensure index is a valid number
                      const rowNumber = isNaN(index) ? 1 : index + 1;
                      
                      return (
                        <tr key={String(event.id)}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{String(rowNumber)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-3">
                                {event.title?.charAt(0) || 'E'}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{String(event.title || 'Untitled')}</div>
                                <div className="text-sm text-gray-500">
                                  {event.short_description ? `${String(event.short_description).substring(0, 50)}...` : 'No description'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              event.type === 'konser' ? 'bg-purple-100 text-purple-800' :
                              event.type === 'festival' ? 'bg-green-100 text-green-800' :
                              event.type === 'workshop' ? 'bg-yellow-100 text-yellow-800' :
                              event.type === 'seminar' ? 'bg-blue-100 text-blue-800' :
                              event.type === 'exhibition' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {event.type === 'konser' ? 'Konser' :
                               event.type === 'festival' ? 'Festival' :
                               event.type === 'workshop' ? 'Workshop' :
                               event.type === 'seminar' ? 'Seminar' :
                               event.type === 'exhibition' ? 'Pameran' :
                               String(event.type || 'Unknown')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {event.date ? new Date(event.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }) : 'TBD'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {event.venue || 'TBD'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{String(event.location || 'No location')}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setQuickViewItem(event)}
                                className="text-purple-600 hover:text-purple-900 p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                                title="Quick View"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                              </button>
                              <Link
                                href={`/admin/events/${String(event.id)}/view`}
                                className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
                                title="Lihat Detail"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                              </Link>
                              <Link
                                href={`/admin/events/${String(event.id)}/edit`}
                                className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
                                title="Edit"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.5 3.5l4 4-11 11H5v-4l11.5-11z"/></svg>
                              </Link>
                              <button
                                onClick={() => confirmDeleteEvent(String(event.id))}
                                className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                title="Hapus"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3m-9 0h12"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }).filter(Boolean) // Remove any null entries
                  )}
                </tbody>
              </table>
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
                <div className="h-16 w-16 rounded-lg bg-blue-500 text-white flex items-center justify-center text-xl font-bold">{quickViewItem.title?.charAt(0) || 'E'}</div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{quickViewItem.title}</div>
                  <div className="text-sm text-gray-500">{quickViewItem.location}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="text-sm"><span className="text-gray-500">Tipe:</span> <span className="font-medium text-gray-900">{quickViewItem.type}</span></div>
                <div className="text-sm"><span className="text-gray-500">Tanggal:</span> <span className="font-medium text-gray-900">{quickViewItem.date || 'TBD'}</span></div>
                <div className="text-sm"><span className="text-gray-500">Tempat:</span> <span className="font-medium text-gray-900">{quickViewItem.venue || 'TBD'}</span></div>
                <div className="text-sm"><span className="text-gray-500">Harga:</span> <span className="font-medium text-gray-900">{quickViewItem.price || 'Gratis'}</span></div>
              </div>
              <div className="text-sm text-gray-700 leading-relaxed">{quickViewItem.short_description || 'Tidak ada deskripsi'}</div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
              <a href={`/admin/events/${String(quickViewItem.id)}/view`} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">Lihat Detail</a>
              <a href={`/admin/events/${String(quickViewItem.id)}/edit`} className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition">Edit</a>
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
