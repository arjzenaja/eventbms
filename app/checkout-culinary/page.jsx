'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BiArrowBack, BiUser, BiPhone, BiMapPin, BiTime, BiCreditCard, BiCheckCircle } from 'react-icons/bi';
import { FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';
import { useCulinaryCart } from '../../context/CulinaryCartContext';
import { useTheme } from '../../context/ThemeContext';

const CheckoutCulinary = () => {
  const router = useRouter();
  const { items, totalPrice, clearCart, destination } = useCulinaryCart();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      router.push('/dolan-banyumas');
    }
  }, [items.length, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Generate order ID
      const newOrderId = `CUL-${Date.now()}`;
      
      // Create payment data
      const paymentData = {
        orderData: {
          eventId: destination?.id || 'culinary-order',
          eventName: destination?.title || 'Pesanan Kuliner',
          ticketType: 'culinary',
          ticketPrice: totalPrice,
          amount: items.length,
          totalPrice: totalPrice,
          customerName: formData.name,
          customerEmail: formData.email || '',
          customerPhone: formData.phone,
          destination: destination,
          items: items,
          address: formData.address,
          notes: formData.notes
        },
        paymentMethod: {
          type: 'cash_on_delivery',
          name: 'Bayar di Tempat',
          icon: '💰'
        },
        paymentForm: {
          customerName: formData.name,
          customerEmail: formData.email || '',
          customerPhone: formData.phone
        },
        amount: totalPrice,
        fee: 0,
        userId: null
      };

      // Save payment to database
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Payment saved to database:', result);
        
        // Save payment data to localStorage for success page
        const successData = {
          orderId: result.payment.id,
          customerName: formData.name,
          customerEmail: formData.email || '',
          eventName: destination?.title || 'Pesanan Kuliner',
          paymentMethod: 'Bayar di Tempat',
          totalAmount: totalPrice,
          destination: destination,
          items: items,
          address: formData.address,
          notes: formData.notes
        };
        
        localStorage.setItem('lastPaymentData', JSON.stringify(successData));
        
        // Clear cart
        clearCart();
        
        // Redirect to success page
        window.location.href = `/payment-success?paymentId=${result.payment.id}`;
        return;
      } else {
        console.error('Failed to save payment to database');
        // Fallback to local success
        setOrderId(newOrderId);
        clearCart();
        setShowSuccess(true);
      }
      
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppOrder = () => {
    let message = `Halo! Saya ingin memesan dari ${destination?.title || 'Kuliner'}:\n\n`;
    
    // Customer info
    message += `👤 Nama: ${formData.name}\n`;
    message += `📞 Telepon: ${formData.phone}\n`;
    message += `📍 Alamat: ${formData.address}\n`;
    if (formData.notes) {
      message += `📝 Catatan: ${formData.notes}\n`;
    }
    message += '\n';
    
    // Order details
    message += `📋 Detail Pesanan:\n`;
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

    message += `💰 Total: Rp ${totalPrice.toLocaleString('id-ID')}\n\n`;
    message += 'Apakah pesanan ini masih tersedia? Terima kasih!';

    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <BiCheckCircle className="text-4xl text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Pesanan Berhasil!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Pesanan Anda telah dikonfirmasi dan akan segera diproses.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
            <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">{orderId}</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dolan-banyumas')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
            >
              Kembali ke Kuliner
            </button>
            
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FaWhatsapp className="text-lg" />
              Konfirmasi via WhatsApp
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
                <BiArrowBack className="text-2xl" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Checkout Kuliner
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Ringkasan Pesanan
                </h2>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
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
                      Total
                    </span>
                    <span className="text-2xl font-bold text-orange-600">
                      Rp {totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Metode Pembayaran
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-700">
                    <BiCreditCard className="text-orange-600 text-xl" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Bayar di Tempat</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Bayar saat pesanan diantar</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <FaWhatsapp className="text-green-500 text-xl" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Transfer via WhatsApp</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Konfirmasi pembayaran via WhatsApp</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information Form */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Informasi Pelanggan
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <BiUser className="inline mr-2" />
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <BiPhone className="inline mr-2" />
                        Nomor Telepon <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <BiMapPin className="inline mr-2" />
                        Alamat Pengiriman <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                        placeholder="Masukkan alamat lengkap untuk pengiriman"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <BiTime className="inline mr-2" />
                        Catatan Tambahan (Opsional)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                        placeholder="Catatan khusus untuk pesanan"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <BiCheckCircle className="text-lg" />
                    {isProcessing ? 'Memproses Pesanan...' : 'Konfirmasi Pesanan'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp className="text-lg" />
                    Pesan via WhatsApp
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCulinary;
