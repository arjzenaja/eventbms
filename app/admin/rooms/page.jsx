'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function RoomsManagement() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAccommodation, setSelectedAccommodation] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Tipe Kamar</h1>
              <div className="flex gap-3">
                <Link 
                  href="/admin/accommodation" 
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Kembali ke Penginapan
                </Link>
                <Link 
                  href="/admin/rooms/new" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <span>+</span>
                  Tambah Kamar
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Penginapan
                  </label>
                  <select
                    value={selectedAccommodation}
                    onChange={(e) => setSelectedAccommodation(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Semua Penginapan</option>
                    {accommodations.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cari Kamar
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari nama atau deskripsi kamar..."
                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={fetchData}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Rooms Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Tipe Kamar ({filteredRooms.length})
                </h3>
              </div>

              {filteredRooms.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Tidak ada kamar yang ditemukan</p>
                  <Link 
                    href="/admin/rooms/new"
                    className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Tambah Kamar Pertama
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kamar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipe Bed
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Harga
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kapasitas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Penginapan
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRooms.map((room) => (
                        <tr key={room.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                  <span className="text-blue-600 text-lg">🛏️</span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {room.name || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {room.description && room.description.length > 50 
                                    ? `${room.description.substring(0, 50)}...` 
                                    : room.description || 'Tidak ada deskripsi'}
                                </div>
                                <div className="flex items-center mt-1">
                                  {room.isPopular && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 mr-2">
                                      Populer
                                    </span>
                                  )}
                                  <span className="text-sm text-gray-500">
                                    {room.size || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {room.bedType || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              Rp {room.price ? room.price.toLocaleString() : '0'}
                            </div>
                            <div className="text-sm text-gray-500">
                              per malam
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {room.capacity || 'N/A'} orang
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleStatus(room.id, room.available)}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                room.available
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {room.available ? 'Tersedia' : 'Tidak Tersedia'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {room.accommodationTitle || accommodations.find(acc => acc.id === room.accommodationId)?.title || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link
                                href={`/admin/rooms/${room.id}/edit`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(room.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Hapus
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