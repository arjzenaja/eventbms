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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 flex items-center justify-center p-4">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-12 max-w-lg w-full text-center shadow-2xl border border-white/50 dark:border-gray-700/50 animate-scale-in">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <BiCheckCircle className="text-5xl text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Pesanan Berhasil! 🎉
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            Pesanan Anda telah dikonfirmasi dan akan segera diproses.
          </p>
          
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 mb-8 border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Order ID</p>
            <p className="font-mono text-xl font-bold text-gray-900 dark:text-white">{orderId}</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => router.push('/dolan-banyumas')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Kembali ke Kuliner
            </button>
            
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FaWhatsapp className="text-xl" />
              Konfirmasi via WhatsApp
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/20 dark:via-red-900/20 dark:to-pink-900/20 pt-24">
      {/* Enhanced Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-white/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 transform hover:-translate-x-1"
            >
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                <BiArrowBack className="text-xl" />
              </div>
              <span className="font-medium">Kembali</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <BiCreditCard className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Checkout Kuliner
                </h1>
                <p className="text-gray-600 dark:text-gray-300">Lengkapi informasi pesanan Anda</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Enhanced Order Summary */}
            <div className="space-y-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Ringkasan Pesanan
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300">
                      <div className="flex gap-4">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                          <Image
                            src={item.menuImage || '/placeholder.jpg'}
                            alt={item.menuName}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            x{item.quantity}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                            {item.menuName}
                          </h4>
                          
                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.drinkType && (
                              <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                                {item.drinkType === 'iced' ? '🧊 Iced' : '☕ Hot'}
                              </span>
                            )}
                            {item.selectedFlavor && (
                              <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium">
                                {item.selectedFlavor}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              @ Rp {item.price.toLocaleString('id-ID')}
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                              </div>
                            </div>
                          </div>
                          
                          {item.specialInstructions && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-3 mt-3">
                              <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
                                📝 {item.specialInstructions}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t-2 border-orange-200 dark:border-orange-700 pt-6 mt-6">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">Total Pembayaran</span>
                      <span className="text-3xl font-bold">
                        Rp {totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <p className="text-orange-100 text-sm mt-2">
                      {items.length} item • {items.reduce((sum, item) => sum + item.quantity, 0)} pcs
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Payment Methods */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <BiCreditCard className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Metode Pembayaran
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-700">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                        <BiCreditCard className="text-white text-xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">Bayar di Tempat</h4>
                        <p className="text-gray-600 dark:text-gray-400">Bayar saat pesanan diantar</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600 dark:text-green-400 font-medium">Rekomendasi</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <FaWhatsapp className="text-white text-xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">Transfer via WhatsApp</h4>
                        <p className="text-gray-600 dark:text-gray-400">Konfirmasi pembayaran via WhatsApp</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Alternatif</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Customer Information Form */}
            <div className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <BiUser className="text-white text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Informasi Pelanggan
                    </h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <BiUser className="text-blue-600 dark:text-blue-400" />
                          </div>
                          Nama Lengkap <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg transition-all duration-200"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <BiPhone className="text-green-600 dark:text-green-400" />
                          </div>
                          Nomor Telepon <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg transition-all duration-200"
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <BiMapPin className="text-purple-600 dark:text-purple-400" />
                          </div>
                          Alamat Pengiriman <span className="text-red-500">*</span>
                        </div>
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none text-lg transition-all duration-200"
                        placeholder="Masukkan alamat lengkap untuk pengiriman"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                            <BiTime className="text-yellow-600 dark:text-yellow-400" />
                          </div>
                          Catatan Tambahan <span className="text-gray-500 font-normal">(Opsional)</span>
                        </div>
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none text-lg transition-all duration-200"
                        placeholder="Catatan khusus untuk pesanan"
                      />
                    </div>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <BiCheckCircle className="text-xl" />
                    {isProcessing ? 'Memproses Pesanan...' : 'Konfirmasi Pesanan'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <FaWhatsapp className="text-xl" />
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
