'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BiCart, BiStar, BiMoney } from 'react-icons/bi';
import { FaWhatsapp } from 'react-icons/fa';

const SouvenirCard = ({ item, onBuyClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleBuyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBuyClick) {
      onBuyClick(item);
      return;
    }
    // Default fallback: open WhatsApp order message
    handleWhatsAppClick(e);
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const priceText = item.price ? ` seharga Rp ${item.price.toLocaleString('id-ID')}` : '';
    const message = `Halo! Saya tertarik dengan oleh-oleh ${item.name}${priceText}. Apakah tersedia?`;
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gambar Produk */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={item.image || '/placeholder.jpg'}
          alt={item.name}
          fill
          className={`object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        {item.isPopular && (
          <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <BiStar className="text-yellow-300" />
            Populer
          </div>
        )}
      </div>

      {/* Konten Kartu */}
      <div className="p-4">
        {/* Nama & Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight">{item.name}</h3>
          {item.rating && (
            <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
              <BiStar className="text-yellow-500 text-sm" />
              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">{item.rating}</span>
            </div>
          )}
        </div>

        {/* Deskripsi */}
        {item.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{item.description}</p>
        )}

        {/* Harga */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BiMoney className="text-green-600 dark:text-green-400" />
            <span className="font-bold text-lg text-green-600 dark:text-green-400">
              {item.price ? `Rp ${item.price.toLocaleString('id-ID')}` : 'Hubungi' }
            </span>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-2">
          <button
            onClick={handleBuyClick}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group-hover:scale-105"
          >
            <BiCart className="text-lg" />
            Beli
          </button>
          <button
            onClick={handleWhatsAppClick}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-xl transition-all duration-200 group-hover:scale-105"
            title="Tanya via WhatsApp"
          >
            <FaWhatsapp className="text-lg" />
          </button>
        </div>

        {/* Info Tambahan */}
        {Array.isArray(item.additionalInfo) && item.additionalInfo.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {item.additionalInfo.map((info, idx) => (
                <span key={idx} className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
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

export default SouvenirCard;
