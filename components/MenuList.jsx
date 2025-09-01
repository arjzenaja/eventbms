'use client';

import React, { useState, useMemo } from 'react';
import { BiSearch, BiFilter, BiStar, BiTime, BiMoney } from 'react-icons/bi';
import MenuCard from './MenuCard';
import BuyMenuModal from './BuyMenuModal';

const MenuList = ({ menus = [], destinationTitle = "Kuliner" }) => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');

  // Categories based on menu data
  const categories = useMemo(() => {
    const categoryMap = new Map();
    menus.forEach(menu => {
      if (menu.category) {
        if (!categoryMap.has(menu.category)) {
          categoryMap.set(menu.category, 0);
        }
        categoryMap.set(menu.category, categoryMap.get(menu.category) + 1);
      }
    });

    const categoryList = [
      { id: 'all', name: 'Semua Menu', count: menus.length },
      { id: 'popular', name: 'Menu Populer', count: menus.filter(menu => menu.isPopular).length },
      ...Array.from(categoryMap.entries()).map(([category, count]) => ({
        id: category.toLowerCase(),
        name: category,
        count
      }))
    ];

    return categoryList;
  }, [menus]);

  // Filter and sort menus
  const filteredAndSortedMenus = useMemo(() => {
    let filtered = menus;

    // Filter by category
    if (activeCategory !== 'all') {
      if (activeCategory === 'popular') {
        filtered = filtered.filter(menu => menu.isPopular);
      } else {
        filtered = filtered.filter(menu => menu.category?.toLowerCase() === activeCategory);
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(menu =>
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(menu => {
        if (max) {
          return menu.price >= min && menu.price <= max;
        } else {
          return menu.price >= min;
        }
      });
    }

    // Sort menus
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'popular':
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [menus, activeCategory, searchQuery, sortBy, priceRange]);

  const handleBuyClick = (menu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMenu(null);
  };

  const handleOrderConfirm = async (orderData) => {
    // Here you can integrate with your backend API
    console.log('Order confirmed:', orderData);
    
    // Show success message
    alert(`Pesanan berhasil!\n\nMenu: ${orderData.menu.name}\nJumlah: ${orderData.quantity}\nTotal: Rp ${orderData.totalPrice.toLocaleString('id-ID')}\n\nPesanan Anda akan segera diproses.`);
    
    handleModalClose();
  };

  const priceRanges = [
    { value: 'all', label: 'Semua Harga' },
    { value: '0-15000', label: 'Dibawah Rp 15.000' },
    { value: '15000-30000', label: 'Rp 15.000 - Rp 30.000' },
    { value: '30000-50000', label: 'Rp 30.000 - Rp 50.000' },
    { value: '50000-', label: 'Diatas Rp 50.000' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Nama Menu' },
    { value: 'price-low', label: 'Harga Terendah' },
    { value: 'price-high', label: 'Harga Tertinggi' },
    { value: 'rating', label: 'Rating Tertinggi' },
    { value: 'popular', label: 'Menu Populer' }
  ];

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Menu Kuliner
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Jelajahi berbagai menu lezat yang tersedia di {destinationTitle}. 
              Pilih menu favorit Anda dan pesan langsung!
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Category Filter */}
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>

              {/* Price Range Filter */}
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>

              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Menampilkan {filteredAndSortedMenus.length} dari {menus.length} menu
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <BiFilter className="text-lg" />
              <span>Filter Aktif</span>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedMenus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onBuyClick={handleBuyClick}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredAndSortedMenus.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Menu Tidak Ditemukan
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Tidak ada menu yang sesuai dengan filter yang Anda pilih.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setPriceRange('all');
                  setSortBy('name');
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-xl transition-colors"
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* Quick Stats */}
          {filteredAndSortedMenus.length > 0 && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {filteredAndSortedMenus.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Menu Tersedia</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  Rp {(filteredAndSortedMenus.reduce((sum, menu) => sum + menu.price, 0) / filteredAndSortedMenus.length).toLocaleString('id-ID')}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Harga Rata-rata</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {filteredAndSortedMenus.filter(menu => menu.isPopular).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Menu Populer</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {filteredAndSortedMenus.filter(menu => menu.isSpicy).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Menu Pedas</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Purchase Modal */}
      {selectedMenu && (
        <BuyMenuModal
          menu={selectedMenu}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={handleOrderConfirm}
        />
      )}
    </div>
  );
};

export default MenuList;
