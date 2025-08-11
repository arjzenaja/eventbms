'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ViewDestinationPage() {
  const router = useRouter();
  const params = useParams();
  const destinationId = params.id;
  
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await fetch(`/api/destinations/${destinationId}`);
        const data = await response.json();
        
        if (data.success) {
          setDestination(data.destination);
        } else {
          setError(data.message || 'Gagal memuat data destinasi');
        }
      } catch (error) {
        console.error('Error fetching destination:', error);
        setError('Terjadi kesalahan saat memuat data destinasi');
      } finally {
        setIsLoading(false);
      }
    };

    if (destinationId) {
      fetchDestination();
    }
  }, [destinationId]);

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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Error</h3>
              <p className="text-gray-500 mb-6">{error}</p>
              <div className="space-x-3">
                <Link
                  href="/admin/destinations"
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Kembali ke Destinasi
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!destination) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="text-gray-500 text-6xl mb-4">❓</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Destinasi Tidak Ditemukan</h3>
              <p className="text-gray-500 mb-6">Destinasi yang Anda cari tidak ditemukan.</p>
              <Link
                href="/admin/destinations"
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Kembali ke Destinasi
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Detail Destinasi</h1>
              <div className="flex space-x-3">
                <Link 
                  href={`/admin/destinations/${destinationId}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  ✏️ Edit
                </Link>
                <Link 
                  href="/admin/destinations"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  ← Kembali ke Destinasi
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header dengan gambar */}
              <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
                {destination.img_lg ? (
                  <img
                    src={destination.img_lg}
                    alt={destination.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-white text-center">
                      <div className="text-6xl mb-2">🏞️</div>
                      <p className="text-xl">Tidak ada gambar</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    destination.recommended 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {destination.recommended ? '⭐ Direkomendasikan' : 'Destinasi'}
                  </span>
                </div>
              </div>

              {/* Informasi Destinasi */}
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{destination.title}</h2>
                  <p className="text-gray-600 text-lg">{destination.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Informasi Dasar */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Dasar</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="text-gray-500 w-24">Tipe:</span>
                          <span className="font-medium">
                            {destination.type === 'objek-wisata' ? 'Objek Wisata' : 'Wisata Alam'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 w-24">Lokasi:</span>
                          <span className="font-medium">{destination.location}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 w-24">Tanggal:</span>
                          <span className="font-medium">
                            {new Date(destination.date).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 w-24">Jam:</span>
                          <span className="font-medium">{destination.hour}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informasi Tiket */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Tiket</h3>
                      <div className="space-y-3">
                        {destination.seats && destination.seats.length > 0 ? (
                          destination.seats.map((seat, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="font-medium">{seat.seat}</span>
                              <span className="text-lg font-bold text-blue-600">
                                Rp {seat.price?.toLocaleString('id-ID')}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 italic">Tidak ada informasi tiket</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gambar */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Gambar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Kecil</label>
                      {destination.img_sm ? (
                        <img
                          src={destination.img_sm}
                          alt={`${destination.title} - Small`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <span className="text-gray-500">Tidak ada gambar</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Besar</label>
                      {destination.img_lg ? (
                        <img
                          src={destination.img_lg}
                          alt={`${destination.title} - Large`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <span className="text-gray-500">Tidak ada gambar</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Status</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">Direkomendasikan:</span>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        destination.recommended 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {destination.recommended ? 'Ya' : 'Tidak'}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">Tipe:</span>
                      <span className="px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800">
                        {destination.type === 'objek-wisata' ? 'Objek Wisata' : 'Wisata Alam'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Link
                    href="/admin/destinations"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Kembali
                  </Link>
                  <Link
                    href={`/admin/destinations/${destinationId}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit Destinasi
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
