"use client";

import Link from "next/link";
import { BiSearch, BiMap, BiPhone, BiStar, BiFilter, BiGrid, BiDownload, BiUser, BiCalendar, BiHeart, BiShare, BiNavigation, BiTime, BiCreditCard, BiCheckCircle, BiHelpCircle, BiRightArrowAlt, BiHome, BiMenu, BiBookOpen, BiInfoCircle } from "react-icons/bi";
import { useTheme } from '@/context/ThemeContext';

// Custom CSS for animations
const customStyles = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes gradient-x {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
  }
  
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 3s ease infinite;
  }
  
  .delay-200 {
    animation-delay: 0.2s;
  }
  
  .delay-400 {
    animation-delay: 0.4s;
  }
  
  .delay-600 {
    animation-delay: 0.6s;
  }
  
  .delay-800 {
    animation-delay: 0.8s;
  }
`;

const TutorialPage = () => {
  const { isDark, isHydrated } = useTheme();
  
  
  // Show loading state during hydration to prevent mismatch
  if (!isHydrated) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 pt-32">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-slate-600 mt-4">Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-gradient-to-br ${isDark ? 'from-slate-900 via-blue-900 to-slate-900' : 'from-blue-50 via-blue-100 to-blue-200'} pt-32`}>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-32 relative">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-cyan-500/10 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-500/10 rounded-full animate-pulse delay-2000"></div>
            <div className="absolute bottom-40 right-1/4 w-14 h-14 bg-orange-500/10 rounded-full animate-pulse delay-500"></div>
          </div>
          
          <div className="relative z-10">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full px-8 py-4 border border-blue-500/30 mb-8 animate-fade-in-up">
                <span className="text-3xl animate-bounce">📚</span>
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-2xl md:text-3xl font-bold">
                  Panduan Lengkap
                </span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in-up delay-200">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-gradient-x">
                Tutorial
              </span>
              <br />
              <span className={`${isDark ? 'text-white' : 'text-slate-800'} animate-fade-in-up delay-400`}>Dolan Banyumas</span>
            </h1>
            
            <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-600`}>
              Pelajari cara menggunakan website Dolan Banyumas untuk menemukan destinasi wisata, 
              kuliner, penginapan, dan berbagai layanan wisata di Kabupaten Banyumas
            </p>
            
            {/* Floating Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12 animate-fade-in-up delay-800">
              <Link href="#beranda" className="group">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3">
                  <BiBookOpen className="text-xl group-hover:rotate-12 transition-transform duration-300" />
                  Mulai Tutorial
                </button>
              </Link>
              <Link href="/dolan-banyumas" className="group">
                <button className={`px-8 py-4 ${isDark ? 'bg-white/10 text-white hover:bg-white/20 border-white/20 hover:border-white/30' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 hover:border-slate-300'} rounded-full text-lg font-semibold transition-all duration-300 border flex items-center gap-3`}>
                  <BiMap className="text-xl group-hover:scale-110 transition-transform duration-300" />
                  Jelajahi Destinasi
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-sm rounded-3xl p-12 mb-24 border relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 via-transparent to-cyan-500/20"></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-blue-500/20 mb-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center animate-pulse">
                  <BiBookOpen className="text-blue-400 text-2xl" />
                </div>
                <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Daftar Isi Tutorial
                </h2>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-lg max-w-2xl mx-auto`}>
                Pilih bagian yang ingin Anda pelajari untuk langsung melompat ke tutorial tersebut
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link href="#beranda" className="group transform hover:scale-105 transition-all duration-300">
                <div className={`${isDark ? 'bg-gradient-to-br from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border-blue-500/20 hover:border-blue-400/40' : 'bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200 hover:border-blue-300'} backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/20`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <BiHome className="text-blue-400 text-2xl" />
                    </div>
                    <div>
                      <h3 className={`${isDark ? 'text-white group-hover:text-blue-300' : 'text-slate-800 group-hover:text-blue-600'} font-bold text-lg transition-colors`}>Beranda</h3>
                      <div className="w-8 h-1 bg-blue-400 rounded-full group-hover:w-12 transition-all duration-300"></div>
                    </div>
                  </div>
                  <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm leading-relaxed`}>Cara menggunakan halaman utama dan navigasi website</p>
                  <div className="mt-4 flex items-center text-blue-400 text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                    <span>Pelajari lebih lanjut</span>
                    <BiRightArrowAlt className="ml-2 text-lg" />
                  </div>
                </div>
              </Link>
            
              <Link href="#pencarian" className="group transform hover:scale-105 transition-all duration-300">
                <div className={`${isDark ? 'bg-gradient-to-br from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20 border-green-500/20 hover:border-green-400/40' : 'bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200 hover:border-green-300'} backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/20`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500/30 to-green-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <BiSearch className="text-green-400 text-2xl" />
                    </div>
                    <div>
                      <h3 className={`${isDark ? 'text-white group-hover:text-green-300' : 'text-slate-800 group-hover:text-green-600'} font-bold text-lg transition-colors`}>Pencarian</h3>
                      <div className="w-8 h-1 bg-green-400 rounded-full group-hover:w-12 transition-all duration-300"></div>
                    </div>
                  </div>
                  <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm leading-relaxed`}>Cara mencari destinasi dan menggunakan filter</p>
                  <div className="mt-4 flex items-center text-green-400 text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                    <span>Pelajari lebih lanjut</span>
                    <BiRightArrowAlt className="ml-2 text-lg" />
                  </div>
                </div>
              </Link>
              
              <Link href="#destinasi" className="group transform hover:scale-105 transition-all duration-300">
                <div className={`${isDark ? 'bg-gradient-to-br from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 border-purple-500/20 hover:border-purple-400/40' : 'bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200 hover:border-purple-300'} backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/20`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <BiMap className="text-purple-400 text-2xl" />
                    </div>
                    <div>
                      <h3 className={`${isDark ? 'text-white group-hover:text-purple-300' : 'text-slate-800 group-hover:text-purple-600'} font-bold text-lg transition-colors`}>Destinasi</h3>
                      <div className="w-8 h-1 bg-purple-400 rounded-full group-hover:w-12 transition-all duration-300"></div>
                    </div>
                  </div>
                  <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm leading-relaxed`}>Menjelajahi berbagai kategori destinasi wisata</p>
                  <div className="mt-4 flex items-center text-purple-400 text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                    <span>Pelajari lebih lanjut</span>
                    <BiRightArrowAlt className="ml-2 text-lg" />
                  </div>
                </div>
              </Link>
              
              <Link href="#detail" className="group transform hover:scale-105 transition-all duration-300">
                <div className={`${isDark ? 'bg-gradient-to-br from-orange-500/10 to-orange-600/10 hover:from-orange-500/20 hover:to-orange-600/20 border-orange-500/20 hover:border-orange-400/40' : 'bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-orange-200 hover:border-orange-300'} backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/20`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500/30 to-orange-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <BiInfoCircle className="text-orange-400 text-2xl" />
                    </div>
                    <div>
                      <h3 className={`${isDark ? 'text-white group-hover:text-orange-300' : 'text-slate-800 group-hover:text-orange-600'} font-bold text-lg transition-colors`}>Detail Destinasi</h3>
                      <div className="w-8 h-1 bg-orange-400 rounded-full group-hover:w-12 transition-all duration-300"></div>
                    </div>
                  </div>
                  <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm leading-relaxed`}>Memahami informasi lengkap destinasi</p>
                  <div className="mt-4 flex items-center text-orange-400 text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                    <span>Pelajari lebih lanjut</span>
                    <BiRightArrowAlt className="ml-2 text-lg" />
                  </div>
                </div>
              </Link>
              
              <Link href="#booking" className="group transform hover:scale-105 transition-all duration-300">
                <div className={`${isDark ? 'bg-gradient-to-br from-red-500/10 to-red-600/10 hover:from-red-500/20 hover:to-red-600/20 border-red-500/20 hover:border-red-400/40' : 'bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border-red-200 hover:border-red-300'} backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/20`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-500/30 to-red-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <BiCreditCard className="text-red-400 text-2xl" />
                    </div>
                    <div>
                      <h3 className={`${isDark ? 'text-white group-hover:text-red-300' : 'text-slate-800 group-hover:text-red-600'} font-bold text-lg transition-colors`}>Booking & Reservasi</h3>
                      <div className="w-8 h-1 bg-red-400 rounded-full group-hover:w-12 transition-all duration-300"></div>
                    </div>
                  </div>
                  <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm leading-relaxed`}>Cara melakukan pemesanan dan reservasi</p>
                  <div className="mt-4 flex items-center text-red-400 text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                    <span>Pelajari lebih lanjut</span>
                    <BiRightArrowAlt className="ml-2 text-lg" />
                  </div>
                </div>
              </Link>
              
              <Link href="#faq" className="group transform hover:scale-105 transition-all duration-300">
                <div className={`${isDark ? 'bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 hover:from-cyan-500/20 hover:to-cyan-600/20 border-cyan-500/20 hover:border-cyan-400/40' : 'bg-gradient-to-br from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 border-cyan-200 hover:border-cyan-300'} backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-cyan-500/20`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/30 to-cyan-600/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <BiHelpCircle className="text-cyan-400 text-2xl" />
                    </div>
                    <div>
                      <h3 className={`${isDark ? 'text-white group-hover:text-cyan-300' : 'text-slate-800 group-hover:text-cyan-600'} font-bold text-lg transition-colors`}>FAQ</h3>
                      <div className="w-8 h-1 bg-cyan-400 rounded-full group-hover:w-12 transition-all duration-300"></div>
                    </div>
                  </div>
                  <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm leading-relaxed`}>Pertanyaan yang sering diajukan</p>
                  <div className="mt-4 flex items-center text-cyan-400 text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                    <span>Pelajari lebih lanjut</span>
                    <BiRightArrowAlt className="ml-2 text-lg" />
                  </div>
                </div>
              </Link>
          </div>
        </div>

        {/* Tutorial Section 1: Beranda */}
        <div id="beranda" className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-sm rounded-3xl p-12 mb-24 border relative overflow-hidden mt-16`}>
          {/* Progress Indicator */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-12">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-2xl flex items-center justify-center">
                    <BiHome className="text-blue-400 text-3xl" />
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    Langkah 1
                  </span>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
                <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-3`}>Beranda & Navigasi</h2>
                <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-lg`}>Cara menggunakan halaman utama dan menu navigasi</p>
              </div>
            </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className={`${isDark ? 'bg-gradient-to-br from-white/5 to-white/10 border-white/20 hover:border-blue-400/30' : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:border-blue-300'} rounded-2xl p-6 border transition-all duration-300 shadow-lg hover:shadow-xl`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                    <BiMenu className="text-blue-400 text-xl" />
                  </div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Menu Navigasi</h3>
                </div>
                <div className="space-y-6">
                  <div className={`${isDark ? 'bg-white/5 border-white/10 hover:border-blue-400/20' : 'bg-slate-50 border-slate-200 hover:border-blue-300'} rounded-xl border p-4 transition-all duration-300`}>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <BiRightArrowAlt className="text-blue-400 text-sm" />
                      </div>
                      <div>
                        <span className={`${isDark ? 'text-white' : 'text-slate-800'} font-semibold`}>Jelajahi:</span>
                        <span className={`${isDark ? 'text-gray-300' : 'text-slate-600'} ml-2`}>Menampilkan semua destinasi wisata</span>
                      </div>
                    </div>
                  </div>
                  <div className={`${isDark ? 'bg-white/5 border-white/10 hover:border-blue-400/20' : 'bg-slate-50 border-slate-200 hover:border-blue-300'} rounded-xl border p-4 transition-all duration-300`}>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <BiRightArrowAlt className="text-blue-400 text-sm" />
                      </div>
                      <div>
                        <span className={`${isDark ? 'text-white' : 'text-slate-800'} font-semibold`}>Tentang Kami:</span>
                        <span className={`${isDark ? 'text-gray-300' : 'text-slate-600'} ml-2`}>Informasi tentang Dolan Banyumas</span>
                      </div>
                    </div>
                  </div>
                  <div className={`${isDark ? 'bg-white/5 border-white/10 hover:border-blue-400/20' : 'bg-slate-50 border-slate-200 hover:border-blue-300'} rounded-xl border p-4 transition-all duration-300`}>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <BiRightArrowAlt className="text-blue-400 text-sm" />
                      </div>
                      <div>
                        <span className={`${isDark ? 'text-white' : 'text-slate-800'} font-semibold`}>Panduan Kami:</span>
                        <span className={`${isDark ? 'text-gray-300' : 'text-slate-600'} ml-2`}>Tutorial penggunaan website (halaman ini)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`${isDark ? 'bg-gradient-to-br from-white/5 to-white/10 border-white/20 hover:border-green-400/30' : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:border-green-300'} rounded-2xl p-6 border transition-all duration-300 shadow-lg hover:shadow-xl`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
                    <BiSearch className="text-green-400 text-xl" />
                  </div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Fitur Pencarian Cepat</h3>
                </div>
                <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} mb-6 text-lg`}>Di halaman beranda, Anda dapat:</p>
                <div className="space-y-3">
                  <div className={`flex items-center gap-3 p-3 ${isDark ? 'bg-white/5' : 'bg-slate-50'} rounded-lg`}>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Menggunakan search bar untuk mencari destinasi</span>
                  </div>
                  <div className={`flex items-center gap-3 p-3 ${isDark ? 'bg-white/5' : 'bg-slate-50'} rounded-lg`}>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Memilih kategori destinasi langsung dari beranda</span>
                  </div>
                  <div className={`flex items-center gap-3 p-3 ${isDark ? 'bg-white/5' : 'bg-slate-50'} rounded-lg`}>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Melihat destinasi populer dan rekomendasi</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`${isDark ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'} rounded-2xl p-8 border shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Tips Navigasi</h3>
              </div>
              <div className="space-y-8">
                <div className={`${isDark ? 'bg-white/5 border-white/10 hover:border-yellow-400/20' : 'bg-slate-50 border-slate-200 hover:border-yellow-300'} rounded-xl border p-4 transition-all duration-300 group`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                      <BiCheckCircle className="text-green-400 text-lg" />
                    </div>
                    <div>
                      <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-bold text-lg mb-2`}>Gunakan Menu Mobile</p>
                      <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Di perangkat mobile, tap ikon menu (☰) untuk mengakses navigasi</p>
                    </div>
                  </div>
                </div>
                <div className={`${isDark ? 'bg-white/5 border-white/10 hover:border-yellow-400/20' : 'bg-slate-50 border-slate-200 hover:border-yellow-300'} rounded-xl border p-4 transition-all duration-300 group`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                      <BiCheckCircle className="text-green-400 text-lg" />
                    </div>
                    <div>
                      <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-bold text-lg mb-2`}>Scroll untuk Eksplorasi</p>
                      <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Scroll ke bawah untuk melihat lebih banyak konten dan fitur</p>
                    </div>
                  </div>
                </div>
                <div className={`${isDark ? 'bg-white/5 border-white/10 hover:border-yellow-400/20' : 'bg-slate-50 border-slate-200 hover:border-yellow-300'} rounded-xl border p-4 transition-all duration-300 group`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                      <BiCheckCircle className="text-green-400 text-lg" />
                    </div>
                    <div>
                      <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-bold text-lg mb-2`}>Logo untuk Kembali</p>
                      <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Klik logo Dolan Banyumas untuk kembali ke beranda</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Tutorial Section 2: Pencarian */}
        <div id="pencarian" className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-sm rounded-3xl p-12 mb-24 border mt-16`}>
          <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center">
              <BiSearch className="text-green-400 text-2xl" />
            </div>
            <div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>2. Pencarian & Filter</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Cara mencari dan memfilter destinasi sesuai kebutuhan</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} rounded-2xl p-6 border`}>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-4 flex items-center gap-3`}>
                  <BiSearch className="text-green-400" />
                  Pencarian Destinasi
                </h3>
                <div className="space-y-6">
                  <div className={`${isDark ? 'bg-white/10' : 'bg-white'} rounded-xl p-4`}>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>1. Gunakan Search Bar</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Ketik nama destinasi, lokasi, atau kata kunci di search bar</p>
                  </div>
                  <div className={`${isDark ? 'bg-white/10' : 'bg-white'} rounded-xl p-4`}>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>2. Pilih Kategori</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Klik kategori yang diinginkan: Wisata, Kuliner, Penginapan, dll.</p>
                  </div>
                  <div className={`${isDark ? 'bg-white/10' : 'bg-white'} rounded-xl p-4`}>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>3. Gunakan Filter</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Filter berdasarkan tipe, rating, atau lokasi spesifik</p>
                  </div>
                </div>
              </div>
              
              <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} rounded-2xl p-6 border`}>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-4 flex items-center gap-3`}>
                  <BiFilter className="text-purple-400" />
                  Filter Lanjutan
                </h3>
                <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-purple-400 mt-1 flex-shrink-0" />
                    <span><strong>Filter Tipe:</strong> Wisata Alam, Cafe, Hotel, dll.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-purple-400 mt-1 flex-shrink-0" />
                    <span><strong>Urutkan:</strong> Nama, Rating, atau Lokasi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-purple-400 mt-1 flex-shrink-0" />
                    <span><strong>Tampilan:</strong> Grid atau List view</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className={`${isDark ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'} rounded-2xl p-6 border`}>
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-4`}>🔍 Tips Pencarian</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium`}>Gunakan Kata Kunci Spesifik</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Contoh: "air terjun", "cafe", "hotel baturaden"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium`}>Kombinasi Filter</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Gunakan kategori + filter tipe untuk hasil lebih akurat</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium`}>Clear Filter</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Gunakan tombol "Clear Filters" untuk reset pencarian</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial Section 3: Destinasi */}
        <div id="destinasi" className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-sm rounded-3xl p-12 mb-24 border mt-16`}>
          <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center">
              <BiMap className="text-purple-400 text-2xl" />
            </div>
            <div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>3. Kategori Destinasi</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Memahami berbagai kategori destinasi yang tersedia</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className={`${isDark ? 'bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'} rounded-2xl p-6 border`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏞️</span>
                </div>
                <h3 className={`${isDark ? 'text-white' : 'text-slate-800'} font-semibold text-lg`}>Objek Wisata</h3>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm mb-4`}>Tempat wisata alam, sejarah, budaya, dan buatan</p>
              <ul className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm space-y-1`}>
                <li>• Wisata Alam</li>
                <li>• Wisata Budaya</li>
                <li>• Wisata Sejarah</li>
                <li>• Wisata Religi</li>
              </ul>
            </div>
            
            <div className={`${isDark ? 'bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20' : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'} rounded-2xl p-6 border`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🍽️</span>
                </div>
                <h3 className={`${isDark ? 'text-white' : 'text-slate-800'} font-semibold text-lg`}>Kuliner</h3>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm mb-4`}>Tempat makan dan minuman khas daerah</p>
              <ul className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm space-y-1`}>
                <li>• Cafe & Resto</li>
                <li>• Rumah Makan</li>
                <li>• Kedai Tradisional</li>
                <li>• Street Food</li>
              </ul>
            </div>
            
            <div className={`${isDark ? 'bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'} rounded-2xl p-6 border`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏨</span>
                </div>
                <h3 className={`${isDark ? 'text-white' : 'text-slate-800'} font-semibold text-lg`}>Penginapan</h3>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm mb-4`}>Tempat menginap untuk wisatawan</p>
              <ul className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm space-y-1`}>
                <li>• Hotel</li>
                <li>• Villa</li>
                <li>• Homestay</li>
                <li>• Resort</li>
              </ul>
            </div>
            
            <div className={`${isDark ? 'bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'} rounded-2xl p-6 border`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🛍️</span>
                </div>
                <h3 className={`${isDark ? 'text-white' : 'text-slate-800'} font-semibold text-lg`}>Oleh-Oleh</h3>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm mb-4`}>Souvenir dan produk lokal</p>
              <ul className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm space-y-1`}>
                <li>• Kerajinan Tangan</li>
                <li>• Makanan Khas</li>
                <li>• Pakaian Tradisional</li>
                <li>• Produk Lokal</li>
              </ul>
            </div>
            
            <div className={`${isDark ? 'bg-gradient-to-br from-teal-500/10 to-teal-600/10 border-teal-500/20' : 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200'} rounded-2xl p-6 border`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏘️</span>
                </div>
                <h3 className={`${isDark ? 'text-white' : 'text-slate-800'} font-semibold text-lg`}>Desa Wisata</h3>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm mb-4`}>Desa dengan budaya dan kehidupan lokal</p>
              <ul className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm space-y-1`}>
                <li>• Desa Budaya</li>
                <li>• Desa Alam</li>
                <li>• Desa Kerajinan</li>
                <li>• Desa Pertanian</li>
              </ul>
            </div>
            
            <div className={`${isDark ? 'bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 border-indigo-500/20' : 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200'} rounded-2xl p-6 border`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🚗</span>
                </div>
                <h3 className={`${isDark ? 'text-white' : 'text-slate-800'} font-semibold text-lg`}>Biro Perjalanan</h3>
              </div>
              <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm mb-4`}>Layanan tour dan travel</p>
              <ul className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm space-y-1`}>
                <li>• Paket Wisata</li>
                <li>• Transportasi</li>
                <li>• Guide Lokal</li>
                <li>• Event Organizer</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tutorial Section 4: Detail Destinasi */}
        <div id="detail" className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-sm rounded-3xl p-12 mb-24 border mt-16`}>
          <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center">
              <BiInfoCircle className="text-orange-400 text-2xl" />
            </div>
            <div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>4. Detail Destinasi</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Memahami informasi lengkap destinasi wisata</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} rounded-2xl p-6 border`}>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-4 flex items-center gap-3`}>
                  <BiMap className="text-orange-400" />
                  Informasi Dasar
                </h3>
                <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-orange-400 mt-1 flex-shrink-0" />
                    <span><strong>Nama Destinasi:</strong> Nama lengkap tempat wisata</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-orange-400 mt-1 flex-shrink-0" />
                    <span><strong>Lokasi:</strong> Alamat dan area destinasi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-orange-400 mt-1 flex-shrink-0" />
                    <span><strong>Deskripsi:</strong> Penjelasan lengkap tentang destinasi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-orange-400 mt-1 flex-shrink-0" />
                    <span><strong>Rating:</strong> Penilaian dari pengunjung</span>
                  </li>
                </ul>
              </div>
              
              <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} rounded-2xl p-6 border`}>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-4 flex items-center gap-3`}>
                  <BiTime className="text-blue-400" />
                  Informasi Operasional
                </h3>
                <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-blue-400 mt-1 flex-shrink-0" />
                    <span><strong>Jam Buka:</strong> Waktu operasional destinasi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-blue-400 mt-1 flex-shrink-0" />
                    <span><strong>Harga Tiket:</strong> Biaya masuk dan paket</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-blue-400 mt-1 flex-shrink-0" />
                    <span><strong>Fasilitas:</strong> Amenities yang tersedia</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-blue-400 mt-1 flex-shrink-0" />
                    <span><strong>Kontak:</strong> Nomor telepon dan WhatsApp</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className={`${isDark ? 'bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20' : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200'} rounded-2xl p-6 border`}>
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-4`}>📋 Fitur Detail</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium`}>Galeri Foto</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Lihat foto-foto destinasi untuk referensi visual</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium`}>Peta Lokasi</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Gunakan fitur navigasi untuk menuju destinasi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium`}>Share & Bookmark</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Bagikan atau simpan destinasi favorit</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium`}>Review & Rating</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Baca ulasan dari pengunjung lain</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial Section 5: Booking & Reservasi */}
        <div id="booking" className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-sm rounded-3xl p-12 mb-24 border mt-16`}>
          <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
              <BiCreditCard className="text-red-400 text-2xl" />
            </div>
            <div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>5. Booking & Reservasi</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Cara melakukan pemesanan dan reservasi destinasi</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} rounded-2xl p-6 border`}>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-4 flex items-center gap-3`}>
                  <BiCalendar className="text-red-400" />
                  Langkah Booking
                </h3>
                <div className="space-y-6">
                  <div className={`${isDark ? 'bg-white/10' : 'bg-white'} rounded-xl p-4`}>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>1. Pilih Destinasi</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Klik destinasi yang ingin dikunjungi</p>
                  </div>
                  <div className={`${isDark ? 'bg-white/10' : 'bg-white'} rounded-xl p-4`}>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>2. Pilih Paket</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Pilih paket wisata atau tiket yang sesuai</p>
                  </div>
                  <div className={`${isDark ? 'bg-white/10' : 'bg-white'} rounded-xl p-4`}>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>3. Isi Data</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Lengkapi informasi pemesanan</p>
                  </div>
                  <div className={`${isDark ? 'bg-white/10' : 'bg-white'} rounded-xl p-4`}>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>4. Konfirmasi</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Konfirmasi dan lakukan pembayaran</p>
                  </div>
                </div>
              </div>
              
              <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} rounded-2xl p-6 border`}>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-4 flex items-center gap-3`}>
                  <BiPhone className="text-green-400" />
                  Kontak Langsung
                </h3>
                <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-green-400 mt-1 flex-shrink-0" />
                    <span><strong>WhatsApp:</strong> Hubungi langsung via WhatsApp</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-green-400 mt-1 flex-shrink-0" />
                    <span><strong>Telepon:</strong> Hubungi nomor yang tersedia</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BiRightArrowAlt className="text-green-400 mt-1 flex-shrink-0" />
                    <span><strong>Email:</strong> Kirim email untuk reservasi</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className={`${isDark ? 'bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-500/20' : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200'} rounded-2xl p-6 border`}>
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-4`}>💳 Tips Booking</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium`}>Reservasi Awal</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Booking minimal 1-2 hari sebelumnya</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium`}>Konfirmasi Ulang</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Konfirmasi ulang sebelum hari H</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium`}>Baca Syarat</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Baca syarat dan ketentuan dengan teliti</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BiCheckCircle className="text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium`}>Simpan Bukti</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Simpan bukti pembayaran dan konfirmasi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-sm rounded-3xl p-12 mb-24 border mt-16`}>
          <div className="flex items-center gap-6 mb-12">
            <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
              <BiHelpCircle className="text-cyan-400 text-2xl" />
            </div>
            <div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>6. FAQ - Pertanyaan Umum</h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Jawaban untuk pertanyaan yang sering diajukan</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} rounded-2xl p-6 border`}>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-4 flex items-center gap-3`}>
                  <BiHelpCircle className="text-cyan-400" />
                  Tentang Website
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>Apa itu Dolan Banyumas?</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Dolan Banyumas adalah platform wisata komprehensif yang menyediakan informasi lengkap tentang destinasi wisata, kuliner, penginapan, dan layanan wisata di Kabupaten Banyumas.</p>
                  </div>
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>Apakah website ini gratis?</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Ya, penggunaan website Dolan Banyumas sepenuhnya gratis. Anda hanya membayar untuk destinasi atau layanan yang dipesan.</p>
                  </div>
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>Bagaimana cara update informasi?</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Informasi destinasi diupdate secara berkala. Jika ada informasi yang tidak akurat, silakan hubungi kami.</p>
                  </div>
                </div>
              </div>
              
              <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} rounded-2xl p-6 border`}>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-4 flex items-center gap-3`}>
                  <BiMap className="text-green-400" />
                  Tentang Destinasi
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>Berapa banyak destinasi yang tersedia?</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Kami memiliki ratusan destinasi wisata yang terbagi dalam berbagai kategori seperti wisata alam, kuliner, penginapan, dan lainnya.</p>
                  </div>
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>Apakah semua destinasi buka setiap hari?</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Tidak, jam operasional bervariasi. Silakan cek informasi jam buka di detail masing-masing destinasi.</p>
                  </div>
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>Bagaimana cara menuju destinasi?</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Setiap destinasi dilengkapi dengan alamat lengkap dan fitur navigasi untuk memudahkan perjalanan Anda.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} rounded-2xl p-6 border`}>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-4 flex items-center gap-3`}>
                  <BiCreditCard className="text-orange-400" />
                  Tentang Booking
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>Bagaimana cara booking destinasi?</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Pilih destinasi, pilih paket, isi data pemesanan, dan konfirmasi. Atau hubungi langsung via WhatsApp/telepon.</p>
                  </div>
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>Apakah ada biaya booking?</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Biaya booking bervariasi tergantung destinasi dan paket yang dipilih. Informasi lengkap tersedia di detail destinasi.</p>
                  </div>
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>Bagaimana jika ingin cancel booking?</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Hubungi langsung penyedia layanan untuk informasi kebijakan pembatalan dan refund.</p>
                  </div>
                </div>
              </div>
              
              <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} rounded-2xl p-6 border`}>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'} mb-4 flex items-center gap-3`}>
                  <BiPhone className="text-blue-400" />
                  Bantuan & Kontak
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>Bagaimana cara menghubungi customer service?</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Anda dapat menghubungi kami melalui WhatsApp, email, atau telepon yang tersedia di halaman kontak.</p>
                  </div>
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>Apakah ada aplikasi mobile?</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Website ini responsive dan dapat diakses dengan baik di perangkat mobile. Aplikasi mobile sedang dalam pengembangan.</p>
                  </div>
                  <div>
                    <p className={`${isDark ? 'text-white' : 'text-slate-800'} font-medium mb-2`}>Bagaimana cara memberikan feedback?</p>
                    <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm`}>Silakan hubungi kami melalui kontak yang tersedia atau berikan rating dan review di destinasi yang telah dikunjungi.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-32 mt-16">
          <div className={`${isDark ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'} backdrop-blur-sm rounded-3xl p-16 border`}>
            <h3 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-6`}>
              Siap Memulai Petualangan?
            </h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-lg mb-10 max-w-2xl mx-auto`}>
              Sekarang Anda sudah memahami cara menggunakan website Dolan Banyumas. 
              Mulai jelajahi destinasi menarik dan buat kenangan tak terlupakan di Banyumas!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/">
                <button className="px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3">
                  <BiHome className="text-xl" />
                  Kembali ke Beranda
                </button>
              </Link>
              <Link href="/dolan-banyumas">
                <button className={`px-10 py-5 ${isDark ? 'bg-white/10 text-white hover:bg-white/20 border-white/20 hover:border-white/30' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 hover:border-slate-300'} rounded-full text-lg font-semibold transition-all duration-300 border flex items-center gap-3`}>
                  <BiMap className="text-xl" />
                  Jelajahi Destinasi
                </button>
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialPage;
