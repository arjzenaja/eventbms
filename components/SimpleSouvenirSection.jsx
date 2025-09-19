'use client';

import React, { useState } from 'react';
import SouvenirCard from './SouvenirCard';
import BuyMenuModal from './BuyMenuModal';
import useSouvenirData from '@/hooks/useSouvenirData';
import LoadingSpinner from './LoadingSpinner';

const SimpleSouvenirSection = ({ destinationTitle, destinationId, destinationSlug }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isBuyOpen, setIsBuyOpen] = useState(false);

  // Use the hook to fetch souvenir data from API
  const { souvenirs, isLoading, error } = useSouvenirData(destinationId, destinationSlug);

  // Generate categories dynamically from API data
  const dynamicCategories = [
    { id: 'all', name: 'Semua Oleh-Oleh', count: souvenirs.length },
    { id: 'popular', name: 'Oleh-Oleh Populer', count: souvenirs.filter(item => item.isPopular).length },
    { id: 'food', name: 'Makanan', count: souvenirs.filter(item => item.category?.toLowerCase().includes('makanan') || item.category?.toLowerCase().includes('food')).length },
    { id: 'craft', name: 'Kerajinan', count: souvenirs.filter(item => item.category?.toLowerCase().includes('kerajinan') || item.category?.toLowerCase().includes('craft')).length },
    { id: 'drink', name: 'Minuman', count: souvenirs.filter(item => item.category?.toLowerCase().includes('minuman') || item.category?.toLowerCase().includes('drink')).length }
  ];

  const filteredSouvenirs = activeCategory === 'all' 
    ? souvenirs 
    : activeCategory === 'popular'
    ? souvenirs.filter(item => item.isPopular)
    : activeCategory === 'food'
    ? souvenirs.filter(item => item.category?.toLowerCase().includes('makanan') || item.category?.toLowerCase().includes('food'))
    : activeCategory === 'craft'
    ? souvenirs.filter(item => item.category?.toLowerCase().includes('kerajinan') || item.category?.toLowerCase().includes('craft'))
    : souvenirs.filter(item => item.category?.toLowerCase().includes('minuman') || item.category?.toLowerCase().includes('drink'));

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Oleh-Oleh
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Memuat oleh-oleh dari {destinationTitle}...
              </p>
            </div>
            <LoadingSpinner message="Memuat oleh-oleh..." />
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Oleh-Oleh
              </h2>
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                <p className="font-medium">Gagal memuat oleh-oleh</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Oleh-Oleh
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Jelajahi berbagai oleh-oleh menarik yang tersedia di {destinationTitle}. 
              Pilih favorit Anda dan pesan langsung!
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
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                }`}
              >
                {category.name}
                <span className="ml-2 bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded-full text-xs">
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* Souvenir Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSouvenirs.map((item) => (
              <SouvenirCard
                key={item.id}
                item={item}
                onBuyClick={(it) => { setSelectedItem(it); setIsBuyOpen(true); }}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredSouvenirs.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Oleh-Oleh Tidak Tersedia
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tidak ada oleh-oleh yang tersedia untuk kategori ini.
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
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Pilih Oleh-Oleh</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                    Pilih oleh-oleh favorit Anda dari berbagai pilihan yang tersedia
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Klik Beli</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                    Klik tombol "Beli" untuk memulai proses pemesanan
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Konfirmasi</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                    Konfirmasi pesanan dan pilih metode pembayaran yang tersedia
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Buy Modal for souvenirs (no WhatsApp order, direct buy only) */}
          <BuyMenuModal
            menu={selectedItem}
            isOpen={isBuyOpen}
            onClose={() => setIsBuyOpen(false)}
            hideWhatsAppOrder={true}
            contextType="souvenir"
          />
        </div>
      </div>
    </div>
  );
};

export default SimpleSouvenirSection;
