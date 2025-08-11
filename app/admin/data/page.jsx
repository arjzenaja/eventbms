'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Search, Plus, Edit, Trash2, Eye, Filter, Download, MoreHorizontal, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminDataPage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    byCategory: {},
    byMonth: {},
    recent: 0
  });

  // Kategori yang tersedia
  const categories = [
    { value: 'semua', label: 'Semua Kategori', icon: '📊' },
    { value: 'objek-wisata', label: 'Objek Wisata', icon: '🏔️' },
    { value: 'kuliner', label: 'Kuliner', icon: '🍽️' },
    { value: 'penginapan', label: 'Penginapan', icon: '🏨' },
    { value: 'oleh-oleh', label: 'Oleh-oleh', icon: '🛍️' },
    { value: 'desa-wisata', label: 'Desa Wisata', icon: '🏘️' },
    { value: 'biro-perjalanan', label: 'Biro Perjalanan', icon: '🚌' },
    { value: 'event', label: 'Event', icon: '🎉' }
  ];

  // Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        const eventsData = data.events || data; // Handle both API response format and direct data
        setData(eventsData);
        setFilteredData(eventsData);
        calculateStats(eventsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStats = (data) => {
    const byCategory = {};
    const byMonth = {};

    const normalizeCategoryValue = (type) => {
      if (typeof type === 'string' && (type === 'objek-wisata' || type.startsWith('wisata-'))) {
        return 'objek-wisata';
      }
      return type;
    };

    data.forEach((item) => {
      const categoryKey = normalizeCategoryValue(item.type);
      byCategory[categoryKey] = (byCategory[categoryKey] || 0) + 1;

      const date = new Date(item.date);
      const month = date.toLocaleString('id-ID', { month: 'long' });
      byMonth[month] = (byMonth[month] || 0) + 1;
    });

    setStats({
      total: data.length,
      byCategory,
      byMonth,
      recent: data.filter((item) => {
        const itemDate = new Date(item.date);
        const now = new Date();
        const diffTime = Math.abs(now - itemDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      }).length,
    });
  };

  // Filter dan search data
  useEffect(() => {
    let filtered = data;

    // Filter berdasarkan kategori
    if (selectedCategory !== 'semua') {
      if (selectedCategory === 'objek-wisata') {
        filtered = filtered.filter(item => typeof item.type === 'string' && (item.type === 'objek-wisata' || item.type.startsWith('wisata-')));
      } else {
        filtered = filtered.filter(item => item.type === selectedCategory);
      }
    }

    // Filter berdasarkan search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, selectedCategory, searchTerm]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handle actions
  const handleView = (id) => {
    // Implementasi view detail
    console.log('View item:', id);
  };

  const handleEdit = (id) => {
    // Implementasi edit
    console.log('Edit item:', id);
  };

  const handleDelete = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      // Implementasi delete
      console.log('Delete item:', id);
    }
  };

  const handleExport = () => {
    // Implementasi export data
    console.log('Export data');
  };

  const getCategoryLabel = (type) => {
    if (typeof type === 'string' && (type === 'objek-wisata' || type.startsWith('wisata-'))) {
      return 'Objek Wisata';
    }
    const category = categories.find(cat => cat.value === type);
    return category ? category.label : type;
  };

  const getCategoryIcon = (type) => {
    if (typeof type === 'string' && (type === 'objek-wisata' || type.startsWith('wisata-'))) {
      return '🏔️';
    }
    const category = categories.find(cat => cat.value === type);
    return category ? category.icon : '📍';
  };

  const getTypeLabel = (type) => {
    if (!type) return '-';
    const map = {
      'wisata-alam': 'Wisata Alam',
      'wisata-taman': 'Wisata Taman',
      'wisata-budaya': 'Wisata Budaya',
      'wisata-sejarah': 'Wisata Sejarah',
      'wisata-buatan': 'Wisata Buatan',
      'wisata-minat-khusus': 'Wisata Minat Khusus',
      'wisata-religi': 'Wisata Religi',
    };
    return map[type] || '-';
  };

  const getSubCategory = (type) => {
    // Logic untuk menentukan sub kategori berdasarkan type
    const subCategories = {
      'wisata-alam': 'Taman Hiburan',
      'kuliner': 'Restoran',
      'penginapan': 'Hotel',
      'oleh-oleh': 'Makanan',
      'desa-wisata': 'Wisata Budaya',
      'biro-perjalanan': 'Travel Agent',
      'event': 'Konser',
      'default': 'Lainnya'
    };
    return subCategories[type] || subCategories.default;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Data Management</h1>
            <p className="text-gray-600 mt-1">Kelola semua data wisata dan event</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              title={viewMode === 'table' ? 'Switch to Grid View' : 'Switch to Table View'}
            >
              {viewMode === 'table' ? <BarChart3 size={20} /> : <PieChart size={20} />}
            </button>
            <Link
              href="/admin/events/new"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Plus size={20} />
              + Tambah Data
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Data</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Data Baru</p>
                <p className="text-3xl font-bold">{stats.recent}</p>
                <p className="text-blue-100 text-xs">30 hari terakhir</p>
              </div>
              <div className="text-3xl">🆕</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Kategori</p>
                <p className="text-3xl font-bold">{Object.keys(stats.byCategory).length}</p>
                <p className="text-purple-100 text-xs">Jenis berbeda</p>
              </div>
              <div className="text-3xl">🏷️</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Filtered</p>
                <p className="text-3xl font-bold">{filteredData.length}</p>
                <p className="text-orange-100 text-xs">Hasil pencarian</p>
              </div>
              <div className="text-3xl">🔍</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart size={20} />
              Distribusi Kategori
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getCategoryIcon(category)}</span>
                    <span className="text-gray-700">{getCategoryLabel(category)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(count / stats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Trend Bulanan
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.byMonth).map(([month, count]) => (
                <div key={month} className="flex items-center justify-between">
                  <span className="text-gray-700 capitalize">{month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(count / Math.max(...Object.values(stats.byMonth))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari semua data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
                             <button
                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                 className="flex items-center justify-between w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-800 min-w-[220px] cursor-pointer transition-all duration-300 ease-in-out hover:border-blue-300 hover:shadow-lg transform hover:scale-[1.02] font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
               >
                 <div className="flex items-center gap-3">
                   <Filter className="text-gray-400" size={20} />
                   <span className="flex items-center gap-2">
                     <span className="text-lg">{getCategoryIcon(selectedCategory)}</span>
                     <span>{getCategoryLabel(selectedCategory)}</span>
                   </span>
                 </div>
                 <svg 
                   className={`w-5 h-5 text-gray-400 transition-transform duration-300 ml-4 ${isDropdownOpen ? 'rotate-180' : ''}`}
                   fill="none" 
                   stroke="currentColor" 
                   viewBox="0 0 24 24"
                 >
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </button>

                             {/* Dropdown Menu */}
               {isDropdownOpen && (
                 <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                   <div className="py-3 max-h-64 overflow-y-auto">
                     {categories.map((category) => (
                       <button
                         key={category.value}
                         onClick={() => {
                           setSelectedCategory(category.value);
                           setIsDropdownOpen(false);
                         }}
                         className={`w-full px-5 py-4 text-left hover:bg-blue-50 transition-colors duration-200 flex items-center gap-4 ${
                           selectedCategory === category.value 
                             ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-500' 
                             : 'text-gray-700 hover:text-gray-900'
                         }`}
                       >
                         <span className="text-2xl">{category.icon}</span>
                         <span className="font-medium text-base">{category.label}</span>
                         {selectedCategory === category.value && (
                           <svg className="w-6 h-6 ml-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                           </svg>
                         )}
                       </button>
                     ))}
                   </div>
                 </div>
               )}

              {/* Backdrop */}
              {isDropdownOpen && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)}
                />
              )}
            </div>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Download size={20} />
              Export Data
            </button>
          </div>
        </div>

        {/* Data Display */}
        {viewMode === 'table' ? (
          /* Table View */
          <div className="bg-white rounded-xl shadow-lg border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Data Wisata</h2>
              <p className="text-sm text-gray-500 mt-1">
                Menampilkan {filteredData.length} dari {data.length} data
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAMA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOKASI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KATEGORI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIPE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TANGGAL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AKSI</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        #{item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-12 w-12 rounded-lg object-cover mr-3 shadow-sm"
                            src={item.img_sm || '/pattern_bg.png'}
                            alt={item.title}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.short_description?.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span>{item.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <span className="mr-1">{getCategoryIcon(item.type)}</span>
                          {getCategoryLabel(item.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getTypeLabel(item.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(item.date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleView(item.id)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Menampilkan {indexOfFirstItem + 1} sampai {Math.min(indexOfLastItem, filteredData.length)} dari {filteredData.length} hasil
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                    >
                      ← Sebelumnya
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                    >
                      Selanjutnya →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <img
                  className="w-full h-48 object-cover rounded-t-xl"
                  src={item.img_sm || '/pattern_bg.png'}
                  alt={item.title}
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <span className="mr-1">{getCategoryIcon(item.type)}</span>
                      {getCategoryLabel(item.type)}
                    </span>
                    <span className="text-xs text-gray-500">#{item.id}</span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{item.short_description?.substring(0, 80)}...</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-2">📍</span>
                    <span>{item.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString('id-ID')}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(item.id)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada data ditemukan</h3>
            <p className="text-gray-600 mb-6">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('semua');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
