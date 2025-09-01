'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white/50 to-green-50/50 dark:from-gray-900/50 dark:via-gray-800/50 dark:to-gray-900/50"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-green-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl"></div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-lg mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Platform Wisata Terdepan</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-800 dark:text-white mb-8 leading-tight">
            Tentang <span className="bg-gradient-to-r from-blue-600 via-green-600 to-purple-600 bg-clip-text text-transparent animate-gradient">Dolan Banyumas</span> 
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-10">
            Platform wisata terdepan yang menghubungkan traveler dengan keindahan alam, 
            budaya, dan kuliner Banyumas yang memukau
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="group bg-white/90 dark:bg-gray-800/90 px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">🎯 Terpercaya</span>
            </div>
            <div className="group bg-white/90 dark:bg-gray-800/90 px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <span className="text-green-600 dark:text-green-400 font-bold text-lg">🌟 Terdepan</span>
            </div>
            <div className="group bg-white/90 dark:bg-gray-800/90 px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">💡 Inovatif</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Link href="/dolan-banyumas">
              <button className="group bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform">
                <span className="flex items-center gap-2">
                  🗺️ Jelajahi Sekarang
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-green-50/30 dark:from-gray-800/30 dark:to-gray-900/30"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-lg mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Perjalanan Kami</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              Sejarah <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Banyumas</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Perjalanan Dolan Banyumas dari awal hingga menjadi platform wisata terpercaya
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <span className="text-4xl">🚀</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">1</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">2020 - Awal Mula</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Dimulai sebagai ide sederhana untuk mempromosikan wisata Banyumas secara digital dengan semangat melestarikan budaya lokal
              </p>
            </div>

            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <span className="text-4xl">📈</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-bold text-sm">2</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">2022 - Pertumbuhan</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Platform berkembang pesat dengan ribuan pengguna aktif dan ratusan destinasi wisata yang terdaftar
              </p>
            </div>

            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <span className="text-4xl">🏆</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">3</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">2024 - Terdepan</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Menjadi platform wisata terdepan di Jawa Tengah dengan teknologi terkini dan user experience terbaik
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 to-green-50/20 dark:from-blue-900/10 dark:to-green-900/10"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-lg mb-6">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Tujuan Kami</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              Visi & <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Misi</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Komitmen kami untuk menghadirkan pengalaman wisata terbaik di Banyumas
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Vision */}
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-4xl">🌟</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Visi Kami</h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-center">
                Menjadi platform wisata terpercaya yang menginspirasi traveler 
                untuk menjelajahi keajaiban Banyumas dan menciptakan pengalaman tak terlupakan.
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-4">
                <li className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <span className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></span>
                  <span>Platform wisata terdepan di Jawa Tengah</span>
                </li>
                <li className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <span className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></span>
                  <span>Teknologi terkini dan user experience terbaik</span>
                </li>
                <li className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <span className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></span>
                  <span>Destinasi wisata terlengkap dan terupdate</span>
                </li>
              </ul>
            </div>

            {/* Mission */}
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-4xl">🎯</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Misi Kami</h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-center">
                Memperkenalkan dan mempromosikan keindahan Banyumas kepada dunia, 
                sambil mendukung pertumbuhan ekonomi lokal dan pelestarian budaya.
              </p>
              <ul className="text-gray-600 dark:text-gray-300 space-y-4">
                <li className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <span className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></span>
                  <span>Mempromosikan destinasi wisata Banyumas</span>
                </li>
                <li className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <span className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></span>
                  <span>Mendukung ekonomi lokal dan UMKM</span>
                </li>
                <li className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <span className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></span>
                  <span>Melestarikan budaya dan tradisi lokal</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-900/80 dark:to-gray-800/80 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/10 to-green-50/10 dark:from-blue-900/5 dark:to-green-900/5"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-lg mb-6">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Layanan Kami</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              Apa yang Kami <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Tawarkan</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Platform lengkap untuk memenuhi semua kebutuhan wisata Anda di Banyumas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Wisata */}
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">🏞️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">Wisata Alam</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-6 leading-relaxed">
                Temukan keindahan alam Banyumas dari gunung hingga pantai yang memukau
              </p>
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                • Gunung Slamet • Curug Cipendok • Pantai Widarapayung
              </div>
            </div>

            {/* Kuliner */}
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">🍜</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">Kuliner Lokal</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-6 leading-relaxed">
                Nikmati cita rasa autentik masakan tradisional Banyumas yang menggugah selera
              </p>
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
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
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-green-600/90"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/5"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-6">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-white">Pencapaian Kami</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Angka <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Mengagumkan</span>
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Angka-angka yang membuktikan dedikasi kami untuk Banyumas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-5xl md:text-6xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">500+</div>
                <div className="text-blue-100 font-semibold text-lg">Destinasi Wisata</div>
                <div className="text-blue-200 text-sm mt-2">Tersebar di seluruh Banyumas</div>
              </div>
            </div>
            <div className="group text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-5xl md:text-6xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">50K+</div>
                <div className="text-blue-100 font-semibold text-lg">Pengguna Aktif</div>
                <div className="text-blue-200 text-sm mt-2">Setiap bulannya</div>
              </div>
            </div>
            <div className="group text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-5xl md:text-6xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">200+</div>
                <div className="text-blue-100 font-semibold text-lg">Mitra Lokal</div>
                <div className="text-blue-200 text-sm mt-2">UMKM & Destinasi</div>
              </div>
            </div>
            <div className="group text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-5xl md:text-6xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300">98%</div>
                <div className="text-blue-100 font-semibold text-lg">Kepuasan User</div>
                <div className="text-blue-200 text-sm mt-2">Rating tertinggi</div>
              </div>
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
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-green-50/50 dark:from-gray-900/50 dark:to-gray-800/50"></div>
        <div className="container mx-auto relative z-10">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-white/5"></div>
            <div className="relative z-10">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-white">Mulai Petualangan</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                Siap <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Berpetualang</span> di Banyumas?
              </h2>
              <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Mulai perjalanan Anda sekarang dan temukan keajaiban yang tersembunyi 
                di setiap sudut Banyumas
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/dolan-banyumas">
                  <button className="group px-10 py-5 bg-white text-blue-600 font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl transform">
                    <span className="flex items-center gap-3">
                      🗺️ Jelajahi Sekarang
                      <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </button>
                </Link>
                <Link href="/">
                  <button className="group px-10 py-5 bg-transparent border-2 border-white text-white font-bold text-lg rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                    <span className="flex items-center gap-3">
                      🏠 Kembali ke Beranda
                      <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 px-4 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 to-green-50/20 dark:from-blue-900/10 dark:to-green-900/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-lg mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Kontak</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              Hubungi <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Kami</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Kami siap membantu Anda merencanakan perjalanan terbaik di Banyumas
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">📧</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Email</h3>
              <p className="text-gray-600 dark:text-gray-300 font-medium">info@dolanbanyumas.com</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Support 24/7</p>
            </div>
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">WhatsApp</h3>
              <p className="text-gray-600 dark:text-gray-300 font-medium">+62 812-3456-7890</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Respon cepat</p>
            </div>
            <div className="group bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">📍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Lokasi</h3>
              <p className="text-gray-600 dark:text-gray-300 font-medium">Banyumas, Jawa Tengah</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Indonesia</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
