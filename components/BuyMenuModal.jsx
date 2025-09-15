'use client';

import { useState } from 'react';
import { BiX, BiMinus, BiPlus, BiMoney, BiTime, BiCart } from 'react-icons/bi';
import { FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';
import { useCulinaryCart } from '../context/CulinaryCartContext';

const BuyMenuModal = ({ menu, isOpen, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [drinkType, setDrinkType] = useState('iced'); // 'iced' or 'hot'
  const [selectedFlavor, setSelectedFlavor] = useState(''); // for flavor options
  const { addToCart } = useCulinaryCart();

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
      alert('Pilih salah satu rasa terlebih dahulu!');
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

      // Show success message
      const flavorText = selectedFlavor ? ` (${selectedFlavor})` : '';
      const drinkTypeText = dualPricingCategories.includes(menu.category) ? 
        (drinkType === 'iced' ? ' 🧊 Iced' : ' ☕ Hot') : '';
      
      alert(`Menu ditambahkan ke keranjang!\n\n${menu.name}${drinkTypeText}${flavorText}\nJumlah: ${quantity}\nTotal: Rp ${totalPrice.toLocaleString('id-ID')}`);
      
      onClose();
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Terjadi kesalahan saat menambahkan ke keranjang. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    // Validate flavor selection for BUTTER RICE WITH DAUN JERUK
    if (menu.category === 'BUTTER RICE WITH DAUN JERUK' && menu.flavorOptions && menu.flavorOptions.length > 0 && !selectedFlavor) {
      alert('Pilih salah satu rasa terlebih dahulu!');
      return;
    }

    setIsProcessing(true);
    
    try {
      if (onConfirm) {
        await onConfirm({
          menu,
          quantity,
          specialInstructions,
          totalPrice,
          selectedFlavor
        });
      } else {
        // Default behavior - show success message
        const flavorText = selectedFlavor ? `\nRasa: ${selectedFlavor}` : '';
        alert(`Pesanan berhasil!\n\nMenu: ${menu.name}${flavorText}\nJumlah: ${quantity}\nTotal: Rp ${totalPrice.toLocaleString('id-ID')}\n\nPesanan Anda akan segera diproses.`);
      }
      onClose();
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Beli Menu
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <BiX className="text-2xl" />
          </button>
        </div>

        {/* Menu Details */}
        <div className="p-6">
          {/* Menu Image and Info */}
          <div className="flex gap-4 mb-6">
            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={menu.image || '/placeholder.jpg'}
                alt={menu.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                {menu.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                {menu.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <BiMoney />
                  <span className="font-semibold">
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
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <BiTime />
                  <span>{estimatedTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Drink Type Selection (for beverages only) */}
          {dualPricingCategories.includes(menu.category) && (menu.priceIced != null || menu.priceHot != null || menu.price != null) && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Pilih Jenis Minuman
              </label>
              <div className="grid grid-cols-2 gap-3">
                {menu.priceIced != null && (
                  <button
                    onClick={() => setDrinkType('iced')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      drinkType === 'iced'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">🧊</div>
                      <div className="font-medium">Iced</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Rp {(menu.priceIced || 0).toLocaleString('id-ID')}</div>
                    </div>
                  </button>
                )}
                {menu.priceHot != null && (
                  <button
                    onClick={() => setDrinkType('hot')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      drinkType === 'hot'
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">☕</div>
                      <div className="font-medium">Hot</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Rp {(menu.priceHot || 0).toLocaleString('id-ID')}
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Flavor Selection (for BUTTER RICE WITH DAUN JERUK only) */}
          {menu.category === 'BUTTER RICE WITH DAUN JERUK' && menu.flavorOptions && menu.flavorOptions.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Pilih Rasa <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {menu.flavorOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFlavor(option)}
                    className={`p-3 rounded-xl border-2 transition-all text-sm ${
                      selectedFlavor === option
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {!selectedFlavor && (
                <p className="text-red-500 text-xs mt-1">Pilih salah satu rasa</p>
              )}
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Jumlah Pesanan
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <BiMinus />
              </button>
              <span className="text-xl font-semibold text-gray-900 dark:text-white min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <BiPlus />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Maksimal 10 pesanan per transaksi
            </p>
          </div>

          {/* Special Instructions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Catatan Khusus (Opsional)
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Contoh: Tidak pedas, tambah sambal, dll."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Ringkasan Pesanan
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  {menu.name} x{quantity}
                  {dualPricingCategories.includes(menu.category) && (
                    <span className="text-xs ml-1">
                      ({drinkType === 'iced' ? '🧊 Iced' : '☕ Hot'})
                    </span>
                  )}
                  {menu.category === 'BUTTER RICE WITH DAUN JERUK' && selectedFlavor && (
                    <span className="text-xs ml-1 text-red-600">
                      ({selectedFlavor})
                    </span>
                  )}
                </span>
                <span className="text-gray-900 dark:text-white">
                  Rp {(currentPrice * quantity).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-green-600 dark:text-green-400 text-lg">
                    Rp {totalPrice.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCart}
              disabled={isProcessing}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BiCart className="text-lg" />
              {isProcessing ? 'Menambahkan...' : 'Tambah ke Keranjang'}
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <BiCart className="text-lg" />
              {isProcessing ? 'Memproses...' : 'Beli Langsung'}
            </button>
            
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FaWhatsapp className="text-lg" />
              Pesan via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyMenuModal;
