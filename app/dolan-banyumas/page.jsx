"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BiMap, BiSearch, BiFilter, BiGrid, BiStar, BiPhone } from "react-icons/bi";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { useTheme } from '@/context/ThemeContext';

// Loading Skeleton Component
const DestinationSkeleton = ({ viewMode }) => {
  if (viewMode === "grid") {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-200 dark:border-gray-600 shadow-lg animate-pulse">
        <div className="h-56 bg-slate-200 dark:bg-gray-700"></div>
        <div className="p-6">
          <div className="h-6 bg-slate-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-600 shadow-lg p-6 animate-pulse">
      <div className="flex gap-6">
        <div className="w-32 h-32 bg-slate-200 dark:bg-gray-700 rounded-xl flex-shrink-0"></div>
        <div className="flex-1">
          <div className="h-6 bg-slate-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded mb-3 w-2/3"></div>
          <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

const DestinationsPage = () => {
  const { isDark } = useTheme();
  const searchParams = useSearchParams();
  const [destinations, setDestinations] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("name"); // name, rating, location
  const [error, setError] = useState(null);

  // Parse features if it's a string JSON
  const parseFeatures = (features) => {
    if (!features) return [];
    if (Array.isArray(features)) {
      return features.map(feature => {
        // If feature is a string that looks like JSON array, parse it
        if (typeof feature === 'string' && feature.startsWith('[') && feature.endsWith(']')) {
          try {
            const parsed = JSON.parse(feature);
            return Array.isArray(parsed) ? parsed : [parsed];
          } catch {
            return feature;
          }
        }
        return feature;
      }).flat();
    }
    return features;
  };

  // Type-specific filter states
  const [selectedObjekWisataType, setSelectedObjekWisataType] = useState("semua");
  const [selectedKulinerType, setSelectedKulinerType] = useState("semua");
  const [selectedPenginapanType, setSelectedPenginapanType] = useState("semua");
  const [selectedOlehOlehType, setSelectedOlehOlehType] = useState("semua");
  const [selectedDesaWisataType, setSelectedDesaWisataType] = useState("semua");
  const [selectedBiroPerjalananType, setSelectedBiroPerjalananType] = useState("semua");
  const [selectedEventType, setSelectedEventType] = useState("semua");
  
  // Type-specific dropdown states
  const [isObjekWisataDropdownOpen, setIsObjekWisataDropdownOpen] = useState(false);
  const [isKulinerDropdownOpen, setIsKulinerDropdownOpen] = useState(false);
  const [isPenginapanDropdownOpen, setIsPenginapanDropdownOpen] = useState(false);
  const [isOlehOlehDropdownOpen, setIsOlehOlehDropdownOpen] = useState(false);
  const [isDesaWisataDropdownOpen, setIsDesaWisataDropdownOpen] = useState(false);
  const [isBiroPerjalananDropdownOpen, setIsBiroPerjalananDropdownOpen] = useState(false);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);

  // Type definitions for each category
  const objekWisataTypes = [
    { value: 'semua', label: 'Semua Jenis', icon: '🏔️' },
    { value: 'wisata-alam', label: 'Wisata Alam', icon: '🌲' },
    { value: 'wisata-taman', label: 'Wisata Taman', icon: '🌺' },
    { value: 'wisata-budaya', label: 'Wisata Budaya', icon: '🏛️' },
    { value: 'wisata-sejarah', label: 'Wisata Sejarah', icon: '📜' },
    { value: 'wisata-buatan', label: 'Wisata Buatan', icon: '🎡' },
    { value: 'wisata-minat-khusus', label: 'Wisata Minat Khusus', icon: '🎯' },
    { value: 'wisata-religi', label: 'Wisata Religi', icon: '⛪' }
  ];

  const kulinerTypes = [
    { value: 'semua', label: 'Semua Jenis', icon: '🍽️' },
    { value: 'cafe', label: 'Cafe', icon: '☕' },
    { value: 'resto', label: 'Resto', icon: '🍴' },
    { value: 'kedai', label: 'Kedai', icon: '🍜' },
    { value: 'rumah-makan', label: 'Rumah Makan', icon: '🍚' }
  ];

  const penginapanTypes = [
    { value: 'semua', label: 'Semua Jenis', icon: '🏨' },
    { value: 'hotel', label: 'Hotel', icon: '🏨' },
    { value: 'vila', label: 'Vila', icon: '🏡' },
    { value: 'homestay', label: 'Homestay', icon: '🏘️' }
  ];

  const olehOlehTypes = [
    { value: 'semua', label: 'Semua Jenis', icon: '🛍️' },
    { value: 'pakaian', label: 'Pakaian', icon: '👕' },
    { value: 'makanan', label: 'Makanan', icon: '🍪' }
  ];

  const desaWisataTypes = [
    { value: 'semua', label: 'Semua Jenis', icon: '🏘️' },
    { value: 'desa-wisata', label: 'Desa Wisata', icon: '🏘️' }
  ];

  const biroPerjalananTypes = [
    { value: 'semua', label: 'Semua Jenis', icon: '🚌' },
    { value: 'biro-perjalanan', label: 'Biro Perjalanan', icon: '🚌' }
  ];

  const eventTypes = [
    { value: 'semua', label: 'Semua Jenis', icon: '🎉' },
    { value: 'event-banyumas', label: 'Event Banyumas', icon: '🎊' },
    { value: 'event', label: 'Event', icon: '🎉' }
  ];

  // Reset type filters when category changes
  const resetTypeFilters = () => {
    setSelectedObjekWisataType('semua');
    setSelectedKulinerType('semua');
    setSelectedPenginapanType('semua');
    setSelectedOlehOlehType('semua');
    setSelectedDesaWisataType('semua');
    setSelectedBiroPerjalananType('semua');
    setSelectedEventType('semua');
  };

  // Handle category change
  const handleCategoryChange = (categoryTitle) => {
    setSelectedCategory(categoryTitle);
    resetTypeFilters();
  };

  // Get current selected type label
  const getCurrentTypeLabel = () => {
    switch (selectedCategory) {
      case 'Objek Wisata':
        return objekWisataTypes.find(t => t.value === selectedObjekWisataType)?.label || 'Semua Jenis';
      case 'Kuliner':
        return kulinerTypes.find(t => t.value === selectedKulinerType)?.label || 'Semua Jenis';
      case 'Penginapan':
        return penginapanTypes.find(t => t.value === selectedPenginapanType)?.label || 'Semua Jenis';
      case 'Oleh-Oleh':
        return olehOlehTypes.find(t => t.value === selectedOlehOlehType)?.label || 'Semua Jenis';
      case 'Desa Wisata':
        return desaWisataTypes.find(t => t.value === selectedDesaWisataType)?.label || 'Semua Jenis';
      case 'Biro Perjalanan':
        return biroPerjalananTypes.find(t => t.value === selectedBiroPerjalananType)?.label || 'Semua Jenis';
      case 'Events & Acara':
        return eventTypes.find(t => t.value === selectedEventType)?.label || 'Semua Jenis';
      default:
        return 'Semua Jenis';
    }
  };

  // Handle URL parameters for category filtering
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      // Map URL parameter to category title
      const categoryMap = {
        'biro-perjalanan': 'Biro Perjalanan',
        'desa-wisata': 'Desa Wisata',
        'kuliner': 'Kuliner',
        'wisata': 'Objek Wisata',
        'oleh-oleh': 'Oleh-Oleh',
        'penginapan': 'Penginapan'
      };
      
      const categoryTitle = categoryMap[categoryParam];
      if (categoryTitle) {
        setSelectedCategory(categoryTitle);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/api/destinations");
        if (!res.ok) throw new Error("Failed to fetch destinations");
        const data = await res.json();
        setDestinations(data.destinations || {});
        
        // Flatten all data for initial display
        const allData = Object.keys(data.destinations || {}).flatMap(key => {
          const items = data.destinations[key].data || [];
          return items.map(item => ({
            ...item,
            category: key,
            categoryTitle: data.destinations[key].title
          }));
        });
        setFilteredData(allData);
      } catch (error) {
        console.error("Error fetching destinations:", error);
        setError("Gagal memuat data destinasi. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  useEffect(() => {
    // Filter data based on selected category and search term
    let filtered = Object.keys(destinations).flatMap(key => {
      const items = destinations[key]?.data || [];
      return items.map(item => ({
        ...item,
        category: key,
        categoryTitle: destinations[key].title
      }));
    });

    // Filter by category
    if (selectedCategory !== "Semua") {
      const categoryKey = Object.keys(destinations).find(key => 
        destinations[key].title === selectedCategory
      );
      if (categoryKey) {
        filtered = (destinations[categoryKey]?.data || []).map(item => ({
          ...item,
          category: categoryKey,
          categoryTitle: destinations[categoryKey].title
        }));
      }
    }

    // Filter berdasarkan tipe spesifik kategori
    if (selectedCategory === 'Objek Wisata' && selectedObjekWisataType !== 'semua') {
      filtered = filtered.filter(item => item.type === selectedObjekWisataType);
    }
    if (selectedCategory === 'Kuliner' && selectedKulinerType !== 'semua') {
      filtered = filtered.filter(item => item.type === selectedKulinerType);
    }
    if (selectedCategory === 'Penginapan' && selectedPenginapanType !== 'semua') {
      filtered = filtered.filter(item => item.type === selectedPenginapanType);
    }
    if (selectedCategory === 'Oleh-Oleh' && selectedOlehOlehType !== 'semua') {
      filtered = filtered.filter(item => item.type === selectedOlehOlehType);
    }
    if (selectedCategory === 'Desa Wisata' && selectedDesaWisataType !== 'semua') {
      filtered = filtered.filter(item => item.type === selectedDesaWisataType);
    }
    if (selectedCategory === 'Biro Perjalanan' && selectedBiroPerjalananType !== 'semua') {
      filtered = filtered.filter(item => item.type === selectedBiroPerjalananType);
    }
    if (selectedCategory === 'Events & Acara' && selectedEventType !== 'semua') {
      filtered = filtered.filter(item => item.type === selectedEventType);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(item =>
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.short_description && item.short_description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.title || '').localeCompare(b.title || '');
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "location":
          return (a.location || '').localeCompare(b.location || '');
        default:
          return 0;
      }
    });

    setFilteredData(filtered);
  }, [destinations, selectedCategory, selectedObjekWisataType, selectedKulinerType, selectedPenginapanType, selectedOlehOlehType, selectedDesaWisataType, selectedBiroPerjalananType, selectedEventType, searchTerm, sortBy]);

  const getCategoryColor = (category) => {
    const colors = {
      "Objek Wisata": "bg-gradient-to-r from-blue-500 to-blue-600",
      "Kuliner": "bg-gradient-to-r from-orange-500 to-orange-600",
      "Penginapan": "bg-gradient-to-r from-green-500 to-green-600",
      "Oleh-Oleh": "bg-gradient-to-r from-purple-500 to-purple-600",
      "Desa Wisata": "bg-gradient-to-r from-teal-500 to-teal-600",
      "Biro Perjalanan": "bg-gradient-to-r from-indigo-500 to-indigo-600",
      "Events & Acara": "bg-gradient-to-r from-red-500 to-red-600"
    };
    return colors[category] || "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Objek Wisata": "🏞️",
      "Kuliner": "🍽️",
      "Penginapan": "🏨",
      "Oleh-Oleh": "🛍️",
      "Desa Wisata": "🏘️",
      "Biro Perjalanan": "🚗",
      "Events & Acara": "🎉"
    };
    return icons[category] || "📍";
  };

  const getCategoryAccent = (category) => {
    const accents = {
      "Objek Wisata": "from-blue-500 to-indigo-500",
      "Kuliner": "from-orange-500 to-red-500",
      "Penginapan": "from-violet-500 to-purple-600",
      "Oleh-Oleh": "from-rose-500 to-pink-600",
      "Desa Wisata": "from-teal-500 to-emerald-600",
      "Biro Perjalanan": "from-indigo-500 to-blue-600",
      "Events & Acara": "from-green-500 to-emerald-600",
    };
    return accents[category] || "from-slate-500 to-slate-600";
  };

  const getRoutePath = (item) => {
    if (item.category === "events") return `/dolan-banyumas/event/${item.id}`;
    
    const categoryMap = {
      "wisata": "wisata",
      "kuliner": "kuliner", 
      "penginapan": "penginapan",
      "oleh_oleh": "oleh_oleh",
      "desa_wisata": "desa_wisata",
      "biro_perjalanan": "biro_perjalanan"
    };
    
    const mappedCategory = categoryMap[item.category];
    return mappedCategory ? `/dolan-banyumas/${mappedCategory}/${item.id}` : `/dolan-banyumas/wisata/${item.id}`;
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-32">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Terjadi Kesalahan</h3>
              <p className="text-slate-600 dark:text-gray-300 text-lg mb-6">{error}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-32">
        <div className="container mx-auto px-4">
          {/* Hero Section Skeleton */}
          <div className="text-center mb-16">
            <div className="h-8 bg-slate-200 dark:bg-gray-700 rounded w-64 mx-auto mb-6 animate-pulse"></div>
            <div className="h-16 bg-slate-200 dark:bg-gray-700 rounded w-96 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-slate-200 dark:bg-gray-700 rounded w-2xl mx-auto animate-pulse"></div>
          </div>

          {/* Search Section Skeleton */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 mb-12 border border-slate-200 dark:border-gray-600 shadow-lg">
            <div className="h-16 bg-slate-200 dark:bg-gray-700 rounded-2xl w-full max-w-2xl mx-auto mb-8 animate-pulse"></div>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-slate-200 dark:bg-gray-700 rounded-full w-24 animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <DestinationSkeleton key={i} viewMode="grid" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${isDark ? 'from-blue-900/30 via-blue-800/30 via-blue-700/30 via-blue-600/30 to-blue-500/30' : 'from-blue-100 via-blue-200 via-blue-300 via-blue-400 to-blue-500'} pt-32 relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute top-20 left-20 w-40 h-40 ${isDark ? 'bg-blue-300/30' : 'bg-blue-300/30'} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute top-40 right-32 w-32 h-32 ${isDark ? 'bg-blue-400/30' : 'bg-blue-400/30'} rounded-full blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute bottom-20 left-1/3 w-36 h-36 ${isDark ? 'bg-blue-500/30' : 'bg-blue-500/30'} rounded-full blur-3xl animate-pulse delay-2000`}></div>
        <div className={`absolute top-1/2 left-10 w-24 h-24 ${isDark ? 'bg-blue-600/30' : 'bg-blue-600/30'} rounded-full blur-3xl animate-pulse delay-1500`}></div>
        <div className={`absolute top-1/3 right-10 w-28 h-28 ${isDark ? 'bg-blue-700/30' : 'bg-blue-700/30'} rounded-full blur-3xl animate-pulse delay-500`}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section - Colorful & Beautiful */}
        <div className="text-center mb-20">
          <div className="mb-10">
                        <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-400 via-blue-500 via-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent text-2xl md:text-3xl font-black mb-8 animate-bounce">
              <span className="text-4xl">🌟</span>
              <span>JELAJAHI KEINDAHAN</span>
              <span className="text-4xl">✨</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-500 via-blue-600 via-blue-700 via-blue-800 to-blue-900 bg-clip-text text-transparent">
              KABUPATEN
            </span>
            <br />
            <span className="text-slate-800 dark:text-white relative">
              BANYUMAS
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-40 h-3 bg-gradient-to-r from-blue-400 via-blue-500 via-blue-600 via-blue-700 to-blue-800 rounded-full shadow-2xl"></div>
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10 font-medium">
            Temukan berbagai destinasi menarik, kuliner lezat, dan pengalaman wisata yang tak terlupakan 
            di jantung Jawa Tengah yang memukau
          </p>
          
          {/* Blue category indicators */}
                      <div className="flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-gray-400">
            <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 px-6 py-3 rounded-full border-2 border-emerald-200 dark:border-emerald-600 shadow-lg">
              <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="font-bold text-emerald-600 dark:text-emerald-300">Wisata Alam</span>
            </div>
            <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 px-6 py-3 rounded-full border-2 border-amber-200 dark:border-amber-600 shadow-lg">
              <div className="w-4 h-4 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="font-bold text-amber-600 dark:text-amber-300">Kuliner Tradisional</span>
            </div>
            <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 px-6 py-3 rounded-full border-2 border-sky-200 dark:border-sky-600 shadow-lg">
              <div className="w-4 h-4 bg-sky-400 rounded-full animate-pulse"></div>
              <span className="font-bold text-sky-600 dark:text-sky-300">Budaya Lokal</span>
            </div>
          </div>
        </div>

        {/* Search and Filters Section - Colorful & Beautiful */}
        <div className={`bg-gradient-to-br ${isDark ? 'from-gray-800/95 via-blue-900/20 via-blue-800/20 via-blue-700/20 via-blue-600/20 to-blue-500/20' : 'from-white/95 via-blue-50/50 via-blue-100/50 via-blue-200/50 via-blue-300/50 to-blue-400/50'} backdrop-blur-xl rounded-3xl p-12 mb-20 border-2 ${isDark ? 'border-blue-600/50' : 'border-blue-200/50'} shadow-2xl shadow-blue-500/20 relative overflow-hidden`}>
          {/* Background pattern */}
          <div className="absolute inset-0 -z-10 opacity-20">
            <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,${isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.3)'}_1px,transparent_0)] bg-[length:25px_25px]`}></div>
            <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,${isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.3)'}_1px,transparent_0)] bg-[length:35px_35px]`}></div>
            <div className={`absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,${isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.3)'}_1px,transparent_0)] bg-[length:45px_45px]`}></div>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative group">
                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 via-blue-700 via-blue-800 to-blue-900 rounded-3xl blur-xl ${isDark ? 'opacity-30 group-hover:opacity-50' : 'opacity-40 group-hover:opacity-60'} transition-opacity duration-500`}></div>
              <div className="relative">
                <BiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-400 text-2xl z-10" />
                <input
                  type="text"
                  placeholder="🔍 Cari destinasi, lokasi, atau deskripsi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-16 pr-8 py-6 ${isDark ? 'bg-gray-700/95 border-blue-600 text-white placeholder-gray-400' : 'bg-white/95 border-blue-200 text-slate-700 placeholder-slate-400'} border-2 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 text-xl font-medium shadow-xl transition-all duration-300`}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className={`px-4 py-2 ${isDark ? 'bg-gradient-to-r from-blue-900/50 to-blue-800/50 text-blue-300 border-blue-700' : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-blue-200'} text-xs font-bold rounded-full border-2 shadow-lg`}>
                    Enter ↵
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filters - Colorful & Beautiful */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <button
              onClick={() => handleCategoryChange("Semua")}
              className={`px-8 py-4 rounded-2xl text-base font-bold transition-all duration-500 transform hover:scale-110 ${
                selectedCategory === "Semua"
                  ? "bg-gradient-to-r from-teal-500 via-teal-600 via-teal-700 via-teal-800 to-teal-900 text-white shadow-2xl shadow-teal-500/40 ring-4 ring-teal-500/20"
                  : `${isDark ? 'bg-gray-700/95 text-white hover:bg-gray-600 border-teal-600' : 'bg-white/95 text-slate-700 hover:bg-white border-teal-200'} hover:shadow-xl border-2 shadow-lg backdrop-blur-sm`
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${selectedCategory === "Semua" ? 'text-white' : 'text-teal-500'}`}>🌟</span>
                <span>Semua</span>
              </div>
            </button>
            {Object.values(destinations).map((category, index) => {
              const colors = [
                'from-green-500 to-green-600',
                'from-orange-500 to-orange-600',
                'from-purple-500 to-purple-600',
                'from-pink-500 to-pink-600',
                'from-yellow-500 to-yellow-600',
                'from-red-500 to-red-600',
                'from-indigo-500 to-indigo-600'
              ];
              const borderColors = [
                isDark ? 'border-green-600' : 'border-green-200',
                isDark ? 'border-orange-600' : 'border-orange-200',
                isDark ? 'border-purple-600' : 'border-purple-200',
                isDark ? 'border-pink-600' : 'border-pink-200',
                isDark ? 'border-yellow-600' : 'border-yellow-200',
                isDark ? 'border-red-600' : 'border-red-200',
                isDark ? 'border-indigo-600' : 'border-indigo-200'
              ];
              const iconColors = [
                'text-green-500',
                'text-orange-500',
                'text-purple-500',
                'text-pink-500',
                'text-yellow-500',
                'text-red-500',
                'text-indigo-500'
              ];
              const color = colors[index % colors.length];
              const borderColor = borderColors[index % borderColors.length];
              const iconColor = iconColors[index % iconColors.length];
              return (
              <button
                key={category.title}
                onClick={() => handleCategoryChange(category.title)}
                  className={`px-8 py-4 rounded-2xl text-base font-bold transition-all duration-500 flex items-center gap-3 transform hover:scale-110 ${
                  selectedCategory === category.title
                      ? `bg-gradient-to-r ${color} text-white shadow-2xl shadow-${color.split('-')[1]}-500/40 ring-4 ring-${color.split('-')[1]}-500/20`
                      : `${isDark ? 'bg-gray-700/95 text-white hover:bg-gray-600' : 'bg-white/95 text-slate-700 hover:bg-white'} hover:shadow-xl border-2 ${borderColor} shadow-lg backdrop-blur-sm`
                }`}
              >
                  <span className={`text-2xl ${selectedCategory === category.title ? 'text-white' : iconColor}`}>{getCategoryIcon(category.title)}</span>
                  <span>{category.title}</span>
              </button>
              );
            })}
          </div>

          {/* Type-Specific Filter Dropdowns */}
          {selectedCategory !== "Semua" && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-white flex items-center gap-2">
                  <BiFilter className="text-xl" />
                  Filter Tipe {selectedCategory}
                </h3>
                <button
                  onClick={resetTypeFilters}
                  className="px-4 py-2 text-sm text-slate-400 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white border border-slate-200 dark:border-gray-600 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-700 transition-all duration-200 flex items-center gap-2"
                >
                  <span>✕</span>
                  Clear Filters
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                
                {/* Objek Wisata Type Filter */}
                {selectedCategory === 'Objek Wisata' && (
                  <div className="relative">
                    <button
                      onClick={() => setIsObjekWisataDropdownOpen(!isObjekWisataDropdownOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 bg-white/90 dark:bg-gray-800/90 border border-slate-200 dark:border-gray-600 rounded-xl text-slate-700 dark:text-white cursor-pointer transition-all duration-300 hover:bg-white dark:hover:bg-gray-700 hover:border-slate-300 dark:hover:border-gray-500 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🏔️</span>
                        <span className="font-medium text-sm">{getCurrentTypeLabel()}</span>
                      </div>
                      <svg className={`w-5 h-5 text-slate-500 dark:text-gray-300 transition-transform duration-300 ${isObjekWisataDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-600 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out ${
                      isObjekWisataDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}>
                      <div className="py-2 max-h-60 overflow-y-auto">
                        {objekWisataTypes.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => {
                              setSelectedObjekWisataType(type.value);
                              setIsObjekWisataDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center gap-3 ${
                              selectedObjekWisataType === type.value ? 'bg-blue-50 dark:bg-blue-900/70 text-blue-700 dark:text-blue-200 border-r-4 border-blue-500' : 'text-slate-700 dark:text-gray-100 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span className="font-medium text-sm flex-1">{type.label}</span>
                            {selectedObjekWisataType === type.value && (
                              <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Kuliner Type Filter */}
                {selectedCategory === 'Kuliner' && (
                  <div className="relative">
                    <button
                      onClick={() => setIsKulinerDropdownOpen(!isKulinerDropdownOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 bg-white/90 dark:bg-gray-800/90 border border-slate-200 dark:border-gray-600 rounded-xl text-slate-700 dark:text-white cursor-pointer transition-all duration-300 hover:bg-white dark:hover:bg-gray-700 hover:border-slate-300 dark:hover:border-gray-500 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🍽️</span>
                        <span className="font-medium text-sm">{getCurrentTypeLabel()}</span>
                      </div>
                      <svg className={`w-5 h-5 text-slate-500 dark:text-gray-300 transition-transform duration-300 ${isKulinerDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-600 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out ${
                      isKulinerDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}>
                      <div className="py-2 max-h-60 overflow-y-auto">
                        {kulinerTypes.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => {
                              setSelectedKulinerType(type.value);
                              setIsKulinerDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center gap-3 ${
                              selectedKulinerType === type.value ? 'bg-blue-50 dark:bg-blue-900/70 text-blue-700 dark:text-blue-200 border-r-4 border-blue-500' : 'text-slate-700 dark:text-gray-100 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span className="font-medium text-sm flex-1">{type.label}</span>
                            {selectedKulinerType === type.value && (
                              <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Penginapan Type Filter */}
                {selectedCategory === 'Penginapan' && (
                  <div className="relative">
                    <button
                      onClick={() => setIsPenginapanDropdownOpen(!isPenginapanDropdownOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 bg-white/90 dark:bg-gray-800/90 border border-slate-200 dark:border-gray-600 rounded-xl text-slate-700 dark:text-white cursor-pointer transition-all duration-300 hover:bg-white dark:hover:bg-gray-700 hover:border-slate-300 dark:hover:border-gray-500 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🏨</span>
                        <span className="font-medium text-sm">{getCurrentTypeLabel()}</span>
                      </div>
                      <svg className={`w-5 h-5 text-slate-500 dark:text-gray-300 transition-transform duration-300 ${isPenginapanDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-600 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out ${
                      isPenginapanDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}>
                      <div className="py-2 max-h-60 overflow-y-auto">
                        {penginapanTypes.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => {
                              setSelectedPenginapanType(type.value);
                              setIsPenginapanDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center gap-3 ${
                              selectedPenginapanType === type.value ? 'bg-blue-50 dark:bg-blue-900/70 text-blue-700 dark:text-blue-200 border-r-4 border-blue-500' : 'text-slate-700 dark:text-gray-100 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span className="font-medium text-sm flex-1">{type.label}</span>
                            {selectedPenginapanType === type.value && (
                              <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Oleh-Oleh Type Filter */}
                {selectedCategory === 'Oleh-Oleh' && (
                  <div className="relative">
                    <button
                      onClick={() => setIsOlehOlehDropdownOpen(!isOlehOlehDropdownOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 bg-white/90 dark:bg-gray-800/90 border border-slate-200 dark:border-gray-600 rounded-xl text-slate-700 dark:text-white cursor-pointer transition-all duration-300 hover:bg-white dark:hover:bg-gray-700 hover:border-slate-300 dark:hover:border-gray-500 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🛍️</span>
                        <span className="font-medium text-sm">{getCurrentTypeLabel()}</span>
                      </div>
                      <svg className={`w-5 h-5 text-slate-500 dark:text-gray-300 transition-transform duration-300 ${isOlehOlehDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-600 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out ${
                      isOlehOlehDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}>
                      <div className="py-2 max-h-60 overflow-y-auto">
                        {olehOlehTypes.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => {
                              setSelectedOlehOlehType(type.value);
                              setIsOlehOlehDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center gap-3 ${
                              selectedOlehOlehType === type.value ? 'bg-blue-50 dark:bg-blue-900/70 text-blue-700 dark:text-blue-200 border-r-4 border-blue-500' : 'text-slate-700 dark:text-gray-100 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span className="font-medium text-sm flex-1">{type.label}</span>
                            {selectedOlehOlehType === type.value && (
                              <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Desa Wisata Type Filter */}
                {selectedCategory === 'Desa Wisata' && (
                  <div className="relative">
                    <button
                      onClick={() => setIsDesaWisataDropdownOpen(!isDesaWisataDropdownOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 bg-white/90 dark:bg-gray-800/90 border border-slate-200 dark:border-gray-600 rounded-xl text-slate-700 dark:text-white cursor-pointer transition-all duration-300 hover:bg-white dark:hover:bg-gray-700 hover:border-slate-300 dark:hover:border-gray-500 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🏘️</span>
                        <span className="font-medium text-sm">{getCurrentTypeLabel()}</span>
                      </div>
                      <svg className={`w-5 h-5 text-slate-500 dark:text-gray-300 transition-transform duration-300 ${isDesaWisataDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-600 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out ${
                      isDesaWisataDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}>
                      <div className="py-2 max-h-60 overflow-y-auto">
                        {desaWisataTypes.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => {
                              setSelectedDesaWisataType(type.value);
                              setIsDesaWisataDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center gap-3 ${
                              selectedDesaWisataType === type.value ? 'bg-blue-50 dark:bg-blue-900/70 text-blue-700 dark:text-blue-200 border-r-4 border-blue-500' : 'text-slate-700 dark:text-gray-100 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span className="font-medium text-sm flex-1">{type.label}</span>
                            {selectedDesaWisataType === type.value && (
                              <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Biro Perjalanan Type Filter */}
                {selectedCategory === 'Biro Perjalanan' && (
                  <div className="relative">
                    <button
                      onClick={() => setIsBiroPerjalananDropdownOpen(!isBiroPerjalananDropdownOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 bg-white/90 dark:bg-gray-800/90 border border-slate-200 dark:border-gray-600 rounded-xl text-slate-700 dark:text-white cursor-pointer transition-all duration-300 hover:bg-white dark:hover:bg-gray-700 hover:border-slate-300 dark:hover:border-gray-500 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🚌</span>
                        <span className="font-medium text-sm">{getCurrentTypeLabel()}</span>
                      </div>
                      <svg className={`w-5 h-5 text-slate-500 dark:text-gray-300 transition-transform duration-300 ${isBiroPerjalananDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-600 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out ${
                      isBiroPerjalananDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}>
                      <div className="py-2 max-h-60 overflow-y-auto">
                        {biroPerjalananTypes.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => {
                              setSelectedBiroPerjalananType(type.value);
                              setIsBiroPerjalananDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center gap-3 ${
                              selectedBiroPerjalananType === type.value ? 'bg-blue-50 dark:bg-blue-900/70 text-blue-700 dark:text-blue-200 border-r-4 border-blue-500' : 'text-slate-700 dark:text-gray-100 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span className="font-medium text-sm flex-1">{type.label}</span>
                            {selectedBiroPerjalananType === type.value && (
                              <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Type Filter */}
                {selectedCategory === 'Events & Acara' && (
                  <div className="relative">
                    <button
                      onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
                      className="flex items-center justify-between w-full px-4 py-3 bg-white/90 dark:bg-gray-800/90 border border-slate-200 dark:border-gray-600 rounded-xl text-slate-700 dark:text-white cursor-pointer transition-all duration-300 hover:bg-white dark:hover:bg-gray-700 hover:border-slate-300 dark:hover:border-gray-500 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🎉</span>
                        <span className="font-medium text-sm">{getCurrentTypeLabel()}</span>
                      </div>
                      <svg className={`w-5 h-5 text-slate-500 dark:text-gray-300 transition-transform duration-300 ${isEventDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-600 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out ${
                      isEventDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}>
                      <div className="py-2 max-h-60 overflow-y-auto">
                        {eventTypes.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => {
                              setSelectedEventType(type.value);
                              setIsEventDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center gap-3 ${
                              selectedEventType === type.value ? 'bg-blue-50 dark:bg-blue-900/70 text-blue-700 dark:text-blue-200 border-r-4 border-blue-500' : 'text-slate-700 dark:text-gray-100 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span className="font-medium text-sm flex-1">{type.label}</span>
                            {selectedEventType === type.value && (
                              <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
              
              {/* Backdrop for all type-specific dropdowns */}
              {(isObjekWisataDropdownOpen || isKulinerDropdownOpen || isPenginapanDropdownOpen || 
                isOlehOlehDropdownOpen || isDesaWisataDropdownOpen || isBiroPerjalananDropdownOpen || 
                isEventDropdownOpen) && (
                <div 
                  className="fixed inset-0 z-40 transition-opacity duration-300 opacity-100 pointer-events-auto"
                  onClick={() => {
                    setIsObjekWisataDropdownOpen(false);
                    setIsKulinerDropdownOpen(false);
                    setIsPenginapanDropdownOpen(false);
                    setIsOlehOlehDropdownOpen(false);
                    setIsDesaWisataDropdownOpen(false);
                    setIsBiroPerjalananDropdownOpen(false);
                    setIsEventDropdownOpen(false);
                  }}
                />
              )}
            </div>
          )}

          {/* View Mode and Sort Options */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className={`${isDark ? 'text-white' : 'text-slate-700'} font-medium`}>Tampilan:</span>
              <div className={`flex ${isDark ? 'bg-gray-700/80 border-gray-600' : 'bg-white/80 border-slate-200'} backdrop-blur-sm rounded-xl p-1 border shadow-sm`}>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white shadow-sm"
                      : `${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-600' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`
                  }`}
                  title="Grid View"
                >
                  <BiGrid className="text-xl" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white shadow-sm"
                      : `${isDark ? 'text-gray-300 hover:text-white hover:bg-gray-600' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'}`
                  }`}
                  title="List View"
                >
                  <AiOutlineUnorderedList className="text-xl" />
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <BiFilter className={`${isDark ? 'text-gray-400' : 'text-slate-600'}`} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`${isDark ? 'bg-gray-700/90 border-gray-600 text-white' : 'bg-white/90 border-slate-200 text-slate-700'} border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm`}
              >
                <option value="name" className={`${isDark ? 'bg-gray-700 text-white' : 'bg-white text-slate-700'}`}>Urutkan: Nama</option>
                <option value="rating" className={`${isDark ? 'bg-gray-700 text-white' : 'bg-white text-slate-700'}`}>Urutkan: Rating</option>
                <option value="location" className={`${isDark ? 'bg-gray-700 text-white' : 'bg-white text-slate-700'}`}>Urutkan: Lokasi</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center mb-12">
            <div className={`inline-block ${isDark ? 'bg-gray-800/80 border-gray-600' : 'bg-white/80 border-slate-200'} backdrop-blur-sm rounded-full px-8 py-4 border shadow-lg`}>
              <p className={`${isDark ? 'text-white' : 'text-slate-700'} text-lg`}>
                <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'} font-semibold`}>{filteredData.length}</span> destinasi ditemukan
                {selectedCategory !== "Semua" && (
                  <span className={`${isDark ? 'text-blue-400' : 'text-blue-600'}`}> dalam kategori {selectedCategory}</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Summary cards - Colorful & Beautiful */}
        {selectedCategory === "Semua" && (
          <div className="mb-20">
            {(() => {
              const counts = {
                wisata: (destinations.wisata?.data || []).length,
                kuliner: (destinations.kuliner?.data || []).length,
                penginapan: (destinations.penginapan?.data || []).length,
                oleh_oleh: (destinations.oleh_oleh?.data || []).length,
                desa_wisata: (destinations.desa_wisata?.data || []).length,
                biro_perjalanan: (destinations.biro_perjalanan?.data || []).length,
                events: (destinations.events?.data || []).length,
              };
              const order = [
                { key: "wisata", title: "Objek Wisata", color: "from-green-500 to-green-600", bgColor: "from-green-100 to-green-200" },
                { key: "kuliner", title: "Kuliner", color: "from-orange-500 to-orange-600", bgColor: "from-orange-100 to-orange-200" },
                { key: "penginapan", title: "Penginapan", color: "from-purple-500 to-purple-600", bgColor: "from-purple-100 to-purple-200" },
                { key: "oleh_oleh", title: "Oleh-Oleh", color: "from-pink-500 to-pink-600", bgColor: "from-pink-100 to-pink-200" },
                { key: "desa_wisata", title: "Desa Wisata", color: "from-yellow-500 to-yellow-600", bgColor: "from-yellow-100 to-yellow-200" },
                { key: "biro_perjalanan", title: "Biro Perjalanan", color: "from-red-500 to-red-600", bgColor: "from-red-100 to-red-200" },
                { key: "events", title: "Events & Acara", color: "from-indigo-500 to-indigo-600", bgColor: "from-indigo-100 to-indigo-200" },
              ];
              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                  {order.map((c) => (
                    <div key={c.key} className="relative rounded-2xl overflow-hidden border-2 border-blue-200/50 dark:border-blue-600/20 bg-gradient-to-br from-white/95 via-white/80 to-white/70 dark:from-gray-800/95 dark:via-gray-700/80 dark:to-gray-600/70 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group min-h-[140px]">
                      <div className={`absolute left-0 top-0 h-full w-2 bg-gradient-to-b ${c.color}`} />
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-slate-700 dark:text-gray-200 text-xs font-bold leading-tight">{c.title}</div>
                          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${c.bgColor} border border-blue-200/50 dark:border-blue-600/30 flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                            {getCategoryIcon(c.title)}
                          </div>
                        </div>
                        <div className={`text-3xl font-black bg-gradient-to-r ${c.color} bg-clip-text text-transparent mb-1`}>{counts[c.key]}</div>
                        <div className="text-xs text-slate-500 dark:text-gray-400 font-medium uppercase tracking-wide">Destinasi</div>
                      </div>
                      {/* Hover effect overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${c.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* Featured section - Colorful & Beautiful */}
        {selectedCategory === "Semua" && filteredData.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-3 h-12 bg-gradient-to-b from-blue-500 via-blue-600 via-blue-700 via-blue-800 to-blue-900 rounded-full shadow-2xl"></div>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white">🌟 Sorotan Destinasi</h3>
            </div>
              <div className="text-sm text-slate-500 dark:text-gray-400 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 px-6 py-3 rounded-full border-2 border-blue-200 dark:border-blue-700 shadow-lg font-semibold">Menampilkan 8 teratas</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredData.slice(0, 8).map((item, index) => {
                const colors = [
                  'from-green-500 to-green-600',
                  'from-orange-500 to-orange-600',
                  'from-purple-500 to-purple-600',
                  'from-pink-500 to-pink-600',
                  'from-yellow-500 to-yellow-600',
                  'from-red-500 to-red-600',
                  'from-indigo-500 to-indigo-600',
                  'from-teal-500 to-teal-600'
                ];
                const color = colors[index % colors.length];
                return (
                <Link
                  key={`featured-${item.category}-${item.id}-${index}`}
                  href={getRoutePath(item)}
                                          className="group block bg-gradient-to-br from-white/95 via-white/80 to-white/70 dark:from-gray-800/95 dark:via-gray-700/80 dark:to-gray-600/70 rounded-3xl overflow-hidden border-2 border-blue-200/50 dark:border-blue-600/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:-translate-y-3 transform"
                >
                    <div className="relative h-52 overflow-hidden">
                    <img
                      src={item.img_sm || item.img_lg || "/placeholder.jpg"}
                      alt={item.title}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                      <div className={`absolute top-4 left-4 bg-gradient-to-r ${color} text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl border-2 border-white/20`}>{item.categoryTitle}</div>
                      {item.rating && (
                        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border border-white/20">
                          <BiStar className="text-yellow-400" />
                          {item.rating}
                  </div>
                      )}
                  </div>
                    <div className="p-6">
                                              <h4 className="font-black text-slate-800 dark:text-white line-clamp-2 mb-3 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{item.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-gray-300 line-clamp-2 mb-4 leading-relaxed">{item.short_description || item.description || "Deskripsi tidak tersedia"}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400 bg-white/80 dark:bg-gray-700/80 px-3 py-1.5 rounded-full border border-slate-200 dark:border-gray-600">
                                                      <BiMap className="text-blue-500" />
                          <span className="truncate max-w-[8rem] font-medium">{item.location}</span>
                        </div>
                                                    <span className="text-blue-600 dark:text-blue-400 text-sm font-bold group-hover:underline">Lihat detail →</span>
                      </div>
                    </div>
                    {/* Hover effect overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl`}></div>
                </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Destinations Display */}
        {filteredData.length > 0 ? (
          <div className={`${
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
              : "space-y-6"
          } mb-16`}>
            {filteredData.map((item, index) => (
              <Link
                key={`${item.category}-${item.id}-${index}`}
                href={getRoutePath(item)}
                className="group block"
              >
                {viewMode === "grid" ? (
                  // Grid View Card (enhanced)
                  <div className={`relative ${isDark ? 'bg-gray-800/90 hover:bg-gray-700 border-blue-600 hover:border-blue-500' : 'bg-white/90 hover:bg-white border-blue-200 hover:border-blue-300'} backdrop-blur-sm transition-all duration-300 rounded-3xl overflow-hidden border hover:shadow-2xl hover:shadow-blue-500/20 group-hover:scale-[1.02] shadow-lg transform hover:-translate-y-1`}>
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={item.img_sm || item.img_lg || "/placeholder.jpg"}
                        alt={item.title}
                        className="object-cover group-hover:scale-110 transition-transform duration-500 w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                      {/* Category Badge */}
                      <div className={`absolute top-4 left-4 z-10 ${getCategoryColor(item.categoryTitle)} text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg`}>
                        {item.categoryTitle}
                      </div>
                      {/* Rating Badge */}
                      {item.rating && (
                        <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <BiStar className="text-yellow-400" />
                          {item.rating}
                        </div>
                      )}
                      {/* Bottom overlay title + meta */}
                      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 text-white">
                        <h3 className="font-bold text-lg line-clamp-1">{item.title}</h3>
                        <div className="flex items-center text-xs opacity-95 mt-1">
                          <div className="flex items-center gap-1">
                            <BiMap className="text-blue-300" />
                            <span className="truncate max-w-[12rem]">{item.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-5">
                      {/* Price/Category Bubbles - moved above description */}
                      <div className="mb-3">
                        {item.entrance_fee ? (
                          <div className="text-sm font-medium" style={{ color: '#3a62e3' }}>{item.entrance_fee}</div>
                        ) : item.price_range ? (
                          <div className="text-sm font-medium" style={{ color: '#3a62e3' }}>{item.price_range}</div>
                        ) : item.type ? (
                          <div className="text-sm font-medium capitalize" style={{ color: '#3a62e3' }}>{item.type}</div>
                        ) : null}
                      </div>
                      <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm mb-3 line-clamp-2 leading-relaxed`}>
                        {item.short_description || item.description || "Deskripsi tidak tersedia"}
                      </p>
                      {(() => {
                        const parsedFeatures = parseFeatures(item.features);
                        return parsedFeatures && parsedFeatures.length > 0 && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                              {parsedFeatures.slice(0, 3).map((feature, index) => (
                                <span
                                  key={index}
                                  className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-xs`}
                                >
                                  {feature}
                                </span>
                              ))}
                              {parsedFeatures.length > 3 && (
                                <span className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-xs`}>
                                  +{parsedFeatures.length - 3} lagi
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                      <div className="flex items-center justify-end">
                        <span className="text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:underline">Lihat detail →</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View Card
                  <div className={`${isDark ? 'bg-gray-800/90 hover:bg-gray-700 border-blue-600 hover:border-blue-500' : 'bg-white/90 hover:bg-white border-blue-200 hover:border-blue-300'} backdrop-blur-sm transition-all duration-300 rounded-2xl overflow-hidden border p-6 shadow-lg border-l-4 border-blue-500/70`}>
                    <div className="flex gap-6">
                      {/* Image */}
                      <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
                        <img
                          src={item.img_sm || item.img_lg || "/placeholder.jpg"}
                          alt={item.title}
                          className="object-cover group-hover:scale-110 transition-transform duration-500 w-full h-full"
                        />
                        <div className={`absolute top-2 left-2 ${getCategoryColor(item.categoryTitle)} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                          {item.categoryTitle}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`${isDark ? 'text-white group-hover:text-blue-400' : 'text-slate-800 group-hover:text-blue-600'} font-bold text-xl transition-colors line-clamp-1`}>
                            {item.title}
                          </h3>
                          {item.rating && (
                            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                              <BiStar className="text-yellow-400" />
                              {item.rating}
                            </div>
                          )}
                        </div>
                        <p className={`${isDark ? 'text-gray-300' : 'text-slate-600'} text-sm mb-3 line-clamp-2 leading-relaxed`}>
                          {item.short_description || item.description || "Deskripsi tidak tersedia"}
                        </p>
                        
                        {/* Features & Facilities */}
                        {(() => {
                          const parsedFeatures = parseFeatures(item.features);
                          return parsedFeatures && parsedFeatures.length > 0 && (
                            <div className="mb-3">
                              <div className="flex flex-wrap gap-1">
                                {parsedFeatures.slice(0, 4).map((feature, index) => (
                                  <span
                                    key={index}
                                    className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs"
                                  >
                                    {feature}
                                  </span>
                                ))}
                                {parsedFeatures.length > 4 && (
                                  <span className="bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                                    +{parsedFeatures.length - 4} lagi
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                        
                        <div className="flex items-center gap-4 text-slate-500 dark:text-gray-400 text-sm">
                          <div className="flex items-center gap-1">
                            <BiMap className="text-blue-500 dark:text-blue-400" />
                            <span>{item.location}</span>
                          </div>
                          {item.phone && (
                            <div className="flex items-center gap-1">
                              <BiPhone className="text-green-500 dark:text-green-400" />
                              <span>{item.phone}</span>
                            </div>
                          )}
                          <span className="ml-auto text-blue-600 dark:text-blue-400 font-medium">Lihat detail →</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-16 border border-slate-200 dark:border-gray-600 shadow-lg">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Tidak ada destinasi ditemukan</h3>
              <p className="text-slate-600 dark:text-gray-300 text-lg mb-8">
                {searchTerm && `Untuk pencarian "${searchTerm}"`}
                {selectedCategory !== "Semua" && ` dalam kategori ${selectedCategory}`}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Semua");
                }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-lg font-medium shadow-lg"
              >
                Reset Filter
              </button>
            </div>
          </div>
        )}

        {/* Call to Action - Colorful & Beautiful */}
        <div className="text-center py-32 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-10 left-20 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-20 right-32 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
            <div className="absolute top-1/2 left-10 w-24 h-24 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1500"></div>
            <div className="absolute top-1/3 right-10 w-28 h-28 bg-blue-700/20 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 via-blue-100 via-blue-200 via-blue-300 to-blue-400 dark:from-blue-900/30 dark:via-blue-800/30 dark:via-blue-700/30 dark:via-blue-600/30 dark:to-blue-500/30 backdrop-blur-xl rounded-3xl p-24 border-2 border-blue-200/50 dark:border-blue-600/50 shadow-2xl shadow-blue-500/30 relative">
            {/* Background pattern */}
            <div className="absolute inset-0 -z-10 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.3)_1px,transparent_0)] bg-[length:30px_30px]"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.3)_1px,transparent_0)] bg-[length:40px_40px]"></div>
            </div>
            
            <div className="max-w-4xl mx-auto relative z-10">
              <div className="text-8xl mb-10 animate-bounce">🌟</div>
                              <h3 className="text-5xl font-black text-slate-800 dark:text-white mb-10 bg-gradient-to-r from-blue-600 via-blue-700 via-blue-800 via-blue-900 to-blue-950 bg-clip-text text-transparent">
                  Siap untuk Petualangan?
                </h3>
                <p className="text-slate-600 dark:text-gray-300 text-2xl mb-16 leading-relaxed font-medium max-w-3xl mx-auto">
                  Temukan destinasi favorit Anda dan buat kenangan tak terlupakan di Banyumas. 
                  Setiap sudut menawarkan pengalaman unik yang siap untuk dijelajahi.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/">
                    <button className="px-16 py-6 bg-gradient-to-r from-blue-500 via-blue-600 via-blue-700 via-blue-800 to-blue-900 text-white rounded-2xl text-xl font-black hover:from-blue-600 hover:via-blue-700 hover:via-blue-800 hover:via-blue-900 hover:to-blue-950 transition-all duration-500 shadow-2xl hover:shadow-3xl hover:shadow-blue-500/40 transform hover:scale-110 border-2 border-white/20">
                      🏠 Kembali ke Beranda
                    </button>
                  </Link>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-16 py-6 bg-white/95 dark:bg-gray-700/95 text-slate-700 dark:text-white border-2 border-blue-200 dark:border-blue-600 rounded-2xl text-xl font-black hover:bg-white dark:hover:bg-gray-600 hover:shadow-2xl transition-all duration-500 transform hover:scale-110 shadow-xl"
                >
                  🔍 Jelajahi Lagi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationsPage;
