'use client';

import React, { useState, useEffect } from 'react';
import { BiMap, BiPhone, BiTime, BiMoney, BiStar, BiUser, BiCalendar } from "react-icons/bi";
import { FaWhatsapp } from "react-icons/fa";

const DesaWisataMenuSection = ({ destinationTitle, destinationId, destinationSlug }) => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data dari API database
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        // Ambil data dari API village packages
        const response = await fetch('/api/villages/packages');
        const data = await response.json();
        
        if (data.success) {
          const all = data.packages || [];
          // filter by current destination
          const filtered = all.filter(p => String(p.villageId || p.destinationId || p.souvenirId || '') === String(destinationId));
          setPackages(filtered);
        } else {
          console.error('Gagal memuat data paket:', data.message);
          setError(data.message);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        setError('Terjadi kesalahan saat memuat data paket');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, [destinationId]);

  // Fallback ke data statis jika API gagal
  const fallbackMenus = [];

  // Gunakan data dari API jika ada, fallback ke data statis
  const displayMenus = packages.length > 0 ? packages : fallbackMenus;

  // Transform data dari API ke format yang dibutuhkan komponen
  const transformedMenus = displayMenus.map(pkg => ({
    id: pkg.id || pkg.name,
    name: pkg.title || pkg.name,
    description: pkg.description,
    price: pkg.price,
    image: pkg.image || "/placeholder.jpg",
    rating: pkg.rating || 4.5,
    duration: pkg.duration,
    isPopular: pkg.popular || false,
    category: pkg.category,
    additionalInfo: pkg.features || pkg.additionalInfo || []
  }));

  const categories = [
    { id: 'all', name: 'Semua Layanan', count: transformedMenus.length },
    { id: 'popular', name: 'Layanan Populer', count: transformedMenus.filter(menu => menu.isPopular).length },
    { id: 'tiket', name: 'Tiket & Parkir', count: transformedMenus.filter(menu => menu.category === 'Tiket & Parkir').length },
    { id: 'aktivitas', name: 'Aktivitas', count: transformedMenus.filter(menu => menu.category === 'Aktivitas').length },
    { id: 'penginapan', name: 'Penginapan', count: transformedMenus.filter(menu => menu.category === 'Penginapan').length },
    { id: 'layanan', name: 'Layanan', count: transformedMenus.filter(menu => menu.category === 'Layanan').length }
  ];

  const filteredMenus = activeCategory === 'all' 
    ? transformedMenus 
    : activeCategory === 'popular'
    ? transformedMenus.filter(menu => menu.isPopular)
    : transformedMenus.filter(menu => menu.category.toLowerCase() === activeCategory);

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
      // Simulate API call
      console.log('Order confirmed:', orderData);
      alert(`Pemesanan berhasil!\n\nLayanan: ${orderData.menu.name}\nJumlah: ${orderData.quantity}\nTotal: Rp ${orderData.totalPrice.toLocaleString('id-ID')}\n\nPemesanan Anda akan segera diproses.`);
      handleModalClose();
    } catch (error) {
      alert('Terjadi kesalahan saat memproses pemesanan. Silakan coba lagi.');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
            <div className="text-green-600 dark:text-green-400 text-xl">Memuat data paket layanan...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error && packages.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Daftar Harga & Layanan
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Jelajahi berbagai layanan dan aktivitas yang tersedia di {destinationTitle}. 
              Pilih layanan yang sesuai dengan kebutuhan Anda!
            </p>
            {packages.length > 0 && (
              <div className="mt-4 text-sm text-green-600 dark:text-green-400">
                ✅ Data real-time dari database ({packages.length} paket)
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30'
                }`}
              >
                {category.name}
                <span className="ml-2 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs">
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenus.map((menu) => (
              <div key={menu.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                {/* Menu Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {menu.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {menu.description}
                    </p>
                  </div>
                  {menu.isPopular && (
                    <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-2 py-1 rounded-full text-xs font-medium">
                      Populer
                    </span>
                  )}
                </div>

                {/* Price and Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    Rp {menu.price.toLocaleString('id-ID')}
                  </div>
                  <div className="flex items-center gap-1">
                    <BiStar className="text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {menu.rating}
                    </span>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <BiTime className="text-green-500" />
                  <span>{menu.duration}</span>
                </div>

                {/* Additional Info */}
                <div className="mb-6">
                  <div className="space-y-2">
                    {menu.additionalInfo.map((info, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        <span>{info}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => handleBuyClick(menu)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Pesan Layanan
                </button>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredMenus.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <BiMap className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Layanan Tidak Tersedia
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tidak ada layanan yang tersedia untuk kategori ini.
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
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Pilih Layanan</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                    Pilih layanan atau aktivitas yang ingin Anda nikmati
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Klik Pesan</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                    Klik tombol "Pesan Layanan" untuk memulai proses pemesanan
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Konfirmasi</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                    Konfirmasi pemesanan dan pilih metode pembayaran yang tersedia
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {selectedMenu && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} transition-opacity duration-300`}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Pesan Layanan
              </h3>
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedMenu.name}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {selectedMenu.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    Rp {selectedMenu.price.toLocaleString('id-ID')}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedMenu.duration}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <button className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  -
                </button>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">1</span>
                <button className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  +
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleModalClose}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleOrderConfirm({
                    menu: selectedMenu,
                    quantity: 1,
                    totalPrice: selectedMenu.price
                  })}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  Konfirmasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesaWisataMenuSection;
