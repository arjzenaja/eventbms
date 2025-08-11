'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

export default function AdminTravelAgencies() {
  const [travelAgencies, setTravelAgencies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchTravelAgencies = async () => {
      try {
        const response = await fetch('/api/travel-agencies');
        const data = await response.json();

        if (data.success) {
          setTravelAgencies(data.travelAgencies);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching travel agencies:', error);
        setError('Terjadi kesalahan saat mengambil data biro perjalanan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTravelAgencies();
  }, []);

  const filteredTravelAgencies = travelAgencies.filter((agency) => {
    const search = searchTerm.toLowerCase();
    const matchesTitle = agency.title?.toLowerCase().includes(search);
    const matchesLocation = agency.location?.toLowerCase().includes(search);
    const matchesType = filterType === 'all' || agency.type === filterType;
    return (matchesTitle || matchesLocation) && matchesType;
  });

  const handleDeleteTravelAgency = async (agencyId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus biro perjalanan ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/travel-agencies/${agencyId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTravelAgencies(travelAgencies.filter(agency => agency.id !== agencyId));
        alert('Biro perjalanan berhasil dihapus!');
      } else {
        alert('Gagal menghapus biro perjalanan: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting travel agency:', error);
      alert('Terjadi kesalahan saat menghapus biro perjalanan');
    }
  };

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Biro Perjalanan</h1>
              <Link 
                href="/admin/travel-agencies/new" 
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
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="biro-perjalanan">Biro Perjalanan</option>
                </select>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                  <span>⚙️</span>
                  Filter
                </button>
              </div>
            </div>

            {/* Tabel */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NO</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NAME</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TYPE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">LOCATION</th>
                
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ACTION</th>
              </tr>
            </thead>
                <tbody className="bg-white divide-y divide-gray-200">
              {filteredTravelAgencies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Data tidak ditemukan
                  </td>
                </tr>
              ) : (
                filteredTravelAgencies.map((agency, index) => (
                  <tr key={agency.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          className="h-10 w-10 rounded-full object-cover mr-3" 
                          src={agency.img_sm || '/placeholder.jpg'} 
                          alt={agency.title}
                        />
                        <div className="ml-1">
                          <div className="text-sm font-medium text-gray-900">{agency.title}</div>
                          <div className="text-sm text-gray-500">{agency.description ? agency.description.substring(0, 50) + '...' : 'No description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        biro perjalanan
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agency.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/travel-agencies/${agency.id}`}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded text-xs"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDeleteTravelAgency(agency.id)}
                          className="text-red-600 hover:text-red-900 px-2 py-1 rounded text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
