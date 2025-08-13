'use client';

import { useState, useEffect } from 'react';
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

  const handleDeleteEvent = async (eventId) => {
    if (!eventId || !confirm('Apakah Anda yakin ingin menghapus event ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove event from local state
        setEvents(events.filter(event => event.id !== eventId));
        alert('Event berhasil dihapus!');
      } else {
        alert('Gagal menghapus event: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Terjadi kesalahan saat menghapus event');
    }
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
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Events</h1>
              <Link 
                href="/admin/events/new" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
              >
                <span>+</span>
                Add New
              </Link>
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
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white !bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white !bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="event-banyumas">Event Banyumas</option>
                  <option value="event">Event</option>
                </select>
                
                <button className="px-4 py-2 bg-white !bg-white text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2">
                  <span>⚙️</span>
                  Filter
                </button>
                
                <button 
                  onClick={refreshData}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2"
                >
                  <span>🔄</span>
                  Refresh
                </button>
                
                <button 
                  onClick={() => {
                    console.log('Current events state:', events);
                    console.log('Filtered events:', filteredEvents);
                    alert(`Total events: ${events.length}\nTersaring: ${filteredEvents.length}`);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
                  title="Debug Info"
                >
                  <span>🐛</span>
                  Debug
                </button>
                
                <button 
                  onClick={async () => {
                    if (confirm('Perbaiki ID yang tidak valid? Ini akan membersihkan data yang rusak.')) {
                      try {
                        const response = await fetch('/api/events/fix-ids', { method: 'POST' });
                        const data = await response.json();
                        if (data.success) {
                          alert('ID berhasil diperbaiki! Memperbarui data...');
                          await refreshData();
                        } else {
                          alert('Gagal memperbaiki ID: ' + data.message);
                        }
                      } catch (error) {
                        alert('Error memperbaiki ID: ' + error.message);
                      }
                    }
                  }}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center gap-2"
                  title="Fix Invalid IDs"
                >
                  <span>🔧</span>
                  Fix IDs
                </button>
                
                <button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/destinations/export?format=csv&category=events');
                      if (response.ok) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `events_${new Date().toISOString().split('T')[0]}.csv`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        alert('Data events berhasil diexport ke CSV!');
                      } else {
                        alert('Gagal export data: ' + response.statusText);
                      }
                    } catch (error) {
                      alert('Error export data: ' + error.message);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  title="Export Data Events"
                >
                  <span>📊</span>
                  Export
                </button>
                
                <button 
                  onClick={async () => {
                    if (confirm('Migrate types untuk standardisasi data events? Ini akan membuat backup otomatis.')) {
                      try {
                        const response = await fetch('/api/destinations/migrate-types?action=migrate', { 
                          method: 'POST' 
                        });
                        const data = await response.json();
                        if (data.success) {
                          alert(`Migrasi berhasil! ${data.migrated_items} item telah distandarisasi.\nBackup tersimpan di: ${data.backup_file}`);
                          await refreshData();
                        } else {
                          alert('Gagal migrate types: ' + data.message);
                        }
                      } catch (error) {
                        alert('Error migrate types: ' + error.message);
                      }
                    }
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center gap-2"
                  title="Migrate Types Data Events"
                >
                  <span>🔄</span>
                  Migrate Types
                </button>
              </div>
            </div>

            {/* Summary Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Total Events Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-lg">📅</span>
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
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-lg">🔍</span>
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
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-lg">🏷️</span>
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
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <span className="text-white text-lg">📍</span>
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
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
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
                              <Link
                                href={`/admin/events/${String(event.id)}/view`}
                                className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors duration-200"
                                title="Lihat Detail"
                              >
                                👁️
                              </Link>
                              <Link
                                href={`/admin/events/${String(event.id)}/edit`}
                                className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50 transition-colors duration-200"
                                title="Edit"
                              >
                                ✏️
                              </Link>
                              <button
                                onClick={() => handleDeleteEvent(String(event.id))}
                                className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                                title="Hapus"
                              >
                                🗑️
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
    </ProtectedRoute>
  );
}
