'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';
import { useEffect, useState, Suspense, lazy } from 'react';

// Client-side only date display component
function ClientDateDisplay() {
  const [currentDate, setCurrentDate] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateDate = () => {
      setCurrentDate(new Date().toLocaleDateString('id-ID', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }));
    };
    
    updateDate(); // Set initial date
    // Update date at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow - now;
    
    const timeout = setTimeout(() => {
      updateDate();
      // Then update every 24 hours
      setInterval(updateDate, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
    
    return () => clearTimeout(timeout);
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <span>Loading...</span>;
  }

  return <span>{currentDate}</span>;
}

// Client-side only event date formatter component
function ClientEventDateFormatter({ date }) {
  const [formattedDate, setFormattedDate] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (date) {
      setFormattedDate(new Date(date).toLocaleDateString('id-ID'));
    }
  }, [date]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <span>Loading...</span>;
  }

  return <span>{formattedDate}</span>;
}

// Client-side only last updated formatter component
function ClientLastUpdatedFormatter({ date }) {
  const [formattedDate, setFormattedDate] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (date) {
      setFormattedDate(date.toLocaleString('id-ID'));
    }
  }, [date]);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return <span>Loading...</span>;
  }

  return <span>Terakhir diperbarui: {formattedDate}</span>;
}

// Lazy-loaded components for better performance
const StatsCards = lazy(() => import('./components/StatsCards'));
const ChartsSection = lazy(() => import('./components/ChartsSection'));
const RecentDataTable = lazy(() => import('./components/RecentDataTable'));
const QuickActions = lazy(() => import('./components/QuickActions'));

// Loading fallback component
const LoadingFallback = ({ children }) => (
  <Suspense fallback={
    <div className="animate-pulse">
      <div className="bg-slate-200 rounded-2xl h-32 mb-6"></div> 
    </div>
  }>
    {children}
  </Suspense>
);

export default function AdminDashboard() {
  const { adminUser } = useAdmin();
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalDestinations: 0,
    totalAccommodations: 0,
    totalCulinary: 0,
    totalSouvenirs: 0,
    totalVillages: 0,
    totalTravelAgencies: 0,
    totalWisataAlam: 0,
    totalUsers: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [chartData, setChartData] = useState({
    eventTypes: [],
    monthlyEvents: []
  });
  const [allRecentData, setAllRecentData] = useState([]);
  const [filteredRecentData, setFilteredRecentData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRecentData(allRecentData);
    } else {
      const filtered = allRecentData.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecentData(filtered);
    }
  }, [searchTerm, allRecentData]);

  const fetchDashboardData = async (isRetry = false) => {
    try {
      if (isRetry) {
        setIsRetrying(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      // Use optimized single API call for dashboard data
      const response = await fetch('/api/dashboard/stats', {
        headers: { 'Cache-Control': 'max-age=300' },
        next: { revalidate: 300 }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch dashboard data');
      }

      // Set all data from the optimized response
      setStats({
        ...data.stats,
        totalWisataAlam: data.stats.totalDestinations // Destinations are the main tourist objects
      });

      setRecentEvents(data.recentEvents);
      setFilteredEvents(data.recentEvents);
      setAllRecentData(data.recentData);
      setFilteredRecentData(data.recentData);
      setChartData(data.chartData);

      // Show success notification
      setNotification({
        type: 'success',
        message: 'Data dashboard berhasil diperbarui!',
        timestamp: new Date()
      });

      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);

      // Update last updated timestamp
      setLastUpdated(new Date());

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // More specific error messages
      let errorMessage = 'Terjadi kesalahan saat mengambil data dashboard.';
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Permintaan timeout. Server mungkin sedang sibuk.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Terjadi kesalahan server. Silakan coba lagi nanti.';
      }
      
      setError(errorMessage);
      
      // Auto-retry logic (max 3 retries)
      if (retryCount < 3 && !isRetry) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchDashboardData(true);
        }, 2000 * (retryCount + 1)); // Exponential backoff
      }
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  };

  // Enhanced skeleton loading component
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg animate-pulse border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
        <div className="w-16 h-4 bg-slate-200 rounded"></div>
      </div>
      <div className="w-28 h-7 bg-slate-200 rounded mb-3"></div>
      <div className="w-20 h-10 bg-slate-200 rounded mb-3"></div>
      <div className="w-36 h-4 bg-slate-200 rounded"></div>
    </div>
  );

  const SkeletonTable = () => (
    <div className="bg-white rounded-2xl shadow-lg animate-pulse border border-gray-100">
      <div className="px-6 py-6 border-b border-gray-100">
        <div className="w-40 h-7 bg-slate-200 rounded mb-4"></div>
        <div className="w-72 h-12 bg-slate-200 rounded"></div>
      </div>
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
            <div className="flex-1 space-y-2">
              <div className="w-56 h-5 bg-slate-200 rounded"></div>
              <div className="w-40 h-4 bg-slate-200 rounded"></div>
            </div>
            <div className="w-24 h-4 bg-slate-200 rounded"></div>
            <div className="w-20 h-4 bg-slate-200 rounded"></div>
            <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 lg:p-8 space-y-8">
          {/* Welcome Section Skeleton */}
          <div className="bg-gradient-to-r from-slate-200 to-slate-300 rounded-3xl p-8 animate-pulse">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              <div className="space-y-4">
                <div className="w-96 h-12 bg-slate-300 rounded-2xl"></div>
                <div className="w-80 h-7 bg-slate-300 rounded-xl"></div>
                <div className="w-56 h-5 bg-slate-300 rounded-lg"></div>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-36 h-14 bg-slate-300 rounded-2xl"></div>
                <div className="w-28 h-20 bg-slate-300 rounded-2xl"></div>
              </div>
            </div>
          </div>

          {/* Summary Stats Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="w-40 h-7 bg-slate-200 rounded-xl mb-6 animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="text-center p-4 bg-slate-50 rounded-xl animate-pulse border border-gray-100">
                  <div className="w-16 h-10 bg-slate-200 rounded-lg mx-auto mb-3"></div>
                  <div className="w-24 h-5 bg-slate-200 rounded mx-auto"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border border-gray-100">
              <div className="w-56 h-7 bg-slate-200 rounded-xl mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
                      <div className="w-32 h-5 bg-slate-200 rounded"></div>
                    </div>
                    <div className="w-32 h-3 bg-slate-200 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse border border-gray-100">
              <div className="w-40 h-7 bg-slate-200 rounded-xl mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="w-28 h-5 bg-slate-200 rounded"></div>
                    <div className="w-32 h-3 bg-slate-200 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Data Table Skeleton */}
          <SkeletonTable />

          {/* Quick Actions Skeleton */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="w-32 h-7 bg-slate-200 rounded-xl mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-slate-100 rounded-xl p-4 text-center animate-pulse border border-gray-200">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl mx-auto mb-3"></div>
                  <div className="w-24 h-5 bg-slate-200 rounded mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Terjadi Kesalahan</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">{error}</p>
            
            {isRetrying && (
              <div className="mb-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <p className="text-sm text-slate-500">Mencoba lagi... ({retryCount}/3)</p>
              </div>
            )}
            
            {retryCount > 0 && retryCount < 3 && !isRetrying && (
              <p className="text-sm text-slate-500 mb-6">
                Mencoba lagi dalam beberapa detik... ({retryCount}/3)
              </p>
            )}
            
            <div className="space-y-3">
              <button 
                onClick={() => {
                  setError(null);
                  setRetryCount(0);
                  setIsLoading(true);
                  fetchDashboardData();
                }}
                disabled={isRetrying}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-lg"
              >
                {isRetrying ? 'Mencoba...' : 'Coba Lagi'}
              </button>
              
              {retryCount >= 3 && (
                <p className="text-xs text-slate-500 mt-3">
                  Sudah mencoba 3 kali. Silakan refresh halaman atau hubungi administrator.
                </p>
              )}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 lg:p-8 space-y-8">
        {/* Enhanced Notification */}
        {notification && (
          <div className={`fixed top-6 right-6 z-50 p-6 rounded-2xl shadow-2xl transition-all duration-500 transform ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border border-emerald-400' 
              : 'bg-gradient-to-r from-red-500 to-rose-600 text-white border border-red-400'
          }`}>
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{notification.type === 'success' ? '✅' : '❌'}</span>
              <span className="font-medium">{notification.message}</span>
              <button 
                onClick={() => setNotification(null)}
                className="ml-4 text-white hover:text-gray-200 transition-colors text-xl"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-white shadow-2xl border border-blue-500/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-8 lg:space-y-0">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Selamat Datang, {adminUser?.name || 'Admin'}! 👋
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                Kelola semua data wisata dan event dari dashboard yang modern ini
              </p>
              {lastUpdated && (
                <p className="text-sm text-blue-200 bg-white bg-opacity-10 px-4 py-3 rounded-xl inline-block backdrop-blur-sm border border-white border-opacity-20">
                  <ClientLastUpdatedFormatter date={lastUpdated} />
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  setRetryCount(0);
                  fetchDashboardData();
                }}
                disabled={isLoading}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-4 rounded-2xl font-medium transition-all duration-300 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-white border-opacity-30 transform hover:scale-105"
              >
                <span className="text-2xl">{isLoading ? '⏳' : '🔄'}</span>
                <span className="text-lg">{isLoading ? 'Memuat...' : 'Refresh Data'}</span>
              </button>
              <div className="text-center sm:text-right bg-white bg-opacity-10 px-6 py-4 rounded-2xl backdrop-blur-sm border border-white border-opacity-20">
                <p className="text-sm text-blue-200 mb-1">Hari ini</p>
                <p className="text-2xl lg:text-3xl font-semibold">
                  <ClientDateDisplay />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Summary Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100">
          <h3 className="text-xl lg:text-2xl font-bold text-slate-700 mb-6">📊 Ringkasan Data</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
              <div className="text-2xl lg:text-3xl font-bold text-blue-700 mb-2">{stats.totalEvents + stats.totalDestinations + stats.totalAccommodations + stats.totalCulinary + stats.totalSouvenirs + stats.totalVillages + stats.totalTravelAgencies}</div>
              <div className="text-sm lg:text-base text-slate-600 font-medium">Total Data Masuk</div>
            </div>
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
              <div className="text-2xl lg:text-3xl font-bold text-blue-700 mb-2">{stats.totalDestinations}</div>
              <div className="text-sm lg:text-base text-slate-600 font-medium">Objek Wisata</div>
            </div>
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
              <div className="text-2xl lg:text-3xl font-bold text-orange-700 mb-2">{stats.totalCulinary}</div>
              <div className="text-sm lg:text-base text-slate-600 font-medium">Kuliner</div>
            </div>
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
              <div className="text-2xl lg:text-3xl font-bold text-purple-700 mb-2">{stats.totalAccommodations}</div>
              <div className="text-sm lg:text-base text-slate-600 font-medium">Penginapan</div>
            </div>
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl border border-teal-200">
              <div className="text-2xl lg:text-3xl font-bold text-teal-700 mb-2">{stats.totalVillages}</div>
              <div className="text-sm lg:text-base text-slate-600 font-medium">Desa Wisata</div>
            </div>
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-200">
              <div className="text-2xl lg:text-3xl font-bold text-indigo-700 mb-2">{stats.totalTravelAgencies}</div>
              <div className="text-sm lg:text-base text-slate-600 font-medium">Biro Perjalanan</div>
            </div>
            <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl border border-rose-200">
              <div className="text-2xl lg:text-3xl font-bold text-rose-700 mb-2">{stats.totalSouvenirs}</div>
              <div className="text-sm lg:text-base text-slate-600 font-medium">Souvenir</div>
            </div>
          </div>
        </div>

        {/* Dashboard Statistics Cards */}
        <LoadingFallback>
          <StatsCards stats={stats} />
        </LoadingFallback>

        {/* Charts and Analytics */}
        <LoadingFallback>
          <ChartsSection chartData={chartData} stats={stats} />
        </LoadingFallback>

        {/* Recent Events Table */}
        <LoadingFallback>
          <RecentDataTable 
            filteredRecentData={filteredRecentData}
            allRecentData={allRecentData}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </LoadingFallback>

        {/* Quick Actions */}
        <LoadingFallback>
          <QuickActions />
        </LoadingFallback>

        {/* Enhanced System Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100">
          <h3 className="text-xl lg:text-2xl font-bold text-slate-700 mb-6">🔧 Status Sistem</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="flex items-center space-x-4 p-4 lg:p-6 bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl border border-emerald-200">
              <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
              <div>
                <span className="text-sm lg:text-base text-slate-600 font-medium">Database</span>
                <p className="text-xs text-emerald-600 font-medium">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <div>
                <span className="text-sm lg:text-base text-slate-600 font-medium">API</span>
                <p className="text-xs text-blue-600 font-medium">Berfungsi</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
              <div>
                <span className="text-sm lg:text-base text-slate-600 font-medium">Storage</span>
                <p className="text-xs text-purple-600 font-medium">Tersedia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
