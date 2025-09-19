'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BiArrowBack, BiUser, BiPhone, BiGift, BiCreditCard, BiCheckCircle } from 'react-icons/bi';
import { FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';
import { useCulinaryCart } from '../../context/CulinaryCartContext';
import { useUser } from '../../context/UserContext';

const CheckoutSouvenir = () => {
  const router = useRouter();
  const { items, totalPrice, clearCart, destination } = useCulinaryCart();
  const { user, isAuthenticated } = useUser();

  const [formData, setFormData] = useState({ name: '', phone: '', notes: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('bank_transfer');

  const methodDefs = {
    bank_transfer: { id: 'bank_transfer', name: 'Bank Transfer (Manual)', icon: '🏦', fee: 0 },
    bca_va: { id: 'bca_va', name: 'BCA Virtual Account', icon: '🏧', fee: 1000 },
    bri_va: { id: 'bri_va', name: 'BRI Virtual Account', icon: '🏧', fee: 1000 },
    mandiri_va: { id: 'mandiri_va', name: 'Mandiri Virtual Account', icon: '🏧', fee: 1000 },
    e_wallet: { id: 'e_wallet', name: 'E-Wallet (DANA/OVO/GOPAY)', icon: '📱', fee: 2500 },
    qris: { id: 'qris', name: 'QRIS', icon: '🔳', fee: 0 },
    alfamart: { id: 'alfamart', name: 'Alfamart Counter', icon: '🏪', fee: 2500 },
    indomaret: { id: 'indomaret', name: 'Indomaret Counter', icon: '🏬', fee: 2500 },
    cod: { id: 'cod', name: 'Bayar di Tempat (COD)', icon: '🚚', fee: 0 },
    pay_on_pickup: { id: 'pay_on_pickup', name: 'Bayar saat Ambil', icon: '🎁', fee: 0 }
  };

  useEffect(() => {
    if (items.length === 0) {
      router.push('/dolan-banyumas');
    }
  }, [items.length, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setIsProcessing(true);
    try {
      const newOrderId = `SOV-${Date.now()}`;
      const selected = methodDefs[selectedMethod] || methodDefs.bank_transfer;

      const paymentData = {
        orderData: {
          eventId: destination?.id || 'souvenir-order',
          eventName: destination?.title || 'Pesanan Oleh-Oleh',
          ticketType: 'souvenir',
          ticketPrice: totalPrice,
          amount: items.length,
          totalPrice: totalPrice,
          customerName: formData.name,
          customerEmail: (isAuthenticated() && user?.email) ? user.email : (formData.email || ''),
          customerPhone: formData.phone,
          destination: destination,
          items: items,
          notes: formData.notes
        },
        paymentMethod: { ...selected },
        paymentForm: {
          customerName: formData.name,
          customerEmail: (isAuthenticated() && user?.email) ? user.email : (formData.email || ''),
          customerPhone: formData.phone
        },
        amount: totalPrice,
        fee: selected.fee,
        userId: (isAuthenticated() && (user?.id || user?.email)) ? (user.id || user.email) : null
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        const result = await response.json();
        const successData = {
          orderId: result.payment.id,
          customerName: formData.name,
          customerEmail: (isAuthenticated() && user?.email) ? user.email : (formData.email || ''),
          eventName: destination?.title || 'Pesanan Oleh-Oleh',
          paymentMethod: selected.name,
          totalAmount: totalPrice + (selected.fee || 0),
          destination: destination,
          items: items,
          notes: formData.notes
        };
        localStorage.setItem('lastPaymentData', JSON.stringify(successData));
        clearCart();
        window.location.href = `/payment-success?paymentId=${result.payment.id}`;
        return;
      } else {
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
    let message = `Halo! Saya ingin memesan oleh-oleh dari ${destination?.title || 'Toko Oleh-Oleh'}:\n\n`;
    message += `👤 Nama: ${formData.name}\n`;
    message += `📞 Telepon: ${formData.phone}\n`;
    if (formData.notes) message += `📝 Catatan: ${formData.notes}\n`;
    message += '\n📋 Detail Pesanan:\n';
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.menuName || item.name}\n`;
      message += `   Jumlah: ${item.quantity}\n`;
      message += `   Harga: Rp ${(item.price * item.quantity).toLocaleString('id-ID')}\n\n`;
    });
    message += `💰 Total: Rp ${totalPrice.toLocaleString('id-ID')}\n\n`;
    message += 'Apakah pesanan ini masih tersedia? Terima kasih!';
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 flex items-center justify-center p-4">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-12 max-w-lg w-full text-center shadow-2xl border border-white/50 dark:border-gray-700/50 animate-scale-in">
          <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <BiCheckCircle className="text-5xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Pesanan Berhasil! 🎉</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">Pesanan oleh-oleh Anda telah dikonfirmasi.</p>
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 mb-8 border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Order ID</p>
            <p className="font-mono text-xl font-bold text-gray-900 dark:text-white">{orderId}</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/dolan-banyumas')}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Kembali ke Dolan Banyumas
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 pt-24">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-white/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 transform hover:-translate-x-1"
            >
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                <BiArrowBack className="text-xl" />
              </div>
              <span className="font-medium">Kembali</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <BiGift className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Checkout Oleh-Oleh</h1>
                <p className="text-gray-600 dark:text-gray-300">Lengkapi informasi pesanan Anda</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ringkasan Pesanan</h2>
                </div>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300">
                      <div className="flex gap-4">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg">
                          <Image src={item.menuImage || '/placeholder.jpg'} alt={item.menuName || 'Souvenir'} fill className="object-cover" />
                          <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">x{item.quantity}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{item.menuName || item.name}</h4>
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm text-gray-600 dark:text-gray-400">@ Rp {item.price.toLocaleString('id-ID')}</div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</div>
                            </div>
                          </div>
                          {item.specialInstructions && (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-3 mt-3">
                              <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">📝 {item.specialInstructions}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t-2 border-emerald-200 dark:border-emerald-700 pt-6 mt-6">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">Total Pembayaran</span>
                      <span className="text-3xl font-bold">Rp {totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <p className="text-emerald-100 text-sm mt-2">{items.length} item • {items.reduce((sum, i) => sum + i.quantity, 0)} pcs</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <BiCreditCard className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Metode Pembayaran</h3>
                </div>
                <div className="space-y-4">
                  {['bank_transfer','bca_va','bri_va','mandiri_va','e_wallet','qris','alfamart','indomaret','cod','pay_on_pickup'].map((m) => (
                    <button key={m} type="button" onClick={() => setSelectedMethod(m)} className={`${selectedMethod === m ? 'border-2 border-emerald-400 bg-gradient-to-r from-emerald-900/20 to-transparent' : 'border border-gray-200 dark:border-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800'} rounded-2xl p-6 w-full text-left transition-colors`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center"><span className="text-white text-xl">{methodDefs[m].icon}</span></div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-lg">{methodDefs[m].name}</h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            {m === 'bank_transfer' && 'Transfer manual ke rekening' }
                            {m === 'bca_va' && 'Otomatis verifikasi via BCA VA' }
                            {m === 'bri_va' && 'Otomatis verifikasi via BRI VA' }
                            {m === 'mandiri_va' && 'Otomatis verifikasi via Mandiri VA' }
                            {m === 'e_wallet' && 'Bayar via DANA / OVO / GOPAY' }
                            {m === 'qris' && 'Scan QRIS untuk membayar' }
                            {m === 'alfamart' && 'Bayar di kasir Alfamart' }
                            {m === 'indomaret' && 'Bayar di kasir Indomaret' }
                            {m === 'cod' && 'Bayar saat barang diterima' }
                            {m === 'pay_on_pickup' && 'Bayar saat pengambilan di toko' }
                          </p>
                          {m === selectedMethod && (
                            <div className="flex items-center gap-2 mt-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span className="text-sm text-green-600 dark:text-green-400 font-medium">Dipilih</span></div>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Biaya: Rp {(methodDefs[m].fee || 0).toLocaleString('id-ID')}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <BiUser className="text-white text-xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Informasi Pelanggan</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">Nama Lengkap <span className="text-red-500">*</span></label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg transition-all duration-200" placeholder="Masukkan nama lengkap" />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">Nomor Telepon <span className="text-red-500">*</span></label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg transition-all duration-200" placeholder="08xxxxxxxxxx" />
                    </div>
                    <div>
                      <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">Catatan Tambahan <span className="text-gray-500 font-normal">(Opsional)</span></label>
                      <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={2} className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none text-lg transition-all duration-200" placeholder="Catatan khusus untuk pesanan" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <button type="submit" disabled={isProcessing} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <BiCheckCircle className="text-xl" />
                    {isProcessing ? 'Memproses Pesanan...' : 'Konfirmasi Pesanan'}
                  </button>
                  <button type="button" onClick={handleWhatsAppOrder} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 shadow-lg hover:shadow-xl">
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

export default CheckoutSouvenir;


