'use client';

import { AdminProvider } from '@/context/AdminContext';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SimpleToast } from '@/components/ui/SimpleToast';
import { cleanupAdminLocalStorage, getValidAdminFlashToast } from '@/lib/utils';

// Client-side only time display component
function ClientTimeDisplay() {
  const [currentTime, setCurrentTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID'));
    };
    
    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <span>Loading...</span>;
  }

  return <span>Last updated: {currentTime}</span>;
}

function AdminSidebar() {
  const { adminUser, logout } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      
      // Show logout success notification
      try {
        localStorage.setItem('adminFlashToast', JSON.stringify({
          type: 'success',
          title: 'Admin Logout Berhasil',
          message: 'Anda telah berhasil keluar dari panel admin. Terima kasih!'
        }));
      } catch (_) {}
      
      logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Show logout success notification even if API call fails
      try {
        localStorage.setItem('adminFlashToast', JSON.stringify({
          type: 'success',
          title: 'Admin Logout Berhasil',
          message: 'Anda telah berhasil keluar dari panel admin. Terima kasih!'
        }));
      } catch (_) {}
      
      logout();
      router.push('/admin/login');
    }
  };

  const navigation = [
    {
      section: 'MAIN',
      items: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' }
      ]
    },
    {
      section: 'MASTER DATA',
      items: [
        { name: 'Semua Data', href: '/admin/data', icon: '📄' },
        { name: 'Objek Wisata', href: '/admin/destinations', icon: '🏔️' },
        { name: 'Kuliner', href: '/admin/culinary', icon: '🍽️' },
        { name: 'Penginapan', href: '/admin/accommodation', icon: '🏨' },
        { name: 'Oleh-oleh', href: '/admin/souvenirs', icon: '🛍️' },
        { name: 'Desa Wisata', href: '/admin/villages', icon: '🏘️' },
        { name: 'Biro Perjalanan', href: '/admin/travel-agencies', icon: '🚌' },
        { name: 'Event', href: '/admin/events', icon: '🎉' }
      ]
    },
    {
      section: 'TRANSAKSI',
      items: [
        { name: 'Pembayaran', href: '/admin/payments', icon: '💳' },
        { name: 'Users', href: '/admin/users', icon: '👥' }
      ]
    },
    // Removed SETTING section as requested
  ];

  const toggleDropdown = (section) => {
    setActiveDropdown(activeDropdown === section ? null : section);
  };

  return (
    <div className={`bg-gradient-to-b from-white to-gray-50 text-gray-800 h-screen transition-all duration-500 ease-in-out border-r border-gray-200/60 shadow-xl shadow-gray-200/30 ${isCollapsed ? 'w-20' : 'w-72'}`}>
      <div className="p-5">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/30">
              DB
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
            <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
          {!isCollapsed && (
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Dolan Banyumas</span>
              <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
            </div>
          )}
        </div>
        
        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full mb-5 p-2.5 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-lg transition-all duration-300 text-gray-600 hover:text-gray-800 hover:shadow-md border border-gray-200/50"
        >
          <span className="transform transition-transform duration-300">
            {isCollapsed ? '→' : '←'}
          </span>
        </button>

        {/* Navigation */}
        <nav className="space-y-3">
          {navigation.map((section) => (
            <div key={section.section}>
              {!isCollapsed && (
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2.5 tracking-wider">
                  {section.section}
                </h3>
              )}
              <ul className="space-y-1.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  
                  return (
                    <li key={item.name}>
                      {item.onClick ? (
                        <button
                          onClick={item.onClick}
                          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-102 ${
                            isActive 
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30' 
                              : 'text-gray-700 hover:bg-white hover:shadow-md hover:shadow-gray-200/50 border border-transparent hover:border-gray-200'
                          }`}
                          title={isCollapsed ? item.name : ''}
                        >
                          <span className="text-lg">{item.icon}</span>
                          {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-102 ${
                            isActive 
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30' 
                              : 'text-gray-700 hover:bg-white hover:shadow-md hover:shadow-gray-200/50 border border-transparent hover:border-gray-200'
                          }`}
                          title={isCollapsed ? item.name : ''}
                        >
                          <span className="text-lg">{item.icon}</span>
                          {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Info - Hidden */}
        {/* {!isCollapsed && (
          <div className="absolute bottom-5 left-5 right-5">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200/50 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {adminUser?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    {adminUser?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">
                    {adminUser?.role || 'Admin'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}

function AdminHeader() {
  const { adminUser, logout } = useAdmin();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const roleLabel = (adminUser?.role || 'Administrator')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const notifications = [
    { id: 1, message: 'Event baru ditambahkan', time: '2 menit yang lalu', type: 'info' },
    { id: 2, message: 'Update sistem selesai', time: '1 jam yang lalu', type: 'success' },
    { id: 3, message: 'Backup database berhasil', time: '3 jam yang lalu', type: 'success' }
  ];

  return (
    <div className="bg-white text-gray-800 px-8 py-4 flex justify-between items-center border-b border-gray-200/60 shadow-lg shadow-gray-100/50">
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="hidden md:flex items-center space-x-3 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200/50">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <ClientTimeDisplay />
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6">
        {/* Search */}
        <div className="hidden md:block relative">
          <input
            type="text"
            placeholder="Cari..."
            className="w-72 pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-300 shadow-sm"
          />
          <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🔍</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 text-gray-600 hover:text-gray-800 hover:shadow-md border border-transparent hover:border-gray-200"
          >
            <span className="text-xl">🔔</span>
            <span className="absolute top-2 right-2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-[11px] text-white flex items-center justify-center border-2 border-white shadow-lg font-bold">3</span>
          </button>
          
          <div 
            className={`absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-200/50 z-50 transition-all duration-300 ease-out ${
              showNotifications 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            <div className="p-5 border-b border-gray-200/50">
              <h3 className="text-lg font-bold text-gray-900">Notifikasi</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-4 border-b border-gray-100/50 hover:bg-gray-50/80 transition-all duration-200 cursor-pointer">
                  <p className="text-sm text-gray-900 font-medium">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2 font-medium">{notification.time}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200/50">
              <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors duration-200">
                Lihat Semua Notifikasi
              </button>
            </div>
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-xl transition-all duration-300 border border-gray-200/0 hover:border-gray-200/100"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/30">
              {adminUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden md:block text-left min-w-[8rem]">
              <div className="text-sm font-bold text-gray-900 leading-tight truncate">{adminUser?.name || 'Admin'}</div>
              <div className="text-xs text-gray-500 leading-tight truncate font-medium">{roleLabel}</div>
            </div>
            <span className="hidden md:block text-gray-400 text-lg">▾</span>
          </button>
          
          <div 
            className={`absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-200/50 z-50 transition-all duration-300 ease-out ${
              showProfile 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}
          >
            <div className="py-3">
              <Link href="/admin/profile" className="flex items-center gap-4 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-all duration-200 rounded-xl mx-2">
                <span className="text-lg">👤</span>
                <span className="font-medium">Profil Saya</span>
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-4 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-all duration-200 rounded-xl mx-2">
                <span className="text-lg">⚙️</span>
                <span className="font-medium">Pengaturan</span>
              </Link>
              <hr className="my-3 border-gray-200/50 mx-2" />
              <button 
                onClick={async () => {
                  setShowProfile(false);
                  try {
                    await fetch('/api/admin/logout', { method: 'POST' });
                    logout();
                    router.push('/admin/login');
                  } catch (error) {
                    console.error('Logout error:', error);
                    logout();
                    router.push('/admin/login');
                  }
                }}
                className="flex items-center gap-4 w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-all duration-200 rounded-xl mx-2 font-medium"
              >
                <span className="text-lg">🚪</span>
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// AdminToast component to display flash notifications - SEPARATE FROM USER NOTIFICATIONS
function AdminToast() {
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    // Only clean admin-specific localStorage
    cleanupAdminLocalStorage();
  }, []);

  useEffect(() => {
    // Read admin flash toast immediately
    const validAdminFlash = getValidAdminFlashToast();
    if (validAdminFlash) {
      setFlash(validAdminFlash);
    }
  }, []);
  
  return (
    <>
      {flash && (
        <SimpleToast
          type={flash.type || 'success'}
          title={flash.title}
          message={flash.message}
          show={true}
          onClose={() => setFlash(null)}
          autoClose={true}
          autoCloseDelay={2000}
          position="top-right"
        />
      )}
    </>
  );
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isAuthRoute = pathname === '/admin/login' || pathname === '/admin/forgot-password';

  return (
    <AdminProvider>
      {/* Admin-specific CSS */}
      <style jsx global>{`
        /* Ensure admin pages have proper colors */
        .admin-page input,
        .admin-page textarea,
        .admin-page select {
          color: #374151 !important;
          background-color: white !important;
        }
        
        .admin-page input::placeholder,
        .admin-page textarea::placeholder {
          color: #6b7280 !important;
        }
        
        .admin-page .text-gray-900 { color: #111827 !important; }
        .admin-page .text-gray-800 { color: #1f2937 !important; }
        .admin-page .text-gray-700 { color: #374151 !important; }
        .admin-page .text-gray-600 { color: #4b5563 !important; }
        .admin-page .text-gray-500 { color: #6b7280 !important; }
        .admin-page .text-gray-400 { color: #9ca3af !important; }
      `}</style>
      
      {isAuthRoute ? (
        <main className="min-h-screen bg-gray-50 admin-page">{children}</main>
      ) : (
        <div className="flex h-screen bg-gray-50 admin-page">
          <AdminSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader />
            <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
          </div>
        </div>
      )}
      <AdminToast />
    </AdminProvider>
  );
}
