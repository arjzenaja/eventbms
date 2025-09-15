'use client';

import React, { useState } from 'react';
import { BiX, BiMinus, BiPlus, BiCart, BiTrash } from 'react-icons/bi';
import { FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const CulinaryCart = ({ isOpen, onClose, items = [], totalItems = 0, totalPrice = 0, updateQuantity, removeFromCart, clearCart, destination }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    // Set destination in cart context
    if (destination) {
      router.push('/checkout-culinary');
    } else {
      alert('Informasi destinasi tidak tersedia');
    }
  };

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;

    let message = `Halo! Saya ingin memesan dari ${destination?.title || 'Kuliner'}:\n\n`;
    
    items.forEach((item, index) => {
      const drinkTypeText = item.drinkType ? ` (${item.drinkType === 'iced' ? '🧊 Iced' : '☕ Hot'})` : '';
      const flavorText = item.selectedFlavor ? ` - ${item.selectedFlavor}` : '';
      message += `${index + 1}. ${item.menuName}${drinkTypeText}${flavorText}\n`;
      message += `   Jumlah: ${item.quantity}\n`;
      message += `   Harga: Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n`;
      if (item.specialInstructions) {
        message += `   Catatan: ${item.specialInstructions}\n`;
      }
      message += '\n';
    });

    message += `Total: Rp ${totalPrice.toLocaleString('id-ID')}\n\n`;
    message += 'Apakah pesanan ini masih tersedia? Terima kasih!';

    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <BiCart className="text-2xl text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Keranjang ({totalItems})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <BiX className="text-2xl" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <BiCart className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Keranjang Kosong
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Pilih menu favorit Anda untuk memulai
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.menuImage || '/placeholder.jpg'}
                        alt={item.menuName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                        {item.menuName}
                      </h4>
                      
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {item.drinkType && (
                          <span className="mr-2">
                            {item.drinkType === 'iced' ? '🧊 Iced' : '☕ Hot'}
                          </span>
                        )}
                        {item.selectedFlavor && (
                          <span className="text-orange-600">- {item.selectedFlavor}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-orange-600 font-semibold text-sm">
                          Rp {item.price.toLocaleString('id-ID')}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                          >
                            <BiMinus className="text-xs" />
                          </button>
                          
                          <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                          >
                            <BiPlus className="text-xs" />
                          </button>
                        </div>
                      </div>
                      
                      {item.specialInstructions && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Catatan: {item.specialInstructions}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                    >
                      <BiTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total
              </span>
              <span className="text-xl font-bold text-orange-600">
                Rp {totalPrice.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BiCart className="text-lg" />
                {isProcessing ? 'Memproses...' : 'Checkout'}
              </button>
              
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="text-lg" />
                Pesan via WhatsApp
              </button>
            </div>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="w-full text-gray-500 hover:text-red-500 text-sm py-2 transition-colors"
            >
              Hapus Semua Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CulinaryCart;
