'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BiCart, BiStar, BiTime, BiMoney } from 'react-icons/bi';
import { FaWhatsapp } from 'react-icons/fa';

const MenuCard = ({ menu, onBuyClick, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);

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

  const handleBuyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBuyClick) {
      onBuyClick(menu);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onAddToCart) {
      onAddToCart(menu);
    } else {
      alert(`${menu.name} ditambahkan ke keranjang!`);
    }
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Determine price for WhatsApp message
    let priceText = '';
    
    if (dualPricingCategories.includes(menu.category)) {
      if (menu.priceIced && menu.priceHot) {
        priceText = `Iced: Rp ${(menu.priceIced || 0).toLocaleString('id-ID')}, Hot: Rp ${(menu.priceHot || 0).toLocaleString('id-ID')}`;
      } else if (menu.priceIced) {
        priceText = `Rp ${(menu.priceIced || 0).toLocaleString('id-ID')} (Iced)`;
      } else if (menu.priceHot) {
        priceText = `Rp ${(menu.priceHot || 0).toLocaleString('id-ID')} (Hot)`;
      } else if (menu.price) {
        priceText = `Rp ${(menu.price || 0).toLocaleString('id-ID')}`;
      }
    } else {
      priceText = `Rp ${(menu.price || 0).toLocaleString('id-ID')}`;
    }
    
    const message = `Halo! Saya ingin memesan ${menu.name} seharga ${priceText}. Apakah masih tersedia?`;
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Menu Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={(menu.image ? `${menu.image}?v=${encodeURIComponent(menu.updated_at || '')}` : '/placeholder.jpg')}
          alt={menu.name}
          fill
          className={`object-cover transition-transform duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        {menu.isPopular && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <BiStar className="text-yellow-300" />
            Populer
          </div>
        )}
        {menu.isSpicy && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            🔥 Pedas
          </div>
        )}
      </div>

      {/* Menu Content */}
      <div className="p-4">
        {/* Menu Name & Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight">
            {menu.name}
          </h3>
          {menu.rating && (
            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
              <BiStar className="text-yellow-500 text-sm" />
              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                {menu.rating}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {menu.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
            {menu.description}
          </p>
        )}

        {/* Flavor Options - Only show for BUTTER RICE WITH DAUN JERUK */}
        {menu.category === 'BUTTER RICE WITH DAUN JERUK' && menu.flavorOptions && menu.flavorOptions.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Pilihan Rasa:</p>
            <div className="flex flex-wrap gap-1">
              {menu.flavorOptions.map((option, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price & Time */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BiMoney className="text-green-600 dark:text-green-400" />
            {dualPricingCategories.includes(menu.category) ? (
              (menu.priceIced != null || menu.priceHot != null) ? (
                <div className="flex flex-col">
                  {menu.priceIced != null && (
                    <span className="font-bold text-sm text-green-600 dark:text-green-400">
                      🧊 Rp {(menu.priceIced || 0).toLocaleString('id-ID')}
                    </span>
                  )}
                  {menu.priceHot != null && (
                    <span className="font-bold text-sm text-green-600 dark:text-green-400">
                      ☕ Rp {(menu.priceHot || 0).toLocaleString('id-ID')}
                    </span>
                  )}
                </div>
              ) : (
                <span className="font-bold text-lg text-green-600 dark:text-green-400">
                  Rp {menu.price ? menu.price.toLocaleString('id-ID') : '0'}
                </span>
              )
            ) : (
              <span className="font-bold text-lg text-green-600 dark:text-green-400">
                Rp {menu.price ? menu.price.toLocaleString('id-ID') : '0'}
              </span>
            )}
          </div>
          {menu.cookingTime && (
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
              <BiTime />
              <span>{menu.cookingTime}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group-hover:scale-105"
            >
              <BiCart className="text-lg" />
              Tambah ke Keranjang
            </button>
            <button
              onClick={handleWhatsAppClick}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-xl transition-all duration-200 group-hover:scale-105"
              title="Pesan via WhatsApp"
            >
              <FaWhatsapp className="text-lg" />
            </button>
          </div>
          
          <button
            onClick={handleBuyClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group-hover:scale-105"
          >
            <BiCart className="text-lg" />
            Beli Langsung
          </button>
        </div>

        {/* Additional Info */}
        {menu.additionalInfo && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {menu.additionalInfo.map((info, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs"
                >
                  {info}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
