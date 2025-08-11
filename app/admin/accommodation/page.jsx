'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function AdminAccommodation() {
  const [accommodations, setAccommodations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch('/api/accommodation');
        const data = await response.json();
        
        if (data.success) {
          setAccommodations(data.accommodations);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching accommodations:', error);
        setError('Terjadi kesalahan saat mengambil data penginapan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  const filteredAccommodations = accommodations.filter(accommodation => {
    const matchesSearch = accommodation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         accommodation.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || accommodation.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDeleteAccommodation = async (accommodationId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus penginapan ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/accommodation/${accommodationId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAccommodations(accommodations.filter(acc => acc.id !== accommodationId));
        alert('Penginapan berhasil dihapus!');
      } else {
        alert('Gagal menghapus penginapan: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting accommodation:', error);
      alert('Terjadi kesalahan saat menghapus penginapan');
    }
  };

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Penginapan</h1>
              <Link 
                href="/admin/accommodation/new" 
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
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="penginapan">Penginapan</option>
                  <option value="hotel">Hotel</option>
                  <option value="villa">Villa</option>
                  <option value="guesthouse">Guesthouse</option>
                  <option value="homestay">Homestay</option>
                </select>
                
                <button className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 flex items-center gap-2">
                  <span>⚙️</span>
                  Filter
                </button>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOCATION</th>
                    
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAccommodations.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        Showing 0 of 0 results
                      </td>
                    </tr>
                  ) : (
                    filteredAccommodations.map((accommodation, index) => (
                      <tr key={accommodation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-full object-cover" 
                                src={accommodation.img_sm || '/placeholder.jpg'} 
                                alt={accommodation.title}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{accommodation.title}</div>
                              <div className="text-sm text-gray-500">{accommodation.short_description?.substring(0, 50)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {accommodation.type === 'penginapan' ? 'Penginapan' : accommodation.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{accommodation.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/accommodation/${accommodation.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </Link>
                            <button 
                              onClick={() => handleDeleteAccommodation(accommodation.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAccommodations.length}</span> of{' '}
                      <span className="font-medium">{filteredAccommodations.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        Next
                      </button>
                    </nav>
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
