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
      {/* Main Navigation Bar */}
      <div className='relative'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          {/* Dark Rounded Navigation Bar */}
          <div className='bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 px-8 py-4'>
            <div className='flex justify-between items-center'>
              
              {/* Logo and Brand */}
              <div className="flex items-center gap-4">
                <Link 
                  href="/" 
                  className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
                >
                  {/* Logo Icon */}
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                  </div>
                  {/* Brand Name */}
                  <span className="text-white font-semibold text-lg">
                    Dolan Banyumas
                  </span>
                </Link>
              </div>

              {/* Navigation Links - Desktop Only */}
              <nav className="hidden md:flex items-center gap-8">
                <Link 
                  href="/dolan-banyumas" 
                  className="relative text-gray-300 hover:text-white transition-all duration-300 font-medium group"
                >
                  <span className="relative z-10">Jelajahi</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white rounded-full transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  href="/about" 
                  className="relative text-gray-300 hover:text-white transition-all duration-300 font-medium group"
                >
                  <span className="relative z-10">Tentang Kami</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white rounded-full transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  href="/destinations" 
                  className="relative text-gray-300 hover:text-white transition-all duration-300 font-medium group"
                >
                  <span className="relative z-10">Panduan Kami</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white rounded-full transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </nav>

              {/* Right Section */}
              <div className='flex items-center gap-4'>
                {/* Theme Toggle */}
                <ThemeToggle className="bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 p-2 rounded-lg" />
                
                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMobileMenu}
                  className="md:hidden p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300"
                  aria-label="Toggle mobile menu"
                >
                  <div className="w-5 h-5 flex flex-col justify-center items-center">
                    <span className={`w-4 h-0.5 bg-gray-300 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                    <span className={`w-4 h-0.5 bg-gray-300 transition-all duration-300 mt-1 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`w-4 h-0.5 bg-gray-300 transition-all duration-300 mt-1 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
                  </div>
                </button>
                
                {isAuthenticated() ? (
                  <>
                    {/* User Profile - Desktop Only */}
                    <div className="hidden md:block">
                      <Link href="/profile">
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {user?.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                            {user?.name}
                          </span>
                        </div>
                      </Link>
                    </div>
                    
                    {/* Payment History - Desktop Only */}
                    <div className="hidden md:block">
                      <Link href="/payment-history">
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm">
                            💳
                          </div>
                          <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                            Riwayat Pembayaran
                          </span>
                        </div>
                      </Link>
                    </div>
                    
                    {/* Logout Button - Desktop Only */}
                    <div className="hidden md:block">
                      <button 
                        onClick={handleLogout}
                        className='px-4 py-2 bg-red-600/80 hover:bg-red-700/80 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm'
                      >
                        Keluar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Login Button - Desktop Only */}
                    <div className="hidden md:block">
                      <Link href="/login">
                        <button className='px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 font-medium rounded-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm'>
                          Masuk
                        </button>
                      </Link>
                    </div>
                    
                    {/* Contact/Register Button - Desktop Only */}
                    <div className="hidden md:block">
                      <Link href="/register">
                        <button className='px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 shadow-lg'>
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
                className="block py-3 px-4 text-gray-300 hover:text-white transition-all duration-300 font-medium rounded-lg hover:bg-gray-800/50"
              >
                Jelajahi
              </Link>
              <Link 
                href="/about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-4 text-gray-300 hover:text-white transition-all duration-300 font-medium rounded-lg hover:bg-gray-800/50"
              >
                Tentang Kami
              </Link>
              <Link 
                href="/destinations" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-4 text-gray-300 hover:text-white transition-all duration-300 font-medium rounded-lg hover:bg-gray-800/50"
              >
                Panduan Kami
              </Link>
            </nav>

            {/* Mobile User Actions */}
            {isAuthenticated() ? (
              <div className="space-y-4">
                {/* Mobile User Profile */}
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/50">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-white">Halo, {user?.name}</p>
                      <p className="text-sm text-gray-400">Klik untuk lihat profil</p>
                    </div>
                  </div>
                </Link>
                
                {/* Mobile Payment History */}
                <Link href="/payment-history" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/50">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-lg">
                      💳
                    </div>
                    <div>
                      <p className="font-medium text-white">Riwayat Pembayaran</p>
                      <p className="text-sm text-gray-400">Lihat semua transaksi</p>
                    </div>
                  </div>
                </Link>
                
                {/* Mobile Logout Button */}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className='w-full py-4 bg-red-600/80 hover:bg-red-700/80 text-white font-medium rounded-lg transition-all duration-300'
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Mobile Login Button */}
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className='w-full py-4 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 font-medium rounded-lg transition-all duration-300'>
                    Masuk
                  </button>
                </Link>
                
                {/* Mobile Register Button */}
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className='w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg'>
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
