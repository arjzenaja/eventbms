'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function ViewEvent() {
  const params = useParams();
  const { id } = params;
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setEvent(data.event);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Terjadi kesalahan saat mengambil data event');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data event..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={() => window.location.reload()}
          message="Gagal memuat data event"
        />
      </ProtectedRoute>
    );
  }

  if (!event) {
    return (
      <ProtectedRoute>
        <div className="p-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Event tidak ditemukan</h2>
            <Link 
              href="/admin/events"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Kembali ke Daftar Events
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
              <h1 className="text-3xl font-bold text-gray-900">Detail Event</h1>
              <div className="flex space-x-3">
                <Link 
                  href="/admin/events"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  ← Kembali
                </Link>
                <Link 
                  href={`/admin/events/${id}/edit`}
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
                {event.recommended && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Direkomendasikan
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Deskripsi Singkat */}
                  {event.short_description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi Singkat</h3>
                      <p className="text-gray-700">{event.short_description}</p>
                    </div>
                  )}

                  {/* Deskripsi Lengkap */}
                  {event.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi Lengkap</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
                    </div>
                  )}

                  {/* Tipe Event */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tipe Event</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {event.type === 'event-banyumas' ? 'Event Banyumas' : 
                       event.type === 'event-rakyat' ? 'Event Rakyat' : 
                       event.type === 'konser' ? 'Konser' : 
                       event.type === 'festival' ? 'Festival' : 
                       event.type === 'workshop' ? 'Workshop' : 
                       event.type === 'seminar' ? 'Seminar' : 
                       event.type === 'exhibition' ? 'Pameran' : event.type}
                    </span>
                  </div>

                  {/* Tanggal dan Waktu */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tanggal & Waktu</h3>
                    <div className="space-y-1 text-gray-700">
                      {event.date && (
                        <p>Tanggal: {new Date(event.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}</p>
                      )}
                      {event.hour && (
                        <p>Waktu: {event.hour}</p>
                      )}
                    </div>
                  </div>

                  {/* Lokasi */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Lokasi</h3>
                    <p className="text-gray-700">{event.location}</p>
                  </div>

                  {/* Tempat */}
                  {event.venue && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Tempat</h3>
                      <p className="text-gray-700">{event.venue}</p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Kapasitas */}
                  {event.seats && event.seats.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Kapasitas & Biaya Masuk</h3>
                      <div className="space-y-2">
                        {event.seats.map((seat, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium text-gray-900">{seat.seat}</p>
                            <p className="text-gray-700">Harga: Rp {seat.price?.toLocaleString('id-ID') || '0'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Organizer */}
                  {event.organizers && event.organizers.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Organizer</h3>
                      <div className="space-y-3">
                        {event.organizers.map((organizer, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <img 
                              src={organizer.img_avatar || '/placeholder.jpg'} 
                              alt={organizer.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{organizer.name}</p>
                              <p className="text-sm text-gray-600">{organizer.job}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gambar */}
                  {(event.img_sm || event.img_lg) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Gambar</h3>
                      <div className="space-y-2">
                        {event.img_sm && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Gambar Kecil:</p>
                            <img 
                              src={event.img_sm} 
                              alt="Gambar kecil" 
                              className="w-32 h-24 object-cover rounded"
                            />
                          </div>
                        )}
                        {event.img_lg && (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Gambar Besar:</p>
                            <img 
                              src={event.img_lg} 
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
                      <p>Dibuat: {event.created_at ? new Date(event.created_at).toLocaleDateString('id-ID') : '-'}</p>
                      <p>Diupdate: {event.updated_at ? new Date(event.updated_at).toLocaleDateString('id-ID') : '-'}</p>
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


