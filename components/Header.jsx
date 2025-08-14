'use client';

import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'

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
    <header className='absolute left-0 right-0 z-10'>
      <div className='container mx-auto h-full border-b border-white/10 py-4 xl:py-6'>
        <div className='flex justify-between items-center h-full'>
          {/* logo */}
          {/* <Link href="/">
            <Image src="/logo.png" alt="logo" width={70} height={70} />
          </Link> */}
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-lg text-blue-600 hover:text-white active:text-white px-3 py-1 rounded transition">
              Dolan Banyumas
            </Link>
            <Link href="/dolan-banyumas" className="text-white hover:text-blue-400 transition-colors">
              Jelajahi
            </Link>
          </div>
          <div className='flex gap-4 items-center'>
            {isAuthenticated() ? (
              <>
                <Link href="/profile">
                  <div className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors cursor-pointer">
                    <span className="text-sm">Halo, {user?.name}</span>
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                  </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className='btn btn-tertiary'
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className='btn btn-tertiary'>Masuk</button>
                </Link>
                <Link href="/register">
                  <button className='btn btn-accent'>Daftar</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
