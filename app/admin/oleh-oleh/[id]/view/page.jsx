'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function ViewOlehOleh() {
  const params = useParams();
  const { id } = params;
  const [olehOleh, setOlehOleh] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOlehOleh = async () => {
      try {
        const response = await fetch(`/api/oleh_oleh/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setOlehOleh(data.oleh_oleh);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching oleh-oleh:', error);
        setError('Terjadi kesalahan saat mengambil data oleh-oleh');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOlehOleh();
    }
  }, [id]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data oleh-oleh..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data oleh-oleh"
        />
      </ProtectedRoute>
    );
  }

  if (!olehOleh) {
    return (
      <ProtectedRoute>
        <div className="p-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Item oleh-oleh tidak ditemukan</h2>
            <Link 
              href="/admin/oleh-oleh"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Kembali ke Daftar Oleh-Oleh
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
              <h1 className="text-3xl font-bold text-gray-900">Detail Oleh-Oleh</h1>
              <div className="flex space-x-3">
                <Link 
                  href="/admin/oleh-oleh"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  ← Kembali
                </Link>
                <Link 
                  href={`/admin/oleh-oleh/${id}`}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{olehOleh.title}</h2>
                {olehOleh.recommended && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Direkomendasikan
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Deskripsi Singkat */}
                  {olehOleh.short_description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi Singkat</h3>
                      <p className="text-gray-700">{olehOleh.short_description}</p>
                    </div>
                  )}

                  {/* Deskripsi Lengkap */}
                  {olehOleh.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi Lengkap</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{olehOleh.description}</p>
                    </div>
                  )}

                  {/* Tipe Item */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tipe Item</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {olehOleh.type === 'makanan' ? 'Makanan' : 
                       olehOleh.type === 'pakaian' ? 'Pakaian' : 
                       olehOleh.type === 'kerajinan' ? 'Kerajinan' : 
                       olehOleh.type === 'aksesoris' ? 'Aksesoris' : 
                       olehOleh.type === 'oleh-oleh' ? 'Oleh-oleh' : olehOleh.type}
                    </span>
                  </div>

                  {/* Kategori */}
                  {olehOleh.category && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Kategori</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {olehOleh.category}
                      </span>
                    </div>
                  )}

                  {/* Lokasi */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Lokasi</h3>
                    <p className="text-gray-700">{olehOleh.location}</p>
                  </div>

                  {/* Alamat */}
                  {olehOleh.address && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Alamat Lengkap</h3>
                      <p className="text-gray-700">{olehOleh.address}</p>
                    </div>
                  )}

                  {/* Kontak */}
                  {olehOleh.contact && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Kontak</h3>
                      <p className="text-gray-700">{olehOleh.contact}</p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Harga */}
                  {olehOleh.price_range && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Kisaran Harga</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{olehOleh.price_range}</p>
                      </div>
                    </div>
                  )}

                  {/* Biaya Masuk */}
                  {olehOleh.entrance_fee && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Biaya Masuk</h3>
                      <p className="text-gray-700">{olehOleh.entrance_fee}</p>
                    </div>
                  )}

                  {/* Gambar */}
                  {(olehOleh.img_sm || olehOleh.img_lg) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Gambar</h3>
                      <div className="space-y-2">
                        {olehOleh.img_sm && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Gambar Kecil:</p>
                            <img 
                              src={olehOleh.img_sm} 
                              alt="Gambar kecil" 
                              className="w-32 h-24 object-cover rounded"
                            />
                          </div>
                        )}
                        {olehOleh.img_lg && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Gambar Besar:</p>
                            <img 
                              src={olehOleh.img_lg} 
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
                      <p>Dibuat: {olehOleh.created_at ? new Date(olehOleh.created_at).toLocaleDateString('id-ID') : '-'}</p>
                      <p>Diupdate: {olehOleh.updated_at ? new Date(olehOleh.updated_at).toLocaleDateString('id-ID') : '-'}</p>
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




