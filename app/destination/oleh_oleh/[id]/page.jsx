"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { 
  BiMap, 
  BiArrowBack, 
  BiPhone, 
  BiMoney, 
  BiStar, 
  BiHeart,
  BiShare,
  BiShoppingBag,
  BiTime,
  BiCheckCircle,
  BiPackage,
  BiHome,
  BiStore
} from "react-icons/bi";
import DetailSkeleton from "@/components/DetailSkeleton";
import ErrorState from "@/components/ErrorState";
import DestinationGallery from "@/components/DestinationGallery";
import KeyboardNavigation from "@/components/KeyboardNavigation";

const OlehOlehDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchDestination = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`/api/oleh_oleh/${id}`);
      if (!res.ok) {
        throw new Error("Gagal memuat data oleh-oleh");
      }
      const data = await res.json();
      setDestination(data.oleh_oleh || data.destination || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDestination();
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: destination.title,
        text: destination.short_description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  const getPriceRange = (priceRange) => {
    if (!priceRange) return "Harga tidak tersedia";
    return priceRange;
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Makanan": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      "Kerajinan": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "Pakaian": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "Aksesoris": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
      "Minuman": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    };
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Makanan": "🍪",
      "Kerajinan": "🎨",
      "Pakaian": "👕",
      "Aksesoris": "💍",
      "Minuman": "🥤"
    };
    return icons[category] || "🛍️";
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !destination) {
    return (
      <ErrorState
        title="Oleh-oleh Tidak Ditemukan"
        message="Oleh-oleh yang Anda cari tidak ditemukan atau telah dihapus."
        onRetry={fetchDestination}
        onBack={handleBack}
      />
    );
  }

  const images = [destination.img_lg, destination.img_sm].filter(Boolean);
  const productSlug = generateSlug(destination.title);

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-red-900/20">
      <KeyboardNavigation onBack={handleBack} onRetry={fetchDestination} />
      
      <div className="container mx-auto py-6 sm:py-8">
        <div className="w-full max-w-[1200px] mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
              <button 
                onClick={() => router.push('/')}
                className="flex items-center gap-1 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                <BiHome className="text-lg" />
                Beranda
              </button>
              <span>/</span>
              <button 
                onClick={() => router.push('/destinations')}
                className="flex items-center gap-1 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                <BiStore className="text-lg" />
                Destinasi
              </button>
              <span>/</span>
              <button 
                onClick={() => router.push('/destinations?category=oleh-oleh')}
                className="flex items-center gap-1 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                🛍️ Oleh-oleh
              </button>
              <span>/</span>
              <span className="text-orange-600 dark:text-orange-400 font-medium truncate">
                {destination.title}
              </span>
            </div>
          </nav>

          {/* Header */}
          <header className="mb-6">
            <button 
              onClick={handleBack}
              className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 mb-4 flex items-center gap-2 transition-colors duration-200 font-medium"
              aria-label="Kembali ke halaman destinasi"
            >
              <BiArrowBack className="text-xl" />
              Kembali ke Destinasi
            </button>
          </header>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative group">
                <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
                  <img
                    src={images[selectedImage] || images[0]}
                    alt={destination.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={handleWishlist}
                    className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
                      isWishlisted 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500'
                    }`}
                    aria-label={isWishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
                  >
                    <BiHeart className={`text-xl ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-orange-500 shadow-lg transition-all duration-200"
                    aria-label="Bagikan"
                  >
                    <BiShare className="text-xl" />
                  </button>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-2 rounded-full text-sm font-medium shadow-lg ${getCategoryColor(destination.category)} flex items-center gap-1`}>
                    <span>{getCategoryIcon(destination.category)}</span>
                    {destination.category}
                  </span>
                </div>

                {/* Product ID Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="px-2 py-1 rounded-lg bg-black/50 text-white text-xs font-medium">
                    ID: {destination.id}
                  </span>
                </div>
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index 
                          ? 'border-orange-500 shadow-lg' 
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${destination.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              {/* Title and Location */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-3">
                  {destination.title}
                </h1>
                <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400 mb-4">
                  <BiMap className="text-xl text-orange-500" aria-hidden="true" />
                  <span className="font-medium">{destination.location}</span>
                </div>
                
                {/* URL Display */}
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">URL Produk:</p>
                  <p className="text-sm font-mono text-slate-700 dark:text-gray-300 break-all">
                    /oleh-oleh/{destination.id}/{productSlug}
                  </p>
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <BiMoney className="text-2xl text-orange-600 dark:text-orange-400" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Harga
                  </h3>
                </div>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {getPriceRange(destination.price_range)}
                </p>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <BiPackage className="text-orange-500" />
                  Deskripsi Produk
                </h3>
                <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
                  {destination.description || destination.short_description || "Deskripsi tidak tersedia"}
                </p>
              </div>

              {/* Features */}
              {destination.features && destination.features.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                    <BiCheckCircle className="text-green-500" />
                    Fitur & Keunggulan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {destination.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <BiCheckCircle className="text-green-500 flex-shrink-0" />
                        <span className="text-slate-600 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact & Address */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg space-y-4">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                  <BiPhone className="text-orange-500" />
                  Informasi Kontak
                </h3>
                
                {destination.contact && (
                  <div className="flex items-center gap-3">
                    <BiPhone className="text-orange-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-gray-400">Kontak</p>
                      <p className="text-slate-800 dark:text-white font-medium">{destination.contact}</p>
                    </div>
                  </div>
                )}

                {destination.address && (
                  <div className="flex items-start gap-3">
                    <BiMap className="text-orange-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-gray-400">Alamat</p>
                      <p className="text-slate-800 dark:text-white">{destination.address}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-4 px-6 rounded-2xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg">
                  <BiShoppingBag className="text-xl" />
                  Beli Sekarang
                </button>
                <button className="flex-1 bg-white dark:bg-gray-800 border-2 border-orange-600 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 py-4 px-6 rounded-2xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2 shadow-lg">
                  <BiPhone className="text-xl" />
                  Hubungi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OlehOlehDetail;
