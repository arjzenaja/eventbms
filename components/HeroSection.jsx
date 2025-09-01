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
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight drop-shadow-2xl">
              <div className="block mb-2">JELAJAHI KEINDAHAN</div>
              <div className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-cyan-300 drop-shadow-lg">
                JELAJAHI WISATA BANYUMAS
              </div>
            </h1>
          </div>
          
          {/* Subtitle */}
          <p className='text-lg md:text-xl font-light text-white/95 max-w-4xl mx-auto leading-relaxed drop-shadow-lg'>
            Nikmati pengalaman wisata yang tak terlupakan dengan berbagai destinasi menarik, kuliner lezat, dan budaya yang kaya di Banyumas.
          </p>
          
          {/* Search Section */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/30">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search Input */}
                <div className="flex-1 relative group">
                  <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl group-hover:text-blue-500 transition-colors duration-300" />
                  <input 
                    type="text" 
                    placeholder="Cari Jelajahi Banyumas"
                    className="w-full pl-12 pr-4 py-3 bg-white/95 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 hover:bg-white hover:shadow-lg"
                  />
                </div>
                
                {/* Location Dropdown */}
                <div className="relative group">
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/95 rounded-xl text-gray-800 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-200">
                    <BiMapPin className="text-blue-500 text-lg" />
                    <span className="text-sm font-medium">Cari lokasi</span>
                    <BiChevronDown className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors duration-200 rounded-lg mx-2">
                        <span className="text-gray-700 text-sm">Purwokerto</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors duration-200 rounded-lg mx-2">
                        <span className="text-gray-700 text-sm">Banyumas</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors duration-200 rounded-lg mx-2">
                        <span className="text-gray-700 text-sm">Cilacap</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Category Dropdown */}
                <div className="relative group">
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/95 rounded-xl text-gray-800 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-200">
                    <BiCamera className="text-green-500 text-lg" />
                    <span className="text-sm font-medium">Wisata Alam</span>
                    <BiChevronDown className="text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
                  </div>
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 hover:bg-green-50 cursor-pointer transition-colors duration-200 rounded-lg mx-2">
                        <span className="text-gray-700 text-sm">Wisata Alam</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-green-50 cursor-pointer transition-colors duration-200 rounded-lg mx-2">
                        <span className="text-gray-700 text-sm">Wisata Budaya</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-green-50 cursor-pointer transition-colors duration-200 rounded-lg mx-2">
                        <span className="text-gray-700 text-sm">Kuliner</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-green-50 cursor-pointer transition-colors duration-200 rounded-lg mx-2">
                        <span className="text-gray-700 text-sm">Penginapan</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Sub Category Dropdown */}
                <div className="relative group">
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/95 rounded-xl text-gray-800 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-purple-200">
                    <BiStar className="text-purple-500 text-lg" />
                    <span className="text-sm font-medium">Pilih Sub Kategori</span>
                    <BiChevronDown className="text-gray-400 group-hover:text-purple-500 transition-colors duration-300" />
                  </div>
                  {/* Dropdown Menu */}
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors duration-200 rounded-lg mx-2">
                        <span className="text-gray-700 text-sm">Gunung</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors duration-200 rounded-lg mx-2">
                        <span className="text-gray-700 text-sm">Pantai</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors duration-200 rounded-lg mx-2">
                        <span className="text-gray-700 text-sm">Air Terjun</span>
                      </div>
                      <div className="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors duration-200 rounded-lg mx-2">
                        <span className="text-gray-700 text-sm">Danau</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Search Button */}
                <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform">
                  <BiSearch className="text-xl" />
                </button>
              </div>
              
              {/* Clear Search Button */}
              <div className='w-full mt-4 flex justify-center'>
                <button 
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl" 
                  onClick={() => handleClearSearch()}
                >
                  <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="w-1 h-3 bg-gradient-to-b from-white/80 to-white/60 rounded-full mt-2 animate-pulse group-hover:from-white to-white transition-all duration-300"></div>
          </div>
          <div className="text-center mt-2">
            <BiChevronDown className="text-white/80 group-hover:text-white transition-colors duration-300 mx-auto text-lg" />
            <p className="text-white/80 text-xs mt-1 group-hover:text-white transition-colors duration-300 font-medium">Scroll</p>
          </div>
        </div>
      </div>
      
      {/* CSS untuk animasi scroll horizontal */}
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
        
        .animate-scroll-horizontal {
          animation: scroll-horizontal 30s linear infinite;
        }
        
        .animate-scroll-horizontal-delayed {
          animation: scroll-horizontal-delayed 30s linear infinite;
        }
      `}</style>
    </section>
  );    
};

export default HeroSection;
