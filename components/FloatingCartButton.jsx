'use client';

import React, { useState } from 'react';
import { BiCart } from 'react-icons/bi';
import CulinaryCart from './CulinaryCart';

const FloatingCartButton = ({ totalItems = 0, totalPrice = 0, items = [], updateQuantity, removeFromCart, clearCart, destination }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  if (totalItems === 0) return null;

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-lg z-40 transition-all duration-300 transform hover:scale-105"
      >
        <div className="relative">
          <BiCart className="text-2xl" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </div>
        
        {/* Price Badge */}
        <div className="absolute -top-1 -left-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg whitespace-nowrap">
          Rp {totalPrice.toLocaleString('id-ID')}
        </div>
      </button>

      {/* Cart Modal */}
      <CulinaryCart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={items}
        totalItems={totalItems}
        totalPrice={totalPrice}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        destination={destination}
      />
    </>
  );
};

export default FloatingCartButton;
