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

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort data
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title?.localeCompare(b.title);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "location":
          return a.location?.localeCompare(b.location);
        default:
          return 0;
      }
    });

    setFilteredData(filtered);
  }, [destinations, selectedCategory, searchTerm, sortBy]);

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
    if (item.category === "events") return `/event/${item.id}`;
    
    const categoryMap = {
      "wisata": "wisata",
      "kuliner": "kuliner", 
      "penginapan": "penginapan",
      "oleh_oleh": "oleh_oleh",
      "desa_wisata": "desa_wisata",
      "biro_perjalanan": "biro_perjalanan"
    };
    
    const mappedCategory = categoryMap[item.category];
    return mappedCategory ? `/destination/${mappedCategory}/${item.id}` : `/destination/wisata/${item.id}`;
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-32">
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
              Destinasi
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
              <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Cari destinasi, lokasi, atau deskripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setSelectedCategory("Semua")}
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
                onClick={() => setSelectedCategory(category.title)}
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
              <BiFilter className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Urutkan: Nama</option>
                <option value="rating">Urutkan: Rating</option>
                <option value="location">Urutkan: Lokasi</option>
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
