'use client';

import { useState } from 'react';
import { BiX, BiMinus, BiPlus, BiMoney, BiTime, BiCart, BiStar } from 'react-icons/bi';
import { FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';
import { useCulinaryCart } from '../context/CulinaryCartContext';
import { useNotifications } from './NotificationProvider';
import { useRouter } from 'next/navigation';

const BuyMenuModal = ({ menu, isOpen, onClose, onConfirm, hideAddToCart = false, hideWhatsAppOrder = false, contextType = 'culinary' }) => {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [drinkType, setDrinkType] = useState('iced'); // 'iced' or 'hot'
  const [selectedFlavor, setSelectedFlavor] = useState(''); // for flavor options
  const { addToCart, clearCart } = useCulinaryCart();
  const { addNotification } = useNotifications();
  const router = useRouter();

  // Define dual pricing categories at component level
  const dualPricingCategories = [
    'THE ESPRESSO BASED',
    'Senja Espresso Based',
    'Tea Series',
    'Coffee Series',
    'Milk Series',
    'Fruits Series',
    'Non Coffee',
    'Tea',
    'Classic Coffee',
    'Milk Base',
    'Non Coffe+'
  ];

  if (!isOpen || !menu) return null;

  // Determine price based on category and drink type
  const getPrice = () => {
    if (dualPricingCategories.includes(menu.category)) {
      if (drinkType === 'iced' && menu.priceIced != null) return menu.priceIced;
      if (drinkType === 'hot' && menu.priceHot != null) return menu.priceHot;
      if (menu.priceIced != null) return menu.priceIced;
      if (menu.priceHot != null) return menu.priceHot;
      if (menu.price != null) return menu.price;
      return 0;
    }
    return menu.price ?? 0;
  };

  const currentPrice = getPrice();
  const totalPrice = currentPrice * quantity;
  const estimatedTime = menu.cookingTime || '15-20 menit';

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    // Validate flavor selection for BUTTER RICE WITH DAUN JERUK
    if (menu.category === 'BUTTER RICE WITH DAUN JERUK' && menu.flavorOptions && menu.flavorOptions.length > 0 && !selectedFlavor) {
      addNotification({
        type: 'warning',
        title: 'Pilih Rasa',
        message: 'Pilih salah satu rasa terlebih dahulu!',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Add to cart using context
      addToCart(
        menu,
        quantity,
        dualPricingCategories.includes(menu.category) ? drinkType : null,
        selectedFlavor,
        specialInstructions
      );

      // Show success toast
      const flavorText = selectedFlavor ? ` (${selectedFlavor})` : '';
      const drinkTypeText = dualPricingCategories.includes(menu.category) ? 
        (drinkType === 'iced' ? ' 🧊 Iced' : ' ☕ Hot') : '';
      
      addNotification({
        type: 'success',
        title: 'Ditambahkan ke Keranjang',
        message: `${menu.name}${drinkTypeText}${flavorText} • x${quantity} • Rp ${totalPrice.toLocaleString('id-ID')}`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding to cart:', error);
      addNotification({
        type: 'error',
        title: 'Gagal Menambahkan',
        message: 'Terjadi kesalahan saat menambahkan ke keranjang. Silakan coba lagi.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    // Validate flavor selection for BUTTER RICE WITH DAUN JERUK
    if (menu.category === 'BUTTER RICE WITH DAUN JERUK' && menu.flavorOptions && menu.flavorOptions.length > 0 && !selectedFlavor) {
      addNotification({
        type: 'warning',
        title: 'Pilih Rasa',
        message: 'Pilih salah satu rasa terlebih dahulu!',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Direct buy: reset cart to contain only this item, then go to checkout
      clearCart();
      addToCart(
        menu,
        quantity,
        dualPricingCategories.includes(menu.category) ? drinkType : null,
        selectedFlavor,
        specialInstructions
      );

      const flavorText = selectedFlavor ? ` (${selectedFlavor})` : '';
      const drinkTypeText = dualPricingCategories.includes(menu.category) ? (drinkType === 'iced' ? ' 🧊 Iced' : ' ☕ Hot') : '';
      addNotification({
        type: 'success',
        title: 'Beli Langsung',
        message: `${menu.name}${drinkTypeText}${flavorText} • x${quantity} • Rp ${totalPrice.toLocaleString('id-ID')}`,
      });

      onClose();
      router.push(contextType === 'souvenir' ? '/checkout-souvenir' : '/checkout-culinary');
    } catch (error) {
      console.error('Error processing direct buy:', error);
      addNotification({
        type: 'error',
        title: 'Gagal Memproses',
        message: 'Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppOrder = () => {
    const drinkTypeText = dualPricingCategories.includes(menu.category) ? 
      (drinkType === 'iced' ? '🧊 Iced' : '☕ Hot') : '';
    
    const flavorText = selectedFlavor ? ` (${selectedFlavor})` : '';
    
    const message = `Halo! Saya ingin memesan:

🍽️ Menu: ${menu.name}${drinkTypeText ? ` (${drinkTypeText})` : ''}${flavorText}
📦 Jumlah: ${quantity}
💰 Total: Rp ${totalPrice.toLocaleString('id-ID')}
⏰ Estimasi waktu: ${estimatedTime}

${specialInstructions ? `📝 Catatan: ${specialInstructions}` : ''}

Apakah masih tersedia? Terima kasih!`;

    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700 animate-scale-in">
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <BiCart className="text-xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Beli Menu</h2>
                <p className="text-orange-100 text-sm">Pesan menu favorit Anda</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
            >
              <BiX className="text-xl" />
            </button>
          </div>
        </div>

        {/* Enhanced Menu Details */}
        <div className="p-6">
          {/* Menu Image and Info */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 mb-6">
            <div className="flex gap-4">
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                <Image
                  src={menu.image || '/placeholder.jpg'}
                  alt={menu.name}
                  fill
                  className="object-cover"
                />
                {menu.isPopular && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <BiStar className="text-yellow-300 text-xs" />
                    Populer
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-2 leading-tight">
                  {menu.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                  {menu.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded-full">
                    <BiMoney className="text-green-600 dark:text-green-400" />
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {dualPricingCategories.includes(menu.category) ? (
                        <>
                          {menu.priceIced != null && (
                            <span>🧊 Rp {(menu.priceIced || 0).toLocaleString('id-ID')}</span>
                          )}
                          {menu.priceIced != null && menu.priceHot != null && <span className="mx-2">|</span>}
                          {menu.priceHot != null && (
                            <span>☕ Rp {(menu.priceHot || 0).toLocaleString('id-ID')}</span>
                          )}
                        </>
                      ) : (
                        <span>Rp {(menu.price || 0).toLocaleString('id-ID')}</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded-full">
                    <BiTime className="text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-600 dark:text-blue-400">{estimatedTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Drink Type Selection */}
          {dualPricingCategories.includes(menu.category) && (menu.priceIced != null || menu.priceHot != null || menu.price != null) && (
            <div className="mb-6">
              <label className="block text-lg font-bold text-gray-900 dark:text-white mb-4">
                Pilih Jenis Minuman
              </label>
              <div className="grid grid-cols-2 gap-4">
                {menu.priceIced != null && (
                  <button
                    onClick={() => setDrinkType('iced')}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      drinkType === 'iced'
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 shadow-lg'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 bg-white dark:bg-gray-700 hover:shadow-md'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">🧊</div>
                      <div className="font-bold text-lg">Iced</div>
                      <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-1">
                        Rp {(menu.priceIced || 0).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </button>
                )}
                {menu.priceHot != null && (
                  <button
                    onClick={() => setDrinkType('hot')}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      drinkType === 'hot'
                        ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-700 dark:text-orange-300 shadow-lg'
                        : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 bg-white dark:bg-gray-700 hover:shadow-md'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">☕</div>
                      <div className="font-bold text-lg">Hot</div>
                      <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-1">
                        Rp {(menu.priceHot || 0).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Flavor Selection */}
          {menu.category === 'BUTTER RICE WITH DAUN JERUK' && menu.flavorOptions && menu.flavorOptions.length > 0 && (
            <div className="mb-6">
              <label className="block text-lg font-bold text-gray-900 dark:text-white mb-4">
                Pilih Rasa <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {menu.flavorOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFlavor(option)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 text-sm font-medium ${
                      selectedFlavor === option
                        ? 'border-red-500 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 text-red-700 dark:text-red-300 shadow-lg'
                        : 'border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-500 bg-white dark:bg-gray-700 hover:shadow-md'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {!selectedFlavor && (
                <p className="text-red-500 text-sm mt-2 font-medium">⚠️ Pilih salah satu rasa</p>
              )}
            </div>
          )}

          {/* Enhanced Quantity Selection */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 dark:text-white mb-4">
              Jumlah Pesanan
            </label>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:hover:bg-gray-300 flex items-center justify-center text-white disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110 disabled:hover:scale-100 shadow-lg"
                >
                  <BiMinus className="text-xl" />
                </button>
                <div className="bg-white dark:bg-gray-600 rounded-xl px-6 py-3 shadow-inner">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white min-w-[4rem] text-center">
                    {quantity}
                  </span>
                </div>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                  className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:hover:bg-gray-300 flex items-center justify-center text-white disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-110 disabled:hover:scale-100 shadow-lg"
                >
                  <BiPlus className="text-xl" />
                </button>
              </div>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 font-medium">
                Maksimal 10 pesanan per transaksi
              </p>
            </div>
          </div>

          {/* Enhanced Special Instructions */}
          <div className="mb-6">
            <label className="block text-lg font-bold text-gray-900 dark:text-white mb-4">
              Catatan Khusus <span className="text-gray-500 font-normal">(Opsional)</span>
            </label>
            <div className="relative">
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Contoh: Tidak pedas, tambah sambal, dll."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-all duration-200 text-base"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                {specialInstructions.length}/200
              </div>
            </div>
          </div>

          {/* Enhanced Order Summary */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 mb-6 border border-orange-200 dark:border-orange-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                Ringkasan Pesanan
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-xl p-4">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white text-base">
                    {menu.name} x{quantity}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {dualPricingCategories.includes(menu.category) && (
                      <span className="inline-flex items-center gap-1">
                        {drinkType === 'iced' ? '🧊 Iced' : '☕ Hot'}
                      </span>
                    )}
                    {menu.category === 'BUTTER RICE WITH DAUN JERUK' && selectedFlavor && (
                      <span className="inline-flex items-center gap-1 text-red-600 ml-2">
                        ({selectedFlavor})
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900 dark:text-white text-lg">
                    Rp {(currentPrice * quantity).toLocaleString('id-ID')}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    @ Rp {currentPrice.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
              <div className="border-t-2 border-orange-200 dark:border-orange-700 pt-4">
                <div className="flex justify-between items-center bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-2xl font-bold">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="space-y-4">
            {!hideAddToCart && (
              <button
                onClick={handleAddToCart}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <BiCart className="text-xl" />
                {isProcessing ? 'Menambahkan...' : 'Tambah ke Keranjang'}
              </button>
            )}
            
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <BiCart className="text-xl" />
              {isProcessing ? 'Memproses...' : 'Beli Langsung'}
            </button>
            
            {!hideWhatsAppOrder && (
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaWhatsapp className="text-xl" />
                Pesan via WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyMenuModal;
