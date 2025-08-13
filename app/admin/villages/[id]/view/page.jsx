'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ViewVillagePage() {
  const router = useRouter();
  const params = useParams();
  const villageId = params.id;
  
  const [village, setVillage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVillage = async () => {
      try {
        const response = await fetch(`/api/villages/${villageId}`);
        const data = await response.json();
        
        if (data.success) {
          setVillage(data.village);
        } else {
          setError(data.message || 'Gagal memuat data desa wisata');
        }
      } catch (error) {
        console.error('Error fetching village:', error);
        setError('Terjadi kesalahan saat memuat data desa wisata');
      } finally {
        setIsLoading(false);
      }
    };

    if (villageId) {
      fetchVillage();
    }
  }, [villageId]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data desa wisata..." />
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
                  href="/admin/villages"
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Kembali ke Desa Wisata
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

  if (!village) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="text-gray-500 text-6xl mb-4">❓</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Desa Wisata Tidak Ditemukan</h3>
              <p className="text-gray-500 mb-6">Desa wisata yang Anda cari tidak ditemukan.</p>
              <Link
                href="/admin/villages"
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Kembali ke Desa Wisata
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
              <h1 className="text-3xl font-bold text-gray-900">Detail Desa Wisata</h1>
              <div className="flex space-x-3">
                <Link 
                  href={`/admin/villages/${villageId}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  ✏️ Edit
                </Link>
                <Link 
                  href="/admin/villages"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  ← Kembali ke Desa Wisata
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header dengan gambar */}
              <div className="relative h-64 bg-gradient-to-r from-green-600 to-blue-600">
                {village.img_lg ? (
                  <img
                    src={village.img_lg}
                    alt={village.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-white text-center">
                      <div className="text-6xl mb-2">🏘️</div>
                      <p className="text-xl">Tidak ada gambar</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    village.recommended 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {village.recommended ? '⭐ Direkomendasikan' : 'Desa Wisata'}
                  </span>
                </div>
              </div>

              {/* Informasi Desa Wisata */}
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{village.title}</h2>
                  <p className="text-gray-600 text-lg">{village.description}</p>
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
                            {village.type === 'desa' ? 'Desa Wisata' : 
                             village.type === 'kampung' ? 'Kampung Wisata' :
                             village.type === 'kelurahan' ? 'Kelurahan Wisata' :
                             village.type}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 w-24">Lokasi:</span>
                          <span className="font-medium">{village.location}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 w-24">Kategori:</span>
                          <span className="font-medium">{village.category || 'Desa Wisata'}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 w-24">Alamat:</span>
                          <span className="font-medium">{village.address || village.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informasi Kontak */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Kontak</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Kontak:</span>
                          <span className="text-lg font-bold text-blue-600">
                            {village.contact || 'Tidak ada'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium">Alamat:</span>
                          <span className="text-lg font-bold text-blue-600">
                            {village.address || village.location || 'Tidak ada'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deskripsi Singkat */}
                {village.short_description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi Singkat</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {village.short_description}
                    </p>
                  </div>
                )}

                {/* Gambar */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Gambar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Kecil</label>
                      {village.img_sm ? (
                        <img
                          src={village.img_sm}
                          alt={`${village.title} - Small`}
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
                      {village.img_lg ? (
                        <img
                          src={village.img_lg}
                          alt={`${village.title} - Large`}
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

                {/* Status dan Fitur */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Status dan Fitur</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">Direkomendasikan:</span>
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            village.recommended 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {village.recommended ? 'Ya' : 'Tidak'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">Tipe:</span>
                          <span className="px-2 py-1 rounded text-sm font-medium bg-green-100 text-green-800">
                            {village.type === 'desa' ? 'Desa Wisata' : 
                             village.type === 'kampung' ? 'Kampung Wisata' :
                             village.type === 'kelurahan' ? 'Kelurahan Wisata' :
                             village.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-2">Fitur</h4>
                      <div className="space-y-2">
                        {village.features && village.features.length > 0 ? (
                          village.features.map((feature, index) => (
                            <div key={index} className="flex items-center">
                              <span className="text-green-500 mr-2">✓</span>
                              <span className="text-sm text-gray-700">{feature}</span>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 italic text-sm">Tidak ada fitur yang tersedia</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informasi Sistem */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Sistem</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Dibuat pada:</span>
                      <span className="ml-2">
                        {village.created_at ? new Date(village.created_at).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Tidak diketahui'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Terakhir diupdate:</span>
                      <span className="ml-2">
                        {village.updated_at ? new Date(village.updated_at).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Tidak diketahui'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <Link
                    href="/admin/villages"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Kembali
                  </Link>
                  <Link
                    href={`/admin/villages/${villageId}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit Desa Wisata
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
