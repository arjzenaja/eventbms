'use client';

import Link from 'next/link';
import Image from 'next/image';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 pt-24">
      <div className="text-center max-w-2xl mx-auto">
        
        {/* Animated 404 Number */}
        <div className="relative mb-6">
          <h1 className="text-8xl md:text-[10rem] font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
          
          {/* Floating Elements */}
          <div className="absolute top-4 left-4 w-4 h-4 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="absolute top-8 right-8 w-3 h-3 bg-green-400 rounded-full animate-bounce animation-delay-2000"></div>
          <div className="absolute bottom-8 left-8 w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-4000"></div>
        </div>

        {/* Main Message */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
            Oops! Halaman Tidak Ditemukan
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Sepertinya Anda tersesat dalam petualangan di Banyumas. 
            Jangan khawatir, mari kita kembali ke jalan yang benar!
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-6 relative">
          <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-full flex items-center justify-center">
            <div className="text-6xl">🏔️</div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full opacity-80 animate-ping"></div>
          <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-400 rounded-full opacity-80 animate-ping animation-delay-1000"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <Link href="/">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-1">
              🏠 Kembali ke Beranda
            </button>
          </Link>
          
          <Link href="/dolan-banyumas">
            <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transform hover:-translate-y-1">
              🗺️ Jelajahi Banyumas
            </button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
          <Link href="/dolan-banyumas/wisata" className="group">
            <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:scale-105">
              <div className="text-2xl mb-2">🏞️</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Wisata
              </div>
            </div>
          </Link>
          
          <Link href="/dolan-banyumas/kuliner" className="group">
            <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 hover:scale-105">
              <div className="text-2xl mb-2">🍜</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400">
                Kuliner
              </div>
            </div>
          </Link>
          
          <Link href="/dolan-banyumas/penginapan" className="group">
            <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:scale-105">
              <div className="text-2xl mb-2">🏨</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                Penginapan
              </div>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
