"use client";
import React, { useContext, useState, useEffect } from "react";
import { TicketContext } from "@/context/TicketContext";
import { BiInfoCircle, BiStar, BiCube, BiCart, BiMoney, BiTime, BiCamera, BiMessageRounded } from "react-icons/bi";

const EventPackages = ({ event }) => {
  const { handleSeat } = useContext(TicketContext);
  const seats = Array.isArray(event?.seats) ? event.seats : [];
  const pricing = event?.pricing || {};
  const [activeCategory, setActiveCategory] = useState("Semua Menu");
  const [menuItems, setMenuItems] = useState([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);

  const formatPrice = (value) => {
    const num = Number(value || 0);
    if (!num) return "Rp Gratis";
    return `Rp ${num.toLocaleString("id-ID")}`;
  };

  // Fetch menu items for this event
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setIsLoadingMenu(true);
        // Try to fetch menu items from the API
        const response = await fetch('/api/menu_items');
        if (response.ok) {
          const data = await response.json();
          // Filter menu items that might be related to this event
          // For now, we'll use all available menu items
          setMenuItems(data.menu_items || []);
        }
      } catch (error) {
        console.error('Error fetching menu items:', error);
        // Fallback to sample data if API fails
        setMenuItems(getSampleMenuItems());
      } finally {
        setIsLoadingMenu(false);
      }
    };

    fetchMenuItems();
  }, [event]);

  // Sample menu data as fallback
  const getSampleMenuItems = () => [
    {
      id: 1,
      name: "Nasi Goreng Spesial",
      description: "Nasi goreng dengan telur, ayam, dan sayuran segar khas Banyumas",
      price: 25000,
      rating: 4.8,
      cookingTime: "10-15 menit",
      category: "Makanan Utama",
      isPopular: true,
      isSpicy: false,
      additionalInfo: ["Halal", "Fresh"],
      image: "/placeholder.jpg"
    },
    {
      id: 2,
      name: "Sate Banyumas",
      description: "Sate ayam dengan bumbu kacang khas Banyumas yang lezat",
      price: 35000,
      rating: 4.9,
      cookingTime: "15-20 menit",
      category: "Sate",
      isPopular: true,
      isSpicy: true,
      additionalInfo: ["Halal", "Signature"],
      image: "/placeholder.jpg"
    },
    {
      id: 3,
      name: "Soto Sokaraja",
      description: "Soto ayam dengan kuah bening dan pelengkap lengkap",
      price: 28000,
      rating: 4.7,
      cookingTime: "12-18 menit",
      category: "Makanan Utama",
      isPopular: false,
      isSpicy: false,
      additionalInfo: ["Halal", "Traditional"],
      image: "/placeholder.jpg"
    },
    {
      id: 4,
      name: "Es Cendol Banyumas",
      description: "Es cendol dengan santan dan gula merah khas Banyumas",
      price: 8000,
      rating: 4.8,
      cookingTime: "5-8 menit",
      category: "Minuman",
      isPopular: false,
      isSpicy: false,
      additionalInfo: ["Halal", "Dessert"],
      image: "/placeholder.jpg"
    }
  ];

  // Category counts
  const categoryCounts = {
    "Semua Menu": menuItems.length,
    "Menu Populer": menuItems.filter(item => item.isPopular || item.popular).length,
    "Menu Utama": menuItems.filter(item => 
      item.category === "Makanan Utama" || 
      item.category === "Makanan" || 
      item.category === "Sate"
    ).length,
    "Minuman": menuItems.filter(item => item.category === "Minuman").length
  };

  // Filter items based on active category
  const filteredItems = activeCategory === "Semua Menu" 
    ? menuItems 
    : menuItems.filter(item => {
        if (activeCategory === "Menu Populer") return item.isPopular || item.popular;
        if (activeCategory === "Menu Utama") {
          return item.category === "Makanan Utama" || 
                 item.category === "Makanan" || 
                 item.category === "Sate";
        }
        return item.category === activeCategory;
      });

  // Check if event is free
  const isFreeEvent = pricing.free === true;

  if (isFreeEvent) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-green-900/40 to-emerald-900/20 border border-green-400/30 p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <BiMoney className="text-white text-2xl" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-white mb-2">Event Gratis!</h3>
          <p className="text-green-200">Tidak perlu membeli tiket untuk event ini</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-600/20 text-green-200 border border-green-500/40 px-4 py-2 rounded-full text-sm font-semibold">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" /> 
            Gratis Masuk
          </div>
        </div>
      </div>
    );
  }

  // Show pricing structure if available
  const hasPricing = pricing.presale || pricing.normal || pricing.vip;
  const hasSeats = seats.length > 0;

  if (!hasPricing && !hasSeats) {
    return (
      <div className="bg-gray-900 rounded-2xl p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-3">Menu Kuliner</h2>
          <p className="text-gray-300 text-lg">
            Jelajahi berbagai menu lezat yang tersedia di {event.title || "event ini"}. 
            Pilih menu favorit Anda dan pesan langsung!
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {category}
              <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoadingMenu && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">Memuat menu...</p>
          </div>
        )}

        {/* Food Items Grid */}
        {!isLoadingMenu && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Image Section */}
                <div className="relative h-48 bg-gray-700">
                  <img 
                    src={item.image || item.img_sm || "/placeholder.jpg"} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                  
                  {/* Popular Badge */}
                  {(item.isPopular || item.popular) && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <BiStar className="w-3 h-3" />
                      Populer
                    </div>
                  )}
                  
                  {/* Spicy Badge */}
                  {item.isSpicy && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="text-white">🔥</span>
                      Pedas
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4 bg-gray-900">
                  {/* Title and Rating */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-white flex-1">{item.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <BiStar className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{item.rating}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Price and Prep Time */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-green-400 font-bold">
                      <BiCamera className="w-4 h-4" />
                      {formatPrice(item.price)}
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <BiTime className="w-4 h-4" />
                      {item.cookingTime || item.prepTime || "10-15 menit"}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mb-3">
                    <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-300 flex items-center justify-center gap-2">
                      <BiCart className="w-4 h-4" />
                      Beli Menu
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors duration-300">
                      <BiMessageRounded className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2">
                    {(item.additionalInfo || item.tags || []).map((tag, index) => (
                      <span key={index} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Items Message */}
        {!isLoadingMenu && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <BiCube className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg">Tidak ada menu tersedia untuk kategori ini.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pricing Structure */}
      {hasPricing && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-gray-900/40 to-purple-900/20 border border-white/10 p-5">
            <div className="flex items-center justify-center mb-3">
              <span className="inline-flex items-center gap-2 bg-emerald-600/20 text-emerald-200 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Harga Tiket
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-white">Struktur Harga</h3>
              <p className="text-sm text-gray-300 mt-1">Pilih kategori tiket yang sesuai</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pricing.presale && (
              <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-400/30 rounded-xl p-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BiTime className="text-white text-xl" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Presale</h4>
                  <div className="text-2xl font-black text-blue-200 mb-2">{formatPrice(pricing.presale)}</div>
                  <p className="text-xs text-blue-300">Harga awal</p>
                </div>
              </div>
            )}

            {pricing.normal && (
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 rounded-xl p-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BiMoney className="text-white text-xl" />
                  </div>
                  <h4 className="font-bold text-white mb-2">Normal</h4>
                  <div className="text-2xl font-black text-purple-200 mb-2">{formatPrice(pricing.normal)}</div>
                  <p className="text-xs text-purple-300">Harga reguler</p>
                </div>
              </div>
            )}

            {pricing.vip && (
              <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-400/30 rounded-xl p-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BiStar className="text-white text-xl" />
                  </div>
                  <h4 className="font-bold text-white mb-2">VIP</h4>
                  <div className="text-2xl font-black text-yellow-200 mb-2">{formatPrice(pricing.vip)}</div>
                  <p className="text-xs text-yellow-300">Fasilitas premium</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Packages */}
      {hasSeats && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-gray-900/40 to-purple-900/20 border border-white/10 p-5">
            <div className="flex items-center justify-center mb-3">
              <span className="inline-flex items-center gap-2 bg-emerald-600/20 text-emerald-200 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Paket Detail
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-white">Pilihan Paket Tiket</h3>
              <p className="text-sm text-gray-300 mt-1">Pilih paket yang sesuai dengan kebutuhan Anda</p>
            </div>
          </div>

          <div className="space-y-3">
            {seats.map((s, idx) => {
              const isVip = /vip/i.test(s?.seat || s?.name || "");
              const isReg = /regul(er|ar)/i.test(s?.seat || s?.name || "");
              const includes = Array.isArray(s.includes) && s.includes.length > 0
                ? s.includes
                : ["Tiket Masuk", "Panduan Wisata", "Fasilitas Dasar", "Asuransi"];
              const requirementTerms = Array.isArray(s.terms_requirements)
                ? s.terms_requirements
                : ["Min. 1 orang", "Bayar full H-7", "Konfirmasi H-3"];
              const cancellationTerms = Array.isArray(s.terms_cancellation)
                ? s.terms_cancellation
                : ["H-7: 100%", "H-3: 50%", "H-1: 0%"];
              return (
                <div
                  key={`pkg-${idx}`}
                  className={`relative rounded-2xl p-4 border shadow-inner transition-all ${
                    isVip
                      ? "bg-gradient-to-br from-indigo-700/20 via-purple-700/10 to-rose-700/10 border-purple-400/40"
                      : isReg
                      ? "bg-gradient-to-br from-purple-600/10 to-pink-600/10 border-purple-400/30"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
                        <BiCube className="text-white/90 text-xl" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-lg font-extrabold capitalize text-white">{s.seat || s.name}</div>
                        {(isVip || s?.recommended) && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-200">
                            <BiStar className="w-3.5 h-3.5" /> Recommended
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-indigo-200">{formatPrice(s.price)}</div>
                      <div className="text-[10px] text-gray-400 -mt-1">per orang</div>
                    </div>
                  </div>
                  {s.desc && (
                    <div className="text-xs text-gray-300 flex items-center gap-1 mt-1">
                      <BiInfoCircle className="w-3.5 h-3.5" /> {s.desc}
                    </div>
                  )}

                  <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-3">
                    <div className="text-sm font-semibold text-gray-100 mb-2">Fitur yang termasuk:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {includes.map((it, i) => (
                        <div key={`inc-${idx}-${i}`} className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="h-2 w-2 rounded-full bg-blue-400 inline-block" /> {it}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-100 mb-2">Syarat:</div>
                        <ul className="space-y-1">
                          {requirementTerms.map((it, i) => (
                            <li key={`req-${idx}-${i}`} className="flex items-center gap-2 text-sm text-gray-300">
                              <span className="h-2 w-2 rounded-full bg-orange-400 inline-block" /> {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-100 mb-2">Pembatalan:</div>
                        <ul className="space-y-1">
                          {cancellationTerms.map((it, i) => (
                            <li key={`can-${idx}-${i}`} className="flex items-center gap-2 text-sm text-gray-300">
                              <span className="h-2 w-2 rounded-full bg-rose-400 inline-block" /> {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => handleSeat(s.seat || s.name, Number(s.price || 0))}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl"
                    >
                      <BiCart className="text-lg" /> Pilih Paket Ini
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPackages;


