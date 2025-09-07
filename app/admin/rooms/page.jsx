'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
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
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <button type="button" onClick={() => setOpen(o => !o)} className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 flex items-center justify-between shadow-sm ${open ? 'border-indigo-500' : 'border-gray-300'}`}>
        <span className="flex items-center gap-3">
          <span className="text-xl leading-none">{current?.icon}</span>
          <span className="font-medium truncate">{current?.label}</span>
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

export default function RoomsManagement() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAccommodation, setSelectedAccommodation] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch accommodations
      const accommodationsResponse = await fetch('/api/accommodation');
      const accommodationsData = await accommodationsResponse.json();

      if (accommodationsData.success) {
        setAccommodations(accommodationsData.penginapan || []);
      }

      // Fetch rooms
      const roomsResponse = await fetch('/api/rooms');
      const roomsData = await roomsResponse.json();

      if (roomsData.success) {
        setRooms(roomsData.rooms || []);
      } else {
        setError(roomsData.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Terjadi kesalahan saat mengambil data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kamar ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/rooms?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('Kamar berhasil dihapus');
        fetchData();
      } else {
        alert('Gagal menghapus kamar: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Terjadi kesalahan saat menghapus kamar');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('available', (!currentStatus).toString());

      const response = await fetch('/api/rooms', {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Status kamar berhasil diperbarui');
        fetchData();
      } else {
        alert('Gagal memperbarui status kamar: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating room status:', error);
      alert('Terjadi kesalahan saat memperbarui status kamar');
    }
  };

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesAccommodation = selectedAccommodation === 'all' || 
      room.accommodationId === selectedAccommodation;
    const matchesSearch = searchTerm === '' || 
      (room.name && room.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (room.description && room.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (room.bedType && room.bedType.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesAccommodation && matchesSearch;
  });

  // Stats
  const totalCount = filteredRooms.length;
  const availableCount = filteredRooms.filter(r => r.available).length;
  const uniqueAccommodations = new Set(filteredRooms.map(r => r.accommodationId)).size;

  const handleExport = async () => {
    try {
      setExporting(true);
      const header = ['ID','Nama','Deskripsi','Tipe Bed','Harga','Kapasitas','Status','PenginapanId','Penginapan'];
      const rows = filteredRooms.map(r => [
        r.id,
        `"${(r.name || '').replace(/"/g,'""')}"`,
        `"${(r.description || '').replace(/"/g,'""')}"`,
        r.bedType || '',
        r.price ?? '',
        r.capacity ?? '',
        r.available ? 'Tersedia' : 'Tidak',
        r.accommodationId || '',
        `"${(r.accommodationTitle || accommodations.find(a=>a.id===r.accommodationId)?.title || '').replace(/"/g,'""')}"`
      ].join(','));
      const csv = [header.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rooms.csv';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data kamar..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={fetchData}
          message="Gagal memuat data kamar"
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
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Manajemen Tipe Kamar</h1>
              <div className="flex gap-3">
                <Link 
                  href="/admin/accommodation" 
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Kembali ke Penginapan
                </Link>
                <Link 
                  href="/admin/rooms/new" 
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  Tambah Kamar
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                <div className="lg:col-span-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cari Kamar</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cari nama atau deskripsi kamar..."
                      className="block w-full border border-gray-300 rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    />
                  </div>
                </div>
                <CustomSelect
                  className="lg:col-span-6"
                  label="Filter Penginapan"
                  value={selectedAccommodation}
                  onChange={setSelectedAccommodation}
                  options={[{ value: 'all', label: 'Semua Penginapan', icon: '🏨' }, ...accommodations.map(a => ({ value: a.id, label: a.title, icon: '🏨' }))]}
                />
                <div className="lg:col-span-1 flex justify-end">
                  <button 
                    onClick={handleExport} 
                    disabled={exporting || filteredRooms.length === 0} 
                    className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 disabled:opacity-60 transform transition-all duration-150 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    {exporting ? 'Export…' : 'Export'}
                  </button>
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
                <div className="h-16 w-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mr-4 text-3xl">🛏️</div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Total Kamar</div>
                  <div className="text-3xl font-bold text-gray-900">{totalCount}</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
                <div className="h-16 w-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mr-4 text-3xl">✔️</div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Tersedia</div>
                  <div className="text-3xl font-bold text-gray-900">{availableCount}</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
                <div className="h-16 w-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mr-4 text-3xl">🏨</div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Penginapan</div>
                  <div className="text-3xl font-bold text-gray-900">{uniqueAccommodations}</div>
                </div>
              </div>
            </div>

            {/* Rooms Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tipe Kamar ({filteredRooms.length})
                </h3>
              </div>

              {filteredRooms.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"/>
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg mb-4">Tidak ada kamar yang ditemukan</p>
                  <Link 
                    href="/admin/rooms/new"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                    Tambah Kamar Pertama
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Kamar
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Tipe Bed
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Harga
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Kapasitas
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Penginapan
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRooms.map((room) => (
                        <tr key={room.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-14 w-14">
                                <div className="h-14 w-14 rounded-xl bg-blue-100 flex items-center justify-center">
                                  <span className="text-blue-600 text-xl">🛏️</span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900">
                                  {room.name || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  {room.description && room.description.length > 50 
                                    ? `${room.description.substring(0, 50)}...` 
                                    : room.description || 'Tidak ada deskripsi'}
                                </div>
                                <div className="flex items-center mt-2">
                                  {room.isPopular && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mr-2">
                                      ⭐ Populer
                                    </span>
                                  )}
                                  <span className="text-sm text-gray-500">
                                    {room.size || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                              {room.bedType || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              Rp {room.price ? room.price.toLocaleString() : '0'}
                            </div>
                            <div className="text-sm text-gray-500">
                              per malam
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {room.capacity || 'N/A'} orang
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleStatus(room.id, room.available)}
                              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                                room.available
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {room.available ? '✅ Tersedia' : '❌ Tidak Tersedia'}
                            </button>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                            {room.accommodationTitle || accommodations.find(acc => acc.id === room.accommodationId)?.title || 'N/A'}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <Link
                                href={`/admin/rooms/${room.id}/edit`}
                                className="text-blue-600 hover:text-blue-900 font-medium transition-colors duration-200"
                              >
                                ✏️ Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(room.id)}
                                className="text-red-600 hover:text-red-900 font-medium transition-colors duration-200"
                              >
                                🗑️ Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}