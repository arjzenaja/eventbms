'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function ViewAccommodation() {
  const params = useParams();
  const { id } = params;
  const [accommodation, setAccommodation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const response = await fetch(`/api/penginapan/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setAccommodation(data.penginapan);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching accommodation:', error);
        setError('Terjadi kesalahan saat mengambil data penginapan');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAccommodation();
    }
  }, [id]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data penginapan..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data penginapan"
        />
      </ProtectedRoute>
    );
  }

  if (!accommodation) {
    return (
      <ProtectedRoute>
        <div className="p-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Penginapan tidak ditemukan</h2>
            <Link 
              href="/admin/accommodation"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Kembali ke Daftar Penginapan
            </Link>
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
              <h1 className="text-3xl font-bold text-gray-900">Detail Penginapan</h1>
              <div className="flex space-x-3">
                <Link 
                  href="/admin/accommodation"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  ← Kembali
                </Link>
                <Link 
                  href={`/admin/accommodation/${id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Header */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{accommodation.title}</h2>
                {accommodation.recommended && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Direkomendasikan
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Deskripsi Singkat */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi Singkat</h3>
                    <p className="text-gray-700">{accommodation.short_description}</p>
                  </div>

                  {/* Deskripsi Lengkap */}
                  {accommodation.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi Lengkap</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{accommodation.description}</p>
                    </div>
                  )}

                  {/* Tipe Penginapan */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tipe Penginapan</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {accommodation.type === 'hotel' ? 'Hotel' : 
                       accommodation.type === 'resort' ? 'Resort' : 
                       accommodation.type === 'villa' ? 'Vila' : 
                       accommodation.type === 'guesthouse' ? 'Guesthouse' : 
                       accommodation.type === 'homestay' ? 'Homestay' : 
                       accommodation.type === 'hostel' ? 'Hostel' : accommodation.type}
                    </span>
                  </div>

                  {/* Lokasi */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Lokasi</h3>
                    <p className="text-gray-700">{accommodation.location}</p>
                  </div>

                  {/* Rating */}
                  {accommodation.star_rating && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Rating Bintang</h3>
                      <p className="text-gray-700">{'⭐'.repeat(accommodation.star_rating)}</p>
                    </div>
                  )}

                  {/* Harga */}
                  {accommodation.price_range && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Kisaran Harga</h3>
                      <p className="text-gray-700">{accommodation.price_range}</p>
                    </div>
                  )}

                  {/* Kontak */}
                  {accommodation.contact && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Kontak</h3>
                      <p className="text-gray-700">{accommodation.contact}</p>
                    </div>
                  )}

                  {/* Alamat */}
                  {accommodation.address && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Alamat Lengkap</h3>
                      <p className="text-gray-700">{accommodation.address}</p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Fasilitas */}
                  {accommodation.amenities && accommodation.amenities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Fasilitas</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {accommodation.amenities.map((amenity, index) => (
                          <li key={index}>{amenity}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Gambar */}
                  {(accommodation.img_sm || accommodation.img_lg) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Gambar</h3>
                      <div className="space-y-2">
                        {accommodation.img_sm && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Gambar Kecil:</p>
                            <img 
                              src={accommodation.img_sm} 
                              alt="Gambar kecil" 
                              className="w-32 h-24 object-cover rounded"
                            />
                          </div>
                        )}
                        {accommodation.img_lg && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Gambar Besar:</p>
                            <img 
                              src={accommodation.img_lg} 
                              alt="Gambar besar" 
                              className="w-full h-48 object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Info Tambahan */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Info Tambahan</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>Dibuat: {accommodation.created_at ? new Date(accommodation.created_at).toLocaleDateString('id-ID') : '-'}</p>
                      <p>Diupdate: {accommodation.updated_at ? new Date(accommodation.updated_at).toLocaleDateString('id-ID') : '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}









