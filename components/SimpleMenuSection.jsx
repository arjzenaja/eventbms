'use client';

import React, { useState } from 'react';
import MenuCard from './MenuCard';
import BuyMenuModal from './BuyMenuModal';
import useMenuData from '@/hooks/useMenuData';
import LoadingSpinner from './LoadingSpinner';
import { useCulinaryCart } from '../context/CulinaryCartContext';
import { useNotifications } from './NotificationProvider';

const   SimpleMenuSection = ({ destinationTitle, destinationId, destinationSlug }) => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Use the hook to fetch menu data from API
  const { menus, isLoading, error, categories, submitOrder } = useMenuData(destinationId, destinationSlug);
  const { addToCart } = useCulinaryCart();
  const { addNotification } = useNotifications();

  // Generate categories dynamically from actual menu data
  const allCategories = [...new Set(menus.map(menu => menu.category))];
  
  const dynamicCategories = [
    { id: 'all', name: 'Semua Menu', count: menus.length },
    { id: 'popular', name: 'Menu Populer', count: menus.filter(menu => menu.isPopular).length },
    ...allCategories.map(category => ({
      id: category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: category,
      count: menus.filter(menu => menu.category === category).length
    }))
  ];

  // Enhanced filtering with search and sorting
  const filteredMenus = menus
    .filter(menu => {
      // Category filter
      const categoryMatch = activeCategory === 'all' 
        ? true
        : activeCategory === 'popular'
        ? menu.isPopular
        : menu.category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === activeCategory;
      
      // Search filter
      const searchMatch = searchQuery === '' || 
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (menu.description && menu.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (menu.category && menu.category.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'popular':
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        default:
          return 0;
      }
    });

  const handleBuyClick = (menu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMenu(null);
  };

  const handleOrderConfirm = async (orderData) => {
    try {
      // Add to cart instead of direct order
      addToCart(
        orderData.menu,
        orderData.quantity,
        orderData.drinkType,
        orderData.selectedFlavor,
        orderData.specialInstructions
      );
      
      addNotification({
        type: 'success',
        title: 'Ditambahkan ke Keranjang',
        message: `${orderData.menu.name} • x${orderData.quantity} • Rp ${orderData.totalPrice.toLocaleString('id-ID')}`,
      });
      handleModalClose();
    } catch (error) {
      console.error('Order error:', error);
      addNotification({
        type: 'error',
        title: 'Gagal Menambahkan',
        message: 'Terjadi kesalahan saat menambahkan ke keranjang. Silakan coba lagi.',
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Menu Kuliner
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Memuat menu dari {destinationTitle}...
              </p>
            </div>
            <LoadingSpinner message="Memuat menu kuliner..." />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Menu Kuliner
              </h2>
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                <p className="font-medium">Gagal memuat menu</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-pink-900/20 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Menu Kuliner
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Jelajahi Kelezatan
              <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {destinationTitle}
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              Temukan berbagai menu lezat yang tersedia di {destinationTitle}. 
              Pilih menu favorit Anda dan pesan langsung dengan mudah!
            </p>
          </div>

          {/* Enhanced Search and Filter Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-xl border border-white/50 dark:border-gray-700/50">
            {/* Search and Sort Bar */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row gap-4 max-w-4xl mx-auto">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari menu favorit Anda..."
                    className="w-full pl-12 pr-12 py-4 bg-gray-100 dark:bg-gray-700 border-0 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-300 text-lg"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-4 px-6 pr-10 rounded-2xl border-0 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all duration-300 text-lg font-medium"
                  >
                    <option value="name">Urutkan: Nama A-Z</option>
                    <option value="price-low">Harga: Terendah</option>
                    <option value="price-high">Harga: Tertinggi</option>
                    <option value="rating">Rating: Tertinggi</option>
                    <option value="popular">Populer</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Category Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">Kategori Menu</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {dynamicCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-6 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl scale-105'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {category.name}
                    <span className={`ml-3 px-3 py-1 rounded-full text-xs font-bold ${
                      activeCategory === category.id
                        ? 'bg-white/20 text-white'
                        : 'bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl p-4">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{menus.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Menu</div>
              </div>
              <div className="text-center bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {menus.filter(menu => menu.isPopular).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Menu Populer</div>
              </div>
              <div className="text-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {allCategories.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Kategori</div>
              </div>
              <div className="text-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-4">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {filteredMenus.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Ditampilkan</div>
              </div>
            </div>
          </div>

          {/* Enhanced Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMenus.map((menu, index) => (
              <div 
                key={`${menu.id}-${index}`}
                className="transform transition-all duration-500 hover:scale-105"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <MenuCard
                  menu={menu}
                  onBuyClick={handleBuyClick}
                  onAddToCart={(menu, quantity) => {
                    addToCart(menu, quantity, null, null, '');
                    addNotification({
                      type: 'success',
                      title: 'Ditambahkan ke Keranjang',
                      message: `${menu.name} • x${quantity}`,
                    });
                  }}
                  hideAddToCart={true}
                  hideDirectBuy={true}
                  hideQuantity={true}
                />
              </div>
            ))}
          </div>

          {/* Enhanced Empty State */}
          {filteredMenus.length === 0 && (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {searchQuery ? 'Menu Tidak Ditemukan' : 'Menu Tidak Tersedia'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? `Tidak ada menu yang cocok dengan pencarian "${searchQuery}". Coba kata kunci lain atau lihat semua menu.`
                  : 'Tidak ada menu yang tersedia untuk kategori ini.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Hapus Pencarian
                  </button>
                )}
                <button
                  onClick={() => setActiveCategory('all')}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Lihat Semua Menu
                </button>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Cara Memesan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Pilih Menu</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                    Pilih menu favorit Anda dari berbagai pilihan yang tersedia
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Klik Beli</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                    Klik tombol "Beli Menu" untuk memulai proses pemesanan
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Konfirmasi</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                    Konfirmasi pesanan dan pilih metode pembayaran yang tersedia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {selectedMenu && (
        <BuyMenuModal
          menu={selectedMenu}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={handleOrderConfirm}
          hideAddToCart={true}
          hideDirectBuy={true}
          hideQuantity={true}
        />
      )}
    </div>
  );
};

export default SimpleMenuSection;
