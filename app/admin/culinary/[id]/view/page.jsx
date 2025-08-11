'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function ViewCulinaryItem() {
  const params = useParams();
  const { id } = params;
  
  const [culinaryItem, setCulinaryItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCulinaryItem = async () => {
      try {
        const response = await fetch(`/api/culinary/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setCulinaryItem(data.culinaryItem);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching culinary item:', error);
        setError('Terjadi kesalahan saat mengambil data item kuliner');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCulinaryItem();
    }
  }, [id]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data item kuliner..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data item kuliner"
        />
      </ProtectedRoute>
    );
  }

  if (!culinaryItem) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Item Kuliner Tidak Ditemukan</h2>
            <Link 
              href="/admin/culinary" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Kembali ke Daftar Kuliner
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
              <h1 className="text-3xl font-bold text-gray-900">Detail Item Kuliner</h1>
              <div className="flex space-x-3">
                <Link 
                  href={`/admin/culinary/${id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Edit
                </Link>
                <Link 
                  href="/admin/culinary" 
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Kembali
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
              {/* Header with image */}
              <div className="relative h-64 bg-gray-200">
                {culinaryItem.img_lg && (
                  <img
                    src={culinaryItem.img_lg}
                    alt={culinaryItem.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                  <div className="p-6 text-white">
                    <h2 className="text-3xl font-bold">{culinaryItem.title}</h2>
                    <p className="text-lg opacity-90">{culinaryItem.location}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Dasar</h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Nama Kuliner</dt>
                        <dd className="text-sm text-gray-900">{culinaryItem.title}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Lokasi</dt>
                        <dd className="text-sm text-gray-900">{culinaryItem.location}</dd>
                      </div>
                      {culinaryItem.date && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Tanggal</dt>
                          <dd className="text-sm text-gray-900">{culinaryItem.date}</dd>
                        </div>
                      )}
                      {culinaryItem.hour && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Jam</dt>
                          <dd className="text-sm text-gray-900">{culinaryItem.hour}</dd>
                        </div>
                      )}
                                              <div>
                          <dt className="text-sm font-medium text-gray-500">Status Rekomendasi</dt>
                        <dd className="text-sm text-gray-900">
                          {culinaryItem.recommended ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Direkomendasikan
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Tidak Direkomendasikan
                            </span>
                          )}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {culinaryItem.description || 'Tidak ada deskripsi yang tersedia.'}
                    </p>
                  </div>
                </div>

                {/* Images */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Gambar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {culinaryItem.img_sm && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 mb-2">Gambar Kecil</dt>
                        <img
                          src={culinaryItem.img_sm}
                          alt={`${culinaryItem.title} - Small`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                    {culinaryItem.img_lg && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500 mb-2">Gambar Besar</dt>
                        <img
                          src={culinaryItem.img_lg}
                          alt={`${culinaryItem.title} - Large`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <Link
                      href={`/admin/culinary/${id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                      Edit Item
                    </Link>
                    <button
                      onClick={async () => {
                        if (confirm('Apakah Anda yakin ingin menghapus item kuliner ini?')) {
                          try {
                            const response = await fetch(`/api/culinary/${id}`, {
                              method: 'DELETE',
                            });
                            const data = await response.json();
                            
                            if (data.success) {
                              alert('Item kuliner berhasil dihapus!');
                              window.location.href = '/admin/culinary';
                            } else {
                              alert('Gagal menghapus item kuliner: ' + data.message);
                            }
                          } catch (error) {
                            console.error('Error deleting culinary item:', error);
                            alert('Terjadi kesalahan saat menghapus item kuliner');
                          }
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                    >
                      Hapus Item
                    </button>
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
