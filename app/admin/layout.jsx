'use client';

import { AdminProvider } from '@/context/AdminContext';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Toast } from '@/components/ui/alert';
import { SimpleToast } from '@/components/ui/SimpleToast';
import { cleanupLocalStorage, getValidFlashToast } from '@/lib/utils';

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
        localStorage.setItem('flashToast', JSON.stringify({
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
        localStorage.setItem('flashToast', JSON.stringify({
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
      section: 'SETTING',
      items: [
        { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
        { name: 'Sign-Out', href: '#', icon: '🚪', onClick: handleLogout }
      ]
    }
  ];

  const toggleDropdown = (section) => {
    setActiveDropdown(activeDropdown === section ? null : section);
  };

  return (
    <div className={`bg-white text-gray-800 h-screen transition-all duration-300 border-r border-gray-200 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
            DB
          </div>
          {!isCollapsed && (
            <div>
              <span className="text-xl font-bold text-gray-900">Dolan Banyumas</span>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          )}
        </div>
        
        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full mb-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? '→' : '←'}
        </button>

        {/* Navigation */}
        <nav className="space-y-6">
          {navigation.map((section) => (
            <div key={section.section}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {section.section}
                </h3>
              )}
              <ul className="space-y-2">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  
                  return (
                    <li key={item.name}>
                      {item.onClick ? (
                        <button
                          onClick={item.onClick}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive 
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm'
                          }`}
                          title={isCollapsed ? item.name : ''}
                        >
                          <span className="text-lg">{item.icon}</span>
                          {!isCollapsed && <span>{item.name}</span>}
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive 
                              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm'
                          }`}
                          title={isCollapsed ? item.name : ''}
                        >
                          <span className="text-lg">{item.icon}</span>
                          {!isCollapsed && <span>{item.name}</span>}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Info at Bottom */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4">
            <div className="bg-gray-50 rounded-lg p-3 w-56">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {adminUser?.name?.charAt(0) || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {adminUser?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {adminUser?.role || 'Administrator'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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
    <div className="bg-white text-gray-800 px-6 py-3 flex justify-between items-center border-b border-gray-200 shadow-sm">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
          <span>•</span>
          <ClientTimeDisplay />
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-4">
        {/* Search */}
        <div className="hidden md:block relative">
          <input
            type="text"
            placeholder="Cari..."
            className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            🔔
            <span className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-5 h-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center border-2 border-white shadow">3</span>
          </button>
          
          <div 
            className={`absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 transition-all duration-200 ease-out ${
              showNotifications 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-1 pointer-events-none'
            }`}
            style={{
              transformOrigin: 'top left',
              transition: 'opacity 200ms ease-out, transform 200ms ease-out'
            }}
          >
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Notifikasi</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-200">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
                Lihat Semua Notifikasi
              </button>
            </div>
          </div>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center font-bold text-white">
              {adminUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden md:block text-left min-w-[8rem]">
              <div className="text-sm font-medium text-gray-900 leading-tight truncate">{adminUser?.name || 'Admin'}</div>
              <div className="text-xs text-gray-500 leading-tight truncate">{roleLabel}</div>
            </div>
            <span className="hidden md:block text-gray-400">▾</span>
          </button>
          
          <div 
            className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 transition-all duration-200 ease-out ${
              showProfile 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-1 pointer-events-none'
            }`}
            style={{
              transformOrigin: 'top left',
              transition: 'opacity 200ms ease-out, transform 200ms ease-out'
            }}
          >
            <div className="py-2">
              <Link href="/admin/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <span className="text-lg">👤</span>
                <span>Profil Saya</span>
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <span className="text-lg">⚙️</span>
                <span>Pengaturan</span>
              </Link>
              <hr className="my-2 border-gray-200" />
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
                className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
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

// AdminToast component to display flash notifications
function AdminToast() {
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    cleanupLocalStorage();
  }, []);

  useEffect(() => {
    // Read flash toast immediately
    const validFlash = getValidFlashToast();
    if (validFlash) {
      setFlash(validFlash);
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
      {isAuthRoute ? (
        <main className="min-h-screen bg-gray-50">{children}</main>
      ) : (
        <div className="flex h-screen bg-gray-50">
          <AdminSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminHeader />
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </div>
        </div>
      )}
      <AdminToast />
    </AdminProvider>
  );
}
