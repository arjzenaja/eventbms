  'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorHandler from '@/components/ErrorHandler';

function CustomSelect({ label, value, onChange, options, className = '' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  const current = options.find(o => o.value === value) || options[0];
  return (
    <div className={className} ref={ref}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <button type="button" onClick={() => setOpen(o => !o)} className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 flex items-center justify-between shadow-sm ${open ? 'border-indigo-500' : 'border-gray-300'}`}>
        <span className="flex items-center gap-3">
          <span className="text-xl leading-none">{current?.icon}</span>
          <span className="font-medium truncate">{current?.label}</span>
        </span>
        <svg className={`w-5 h-5 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd"/></svg>
      </button>
      {open && (
        <div className="relative">
          <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="max-h-72 overflow-y-auto">
              {options.map(opt => (
                <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setOpen(false); }} className={`w-full px-4 py-3 flex items-center justify-between text-left hover:bg-indigo-50 ${value === opt.value ? 'bg-indigo-50' : ''}`}>
                  <span className="flex items-center gap-3">
                    <span className="text-xl leading-none">{opt.icon}</span>
                    <span className={`font-medium ${value === opt.value ? 'text-indigo-700' : 'text-gray-900'}`}>{opt.label}</span>
                  </span>
                  {value === opt.value && <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CulinaryMenuManagement() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState([]);
  const [culinaryDestinations, setCulinaryDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Reset category when destination changes
  const handleDestinationChange = (destinationId) => {
    setSelectedDestination(destinationId);
    setSelectedCategory('all'); // Reset category when destination changes
  };
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch culinary destinations (no cache)
      const destinationsResponse = await fetch(`/api/kuliner?ts=${Date.now()}`, { cache: 'no-store' });
      const destinationsData = await destinationsResponse.json();

      if (destinationsData.success) {
        setCulinaryDestinations(destinationsData.kuliner || []);
      }

      // Fetch menu items (no cache)
      const menuResponse = await fetch(`/api/kuliner/menu?ts=${Date.now()}`, { cache: 'no-store' });
      const menuData = await menuResponse.json();

      if (menuData.success) {
        setMenuItems(menuData.menu_items || []);
      } else {
        setError(menuData.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Terjadi kesalahan saat mengambil data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus menu ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/kuliner/menu?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('Menu berhasil dihapus');
        fetchData(); // Refresh data
      } else {
        alert('Gagal menghapus menu: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('Terjadi kesalahan saat menghapus menu');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('available', (!currentStatus).toString());

      const response = await fetch('/api/kuliner/menu', {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Status menu berhasil diperbarui');
        fetchData(); // Refresh data
      } else {
        alert('Gagal memperbarui status menu: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating menu status:', error);
      alert('Terjadi kesalahan saat memperbarui status menu');
    }
  };

  // Filter menu items
  const filteredMenuItems = menuItems.filter(item => {
    const matchesDestination = selectedDestination === 'all' || 
      item.destinationId === selectedDestination;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      (selectedDestination !== 'all' && item.category === selectedCategory);

    return matchesDestination && matchesSearch && matchesCategory;
  });

  // Get unique categories based on selected destination
  const getCategoriesForDestination = () => {
    if (selectedDestination === 'all') {
      return [...new Set(menuItems.map(item => item.category))];
    } else {
      return [...new Set(menuItems
        .filter(item => item.destinationId === selectedDestination)
        .map(item => item.category)
      )];
    }
  };
  const categories = getCategoriesForDestination();

  // Stats
  const totalCount = filteredMenuItems.length;
  const availableCount = filteredMenuItems.filter(i => i.available).length;
  const popularCount = filteredMenuItems.filter(i => i.isPopular).length;
  const destinationCount = new Set(filteredMenuItems.map(i => i.destinationId)).size;

  const handleExport = async () => {
    try {
      setExporting(true);
      const header = [
        'ID','Nama','Deskripsi','Kategori','Harga','WaktuMasak','Rating','Populer','Pedas','Halal','Tersedia','DestinasiId','Destinasi'
      ];
      const rows = filteredMenuItems.map(i => [
        i.id,
        `"${(i.name || '').replace(/"/g,'""')}"`,
        `"${(i.description || '').replace(/"/g,'""')}"`,
        i.category || '',
        (["THE ESPRESSO BASED","Senja Espresso Based","Tea Series","Coffee Series","Milk Series","Fruits Series","Non Coffee","Tea","Classic Coffee","Milk Base","Non Coffe+"].includes(i.category)) ? 
          `${i.priceIced || i.price || ''}${i.priceHot ? ` / ${i.priceHot}` : ''}` : 
          (i.price ?? ''),
        i.cookingTime || '',
        i.rating ?? '',
        i.isPopular ? 'Ya' : 'Tidak',
        i.isSpicy ? 'Ya' : 'Tidak',
        i.halal ? 'Ya' : 'Tidak',
        i.available ? 'Ya' : 'Tidak',
        i.destinationId || '',
        `"${(i.destinationTitle || '').replace(/"/g,'""')}"`,
      ].join(','));
      const csv = [header.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'menu_kuliner.csv';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Memuat data menu..." />
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <ErrorHandler 
          error={error} 
          onRetry={fetchData}
          message="Gagal memuat data menu"
        />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Manajemen Menu Kuliner</h1>
              <div className="flex gap-3">
                <Link 
                  href="/admin/culinary" 
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  Kembali ke Kuliner
                </Link>
                <Link 
                  href="/admin/culinary/menu/new" 
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                >
                  <span>+</span>
                  Tambah Menu
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                <div className="lg:col-span-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cari Menu</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">🔍</div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cari berdasarkan nama menu atau deskripsi..."
                      className="block w-full border border-gray-300 rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <CustomSelect
                  className="lg:col-span-3"
                  label="Filter Kuliner"
                  value={selectedDestination}
                  onChange={handleDestinationChange}
                  options={[{ value: 'all', label: 'Semua Kuliner', icon: '🔎' }, ...culinaryDestinations.map(d => ({ value: d.id, label: d.title, icon: '📍' }))]}
                />
                <CustomSelect
                  className="lg:col-span-3"
                  label="Filter Kategori"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={selectedDestination === 'all' 
                    ? [{ value: 'all', label: 'Pilih kuliner terlebih dahulu', icon: '⚠️' }]
                    : [{ value: 'all', label: 'Semua Kategori', icon: '🔎' }, ...categories.map(c => ({ value: c, label: c, icon: '🍽️' }))]
                  }
                />
                <div className="lg:col-span-1 flex justify-end">
                  <button
                    onClick={handleExport}
                    disabled={exporting}
                    className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg shadow-sm hover:bg-purple-700 disabled:opacity-60 transform transition-transform duration-150 hover:scale-105 active:scale-95"
                  >
                    {exporting ? 'Export…' : 'Export'}
                  </button>
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-5 flex items-center">
                <div className="h-14 w-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mr-4 text-2xl">📦</div>
                <div>
                  <div className="text-sm text-gray-600">Total Menu</div>
                  <div className="text-2xl font-semibold">{totalCount}</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-5 flex items-center">
                <div className="h-14 w-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mr-4 text-2xl">✔️</div>
                <div>
                  <div className="text-sm text-gray-600">Available</div>
                  <div className="text-2xl font-semibold">{availableCount}</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-5 flex items-center">
                <div className="h-14 w-14 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center mr-4 text-2xl">⭐</div>
                <div>
                  <div className="text-sm text-gray-600">Popular</div>
                  <div className="text-2xl font-semibold">{popularCount}</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-5 flex items-center">
                <div className="h-14 w-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mr-4 text-2xl">📈</div>
                <div>
                  <div className="text-sm text-gray-600">Kuliner</div>
                  <div className="text-2xl font-semibold">{destinationCount}</div>
                </div>
              </div>
            </div>

            {/* Selected Destination Info */}
            {selectedDestination !== 'all' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-xl">
                    📍
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">
                      {culinaryDestinations.find(d => d.id === selectedDestination)?.title || 'Unknown Destination'}
                    </h3>
                    <p className="text-sm text-blue-700">
                      Menampilkan {filteredMenuItems.length} menu dari {categories.length} kategori
                    </p>
                  </div>
                  <div className="ml-auto">
                    <button
                      onClick={() => handleDestinationChange('all')}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Lihat Semua Kuliner
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedDestination === 'all' 
                      ? `Semua Menu Kuliner (${filteredMenuItems.length})`
                      : `Menu ${culinaryDestinations.find(d => d.id === selectedDestination)?.title || 'Unknown'} (${filteredMenuItems.length})`
                    }
                  </h3>
                  {selectedDestination !== 'all' && (
                    <div className="text-sm text-gray-500">
                      Kategori: {categories.length} tersedia
                    </div>
                  )}
                </div>
              </div>

              {filteredMenuItems.length === 0 ? (
                <div className="text-center py-12">
                  {selectedDestination === 'all' ? (
                    <>
                      <p className="text-gray-500 mb-4">Tidak ada menu yang ditemukan</p>
                      <Link 
                        href="/admin/culinary/menu/new"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                      >
                        Tambah Menu Pertama
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-500 mb-2">
                        Tidak ada menu untuk kuliner "{culinaryDestinations.find(d => d.id === selectedDestination)?.title || 'Unknown'}"
                      </p>
                      <p className="text-sm text-gray-400 mb-4">
                        Coba pilih kuliner lain atau tambah menu baru
                      </p>
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleDestinationChange('all')}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                        >
                          Lihat Semua Kuliner
                        </button>
                        <Link 
                          href="/admin/culinary/menu/new"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                        >
                          Tambah Menu Baru
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMenuItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                      {/* Image */}
                      <div className="h-48 bg-gray-100">
                        <img
                          className="w-full h-full object-cover"
                          src={(item.image ? `${item.image}?v=${encodeURIComponent(item.updated_at || '')}` : '/placeholder.jpg')}
                          alt={item.name}
                          onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="p-4">
                        {/* Title & Category */}
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.name}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.category}
                          </span>
                        </div>
                        
                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-3 overflow-hidden" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {item.description}
                        </p>
                        
                        {/* Price & Time */}
                        <div className="mb-3">
                          <div className="text-lg font-bold text-green-600">
                            {(['THE ESPRESSO BASED','Senja Espresso Based','Tea Series','Coffee Series','Milk Series','Fruits Series','Non Coffee','Tea','Classic Coffee','Milk Base','Non Coffe+','Coffee Based','Minuman','Kopi'].includes(item.category)) ? (
                              <div className="space-y-1">
                                {(item.priceIced || item.price) && (
                                  <div>🧊 Rp {(item.priceIced || item.price || 0).toLocaleString('id-ID')}</div>
                                )}
                                {item.priceHot && (
                                  <div>☕ Rp {(item.priceHot || 0).toLocaleString('id-ID')}</div>
                                )}
                              </div>
                            ) : (
                              <div>Rp {item.price?.toLocaleString('id-ID') || '0'}</div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            ⏱️ {item.cookingTime || '15-20 menit'}
                          </div>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.isPopular && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                              ⭐ Populer
                            </span>
                          )}
                          {item.isSpicy && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              🌶️ Pedas
                            </span>
                          )}
                          {item.halal && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              ✅ Halal
                            </span>
                          )}
                        </div>
                        
                        {/* Rating & Status */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900 mr-1">
                              {item.rating || '0'}
                            </span>
                            <span className="text-yellow-400">⭐</span>
                          </div>
                          <button
                            onClick={() => handleToggleStatus(item.id, item.available)}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.available
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {item.available ? '✅ Tersedia' : '❌ Tidak Tersedia'}
                          </button>
                        </div>
                        
                        {/* Destination */}
                        {selectedDestination === 'all' && (
                          <div className="mb-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              📍 {item.destinationTitle || 'Unknown Destination'}
                            </span>
                          </div>
                        )}
                        
                        {/* Actions */}
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/culinary/menu/${item.id}/edit`}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded-md text-sm font-medium transition-colors"
                          >
                            ✏️ Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors"
                          >
                            🗑️ Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
