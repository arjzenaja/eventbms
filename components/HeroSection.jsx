import React, { useContext, useState, useEffect } from 'react'
import { EventContext } from '@/context/EventContext';
//  components
import Searchbar from "@/components/Searchbar/Searchbar";
import Image from "next/image";
import { BiMapPin, BiSearch, BiFilter, BiStar, BiHeart, BiCamera, BiPlay, BiChevronDown, BiTime, BiUser, BiRefresh } from 'react-icons/bi';

const HeroSection = () => {
  const { handleClearSearch } = useContext(EventContext);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  
  // Array foto background yang tersedia
  const backgroundImages = [
    "/hero/hero-bg1.png",
    "/hero/hero-bg2.png", 
    "/hero/caub.jpg",
    "/hero/bunderan batur.jpg",
    "/hero/menara teratai.jpg"
  ];
  
  // Auto-rotate background setiap 10 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [backgroundImages.length]);
  
  // Fungsi untuk mengganti background manual
  const changeBackground = () => {
    setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
  };
  
  return (
    <section className='min-h-screen relative overflow-hidden'>
      {/* Background Image dengan Scroll Horizontal */}
      <div className='absolute inset-0 -z-10'>
        {/* Container untuk animasi scroll horizontal */}
        <div className="relative w-full h-full overflow-hidden">
          {/* Background Image dengan animasi scroll horizontal */}
          <div className="absolute inset-0 w-[200%] h-full animate-scroll-horizontal">
            <Image
              src={backgroundImages[currentBgIndex]}
              alt="Background Banyumas"
              fill
              className="object-cover w-full h-full"
              priority
            />
          </div>
          
          {/* Duplikat image untuk seamless loop */}
          <div className="absolute inset-0 w-[200%] h-full animate-scroll-horizontal-delayed">
            <Image
              src={backgroundImages[currentBgIndex]}
              alt="Background Banyumas Duplicate"
              fill
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </div>
        
        {/* Dark overlay untuk memastikan teks terbaca */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Background Change Button */}
        <button 
          onClick={changeBackground}
          className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-lg border border-white/30"
          title="Ganti Background"
        >
          <BiRefresh className="text-xl" />
        </button>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        </div>
        
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-24 h-24 border border-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-16 w-20 h-20 border border-blue-400/20 rounded-lg rotate-45 animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-16 h-16 border border-purple-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 border border-green-400/20 rounded-lg animate-pulse"></div>
      </div>
      
      <div className='container mx-auto h-screen flex flex-col justify-center items-center pt-24 md:pt-32 relative z-10'>
        {/* Main Hero Content */}
        <div className='w-full max-w-5xl text-center mx-auto flex flex-col gap-8 mb-12'>
          {/* Main Title */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-2xl animate-float">
              <div className="block mb-4 relative">
                <span className="relative z-10 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-lg animate-text-glow">
                  JELAJAHI KEINDAHAN
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-xl rounded-lg"></div>
              </div>
              <div className="block relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 drop-shadow-lg animate-pulse">
                  JELAJAHI WISATA BANYUMAS
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 via-cyan-400/30 to-purple-500/30 blur-xl rounded-lg animate-pulse"></div>
              </div>
            </h1>
            
            {/* Decorative Elements */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full animate-pulse"></div>
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent rounded-full"></div>
            </div>
          </div>
          
          {/* Subtitle */}
          <div className="relative">
            <p className='text-lg md:text-xl font-light text-white/95 max-w-4xl mx-auto leading-relaxed drop-shadow-lg relative z-10'>
              Nikmati pengalaman wisata yang tak terlupakan dengan berbagai destinasi menarik, kuliner lezat, dan budaya yang kaya di Banyumas.
            </p>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 blur-2xl rounded-2xl"></div>
          </div>
          
          {/* Search Section */}
          <div className="w-full max-w-6xl mx-auto">
            <div className="bg-gray-900/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-gray-700/30">
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* Search Input */}
                <div className="flex-1 relative group">
                  <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl group-hover:text-blue-400 transition-colors duration-300" />
                  <input 
                    type="text" 
                    placeholder="Cari Jelaj"
                    className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 hover:bg-white hover:shadow-lg text-lg font-medium"
                  />
                </div>
                
                {/* Location Dropdown */}
                <div className="relative group">
                  <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl text-gray-800 hover:bg-gray-50 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200 hover:scale-105">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <BiMapPin className="text-white text-lg" />
                    </div>
                    <span className="text-base font-semibold">Cari lokasi</span>
                    <BiChevronDown className="text-gray-400 group-hover:text-blue-500 transition-all duration-300 group-hover:rotate-180" />
                  </div>
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">
                    <div className="py-4">
                      <div className="px-6 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 cursor-pointer transition-all duration-200 rounded-xl mx-3 group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700 text-base font-medium group-hover/item:text-blue-600">Purwokerto</span>
                        </div>
                      </div>
                      <div className="px-6 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 cursor-pointer transition-all duration-200 rounded-xl mx-3 group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700 text-base font-medium group-hover/item:text-green-600">Banyumas</span>
                        </div>
                      </div>
                      <div className="px-6 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 cursor-pointer transition-all duration-200 rounded-xl mx-3 group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-700 text-base font-medium group-hover/item:text-purple-600">Cilacap</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Category Dropdown */}
                <div className="relative group">
                  <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl text-gray-800 hover:bg-gray-50 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-200 hover:scale-105">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <BiCamera className="text-white text-lg" />
                    </div>
                    <span className="text-base font-semibold">Wisata Alam</span>
                    <BiChevronDown className="text-gray-400 group-hover:text-green-500 transition-all duration-300 group-hover:rotate-180" />
                  </div>
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">
                    <div className="py-4">
                      <div className="px-6 py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 cursor-pointer transition-all duration-200 rounded-xl mx-3 group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700 text-base font-medium group-hover/item:text-green-600">Wisata Alam</span>
                        </div>
                      </div>
                      <div className="px-6 py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 cursor-pointer transition-all duration-200 rounded-xl mx-3 group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-700 text-base font-medium group-hover/item:text-orange-600">Wisata Budaya</span>
                        </div>
                      </div>
                      <div className="px-6 py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 cursor-pointer transition-all duration-200 rounded-xl mx-3 group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-gray-700 text-base font-medium group-hover/item:text-red-600">Kuliner</span>
                        </div>
                      </div>
                      <div className="px-6 py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 cursor-pointer transition-all duration-200 rounded-xl mx-3 group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700 text-base font-medium group-hover/item:text-blue-600">Penginapan</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sub Category Dropdown */}
                <div className="relative group">
                  <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl text-gray-800 hover:bg-gray-50 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-purple-200 hover:scale-105">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <BiStar className="text-white text-lg" />
                    </div>
                    <span className="text-base font-semibold">Pilih Sub Kategori</span>
                    <BiChevronDown className="text-gray-400 group-hover:text-purple-500 transition-all duration-300 group-hover:rotate-180" />
                  </div>
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">
                    <div className="py-4">
                      <div className="px-6 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer transition-all duration-200 rounded-xl mx-3 group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-700 text-base font-medium group-hover/item:text-purple-600">Gunung</span>
                        </div>
                      </div>
                      <div className="px-6 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer transition-all duration-200 rounded-xl mx-3 group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                          <span className="text-gray-700 text-base font-medium group-hover/item:text-cyan-600">Pantai</span>
                        </div>
                      </div>
                      <div className="px-6 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer transition-all duration-200 rounded-xl mx-3 group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700 text-base font-medium group-hover/item:text-blue-600">Air Terjun</span>
                        </div>
                      </div>
                      <div className="px-6 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer transition-all duration-200 rounded-xl mx-3 group/item">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700 text-base font-medium group-hover/item:text-green-600">Danau</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Search Button */}
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform">
                  <BiSearch className="text-2xl" />
                </button>
              </div>
              
              {/* Clear Search Button */}
              <div className='w-full mt-6 flex justify-center'>
                <button 
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-2xl text-base font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl" 
                  onClick={() => handleClearSearch()}
                >
                  <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Hapus Pencarian
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer group">
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center group-hover:border-white transition-colors duration-300">
            <div className="w-1 h-3 bg-gradient-to-b from-white/80 to-white/60 rounded-full mt-2 animate-pulse group-hover:from-white group-hover:to-white/90 transition-all duration-300"></div>
          </div>
          <div className="text-center mt-2">
            <BiChevronDown className="text-white/80 group-hover:text-white transition-colors duration-300 mx-auto text-lg" />
            <p className="text-white/80 text-xs mt-1 group-hover:text-white transition-colors duration-300 font-medium">Scroll</p>
          </div>
        </div>
      </div>
      
      {/* CSS untuk animasi scroll horizontal dan efek teks */}
      <style jsx>{`
        @keyframes scroll-horizontal {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        
        @keyframes scroll-horizontal-delayed {
          0% {
            transform: translateX(66.67%);
          }
          100% {
            transform: translateX(33.33%);
          }
        }
        
        @keyframes text-glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1);
          }
          50% {
            text-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 50px rgba(59, 130, 246, 0.5), 0 0 70px rgba(59, 130, 246, 0.2);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-scroll-horizontal {
          animation: scroll-horizontal 30s linear infinite;
        }
        
        .animate-scroll-horizontal-delayed {
          animation: scroll-horizontal-delayed 30s linear infinite;
        }
        
        .animate-text-glow {
          animation: text-glow 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );    
};

export default HeroSection;
