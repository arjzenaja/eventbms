'use client';

import React from 'react';
import { BiMapPin, BiTime, BiUser, BiPhone, BiReceipt, BiCheckCircle } from 'react-icons/bi';
import Image from 'next/image';

const CulinaryOrderDetails = ({ orderData, paymentData }) => {
  const formatPrice = (price) => `Rp ${Number(price || 0).toLocaleString("id-ID")}`;
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!orderData || !paymentData) return null;

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BiReceipt className="text-orange-600" />
          Detail Pesanan
        </h3>
        
        <div className="space-y-4">
          {orderData.items?.map((item, index) => (
            <div key={item.id || index} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
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
                    Rp {item.price.toLocaleString('id-ID')} x {item.quantity}
                  </span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
                
                {item.specialInstructions && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Catatan: {item.specialInstructions}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Total Pesanan
            </span>
            <span className="text-2xl font-bold text-orange-600">
              {formatPrice(orderData.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BiUser className="text-blue-600" />
          Informasi Pelanggan
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BiUser className="text-gray-500 dark:text-gray-400" />
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Nama</span>
              <p className="font-semibold text-gray-900 dark:text-white">{orderData.customerName}</p>
            </div>
          </div>
          
          {orderData.customerEmail && (
            <div className="flex items-center gap-3">
              <BiPhone className="text-gray-500 dark:text-gray-400" />
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
                <p className="font-semibold text-gray-900 dark:text-white">{orderData.customerEmail}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <BiPhone className="text-gray-500 dark:text-gray-400" />
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Telepon</span>
              <p className="font-semibold text-gray-900 dark:text-white">{orderData.customerPhone}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <BiMapPin className="text-gray-500 dark:text-gray-400" />
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Alamat Pengiriman</span>
              <p className="font-semibold text-gray-900 dark:text-white">{orderData.address}</p>
            </div>
          </div>
          
          {orderData.notes && (
            <div className="flex items-center gap-3">
              <BiTime className="text-gray-500 dark:text-gray-400" />
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Catatan Khusus</span>
                <p className="font-semibold text-gray-900 dark:text-white">{orderData.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BiCheckCircle className="text-green-600" />
          Informasi Pembayaran
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
            <span className="font-mono text-gray-900 dark:text-white">{paymentData.orderId}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Metode Pembayaran:</span>
            <span className="text-gray-900 dark:text-white">{paymentData.paymentMethod}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span className="text-green-600 font-semibold">Berhasil</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Tanggal Pesanan:</span>
            <span className="text-gray-900 dark:text-white">{formatDate(paymentData.createdAt || new Date())}</span>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Pembayaran:</span>
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(paymentData.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulinaryOrderDetails;
