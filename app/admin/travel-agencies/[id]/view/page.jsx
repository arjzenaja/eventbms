'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function ViewTravelAgency() {
  const params = useParams();
  const { id } = params;
  const [travelAgency, setTravelAgency] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTravelAgency = async () => {
      try {
        const response = await fetch(`/api/biro_perjalanan/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setTravelAgency(data.biro_perjalanan);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching travel agency:', error);
        setError('Terjadi kesalahan saat mengambil data biro perjalanan');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTravelAgency();
    }
  }, [id]);

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

  if (!travelAgency) {
    return (
      <ProtectedRoute>
        <div className="p-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Biro perjalanan tidak ditemukan</h2>
            <Link 
              href="/admin/travel-agencies"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Kembali ke Daftar Biro Perjalanan
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
              <h1 className="text-3xl font-bold text-gray-900">Detail Biro Perjalanan</h1>
              <div className="flex space-x-3">
                <Link 
                  href="/admin/travel-agencies"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  ← Kembali
                </Link>
                <Link 
                  href={`/admin/travel-agencies/${id}/edit`}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{travelAgency.title}</h2>
                {travelAgency.recommended && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Direkomendasikan
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Penjelasan Singkat */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Penjelasan Singkat</h3>
                    <p className="text-gray-700">{travelAgency.short_description}</p>
                  </div>

                  {/* Deskripsi Lengkap */}
                  {travelAgency.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi Lengkap</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{travelAgency.description}</p>
                    </div>
                  )}

                  {/* Jenis Layanan */}
                  {travelAgency.services && travelAgency.services.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Jenis Layanan</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {travelAgency.services.map((service, index) => (
                          <li key={index}>{service}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Alamat Kantor */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Alamat Kantor</h3>
                    <p className="text-gray-700">{travelAgency.address || travelAgency.office_address || '-'}</p>
                  </div>

                  {/* Kontak */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Kontak</h3>
                    <div className="space-y-2 text-gray-700">
                      {travelAgency.contact && (
                        <p>{travelAgency.contact}</p>
                      )}
                      {travelAgency.contact?.whatsapp && (
                        <p><span className="font-medium">WhatsApp:</span> {travelAgency.contact.whatsapp}</p>
                      )}
                      {travelAgency.contact?.email && (
                        <p><span className="font-medium">Email:</span> {travelAgency.contact.email}</p>
                      )}
                      {travelAgency.contact?.instagram && (
                        <p><span className="font-medium">Instagram:</span> {travelAgency.contact.instagram}</p>
                      )}
                      {travelAgency.contact?.website && (
                        <p><span className="font-medium">Website:</span> {travelAgency.contact.website}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Tipe Layanan */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tipe Layanan</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {travelAgency.type === 'biro-perjalanan' ? 'Biro Perjalanan' : 
                       travelAgency.type === 'travel-agent' ? 'Travel Agent' : 
                       travelAgency.type === 'tour-operator' ? 'Tour Operator' : 
                       travelAgency.type === 'online-travel' ? 'Online Travel' : travelAgency.type}
                    </span>
                  </div>

                  {/* Kategori */}
                  {travelAgency.category && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Kategori</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {travelAgency.category}
                      </span>
                    </div>
                  )}

                  {/* Lokasi */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Lokasi</h3>
                    <p className="text-gray-700">{travelAgency.location}</p>
                  </div>

                  {/* Fasilitas */}
                  {travelAgency.facilities && travelAgency.facilities.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Fasilitas & Layanan Unggulan</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {travelAgency.facilities.map((facility, index) => (
                          <li key={index}>{facility}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Harga */}
                  {travelAgency.pricing && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Harga / Kisaran Tarif</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{travelAgency.pricing}</p>
                      </div>
                    </div>
                  )}

                  {/* Galeri */}
                  {travelAgency.gallery_link && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Foto / Galeri</h3>
                      <a 
                        href={travelAgency.gallery_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Lihat Galeri
                      </a>
                    </div>
                  )}

                  {/* Info Tambahan */}
                  {travelAgency.additional_info && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Info Tambahan</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{travelAgency.additional_info}</p>
                      </div>
                    </div>
                  )}

                  {/* Gambar */}
                  {(travelAgency.img_sm || travelAgency.img_lg) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Gambar</h3>
                      <div className="space-y-2">
                        {travelAgency.img_sm && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Gambar Kecil:</p>
                            <img 
                              src={travelAgency.img_sm} 
                              alt="Gambar kecil" 
                              className="w-32 h-24 object-cover rounded"
                            />
                          </div>
                        )}
                        {travelAgency.img_lg && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Gambar Besar:</p>
                            <img 
                              src={travelAgency.img_lg} 
                              alt="Gambar besar" 
                              className="w-full h-48 object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}









