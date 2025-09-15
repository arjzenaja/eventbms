'use client';

import React, { useState } from 'react';
import MenuCard from './MenuCard';
import BuyMenuModal from './BuyMenuModal';
import useMenuData from '@/hooks/useMenuData';
import LoadingSpinner from './LoadingSpinner';
import { useCulinaryCart } from '../context/CulinaryCartContext';

const   SimpleMenuSection = ({ destinationTitle, destinationId, destinationSlug }) => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  // Use the hook to fetch menu data from API
  const { menus, isLoading, error, categories, submitOrder } = useMenuData(destinationId, destinationSlug);
  const { addToCart } = useCulinaryCart();

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

  // Dynamic filtering based on actual categories
  const filteredMenus = activeCategory === 'all' 
    ? menus 
    : activeCategory === 'popular'
    ? menus.filter(menu => menu.isPopular)
    : menus.filter(menu => {
        const categoryId = menu.category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return categoryId === activeCategory;
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
      
      alert(`Menu ditambahkan ke keranjang!\n\nMenu: ${orderData.menu.name}\nJumlah: ${orderData.quantity}\nTotal: Rp ${orderData.totalPrice.toLocaleString('id-ID')}`);
      handleModalClose();
    } catch (error) {
      console.error('Order error:', error);
      alert('Terjadi kesalahan saat menambahkan ke keranjang. Silakan coba lagi.');
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

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {dynamicCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                }`}
              >
                {category.name}
                <span className="ml-2 bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full text-xs">
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenus.map((menu, index) => (
              <MenuCard
                key={`${menu.id}-${index}`}
                menu={menu}
                onBuyClick={handleBuyClick}
                onAddToCart={(menu) => {
                  addToCart(menu, 1, null, null, '');
                  alert(`${menu.name} ditambahkan ke keranjang!`);
                }}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredMenus.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Menu Tidak Tersedia
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tidak ada menu yang tersedia untuk kategori ini.
              </p>
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
        />
      )}
    </div>
  );
};

export default SimpleMenuSection;
