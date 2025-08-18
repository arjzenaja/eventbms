'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
            Tentang <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Dolan Banyumas</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Platform wisata terdepan yang menghubungkan traveler dengan keindahan alam, 
            budaya, dan kuliner Banyumas yang memukau
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="bg-white/80 dark:bg-gray-800/80 px-6 py-3 rounded-full shadow-lg">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">🎯 Terpercaya</span>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 px-6 py-3 rounded-full shadow-lg">
              <span className="text-green-600 dark:text-green-400 font-semibold">🌟 Terdepan</span>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 px-6 py-3 rounded-full shadow-lg">
              <span className="text-purple-600 dark:text-purple-400 font-semibold">💡 Inovatif</span>
            </div>
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Sejarah Banyumas
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Perjalanan Dolan Banyumas dari awal hingga menjadi platform wisata terpercaya
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">2020 - Awal Mula</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Dimulai sebagai ide sederhana untuk mempromosikan wisata Banyumas secara digital
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">2022 - Pertumbuhan</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Platform berkembang pesat dengan ribuan pengguna dan ratusan destinasi
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">2024 - Terdepan</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Menjadi platform wisata terdepan di Jawa Tengah dengan teknologi terkini
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Vision */}
            <div className="text-center md:text-left">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-6">
                <span className="text-3xl">🌟</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Visi Kami</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Menjadi platform wisata terpercaya yang menginspirasi traveler 
                untuk menjelajahi keajaiban Banyumas dan menciptakan pengalaman tak terlupakan.
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Platform wisata terdepan di Jawa Tengah
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Teknologi terkini dan user experience terbaik
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Destinasi wisata terlengkap dan terupdate
                </li>
              </ul>
            </div>

            {/* Mission */}
            <div className="text-center md:text-left">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Misi Kami</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Memperkenalkan dan mempromosikan keindahan Banyumas kepada dunia, 
                sambil mendukung pertumbuhan ekonomi lokal dan pelestarian budaya.
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Mempromosikan destinasi wisata Banyumas
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Mendukung ekonomi lokal dan UMKM
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Melestarikan budaya dan tradisi lokal
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Apa yang Kami Tawarkan
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Platform lengkap untuk memenuhi semua kebutuhan wisata Anda di Banyumas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Wisata */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🏞️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Wisata Alam</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
                Temukan keindahan alam Banyumas dari gunung hingga pantai
              </p>
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                • Gunung Slamet • Curug Cipendok • Pantai Widarapayung
              </div>
            </div>

            {/* Kuliner */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🍜</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Kuliner Lokal</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
                Nikmati cita rasa autentik masakan tradisional Banyumas
              </p>
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                • Soto Sokaraja • Tempe Mendoan • Nasi Penggel
              </div>
            </div>

            {/* Penginapan */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🏨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Penginapan</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
                Temukan tempat menginap nyaman dengan harga terjangkau
              </p>
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                • Hotel • Villa • Homestay • Resort
              </div>
            </div>

            {/* Event */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Event & Festival</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
                Ikuti berbagai acara budaya dan festival menarik
              </p>
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                • Festival Budaya • Event Wisata • Pameran Lokal
              </div>
            </div>

            {/* Desa Wisata */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🏘️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Desa Wisata</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
                Jelajahi kehidupan pedesaan dan budaya tradisional
              </p>
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                • Desa Wisata • Budaya Lokal • Tradisi
              </div>
            </div>

            {/* Oleh-oleh */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🛍️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Oleh-oleh</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
                Bawa pulang kenangan dan cinderamata khas Banyumas
              </p>
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                • Kerajinan • Makanan • Souvenir
              </div>
            </div>

            {/* Biro Perjalanan */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🚌</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Biro Perjalanan</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
                Layanan tour guide dan paket wisata terpercaya
              </p>
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                • Tour Guide • Paket Wisata • Transportasi
              </div>
            </div>

            {/* Transportasi */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Transportasi</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
                Informasi lengkap transportasi ke dan di Banyumas
              </p>
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                • Bus • Kereta • Rental Mobil
              </div>
            </div>

            {/* Tips Wisata */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Tips Wisata</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
                Panduan lengkap untuk wisata yang aman dan nyaman
              </p>
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                • Cuaca • Musim • Persiapan
              </div>
            </div>

            {/* Peta Digital */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🗺️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Peta Digital</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
                Navigasi mudah dengan peta interaktif Banyumas
              </p>
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                • Lokasi • Rute • Navigasi
              </div>
            </div>

            {/* Review & Rating */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Review & Rating</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
                Ulasan jujur dari pengunjung sebelumnya
              </p>
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                • Testimoni • Rating • Foto
              </div>
            </div>

            {/* Booking Online */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 text-center">Booking Online</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
                Reservasi mudah untuk semua layanan wisata
              </p>
              <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                • Tiket • Hotel • Paket
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pencapaian Kami
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Angka-angka yang membuktikan dedikasi kami untuk Banyumas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Destinasi Wisata</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-100">Pengguna Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">200+</div>
              <div className="text-blue-100">Mitra Lokal</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">98%</div>
              <div className="text-blue-100">Kepuasan User</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Keunggulan yang membuat Dolan Banyumas menjadi pilihan terbaik
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Terpercaya</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Informasi akurat dan terverifikasi dari sumber terpercaya
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Data terverifikasi</li>
                <li>• Review asli pengguna</li>
                <li>• Update berkala</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Mudah Digunakan</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Interface yang user-friendly dan responsif di semua perangkat
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Design responsif</li>
                <li>• Navigasi intuitif</li>
                <li>• Loading cepat</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Informasi Lengkap</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Detail lengkap tentang destinasi, harga, dan tips perjalanan
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <li>• Detail lengkap</li>
                <li>• Harga terupdate</li>
                <li>• Tips perjalanan</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Tim Kami
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Dedikasi dan passion tim kami untuk menghadirkan yang terbaik
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👨‍💻</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Tim Development</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Mengembangkan platform dengan teknologi terkini dan user experience terbaik
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📸</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Tim Content</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Menghadirkan konten berkualitas tinggi dan informasi yang akurat
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Tim Partnership</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Membangun kerjasama dengan mitra lokal dan destinasi wisata
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Siap Berpetualang di Banyumas?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Mulai perjalanan Anda sekarang dan temukan keajaiban yang tersembunyi 
              di setiap sudut Banyumas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dolan-banyumas">
                <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
                  🗺️ Jelajahi Sekarang
                </button>
              </Link>
              <Link href="/">
                <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105">
                  🏠 Kembali ke Beranda
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
            Hubungi Kami
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-300">info@dolanbanyumas.com</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Support 24/7</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">WhatsApp</h3>
              <p className="text-gray-600 dark:text-gray-300">+62 812-3456-7890</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Respon cepat</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Lokasi</h3>
              <p className="text-gray-600 dark:text-gray-300">Banyumas, Jawa Tengah</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Indonesia</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
