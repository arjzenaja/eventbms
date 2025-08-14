"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BiMap, BiSearch, BiFilter, BiGrid, BiStar, BiPhone } from "react-icons/bi";
import { AiOutlineUnorderedList } from "react-icons/ai";

// Loading Skeleton Component
const DestinationSkeleton = ({ viewMode }) => {
  if (viewMode === "grid") {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 animate-pulse">
        <div className="h-56 bg-gray-700"></div>
        <div className="p-6">
          <div className="h-6 bg-gray-700 rounded mb-3"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded mb-4 w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 p-6 animate-pulse">
      <div className="flex gap-6">
        <div className="w-32 h-32 bg-gray-700 rounded-xl flex-shrink-0"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-700 rounded mb-3"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded mb-3 w-2/3"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("name"); // name, rating, location
  const [error, setError] = useState(null);

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
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-white mb-4">Terjadi Kesalahan</h3>
              <p className="text-gray-400 text-lg mb-6">{error}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
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
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32">
        <div className="container mx-auto px-4">
          {/* Hero Section Skeleton */}
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-700 rounded w-64 mx-auto mb-6 animate-pulse"></div>
            <div className="h-16 bg-gray-700 rounded w-96 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-700 rounded w-2xl mx-auto animate-pulse"></div>
          </div>

          {/* Search Section Skeleton */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 mb-12 border border-white/10">
            <div className="h-16 bg-gray-700 rounded-2xl w-full max-w-2xl mx-auto mb-8 animate-pulse"></div>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-700 rounded-full w-24 animate-pulse"></div>
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
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-12">
            <span className="inline-block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-2xl md:text-3xl font-bold mb-8">
              🌟 Jelajahi Keindahan
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Kabupaten
            </span>
            <br />
            <span className="text-white">Banyumas</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Temukan berbagai destinasi menarik, kuliner lezat, dan pengalaman wisata yang tak terlupakan 
            di jantung Jawa Tengah yang memukau
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-16 border border-white/10">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-xl z-10" />
              <input
                type="text"
                placeholder="Cari destinasi, lokasi, atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => handleCategoryChange("Semua")}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === "Semua"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white/10 text-white hover:bg-white/20 hover:scale-105"
              }`}
            >
              🌟 Semua
            </button>
            {Object.values(destinations).map((category) => (
              <button
                key={category.title}
                onClick={() => handleCategoryChange(category.title)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.title
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-white/10 text-white hover:bg-white/20 hover:scale-105"
                }`}
              >
                <span>{getCategoryIcon(category.title)}</span>
                {category.title}
              </button>
            ))}
          </div>

          {/* Type-Specific Filter Dropdowns */}
          {selectedCategory !== "Semua" && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BiFilter className="text-xl" />
                  Filter Tipe {selectedCategory}
                </h3>
                <button
                  onClick={resetTypeFilters}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center gap-2"
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
                      className="flex items-center justify-between w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white cursor-pointer transition-all duration-300 hover:bg-white/20 hover:border-white/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🏔️</span>
                        <span className="font-medium text-sm">{getCurrentTypeLabel()}</span>
                      </div>
                      <svg className={`w-5 h-5 text-gray-300 transition-transform duration-300 ${isObjekWisataDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-white/20 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out ${
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
                            className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 flex items-center gap-3 ${
                              selectedObjekWisataType === type.value ? 'bg-blue-500/20 text-blue-300 border-r-4 border-blue-400' : 'text-gray-300 hover:text-white'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span className="font-medium text-sm flex-1">{type.label}</span>
                            {selectedObjekWisataType === type.value && (
                              <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                      className="flex items-center justify-between w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white cursor-pointer transition-all duration-300 hover:bg-white/20 hover:border-white/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🍽️</span>
                        <span className="font-medium text-sm">{getCurrentTypeLabel()}</span>
                      </div>
                      <svg className={`w-5 h-5 text-gray-300 transition-transform duration-300 ${isKulinerDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-white/20 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out ${
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
                            className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 flex items-center gap-3 ${
                              selectedKulinerType === type.value ? 'bg-blue-500/20 text-blue-300 border-r-4 border-blue-400' : 'text-gray-300 hover:text-white'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span className="font-medium text-sm flex-1">{type.label}</span>
                            {selectedKulinerType === type.value && (
                              <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                      className="flex items-center justify-between w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white cursor-pointer transition-all duration-300 hover:bg-white/20 hover:border-white/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🏨</span>
                        <span className="font-medium text-sm">{getCurrentTypeLabel()}</span>
                      </div>
                      <svg className={`w-5 h-5 text-gray-300 transition-transform duration-300 ${isPenginapanDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-white/20 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out ${
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
                            className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 flex items-center gap-3 ${
                              selectedPenginapanType === type.value ? 'bg-blue-500/20 text-blue-300 border-r-4 border-blue-400' : 'text-gray-300 hover:text-white'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span className="font-medium text-sm flex-1">{type.label}</span>
                            {selectedPenginapanType === type.value && (
                              <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                      className="flex items-center justify-between w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white cursor-pointer transition-all duration-300 hover:bg-white/20 hover:border-white/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🛍️</span>
                        <span className="font-medium text-sm">{getCurrentTypeLabel()}</span>
                      </div>
                      <svg className={`w-5 h-5 text-gray-300 transition-transform duration-300 ${isOlehOlehDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-white/20 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out ${
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
                            className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 flex items-center gap-3 ${
                              selectedOlehOlehType === type.value ? 'bg-blue-500/20 text-blue-300 border-r-4 border-blue-400' : 'text-gray-300 hover:text-white'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span className="font-medium text-sm flex-1">{type.label}</span>
                            {selectedOlehOlehType === type.value && (
                              <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                      className="flex items-center justify-between w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white cursor-pointer transition-all duration-300 hover:bg-white/20 hover:border-white/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🏘️</span>
                        <span className="font-medium text-sm">{getCurrentTypeLabel()}</span>
                      </div>
                      <svg className={`w-5 h-5 text-gray-300 transition-transform duration-300 ${isDesaWisataDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-white/20 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out ${
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
                            className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 flex items-center gap-3 ${
                              selectedDesaWisataType === type.value ? 'bg-blue-500/20 text-blue-300 border-r-4 border-blue-400' : 'text-gray-300 hover:text-white'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span className="font-medium text-sm flex-1">{type.label}</span>
                            {selectedDesaWisataType === type.value && (
                              <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                      className="flex items-center justify-between w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white cursor-pointer transition-all duration-300 hover:bg-white/20 hover:border-white/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🚌</span>
                        <span className="font-medium text-sm">{getCurrentTypeLabel()}</span>
                      </div>
                      <svg className={`w-5 h-5 text-gray-300 transition-transform duration-300 ${isBiroPerjalananDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-white/20 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out ${
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
                            className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 flex items-center gap-3 ${
                              selectedBiroPerjalananType === type.value ? 'bg-blue-500/20 text-blue-300 border-r-4 border-blue-400' : 'text-gray-300 hover:text-white'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span className="font-medium text-sm flex-1">{type.label}</span>
                            {selectedBiroPerjalananType === type.value && (
                              <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                      className="flex items-center justify-between w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white cursor-pointer transition-all duration-300 hover:bg-white/20 hover:border-white/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🎉</span>
                        <span className="font-medium text-sm">{getCurrentTypeLabel()}</span>
                      </div>
                      <svg className={`w-5 h-5 text-gray-300 transition-transform duration-300 ${isEventDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-white/20 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out ${
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
                            className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors duration-200 flex items-center gap-3 ${
                              selectedEventType === type.value ? 'bg-blue-500/20 text-blue-300 border-r-4 border-blue-400' : 'text-gray-300 hover:text-white'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span className="font-medium text-sm flex-1">{type.label}</span>
                            {selectedEventType === type.value && (
                              <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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

          {/* View Controls and Sort */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {/* View Mode Toggle */}
            <div className="flex bg-white/10 rounded-full p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-full transition-all ${
                  viewMode === "grid" 
                    ? "bg-blue-500 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <BiGrid className="text-xl" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-full transition-all ${
                  viewMode === "list" 
                    ? "bg-blue-500 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <AiOutlineUnorderedList className="text-xl" />
              </button>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <BiFilter className="text-white" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name" className="bg-gray-800 text-white">Urutkan: Nama</option>
                <option value="rating" className="bg-gray-800 text-white">Urutkan: Rating</option>
                <option value="location" className="bg-gray-800 text-white">Urutkan: Lokasi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-12">
          <div className="inline-block bg-white/5 backdrop-blur-sm rounded-full px-8 py-4 border border-white/10">
            <p className="text-gray-300 text-lg">
              <span className="text-blue-400 font-semibold">{filteredData.length}</span> destinasi ditemukan
              {selectedCategory !== "Semua" && (
                <span className="text-blue-400"> dalam kategori {selectedCategory}</span>
              )}
            </p>
          </div>
        </div>

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
                  // Grid View Card
                  <div className="bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10 group-hover:scale-[1.02]">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={item.img_sm || item.img_lg || "/placeholder.jpg"}
                        alt={item.title}
                        className="object-cover group-hover:scale-110 transition-transform duration-500 w-full h-full"
                      />
                      {/* Category Badge */}
                      <div className={`absolute top-4 left-4 ${getCategoryColor(item.categoryTitle)} text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg`}>
                        {item.categoryTitle}
                      </div>
                      {/* Rating Badge */}
                      {item.rating && (
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <BiStar className="text-yellow-400" />
                          {item.rating}
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-white font-bold text-xl mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {item.short_description || item.description || "Deskripsi tidak tersedia"}
                      </p>
                      
                      {/* Features & Facilities */}
                      {item.features && item.features.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {item.features.slice(0, 3).map((feature, index) => (
                              <span
                                key={index}
                                className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full text-xs"
                              >
                                {feature}
                              </span>
                            ))}
                            {item.features.length > 3 && (
                              <span className="bg-gray-600/20 text-gray-300 px-2 py-1 rounded-full text-xs">
                                +{item.features.length - 3} lagi
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <BiMap className="text-blue-400 text-lg" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View Card
                  <div className="bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 p-6">
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
                          <h3 className="text-white font-bold text-xl group-hover:text-blue-400 transition-colors line-clamp-1">
                            {item.title}
                          </h3>
                          {item.rating && (
                            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                              <BiStar className="text-yellow-400" />
                              {item.rating}
                            </div>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2 leading-relaxed">
                          {item.short_description || item.description || "Deskripsi tidak tersedia"}
                        </p>
                        
                        {/* Features & Facilities */}
                        {item.features && item.features.length > 0 && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                              {item.features.slice(0, 4).map((feature, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full text-xs"
                                >
                                  {feature}
                                </span>
                              ))}
                              {item.features.length > 4 && (
                                <span className="bg-gray-600/20 text-gray-300 px-2 py-1 rounded-full text-xs">
                                  +{item.features.length - 4} lagi
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 text-gray-400 text-sm">
                          <div className="flex items-center gap-1">
                            <BiMap className="text-blue-400" />
                            <span>{item.location}</span>
                          </div>
                          {item.phone && (
                            <div className="flex items-center gap-1">
                              <BiPhone className="text-green-400" />
                              <span>{item.phone}</span>
                            </div>
                          )}
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
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-16 border border-white/10">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-4">Tidak ada destinasi ditemukan</h3>
              <p className="text-gray-400 text-lg mb-8">
                {searchTerm && `Untuk pencarian "${searchTerm}"`}
                {selectedCategory !== "Semua" && ` dalam kategori ${selectedCategory}`}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("Semua");
                }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-lg font-medium"
              >
                Reset Filter
              </button>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center py-20">
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-3xl p-16 border border-blue-500/20">
            <h3 className="text-3xl font-bold text-white mb-6">
              Siap untuk Petualangan?
            </h3>
            <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
              Temukan destinasi favorit Anda dan buat kenangan tak terlupakan di Banyumas
            </p>
            <Link href="/">
              <button className="px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                Kembali ke Beranda
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationsPage;
