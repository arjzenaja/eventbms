'use client';

import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

const Header = () => {
  const { user, logout, isAuthenticated } = useUser();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Show logout success notification
    try {
      localStorage.setItem('flashToast', JSON.stringify({
        type: 'success',
        title: 'Berhasil Keluar',
        message: 'Anda telah berhasil keluar dari akun. Terima kasih telah menggunakan Dolan Banyumas!'
      }));
    } catch (_) {}
    
    logout();
    
    // Redirect to home page to show the notification
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className='absolute left-0 right-0 z-50'>
      {/* Enhanced backdrop with modern glassmorphism effect */}
      <div className='bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/40 shadow-xl shadow-black/20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-20 lg:h-24'>
            
            {/* Enhanced Logo Section with better animations */}
            <div className="flex items-center gap-8">
              <Link 
                href="/" 
                className="group flex items-center gap-4 transition-all duration-500 hover:scale-105"
              >
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-500 group-hover:rotate-3">
                    <span className="text-white font-bold text-2xl">D</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white shadow-md"></div>
                </div>
                <div className="hidden sm:block">
                  <span className="font-bold text-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-500">
                    Dolan Banyumas
                  </span>
                </div>
              </Link>
              
              {/* Enhanced Navigation Links with better hover effects - Desktop Only */}
              <nav className="hidden md:flex items-center gap-8">
                <Link 
                  href="/dolan-banyumas" 
                  className="relative text-gray-300 hover:text-indigo-400 transition-all duration-300 font-semibold group"
                >
                  <span className="relative z-10">Jelajahi</span>
                  <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 group-hover:w-full group-hover:shadow-lg group-hover:shadow-indigo-500/50"></span>
                </Link>
                <Link 
                  href="/about" 
                  className="relative text-gray-300 hover:text-indigo-400 transition-all duration-300 font-semibold group"
                >
                  <span className="relative z-10">Tentang</span>
                  <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 group-hover:w-full group-hover:shadow-lg group-hover:shadow-indigo-500/50"></span>
                </Link>
                {isAuthenticated() && (
                  <Link 
                    href="/settings" 
                    className="relative text-gray-300 hover:text-indigo-400 transition-all duration-300 font-semibold group"
                  >
                    <span className="relative z-10">Pengaturan</span>
                    <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 group-hover:w-full group-hover:shadow-lg group-hover:shadow-indigo-500/50"></span>
                  </Link>
                )}
              </nav>
            </div>

            {/* Enhanced Right Section with better styling */}
            <div className='flex items-center gap-4'>
              {/* Enhanced Theme Toggle */}
              <ThemeToggle className="bg-gray-800 hover:bg-gray-700 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg p-3 rounded-xl" />
              
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:shadow-lg border border-gray-600/50"
                aria-label="Toggle mobile menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span className={`w-5 h-0.5 bg-gray-300 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                  <span className={`w-5 h-0.5 bg-gray-300 transition-all duration-300 mt-1 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`w-5 h-0.5 bg-gray-300 transition-all duration-300 mt-1 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>
              
              {isAuthenticated() ? (
                <>
                  {/* Enhanced User Profile with better design - Desktop Only */}
                  <div className="hidden md:block">
                    <Link href="/profile">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-800 hover:bg-gray-700 transition-all duration-300 cursor-pointer group border border-gray-600/50 hover:border-indigo-500/50">
                        <span className="text-sm font-semibold text-gray-300 group-hover:text-indigo-400 transition-colors">
                          Halo, {user?.name}
                        </span>
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/25 transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-500/40">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                      </div>
                    </Link>
                  </div>
                  
                  {/* Enhanced Settings Link - Desktop Only */}
                  <div className="hidden md:block">
                    <Link href="/settings">
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition-all duration-300 cursor-pointer group border border-gray-600/50 hover:border-indigo-500/50">
                        <span className="text-gray-400 group-hover:text-indigo-400 transition-colors text-lg">
                          ⚙️
                        </span>
                      </div>
                    </Link>
                  </div>
                  
                  {/* Enhanced Logout Button - Desktop Only */}
                  <div className="hidden md:block">
                    <button 
                      onClick={handleLogout}
                      className='px-7 py-3 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-red-500/30 hover:shadow-red-500/50 border-0 focus:outline-none focus:ring-4 focus:ring-red-500/30'
                    >
                      Keluar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Enhanced Login Button - Desktop Only */}
                  <div className="hidden md:block">
                    <Link href="/login">
                      <button className='px-7 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-600/50 hover:border-indigo-500/50'>
                        Masuk
                      </button>
                    </Link>
                  </div>
                  
                  {/* Enhanced Register Button - Desktop Only */}
                  <div className="hidden md:block">
                    <Link href="/register">
                      <button className='px-7 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 border-0 focus:outline-none focus:ring-4 focus:ring-purple-500/30'>
                        Daftar
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
        isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-gray-900/95 backdrop-blur-2xl border-b border-gray-700/30 shadow-2xl">
          <div className="container mx-auto px-4 py-6">
            {/* Mobile Navigation Links */}
            <nav className="space-y-4 mb-6">
              <Link 
                href="/dolan-banyumas" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-4 text-gray-300 hover:text-indigo-400 transition-all duration-300 font-semibold rounded-xl hover:bg-gray-800"
              >
                Jelajahi
              </Link>
              <Link 
                href="/about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-4 text-gray-300 hover:text-indigo-400 transition-all duration-300 font-semibold rounded-xl hover:bg-gray-800"
              >
                Tentang
              </Link>
              {isAuthenticated() && (
                <Link 
                  href="/settings" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-gray-300 hover:text-indigo-400 transition-all duration-300 font-semibold rounded-xl hover:bg-gray-800"
                >
                  Pengaturan
                </Link>
              )}
            </nav>

            {/* Mobile User Actions */}
            {isAuthenticated() ? (
              <div className="space-y-4">
                {/* Mobile User Profile */}
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-800 border border-gray-600/50">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white">Halo, {user?.name}</p>
                      <p className="text-sm text-gray-400">Klik untuk lihat profil</p>
                    </div>
                  </div>
                </Link>
                
                {/* Mobile Logout Button */}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className='w-full py-4 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl shadow-red-500/30'
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Mobile Login Button */}
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className='w-full py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg border border-gray-600/50'>
                    Masuk
                  </button>
                </Link>
                
                {/* Mobile Register Button */}
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className='w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-xl shadow-purple-500/30'>
                    Daftar
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
