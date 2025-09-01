'use client';

import { useState } from 'react';
import MenuList from './MenuList';
import BuyMenuModal from './BuyMenuModal';
import useMenuData from '@/hooks/useMenuData';
import LoadingSpinner from './LoadingSpinner';

const KulinerMenuSection = ({ destinationTitle, destinationId, destinationSlug }) => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  // Use the hook to fetch menu data from API
  const { menus, isLoading, error, submitOrder } = useMenuData(destinationId, destinationSlug);

  const handleBuyMenu = (menu) => {
    setSelectedMenu(menu);
    setIsBuyModalOpen(true);
  };

  const handleConfirmOrder = async (orderData) => {
    try {
      // Use the submitOrder function from the hook
      const result = await submitOrder(orderData);
      
      if (result.success) {
        alert(`Pesanan berhasil!\n\nMenu: ${orderData.menu.name}\nJumlah: ${orderData.quantity}\nTotal: Rp ${orderData.totalPrice.toLocaleString('id-ID')}\n\nPesanan Anda akan segera diproses.`);
      } else {
        alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
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
    <>
      {/* Menu Section */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Menu Kuliner
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Jelajahi berbagai menu lezat yang tersedia di {destinationTitle}. 
                Pilih menu favorit Anda dan pesan langsung!
              </p>
            </div>

            <MenuList 
              menus={menus} 
              onBuyClick={handleBuyMenu}
            />
          </div>
        </div>
      </div>

      {/* Buy Menu Modal */}
      <BuyMenuModal
        menu={selectedMenu}
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        onConfirm={handleConfirmOrder}
      />
    </>
  );
};

export default KulinerMenuSection;
