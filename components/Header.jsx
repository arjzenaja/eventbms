'use client';

import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '@/context/ThemeContext'

const Header = () => {
  const { user, logout, isAuthenticated } = useUser();
  const { isDark } = useTheme();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const userDropdownRef = useRef(null);
  const paymentDropdownRef = useRef(null);
  const searchRef = useRef(null);
  const SHOW_PAYMENT_MENU = false; // hide payment menu (not deleted)

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target)) {
        setIsPaymentDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when search is shown
  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery('');
    }
  };

  return (
    <header className='absolute left-0 right-0 z-50'>
      {/* Main Navigation Bar */}
      <div className='relative'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-3'>
          {/* Responsive Navigation Bar */}
          <div className={`${isDark ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-2xl rounded-2xl shadow-xl border ${isDark ? 'border-gray-700/20' : 'border-gray-200/20'} px-6 py-3 transition-all duration-500 hover:shadow-2xl`}>
            <div className='flex justify-between items-center'>
              
              {/* Logo and Brand */}
              <div className="flex items-center gap-4">
                <Link 
                  href="/" 
                  className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
                >
                  {/* Logo Icon */}
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                      </svg>
                    </div>
                  </div>
                  {/* Brand Name */}
                  <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-semibold text-base`}>
                    Dolan Banyumas
                  </span>
                </Link>
              </div>

              {/* Navigation Links - Desktop Only */}
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  href="/dolan-banyumas" 
                  className={`relative ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-all duration-300 font-medium group text-sm`}
                >
                  <span className="relative z-10">Jelajahi</span>
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDark ? 'bg-white' : 'bg-gray-900'} rounded-full transition-all duration-300 group-hover:w-full`}></span>
                </Link>
                <Link 
                  href="/about" 
                  className={`relative ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-all duration-300 font-medium group text-sm`}
                >
                  <span className="relative z-10">Tentang Kami</span>
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDark ? 'bg-white' : 'bg-gray-900'} rounded-full transition-all duration-300 group-hover:w-full`}></span>
                </Link>
                <Link 
                  href="/panduan-dolan-banyumas" 
                  className={`relative ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-all duration-300 font-medium group text-sm`}
                >
                  <span className="relative z-10">Panduan Kami</span>
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 ${isDark ? 'bg-white' : 'bg-gray-900'} rounded-full transition-all duration-300 group-hover:w-full`}></span>
                </Link>
              </nav>

              {/* Right Section */}
              <div className='flex items-center gap-2'>
                {/* Search Button/Input */}
                <div className="relative">
                  {showSearch ? (
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                      <div className="relative">
                        <input
                          ref={searchRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Cari destinasi, kuliner..."
                          className={`w-56 px-3 py-2 pr-10 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                            isDark 
                              ? 'bg-gray-800/80 border-gray-600/50 text-white placeholder-gray-400' 
                              : 'bg-white/80 border-gray-300/50 text-gray-900 placeholder-gray-500'
                          }`}
                        />
                        <button
                          type="submit"
                          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-all duration-300 hover:scale-110 ${
                            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={toggleSearch}
                        className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                          isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={toggleSearch}
                      className={`p-2 transition-all duration-300 hover:scale-110 group ${
                        isDark 
                          ? 'text-gray-300 hover:text-white' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      aria-label="Search"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Theme Toggle */}
                <ThemeToggle className={`transition-all duration-300 hover:scale-110`} />
                
                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMobileMenu}
                  className={`md:hidden p-2 rounded-lg ${isDark ? 'bg-gray-800/60 hover:bg-gray-700/60' : 'bg-gray-100/60 hover:bg-gray-200/60'} backdrop-blur-sm transition-all duration-300 hover:scale-110`}
                  aria-label="Toggle mobile menu"
                >
                  <div className="w-5 h-5 flex flex-col justify-center items-center">
                    <span className={`w-4 h-0.5 ${isDark ? 'bg-gray-300' : 'bg-gray-600'} transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                    <span className={`w-4 h-0.5 ${isDark ? 'bg-gray-300' : 'bg-gray-600'} transition-all duration-300 mt-1 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`w-4 h-0.5 ${isDark ? 'bg-gray-300' : 'bg-gray-600'} transition-all duration-300 mt-1 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
                  </div>
                </button>
                
                {isAuthenticated() ? (
                  <>
                    {/* User Profile Dropdown - Desktop Only */}
                    <div className="hidden md:block relative" ref={userDropdownRef}>
                      <button
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        className="p-1 rounded-full hover:bg-gray-800/20 transition-all duration-300 cursor-pointer group"
                        title={`${user?.name} - Lihat Profil`}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md hover:scale-110 transition-transform duration-300">
                          {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                      </button>
                      
                      {/* User Dropdown Menu */}
                      {isUserDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/20 dark:border-gray-700/20 py-2 z-50">
                          <Link href="/profile" onClick={() => setIsUserDropdownOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">Profil Saya</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Kelola informasi pribadi</div>
                              </div>
                            </div>
                          </Link>
                          <Link href="/settings" onClick={() => setIsUserDropdownOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
                              <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">Pengaturan</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Preferensi akun</div>
                              </div>
                            </div>
                          </Link>
                          <div className="border-t border-gray-200/20 dark:border-gray-700/20 my-2"></div>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                          >
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                            </div>
                            <div className="text-left">
                              <div className="font-medium">Keluar</div>
                              <div className="text-sm opacity-75">Logout dari akun</div>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Payment History Dropdown - Desktop Only (hidden by flag) */}
                    {SHOW_PAYMENT_MENU && (
                    <div className="hidden md:block relative" ref={paymentDropdownRef}>
                      <button
                        onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
                        className="p-1 rounded-full hover:bg-gray-800/20 transition-all duration-300 cursor-pointer group"
                        title="Riwayat Pembayaran - Lihat Transaksi"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs shadow-md hover:scale-110 transition-transform duration-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                      </button>
                      
                      {/* Payment Dropdown Menu */}
                      {isPaymentDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/20 dark:border-gray-700/20 py-2 z-50">
                          <Link href="/payment-history" onClick={() => setIsPaymentDropdownOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">Semua Transaksi</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Lihat riwayat lengkap</div>
                              </div>
                            </div>
                          </Link>
                          <Link href="/payment-history?status=pending" onClick={() => setIsPaymentDropdownOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
                              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">Menunggu Pembayaran</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Transaksi pending</div>
                              </div>
                            </div>
                          </Link>
                          <Link href="/payment-history?status=completed" onClick={() => setIsPaymentDropdownOpen(false)}>
                            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">Transaksi Berhasil</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Pembayaran selesai</div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      )}
                    </div>
                    )}
                    
                    {/* Logout Button - Desktop Only */}
                    <div className="hidden md:block">
                      <button 
                        onClick={handleLogout}
                        className='px-3 py-2 bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-700/80 hover:to-red-800/80 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-red-500/20 shadow-md text-sm'
                      >
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Keluar
                        </div>
                      </button>
                    </div>
                    
                  </>
                ) : (
                  <>
                    {/* Login Button - Desktop Only */}
                    <div className="hidden md:block">
                      <Link href="/login">
                        <button className={`px-4 py-2 ${isDark ? 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300' : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-700'} font-medium rounded-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm`}>
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
        <div className={`${isDark ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-2xl border-b ${isDark ? 'border-gray-700/20' : 'border-gray-200/20'} shadow-2xl`}>
          <div className="container mx-auto px-4 py-6">
            {/* Mobile Navigation Links */}
            <nav className="space-y-3 mb-6">
              <Link 
                href="/dolan-banyumas" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 py-4 px-4 ${isDark ? 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-600/20' : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-600/10'} transition-all duration-300 font-medium rounded-2xl backdrop-blur-sm border border-transparent hover:border-blue-500/20`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span>Jelajahi</span>
              </Link>
              <Link 
                href="/about" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 py-4 px-4 ${isDark ? 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-green-500/20 hover:to-emerald-600/20' : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-600/10'} transition-all duration-300 font-medium rounded-2xl backdrop-blur-sm border border-transparent hover:border-green-500/20`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-green-500/20' : 'bg-green-500/10'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Tentang Kami</span>
              </Link>
              <Link 
                href="/panduan-dolan-banyumas" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 py-4 px-4 ${isDark ? 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-600/20' : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-600/10'} transition-all duration-300 font-medium rounded-2xl backdrop-blur-sm border border-transparent hover:border-purple-500/20`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-purple-500/20' : 'bg-purple-500/10'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span>Panduan Kami</span>
              </Link>
            </nav>

            {/* Mobile User Actions */}
            {isAuthenticated() ? (
              <div className="space-y-3">
                {/* Mobile User Profile */}
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/20">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-lg">Halo, {user?.name}</p>
                      <p className="text-sm text-white/80 font-medium">Klik untuk lihat profil</p>
                    </div>
                  </div>
                </Link>
                
                {/* Mobile Payment History (hidden by flag) */}
                {SHOW_PAYMENT_MENU && (
                <Link href="/payment-history" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/20">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-white text-lg">Riwayat Pembayaran</p>
                      <p className="text-sm text-white/80 font-medium">Lihat semua transaksi</p>
                    </div>
                  </div>
                </Link>
                )}

                {/* Mobile Settings */}
                <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-gray-500/20 to-gray-600/20 backdrop-blur-sm border border-gray-500/20">
                    <div className="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-white text-lg">Pengaturan</p>
                      <p className="text-sm text-white/80 font-medium">Preferensi akun</p>
                    </div>
                  </div>
                </Link>
                
                {/* Mobile Logout Button */}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className='w-full py-4 bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-700/80 hover:to-red-800/80 text-white font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm border border-red-500/20 shadow-lg'
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Keluar
                  </div>
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
