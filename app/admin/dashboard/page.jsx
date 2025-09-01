'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch data from all available APIs
      const [
        eventsResponse,
        destinationsResponse,
        culinaryResponse,
        accommodationResponse,
        souvenirsResponse,
        villagesResponse,
        travelAgenciesResponse,
        usersResponse
      ] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/wisata'),
        fetch('/api/kuliner'),
        fetch('/api/penginapan'),
        fetch('/api/oleh_oleh'),
        fetch('/api/desa_wisata'),
        fetch('/api/biro_perjalanan'),
        fetch('/api/users')
      ]);

      // Parse all responses
      const eventsData = await eventsResponse.json();
      const destinationsData = await destinationsResponse.json();
      const culinaryData = await culinaryResponse.json();
      const accommodationData = await accommodationResponse.json();
      const souvenirsData = await souvenirsResponse.json();
      const villagesData = await villagesResponse.json();
      const travelAgenciesData = await travelAgenciesResponse.json();
      const usersData = await usersResponse.json();

      // Extract data arrays, handle potential errors gracefully
      const events = eventsData.success ? (eventsData.events || []) : [];
      const destinations = destinationsData.success ? (destinationsData.wisata || []) : [];
      const culinary = culinaryData.success ? (culinaryData.kuliner || []) : [];
      const accommodations = accommodationData.success ? (accommodationData.penginapan || []) : [];
      const souvenirs = souvenirsData.success ? (souvenirsData.oleh_oleh || []) : [];
      const villages = villagesData.success ? (villagesData.desa_wisata || []) : [];
      const travelAgencies = travelAgenciesData.success ? (travelAgenciesData.biro_perjalanan || []) : [];
      const users = usersData.success ? (usersData.users || []) : [];

      // Calculate statistics from actual API data
      setStats({
        totalEvents: events.length,
        totalDestinations: destinations.length,
        totalAccommodations: accommodations.length,
        totalCulinary: culinary.length,
        totalSouvenirs: souvenirs.length,
        totalVillages: villages.length,
        totalTravelAgencies: travelAgencies.length,
        totalWisataAlam: destinations.length, // Destinations are the main tourist objects
        totalUsers: users.length
      });

      // Get recent events for display
      const recent = events
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
      setRecentEvents(recent);
      setFilteredEvents(recent);

      // Collect recent data from all categories
      const allData = [];
      
      // Add events with category info
      events.slice(0, 3).forEach(event => {
        allData.push({
          ...event,
          category: 'Event',
          categoryIcon: '🎉',
          source: 'events'
        });
      });
      
      // Add destinations with category info
      destinations.slice(0, 2).forEach(dest => {
        allData.push({
          ...dest,
          category: 'Objek Wisata',
          categoryIcon: '🏔️',
          source: 'destinations'
        });
      });
      
      // Add culinary with category info
      culinary.slice(0, 2).forEach(cul => {
        allData.push({
          ...cul,
          category: 'Kuliner',
          categoryIcon: '🍽️',
          source: 'culinary'
        });
      });
      
      // Add accommodations with category info
      accommodations.slice(0, 2).forEach(acc => {
        allData.push({
          ...acc,
          category: 'Penginapan',
          categoryIcon: '🏨',
          source: 'accommodation'
        });
      });
      
      // Add souvenirs with category info
      souvenirs.slice(0, 2).forEach(sou => {
        allData.push({
          ...sou,
          category: 'Souvenir',
          categoryIcon: '🛍️',
          source: 'souvenirs'
        });
      });
      
      // Add villages with category info
      villages.slice(0, 2).forEach(vill => {
        allData.push({
          ...vill,
          category: 'Desa Wisata',
          categoryIcon: '🏘️',
          source: 'villages'
        });
      });
      
      // Add travel agencies with category info
      travelAgencies.slice(0, 2).forEach(ta => {
        allData.push({
          ...ta,
          category: 'Biro Perjalanan',
          categoryIcon: '🚌',
          source: 'travel-agencies'
        });
      });
      
      // Sort all data by creation date (if available) or use current date
      const sortedAllData = allData.sort((a, b) => {
        const dateA = getEventCreatedAt(a) ? new Date(getEventCreatedAt(a)) : new Date();
        const dateB = getEventCreatedAt(b) ? new Date(getEventCreatedAt(b)) : new Date();
        return dateB - dateA;
      }).slice(0, 5); // Show top 5 most recent items
      
      setAllRecentData(sortedAllData);
      setFilteredRecentData(sortedAllData);

      // Prepare chart data from events
      const eventTypes = {};
      const monthlyData = {};
      
      events.forEach(event => {
        // Count by type
        const normalized = (typeof event.type === 'string' && (event.type === 'objek-wisata' || event.type.startsWith('wisata-')))
          ? 'objek-wisata'
          : event.type;
        eventTypes[normalized] = (eventTypes[normalized] || 0) + 1;
        
        // Count by month
        if (event.date) {
          const date = new Date(event.date);
          const month = date.toLocaleString('id-ID', { month: 'long' });
          monthlyData[month] = (monthlyData[month] || 0) + 1;
        }
      });

      setChartData({
        eventTypes: Object.entries(eventTypes).map(([type, count]) => ({ type, count })),
        monthlyEvents: Object.entries(monthlyData).map(([month, count]) => ({ month, count }))
      });

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
      setError('Terjadi kesalahan saat mengambil data dashboard. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const getEventTypeIcon = (type) => {
    if (!type) return '📍';
    
    const icons = {
      'wisata-alam': '🏔️',
      'wisata-taman': '🌳',
      'wisata-budaya': '🏛️',
      'wisata-sejarah': '🏺',
      'wisata-buatan': '🎡',
      'wisata-minat-khusus': '🎯',
      'wisata-religi': '⛪',
      'objek-wisata': '🏔️',
      'desa-wisata': '🏘️',
      'biro-perjalanan': '🚌',
      'kuliner': '🍽️',
      'penginapan': '🏨',
      'oleh-oleh': '🛍️',
      'event': '🎉',
      'event-rakyat': '👥',
      'event-banyumas': '🎊'
    };
    return icons[type] || '📍';
  };

  const getEventTypeLabel = (type) => {
    if (!type) return 'Lainnya';
    
    const labels = {
      'wisata-alam': 'Objek Wisata',
      'wisata-taman': 'Objek Wisata',
      'wisata-budaya': 'Objek Wisata',
      'wisata-sejarah': 'Objek Wisata',
      'wisata-buatan': 'Objek Wisata',
      'wisata-minat-khusus': 'Objek Wisata',
      'wisata-religi': 'Objek Wisata',
      'objek-wisata': 'Objek Wisata',
      'desa-wisata': 'Desa Wisata',
      'biro-perjalanan': 'Biro Perjalanan',
      'kuliner': 'Kuliner',
      'penginapan': 'Penginapan',
      'oleh-oleh': 'Oleh-oleh',
      'event': 'Event',
      'event-rakyat': 'Event Rakyat',
      'event-banyumas': 'Event Banyumas'
    };
    return labels[type] || 'Lainnya';
  };

  // Prefer created/added timestamp when available for "tanggal masuk data"
  const getEventCreatedAt = (event) => {
    if (!event) return null;
    const candidate =
      event.createdAt ||
      event.created_at ||
      event.addedAt ||
      event.added_at ||
      event.dateAdded ||
      event.date_added ||
      event.timestamp ||
      event.ts;
    return candidate || event.date || null;
  };

  const statsCards = [
    {
      title: "Total Data Masuk",
      count: stats.totalEvents + stats.totalDestinations + stats.totalAccommodations + stats.totalCulinary + stats.totalSouvenirs + stats.totalVillages + stats.totalTravelAgencies,
      subtitle: "Seluruh event & destinasi",
      icon: "👁",
      color: "bg-gradient-to-r from-blue-600 to-blue-700",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Users",
      count: stats.totalUsers || 0,
      subtitle: "Pengguna terdaftar",
      icon: "👥",
      color: "bg-gradient-to-r from-purple-600 to-purple-700",
      change: "+8%",
      changeType: "positive"
    },
    {
      title: "Event",
      count: stats.totalEvents,
      subtitle: "Event & kegiatan",
      icon: "🎉",
      color: "bg-gradient-to-r from-green-600 to-green-700",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Objek Wisata",
      count: stats.totalDestinations,
      subtitle: "Objek wisata",
      icon: "🏔️",
      color: "bg-gradient-to-r from-blue-600 to-blue-700",
      change: "+8%",
      changeType: "positive"
    },
    {
      title: "Desa Wisata",
      count: stats.totalVillages,
      subtitle: "Desa wisata aktif",
      icon: "🏘️",
      color: "bg-gradient-to-r from-teal-600 to-teal-700",
      change: "+15%",
      changeType: "positive"
    },
    {
      title: "Kuliner",
      count: stats.totalCulinary,
      subtitle: "Makanan khas daerah",
      icon: "🍽️",
      color: "bg-gradient-to-r from-orange-600 to-orange-700",
      change: "+5%",
      changeType: "positive"
    },
    {
      title: "Penginapan",
      count: stats.totalAccommodations,
      subtitle: "Tempat menginap",
      icon: "🏨",
      color: "bg-gradient-to-r from-purple-600 to-purple-700",
      change: "+10%",
      changeType: "positive"
    },
    {
      title: "Biro Perjalanan",
      count: stats.totalTravelAgencies,
      subtitle: "Agen perjalanan",
      icon: "🚌",
      color: "bg-gradient-to-r from-indigo-600 to-indigo-700",
      change: "+7%",
      changeType: "positive"
    },
    {
      title: "Souvenir",
      count: stats.totalSouvenirs,
      subtitle: "Toko oleh-oleh",
      icon: "🛍️",
      color: "bg-gradient-to-r from-rose-600 to-rose-700",
      change: "+3%",
      changeType: "positive"
    }
  ];

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
                fetchDashboardData();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 space-y-8">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl transition-all duration-300 transform ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
          }`}>
            <div className="flex items-center space-x-3">
              <span className="text-xl">{notification.type === 'success' ? '✅' : '❌'}</span>
              <span className="font-medium">{notification.message}</span>
              <button 
                onClick={() => setNotification(null)}
                className="ml-4 text-white hover:text-gray-200 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold">Selamat Datang, {adminUser?.name || 'Admin'}! 👋</h1>
              <p className="text-xl text-blue-100">Kelola semua data wisata dan event dari dashboard ini</p>
              {lastUpdated && (
                <p className="text-sm text-blue-200 bg-white bg-opacity-10 px-3 py-2 rounded-lg inline-block">
                  <ClientLastUpdatedFormatter date={lastUpdated} />
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  fetchDashboardData();
                }}
                disabled={isLoading}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-white border-opacity-30"
              >
                <span className="text-xl">{isLoading ? '⏳' : '🔄'}</span>
                <span>{isLoading ? 'Memuat...' : 'Refresh Data'}</span>
              </button>
              <div className="text-center sm:text-right bg-white bg-opacity-10 px-4 py-3 rounded-xl backdrop-blur-sm">
                <p className="text-sm text-blue-200">Hari ini</p>
                <p className="text-2xl font-semibold">
                  <ClientDateDisplay />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Data</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalEvents + stats.totalDestinations + stats.totalAccommodations + stats.totalCulinary + stats.totalSouvenirs + stats.totalVillages + stats.totalTravelAgencies}</div>
              <div className="text-sm text-gray-600">Total Data Masuk</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.totalDestinations}</div>
              <div className="text-sm text-gray-600">Objek Wisata</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{stats.totalCulinary}</div>
              <div className="text-sm text-gray-600">Kuliner</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.totalAccommodations}</div>
              <div className="text-sm text-gray-600">Penginapan</div>
            </div>
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-2xl font-bold text-teal-600">{stats.totalVillages}</div>
              <div className="text-sm text-gray-600">Desa Wisata</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{stats.totalTravelAgencies}</div>
              <div className="text-sm text-gray-600">Biro Perjalanan</div>
            </div>
            <div className="text-center p-4 bg-rose-50 rounded-lg">
              <div className="text-2xl font-bold text-rose-600">{stats.totalSouvenirs}</div>
              <div className="text-sm text-gray-600">Souvenir</div>
            </div>
          </div>
        </div>

        {/* Dashboard Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((stat, index) => {
            // Define navigation paths for each card
            const getNavigationPath = (title) => {
              switch (title) {
                case "Total Data Masuk":
                  return "/admin/data";
                case "Event":
                  return "/admin/events";
                case "Objek Wisata":
                  return "/admin/destinations";
                case "Desa Wisata":
                  return "/admin/villages";
                case "Kuliner":
                  return "/admin/culinary";
                case "Penginapan":
                  return "/admin/accommodation";
                case "Biro Perjalanan":
                  return "/admin/travel-agencies";
                case "Souvenir":
                  return "/admin/souvenirs";
                case "Users":
                  return "/admin/users";
                default:
                  return "/admin/events";
              }
            };

            return (
              <Link key={index} href={getNavigationPath(stat.title)} className="block">
                <div className={`${stat.color} text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`text-3xl opacity-80 ${stat.title === "Total Data Masuk" ? "text-gray-700" : ""}`}>{stat.icon}</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      stat.changeType === 'positive' ? 'bg-blue-500 bg-opacity-20' : 'bg-red-500 bg-opacity-20'
                    }`}>
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold mb-2">{stat.count}</p>
                  <p className="text-sm opacity-90">{stat.subtitle}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event Types Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Jenis Event</h3>
            <div className="space-y-3">
              {chartData.eventTypes.length > 0 ? (
                chartData.eventTypes.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getEventTypeIcon(item.type)}</span>
                      <span className="text-gray-700">{getEventTypeLabel(item.type)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(item.count / stats.totalEvents) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📊</div>
                  <p>Tidak ada data untuk ditampilkan</p>
                </div>
              )}
            </div>
          </div>

          {/* Monthly Events Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event per Bulan</h3>
            <div className="space-y-3">
              {chartData.monthlyEvents.length > 0 ? (
                chartData.monthlyEvents.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">{item.month}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(item.count / Math.max(...chartData.monthlyEvents.map(m => m.count))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📅</div>
                  <p>Tidak ada data untuk ditampilkan</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Events Table */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Data Terbaru</h2>
                             <Link 
                 href="/admin/data" 
                 className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center space-x-1"
               >
                <span>Lihat Semua</span>
                <span>→</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Cari data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              </div>
              <span className="text-sm text-gray-500">
                {filteredRecentData.length} dari {allRecentData.length} data
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lokasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Masuk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecentData.length > 0 ? (
                  filteredRecentData.map((item) => (
                    <tr key={`${item.source}-${item.id}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            className="h-10 w-10 rounded-lg object-cover" 
                            src={item.img_sm || '/placeholder.jpg'} 
                            alt={item.title}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                            <div className="text-sm text-gray-500">{item.short_description?.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{item.categoryIcon}</span>
                          <span className="text-sm text-gray-900">{item.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <ClientEventDateFormatter date={getEventCreatedAt(item)} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.recommended 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.recommended ? 'Direkomendasikan' : 'Aktif'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : searchTerm.trim() !== '' ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-2">🔍</div>
                        <p className="text-lg font-medium">Tidak ada hasil</p>
                        <p className="text-sm">Coba ubah kata kunci pencarian</p>
                      </div>
                    </td>
                  </tr>
                ) : allRecentData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-2">📊</div>
                        <p className="text-lg font-medium">Belum ada data</p>
                        <p className="text-sm">Data akan muncul di sini setelah Anda menambahkan item</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-2">🔍</div>
                        <p className="text-lg font-medium">Tidak ada data yang cocok</p>
                        <p className="text-sm">Coba ubah kata kunci pencarian</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/events/new"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg text-center font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              aria-label="Tambah Event"
            >
              <div className="text-2xl mb-2">🎉</div>
              <div>Tambah Event</div>
            </Link>

            <Link
              href="/admin/destinations/new"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg text-center font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              aria-label="Tambah Objek Wisata"
            >
              <div className="text-2xl mb-2">🏔️</div>
              <div>Tambah Objek Wisata</div>
            </Link>

            <Link
              href="/admin/culinary/new"
              className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-4 py-3 rounded-lg text-center font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              aria-label="Tambah Kuliner"
            >
              <div className="text-2xl mb-2">🍽️</div>
              <div>Tambah Kuliner</div>
            </Link>

            <Link
              href="/admin/accommodation/new"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-3 rounded-lg text-center font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              aria-label="Tambah Penginapan"
            >
              <div className="text-2xl mb-2">🏨</div>
              <div>Tambah Penginapan</div>
            </Link>

            <Link
              href="/admin/souvenirs/new"
              className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white px-4 py-3 rounded-lg text-center font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              aria-label="Tambah Souvenir"
            >
              <div className="text-2xl mb-2">🛍️</div>
              <div>Tambah Souvenir</div>
            </Link>

            <Link
              href="/admin/travel-agencies/new"
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-4 py-3 rounded-lg text-center font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              aria-label="Tambah Biro Perjalanan"
            >
              <div className="text-2xl mb-2">🚌</div>
              <div>Tambah Biro Perjalanan</div>
            </Link>

            <Link
              href="/admin/villages/new"
              className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-4 py-3 rounded-lg text-center font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              aria-label="Tambah Desa Wisata"
            >
              <div className="text-2xl mb-2">🏘️</div>
              <div>Tambah Desa Wisata</div>
            </Link>

            <Link
              href="/admin/data"
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-3 rounded-lg text-center font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              aria-label="Kelola Data"
            >
              <div className="text-2xl mb-2">📊</div>
              <div>Kelola Data</div>
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Sistem</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Database: Online</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">API: Berfungsi</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Storage: Tersedia</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
