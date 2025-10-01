'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BiCart, BiStar, BiTime, BiMoney, BiHeart, BiShare, BiPlus, BiMinus } from 'react-icons/bi';
import { FaWhatsapp, FaHeart } from 'react-icons/fa';

const MenuCard = ({ menu, onBuyClick, onAddToCart, hideAddToCart = false, hideDirectBuy = false, hideQuantity = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

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
      onAddToCart(menu, quantity);
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

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: menu.name,
        text: `Coba menu ${menu.name} yang lezat!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link berhasil disalin!');
    }
  };

  const adjustQuantity = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(prev => Math.max(1, prev + delta));
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-gray-700 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Menu Image with Enhanced Overlay */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={(menu.image ? `${menu.image}?v=${encodeURIComponent(menu.updated_at || '')}` : '/placeholder.jpg')}
          alt={menu.name}
          fill
          className={`object-cover transition-all duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {menu.isPopular && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <BiStar className="text-yellow-300 text-sm" />
              Populer
            </div>
          )}
          <div className="flex gap-2">
            {menu.isSpicy && (
              <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                🔥 Pedas
              </div>
            )}
            {menu.isNew && (
              <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                ✨ Baru
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons Overlay */}
        <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}>
          <button
            onClick={handleLike}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              isLiked 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white'
            }`}
          >
            {isLiked ? <FaHeart className="text-sm" /> : <BiHeart className="text-sm" />}
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all duration-200 shadow-lg"
          >
            <BiShare className="text-sm" />
          </button>
        </div>

        {/* Category Badge */}
        {menu.category && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
              {menu.category}
            </span>
          </div>
        )}
      </div>

      {/* Menu Content with Enhanced Layout */}
      <div className="p-6">
        {/* Menu Name & Rating */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-gray-900 dark:text-white text-xl leading-tight flex-1 pr-2">
            {menu.name}
          </h3>
          {menu.rating && (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg">
              <BiStar className="text-yellow-200 text-sm" />
              <span className="text-sm font-bold">
                {menu.rating}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {menu.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
            {menu.description}
          </p>
        )}

        {/* Flavor Options - Enhanced Design */}
        {menu.category === 'BUTTER RICE WITH DAUN JERUK' && menu.flavorOptions && menu.flavorOptions.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Pilihan Rasa:</p>
            <div className="flex flex-wrap gap-1.5">
              {menu.flavorOptions.map((option, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price & Time - Enhanced Layout */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <BiMoney className="text-green-600 dark:text-green-400 text-lg" />
            </div>
            {dualPricingCategories.includes(menu.category) ? (
              (menu.priceIced != null || menu.priceHot != null) ? (
                <div className="flex flex-col gap-1">
                  {menu.priceIced != null && (
                    <span className="font-bold text-base text-green-600 dark:text-green-400 flex items-center gap-2">
                      <span className="text-xs">🧊</span>
                      Rp {(menu.priceIced || 0).toLocaleString('id-ID')}
                    </span>
                  )}
                  {menu.priceHot != null && (
                    <span className="font-bold text-base text-green-600 dark:text-green-400 flex items-center gap-2">
                      <span className="text-xs">☕</span>
                      Rp {(menu.priceHot || 0).toLocaleString('id-ID')}
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
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
              <BiTime className="text-lg" />
              <span className="font-medium">{menu.cookingTime}</span>
            </div>
          )}
        </div>

        {/* Quantity Selector */}
        {!hideQuantity && (
        <div className="mb-4">
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-xl p-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => adjustQuantity(e, -1)}
                className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-all duration-200"
              >
                <BiMinus className="text-sm" />
              </button>
              <span className="w-8 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
              <button
                onClick={(e) => adjustQuantity(e, 1)}
                className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-all duration-200"
              >
                <BiPlus className="text-sm" />
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Action Buttons - Enhanced Design */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {!hideAddToCart && (
            <button
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <BiCart className="text-lg" />
              Keranjang
            </button>
            )}
            <button
              onClick={handleWhatsAppClick}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              title="Pesan via WhatsApp"
            >
              <FaWhatsapp className="text-lg" />
              WhatsApp
            </button>
          </div>
          
          {!hideDirectBuy && (
          <button
            onClick={handleBuyClick}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <BiCart className="text-lg" />
            Beli Sekarang
          </button>
          )}
        </div>

        {/* Additional Info - Enhanced Design */}
        {menu.additionalInfo && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {menu.additionalInfo.map((info, index) => (
                <span
                  key={index}
                  className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-full text-xs font-medium"
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
