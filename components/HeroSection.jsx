import React, { useContext, useState, useEffect } from 'react'
import { EventContext } from '@/context/EventContext';
import { useTheme } from '@/context/ThemeContext';
//  components
import Searchbar from "@/components/Searchbar/Searchbar";
import { BiMapPin, BiSearch, BiFilter, BiStar, BiHeart, BiCamera, BiPlay, BiTime, BiUser, BiRefresh } from 'react-icons/bi';

const HeroSection = () => {
  const { handleClearSearch } = useContext(EventContext);
  const { theme, isDark } = useTheme();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  
  // Generate gradient backgrounds with custom #f0f5fe color
  const getGradientBackgrounds = () => {
    if (isDark) {
      return [
        "bg-gradient-to-br from-slate-900/60 via-blue-900/40 to-indigo-900/50",
        "bg-gradient-to-br from-slate-800/70 via-blue-800/50 to-indigo-800/60",
        "bg-gradient-to-br from-slate-700/80 via-blue-700/60 to-indigo-700/70",
        "bg-gradient-to-br from-slate-600/90 via-blue-600/70 to-indigo-600/80",
        "bg-gradient-to-br from-slate-500/100 via-blue-500/80 to-indigo-500/90",
        "bg-gradient-to-br from-slate-400/100 via-blue-400/90 to-indigo-400/100"
      ];
    } else {
      return [
        "bg-[#f8fafc]",
        "bg-[#f8fafc]",
        "bg-[#f8fafc]",
        "bg-[#f8fafc]",
        "bg-[#f8fafc]",
        "bg-[#f8fafc]"
      ];
    }
  };
  
  const gradientBackgrounds = getGradientBackgrounds();
  
  // Auto-rotate background setiap 10 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % gradientBackgrounds.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [gradientBackgrounds.length]);
  
  // Reset background index when theme changes
  useEffect(() => {
    setCurrentBgIndex(0);
  }, [isDark]);
  
  // Fungsi untuk mengganti background manual
  const changeBackground = () => {
    setCurrentBgIndex((prev) => (prev + 1) % gradientBackgrounds.length);
  };
  
  return (
    <section className='min-h-screen relative overflow-hidden'>
      {/* Gradient Background */}
      <div className='absolute inset-0 -z-10'>
        {/* Main gradient background */}
        <div className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out ${gradientBackgrounds[currentBgIndex]}`}>
        </div>
        
        {/* Animated gradient overlay untuk efek yang lebih dinamis */}
        <div className={`absolute inset-0 w-full h-full animate-gradient-shift ${gradientBackgrounds[(currentBgIndex + 1) % gradientBackgrounds.length]} opacity-30`}>
        </div>
        
        {/* Dynamic overlay untuk memastikan teks terbaca berdasarkan tema */}
        <div className={`absolute inset-0 ${isDark ? 'bg-black/20' : 'bg-black/10'}`}></div>
        
        {/* Background Change Button */}
        <button 
          onClick={changeBackground}
          className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-lg border border-white/30"
          title="Ganti Warna Gradasi"
        >
          <BiRefresh className="text-xl" />
        </button>
        
        {/* Background elements matching main page section */}
        <div className="absolute inset-0 -z-10">
          <div className={`absolute top-20 left-10 w-72 h-72 ${isDark ? 'bg-slate-300/10' : 'bg-slate-300/30'} rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-20 right-10 w-96 h-96 ${isDark ? 'bg-blue-300/10' : 'bg-blue-300/30'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 ${isDark ? 'bg-indigo-300/10' : 'bg-indigo-300/30'} rounded-full blur-3xl animate-pulse delay-2000`}></div>
          <div className={`absolute top-1/3 right-1/4 w-64 h-64 ${isDark ? 'bg-blue-200/10' : 'bg-blue-200/30'} rounded-full blur-3xl animate-pulse delay-500`}></div>
          <div className={`absolute bottom-1/3 left-1/4 w-56 h-56 ${isDark ? 'bg-slate-200/10' : 'bg-slate-200/30'} rounded-full blur-3xl animate-pulse delay-1500`}></div>
        </div>
        
        {/* Animated Background Pattern */}
        <div className={`absolute inset-0 ${isDark ? 'opacity-10' : 'opacity-15'}`}>
          <div className={`absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,${isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.3)'}_1px,transparent_0)] bg-[length:25px_25px]`}></div>
          <div className={`absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,${isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.3)'}_1px,transparent_0)] bg-[length:35px_35px]`}></div>
          <div className={`absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,${isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.3)'}_1px,transparent_0)] bg-[length:45px_45px]`}></div>
        </div>
        
        {/* Floating Geometric Shapes */}
        <div className={`absolute top-20 left-10 w-24 h-24 border ${isDark ? 'border-white/10' : 'border-white/20'} rounded-full animate-pulse`}></div>
        <div className={`absolute top-32 right-16 w-20 h-20 border ${isDark ? 'border-blue-400/20' : 'border-blue-400/30'} rounded-lg rotate-45 animate-pulse`}></div>
        <div className={`absolute bottom-32 left-16 w-16 h-16 border ${isDark ? 'border-purple-400/20' : 'border-purple-400/30'} rounded-full animate-pulse`}></div>
        <div className={`absolute top-1/3 right-1/4 w-12 h-12 border ${isDark ? 'border-green-400/20' : 'border-green-400/30'} rounded-lg animate-pulse`}></div>
      </div>
      
      <div className='container mx-auto h-screen flex flex-col justify-center items-center px-4 relative z-10'>
        {/* Main Hero Content */}
        <div className='w-full max-w-6xl text-center mx-auto flex flex-col gap-8 mb-12'>
          {/* Main Title */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
              <div className="block mb-4">
                <span className="text-white">
                  JELAJAHI KEINDAHAN
                </span>
              </div>
              <div className="block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900">
                  JELAJAHI WISATA BANYUMAS
                </span>
              </div>
            </h1>
            
            {/* Decorative Elements */}
            <div className="flex justify-center items-center gap-4 mt-6">
              <div className={`w-16 h-1 bg-gradient-to-r from-transparent ${isDark ? 'via-blue-400' : 'via-blue-500'} to-transparent rounded-full`}></div>
              <div className={`w-3 h-3 bg-gradient-to-r ${isDark ? 'from-blue-400 to-cyan-300' : 'from-blue-500 to-cyan-400'} rounded-full animate-pulse`}></div>
              <div className={`w-16 h-1 bg-gradient-to-r from-transparent ${isDark ? 'via-cyan-300' : 'via-cyan-400'} to-transparent rounded-full`}></div>
            </div>
          </div>
          
          {/* Subtitle */}
          <div className="relative">
            <p className={`text-lg md:text-xl font-light ${isDark ? 'text-white/95' : 'text-white/90'} max-w-4xl mx-auto leading-relaxed drop-shadow-lg relative z-10`}>
              Nikmati pengalaman wisata yang tak terlupakan dengan berbagai destinasi menarik, kuliner lezat, dan budaya yang kaya di Banyumas.
            </p>
            <div className={`absolute -inset-4 bg-gradient-to-r ${isDark ? 'from-blue-500/5 via-purple-500/5 to-cyan-500/5' : 'from-blue-500/10 via-purple-500/10 to-cyan-500/10'} blur-2xl rounded-2xl`}></div>
          </div>
          
          {/* Search Section */}
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
            <Searchbar />
            
            {/* Clear Search Button */}
            <div className='mt-6 flex justify-center'>
              <button 
                className={`group inline-flex items-center gap-3 px-8 py-4 ${isDark ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white' : 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 hover:text-gray-800'} rounded-2xl text-base font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl`}
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
      
      {/* CSS untuk animasi gradient */}
      <style jsx>{`
        @keyframes gradient-shift {
          0% {
            opacity: 0;
            transform: scale(1.1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
          100% {
            opacity: 0;
            transform: scale(1);
          }
        }
        
        .animate-gradient-shift {
          animation: gradient-shift 10s ease-in-out infinite;
        }
      `}</style>
    </section>
  );    
};

export default HeroSection;
