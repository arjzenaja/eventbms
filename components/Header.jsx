'use client';

import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

const Header = () => {
  const { user, logout, isAuthenticated } = useUser();
  const router = useRouter();

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

  return (
    <header className='absolute left-0 right-0 z-50'>
      {/* Enhanced backdrop with better blur and gradient */}
      <div className='bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-100/50 dark:shadow-black/20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16 lg:h-20'>
            
            {/* Enhanced Logo Section */}
            <div className="flex items-center gap-8">
              <Link 
                href="/" 
                className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <span className="text-white font-bold text-lg">D</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden sm:block">
                  <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    Dolan Banyumas
                  </span>
                </div>
              </Link>
              
              {/* Enhanced Navigation Links */}
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  href="/dolan-banyumas" 
                  className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium group"
                >
                  Jelajahi
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link 
                  href="/about" 
                  className="relative text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium group"
                >
                  Tentang
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </nav>
            </div>

            {/* Enhanced Right Section */}
            <div className='flex items-center gap-4'>
              {/* Enhanced Theme Toggle */}
              <ThemeToggle className="bg-gray-100/80 hover:bg-gray-200/80 dark:bg-gray-800/50 dark:hover:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105" />
              
              {isAuthenticated() ? (
                <>
                  {/* Enhanced User Profile */}
                  <Link href="/profile">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        Halo, {user?.name}
                      </span>
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    </div>
                  </Link>
                  
                  {/* Enhanced Logout Button */}
                  <button 
                    onClick={handleLogout}
                    className='px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/25 hover:shadow-red-500/40'
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  {/* Enhanced Login Button */}
                  <Link href="/login">
                    <button className='px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-600'>
                      Masuk
                    </button>
                  </Link>
                  
                  {/* Enhanced Register Button */}
                  <Link href="/register">
                    <button className='px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'>
                      Daftar
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
