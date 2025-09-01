"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { BiMap, BiPhone, BiTime, BiMoney, BiStar, BiWifi, BiCar, BiSwim, BiRestaurant, BiParking, BiShield, BiHeart, BiShareAlt } from "react-icons/bi";
import { FaBed, FaShower, FaTv, FaSnowflake, FaWifi, FaParking, FaSwimmingPool, FaUtensils, FaConciergeBell, FaUmbrellaBeach, FaCheckCircle, FaClock, FaUsers, FaRulerCombined } from "react-icons/fa";
import PhotoGallery from "../../../../components/PhotoGallery";
import ErrorBoundary from "../../../../components/ErrorBoundary";
import SmartMap from "../../../../components/SmartMap";
import LocationInfo from "../../../../components/LocationInfo";


const PenginapanDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapDistance, setMapDistance] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const roomItems = useMemo(() => {
    if (Array.isArray(destination?.rooms)) return destination.rooms;
    const alt = destination?.room_types || destination?.kamar;
    if (Array.isArray(alt)) return alt;
    return [];
  }, [destination]);

  const demoRooms = useMemo(() => ([
    { 
      id: 1,
      name: 'Standard Room', 
      price: 150000, 
      description: 'Kamar standar dengan AC dan TV, nyaman untuk istirahat', 
      includes: ['AC', 'TV', 'Air mineral', 'Kamar mandi dalam'],
      capacity: '2 orang',
      size: '24m²',
      bed: '1 Queen Bed',
      image: '/placeholder.jpg',
      popular: false
    },
    { 
      id: 2,
      name: 'Deluxe Room', 
      price: 250000, 
      description: 'Kamar luas dengan balkon dan pemandangan indah', 
      includes: ['AC', 'TV', 'Air panas', 'Balkon', 'Kamar mandi dalam'],
      capacity: '2 orang',
      size: '32m²',
      bed: '1 King Bed',
      image: '/placeholder.jpg',
      popular: true
    },
    { 
      id: 3,
      name: 'Family Room', 
      price: 350000, 
      description: 'Kamar keluarga untuk 4 orang dengan ruang tamu', 
      includes: ['2 Queen Bed', 'AC', 'TV', 'Ruang tamu', 'Kamar mandi dalam'],
      capacity: '4 orang',
      size: '45m²',
      bed: '2 Queen Bed',
      image: '/placeholder.jpg',
      popular: false
    },
    { 
      id: 4,
      name: 'Suite', 
      price: 500000, 
      description: 'Suite mewah dengan ruang tamu terpisah dan minibar', 
      includes: ['Ruang tamu', 'AC', 'TV', 'Minibar', 'Kamar mandi dalam'],
      capacity: '2 orang',
      size: '55m²',
      bed: '1 King Bed',
      image: '/placeholder.jpg',
      popular: true
    },
    { 
      id: 5,
      name: 'Economy Room', 
      price: 100000, 
      description: 'Kamar hemat dengan kipas angin, cocok untuk budget terbatas', 
      includes: ['Kipas angin', 'Air mineral', 'Kamar mandi dalam'],
      capacity: '2 orang',
      size: '18m²',
      bed: '1 Single Bed',
      image: '/placeholder.jpg',
      popular: false
    },
    { 
      id: 6,
      name: 'VIP Suite', 
      price: 750000, 
      description: 'Suite mewah dengan bathtub dan breakfast included', 
      includes: ['Bathtub', 'AC', 'TV', 'Breakfast', 'Kamar mandi dalam'],
      capacity: '2 orang',
      size: '65m²',
      bed: '1 King Bed',
      image: '/placeholder.jpg',
      popular: true
    },
  ]), []);

  const amenities = useMemo(() => {
    if (destination?.amenities && Array.isArray(destination.amenities)) {
      return destination.amenities;
    }
    return ['WiFi', 'Parkir', 'AC', 'TV', 'Kamar Mandi Dalam', 'Air Panas'];
  }, [destination]);

  const amenityIcons = {
    'WiFi': FaWifi,
    'Parkir': FaParking,
    'AC': FaSnowflake,
    'TV': FaTv,
    'Kamar Mandi Dalam': FaShower,
    'Air Panas': FaShower,
    'Spa': FaConciergeBell,
    'Kolam Renang': FaSwimmingPool,
    'Restoran': FaUtensils,
    'Beach Access': FaUmbrellaBeach
  };

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/penginapan/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch destination");
        }
        const data = await res.json();
        let acc = data.penginapan || data.destination || data;

        // Fallback: jika rooms belum ada dari API penginapan, ambil dari /api/rooms
        if (!acc?.rooms || (Array.isArray(acc.rooms) && acc.rooms.length === 0)) {
          try {
            const roomsRes = await fetch(`/api/rooms?accommodationId=${id}`);
            if (roomsRes.ok) {
              const roomsData = await roomsRes.json();
              const mappedRooms = Array.isArray(roomsData.rooms)
                ? roomsData.rooms.map((room) => ({
                    id: room.id,
                    name: room.name,
                    description: room.description || '',
                    price: room.price,
                    includes: Array.isArray(room.facilities)
                      ? room.facilities
                      : room.facilities
                      ? [room.facilities]
                      : [],
                    capacity: room.capacity ? `${room.capacity} orang` : undefined,
                    size: room.size,
                    bed: room.bedType,
                    popular: !!room.isPopular,
                    available: room.available !== false,
                  }))
                : [];
              acc = { ...acc, rooms: mappedRooms };
            }
          } catch (e) {
            // Abaikan, UI akan fallback ke demoRooms
          }
        }

        setDestination(acc);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDestination();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-700 to-zinc-800 flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-600/20 via-gray-500/15 to-zinc-600/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
        
        <div className="text-center relative z-10">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-slate-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-slate-300 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <div className="text-slate-100 text-xl font-medium">Memuat informasi penginapan...</div>
          <div className="text-slate-300 text-sm mt-2">Mohon tunggu sebentar</div>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-700 to-zinc-800 flex items-center justify-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-600/20 via-gray-500/15 to-zinc-600/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
        
        <div className="text-center relative z-10">
          <div className="w-32 h-32 bg-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-slate-500/30">
            <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-100 mb-4">Penginapan Tidak Ditemukan</h1>
          <p className="text-slate-300 mb-8 text-lg">Penginapan yang Anda cari tidak ditemukan atau telah dihapus.</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-2xl"
          >
            ← Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-zinc-900">
      {/* Hero Section with Background Image */}
      <div className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-600/20 via-gray-500/15 to-zinc-600/20"></div>
        <div className="absolute inset-0 bg-[url('/pattern_bg.png')] opacity-8"></div>
        
        {/* Additional Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-slate-800/10 via-transparent to-zinc-800/10"></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Back Button & Actions */}
            <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => window.history.back()} 
                className="group inline-flex items-center gap-3 text-gray-200 hover:text-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                <div className="w-10 h-10 bg-gray-600/30 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-gray-500/40 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <span className="font-medium">Kembali ke Dolan Banyumas</span>
              </button>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                    isLiked 
                      ? 'bg-gradient-to-r from-gray-600 to-slate-600 text-white shadow-2xl' 
                      : 'bg-gray-600/30 backdrop-blur-sm text-gray-200 hover:bg-gray-500/40'
                  }`}
                >
                  <BiHeart className={`text-xl ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button className="w-12 h-12 bg-gray-600/30 backdrop-blur-sm rounded-2xl flex items-center justify-center text-gray-200 hover:bg-gray-500/40 transition-all duration-300 transform hover:scale-110">
                  <BiShareAlt className="text-xl" />
            </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="text-center">
              {/* Badges */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-2xl">
                  <FaBed className="w-5 h-5" />
                  {destination.type || 'Penginapan'}
                </div>
                {destination.recommended && (
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-2xl animate-pulse">
                    <BiStar className="w-5 h-5" />
                    ⭐ Direkomendasikan
                  </div>
                )}
              </div>
              
              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-black text-gray-100 mb-6 leading-tight">
                {destination.title}
              </h1>
              
              {/* Location */}
              <div className="flex items-center justify-center gap-3 text-gray-200 text-xl mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-600 to-slate-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <BiMap className="text-2xl text-white" />
                </div>
                <span className="font-medium">{destination.location}</span>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {destination.price_range && (
                  <div className="bg-gray-700/40 backdrop-blur-sm rounded-3xl p-6 border border-gray-600/30 shadow-2xl">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                        <BiMoney className="text-3xl text-white" />
                      </div>
                      <p className="text-gray-300 text-sm mb-2">Harga per Malam</p>
                      <p className="text-2xl font-bold text-gray-100">{destination.price_range}</p>
                    </div>
                  </div>
                )}

                {destination.rating && (
                  <div className="bg-gray-700/40 backdrop-blur-sm rounded-3xl p-6 border border-gray-600/30 shadow-2xl">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                        <BiStar className="text-3xl text-white" />
                      </div>
                      <p className="text-gray-300 text-sm mb-2">Rating</p>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <BiStar 
                            key={i} 
                            className={`w-6 h-6 ${i < parseInt(destination.rating) ? 'text-gray-300 fill-current' : 'text-gray-500'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-xl font-bold text-gray-100">({destination.rating}/5)</p>
                    </div>
                  </div>
                )}

                {destination.contact && (
                  <div className="bg-gray-700/40 backdrop-blur-sm rounded-3xl p-6 border border-gray-600/30 shadow-2xl">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                        <BiPhone className="text-3xl text-white" />
                      </div>
                      <p className="text-gray-300 text-sm mb-2">Kontak</p>
                      <p className="text-lg font-semibold text-gray-100">{destination.contact}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
            </div>
          </div>

          {/* Main Content */}
      <div className="relative z-20 -mt-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Left Column - Media & Maps */}
              <div className="xl:col-span-2 space-y-8">
                              {/* Photo Gallery */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-white mb-2">Galeri Foto</h3>
                  <p className="text-white/80">Lihat keindahan penginapan kami</p>
                </div>
              <PhotoGallery
                images={[destination.img_lg, destination.img_sm, ...(destination.gallery || [])].filter(Boolean)}
                title={destination.title}
              />
              </div>

              {/* Interactive Map */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
                      <BiMap className="text-white text-2xl" />
                    </div>
                    Lokasi & Peta
                  </h3>
                  <p className="text-white/80">Temukan lokasi penginapan kami</p>
                </div>
              <ErrorBoundary>
                <SmartMap
                  destination={destination}
                  onDistanceCalculated={setMapDistance}
                />
              </ErrorBoundary>
              </div>

              {/* Location Info */}
              <ErrorBoundary>
                <LocationInfo destination={destination} mapDistance={mapDistance} />
              </ErrorBoundary>
              </div>

              {/* Right Column - Info & Actions */}
              <div className="space-y-6">
                              {/* Description Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  Deskripsi
                </h3>
                </div>
                <p className="text-white/80 leading-relaxed text-lg">
                  {destination.description || destination.short_description || "Deskripsi penginapan tidak tersedia saat ini."}
                </p>
              </div>

              {/* Amenities Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl">
                      <FaConciergeBell className="text-white text-2xl" />
                  </div>
                    Fasilitas & Amenitas
                </h3>
                  <p className="text-white/80">Nikmati berbagai fasilitas yang tersedia</p>
                        </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {amenities.map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity] || FaConciergeBell;
                    return (
                      <div key={index} className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-white">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
                            </div>

              {/* Aksi Cepat Card */}
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-2">Aksi Cepat</h3>
                  <p className="text-orange-100 text-lg">Pilih aksi yang ingin Anda lakukan</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => {
                      const phone = destination.contact?.toString().replace(/[^0-9+]/g, "");
                      if (phone) {
                        window.open(`tel:${phone}`, "_blank");
                      } else {
                        alert("Kontak tidak tersedia");
                      }
                    }}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center gap-2 text-sm font-semibold"
                  >
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                      <BiPhone className="text-2xl text-white" />
                    </div>
                    <span>Telepon</span>
                  </button>

                  <button
                    onClick={() => {
                      const message = `Halo, saya tertarik dengan penginapan ${destination.title} dan ingin mendapatkan informasi lebih lanjut.`;
                      const phone = destination.contact?.toString().replace(/[^0-9+]/g, "");
                      if (phone) {
                        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
                      } else {
                        alert("Kontak tidak tersedia");
                      }
                    }}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center gap-2 text-sm font-semibold"
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                    </div>
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => {
                      if (destination.latitude && destination.longitude) {
                        window.open(`https://www.google.com/maps?q=${destination.latitude},${destination.longitude}`, "_blank");
                      } else if (destination.address) {
                        window.open(`https://www.google.com/maps/search/${encodeURIComponent(destination.address)}`, "_blank");
                      } else {
                        alert("Lokasi tidak tersedia");
                      }
                    }}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center gap-2 text-sm font-semibold"
                  >
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <BiMap className="text-2xl text-white" />
                    </div>
                    <span>Arahkan</span>
                  </button>

                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: destination.title,
                          text: `Lihat penginapan ${destination.title} di Dolan Banyumas!`,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link telah disalin ke clipboard!");
                      }
                    }}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center gap-2 text-sm font-semibold"
                  >
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <BiShareAlt className="text-2xl text-white" />
                    </div>
                    <span>Bagikan</span>
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-orange-100 text-sm">
                    Pilih aksi yang ingin Anda lakukan
                  </p>
                </div>
              </div>

              {/* Contact & Booking Card */}
              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl p-8 text-white shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30">
                    <BiPhone className="text-4xl" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Hubungi & Pesan</h3>
                  <p className="text-purple-100 text-lg">Reservasi cepat dan mudah</p>
                    </div>

                <div className="space-y-4">
                  {destination.contact && (
                    <button
                      onClick={() => {
                        const phone = destination.contact.toString().replace(/[^0-9+]/g, "");
                        window.open(`tel:${phone}`, "_blank");
                      }}
                      className="w-full bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-4 text-lg font-semibold"
                    >
                      <BiPhone className="text-2xl" />
                      Telepon Sekarang
                    </button>
                  )}

                  {destination.contact && (
                    <button
                      onClick={() => {
                        const message = `Halo, saya tertarik dengan penginapan ${destination.title} dan ingin mendapatkan informasi lebih lanjut.`;
                        const phone = destination.contact.toString().replace(/[^0-9+]/g, "");
                        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
                      }}
                      className="w-full bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-4 text-lg font-semibold"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      WhatsApp
                    </button>
                  )}

                  <div className="text-center pt-4">
                    <p className="text-purple-100 text-sm">
                      Atau kunjungi langsung lokasi kami
                    </p>
                        </div>
                      </div>
                    </div>
                        </div>
                      </div>

            {/* Room Types Section */}
            <div className="mt-20">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full text-lg font-bold mb-6 shadow-2xl">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  🛏️ Pilihan Tipe Kamar
                </div>
                <h2 className="text-5xl font-black text-white mb-6">Tipe Kamar Tersedia</h2>
                <p className="text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                  Pilih tipe kamar yang sesuai dengan kebutuhan dan budget Anda
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(roomItems.length > 0 ? roomItems : demoRooms).map((item, index) => {
                    const isObj = typeof item === 'object' && item !== null;
                    const name = isObj ? item.name : item;
                    if (!name) return null;
                    const price = isObj ? item.price : undefined;
                    const desc = isObj ? item.description || item.desc : undefined;
                    const includes = isObj && Array.isArray(item.includes) ? item.includes : [];
                  const capacity = isObj ? item.capacity : '2 orang';
                  const size = isObj ? item.size : '24m²';
                  const bed = isObj ? item.bed : '1 Queen Bed';
                  const popular = isObj ? item.popular : false;

                    return (
                      <div
                        key={index}
                                          className={`group relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 transition-all duration-500 hover:shadow-2xl hover:scale-105 ${
                      selectedRoom === item.id ? 'border-green-500 shadow-2xl' : 'border-white/20 hover:border-green-400'
                    }`}
                      onClick={() => setSelectedRoom(item.id)}
                    >
                      {/* Popular Badge */}
                      {popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-2xl">
                            ⭐ POPULAR
                          </div>
                        </div>
                      )}

                      {/* Room Header */}
                      <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                          <FaBed className="text-white text-3xl" />
                            </div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                                {name}
                        </h3>
                        <div className="flex items-center justify-center gap-6 text-sm text-white/80">
                          <span className="flex items-center gap-2">
                            <FaUsers className="w-4 h-4 text-green-400" />
                            {capacity}
                          </span>
                          <span className="flex items-center gap-2">
                            <FaRulerCombined className="w-4 h-4 text-blue-400" />
                            {size}
                          </span>
                        </div>
                      </div>

                      {/* Room Details */}
                      <div className="space-y-6 mb-8">
                              {desc && (
                          <p className="text-white/80 text-base leading-relaxed text-center">
                                  {desc}
                                </p>
                              )}
                        
                        <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                          <div className="flex items-center gap-3 text-sm text-white/90 mb-3">
                            <FaBed className="w-5 h-5 text-green-400" />
                            <span className="font-semibold">Tipe Tempat Tidur</span>
                          </div>
                          <p className="text-white font-bold text-lg">{bed}</p>
                            </div>
                          </div>

                      {/* Price */}
                      <div className="text-center mb-8">
                        <div className="text-4xl font-black text-green-400 mb-2">
                          {price ? `Rp ${Number(price).toLocaleString('id-ID')}` : 'Rp -'}
                        </div>
                        <div className="text-white/70 font-medium">per malam</div>
                        </div>

                      {/* Features */}
                        {includes.length > 0 && (
                        <div className="mb-8">
                          <div className="text-base font-semibold text-white/90 mb-4 flex items-center gap-3">
                            <FaCheckCircle className="w-5 h-5 text-green-400" />
                            Fasilitas Kamar:
                            </div>
                          <div className="grid grid-cols-1 gap-3">
                            {includes.slice(0, 4).map((inc, i) => (
                              <div key={i} className="flex items-center gap-3 text-sm text-white/80">
                                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                                  <span className="truncate">{inc}</span>
                                </div>
                              ))}
                            {includes.length > 4 && (
                              <div className="text-sm text-green-400 font-semibold mt-3 text-center">
                                +{includes.length - 4} fasilitas lainnya
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                      {/* Booking Button */}
                          <button
                        onClick={(e) => {
                          e.stopPropagation();
                              const message = `Halo, saya ingin memesan kamar ${name}${price ? ` (Rp ${Number(price).toLocaleString('id-ID')}/malam)` : ''} di ${destination.title}`;
                              const phone = destination.contact || destination.phone || destination.whatsapp;
                              if (phone) {
                                window.open(`https://wa.me/${phone.toString().replace(/[^0-9+]/g, "")}?text=${encodeURIComponent(message)}`, "_blank");
                              } else {
                                alert("Kontak tidak tersedia untuk pemesanan");
                              }
                            }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-lg shadow-2xl"
                          >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                        Pesan Kamar Ini
                          </button>
                      </div>
                    );
                  })}
                </div>

                {(roomItems.length > 0 ? roomItems : demoRooms).length > 6 && (
                <div className="text-center mt-16">
                  <button className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-5 px-10 rounded-3xl transition-all duration-300 transform hover:scale-105 text-xl border border-white/20 shadow-2xl">
                    <span>Lihat Semua Tipe Kamar</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

            {/* Pengelola Penginapan */}
            <div className="mt-24">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-full text-lg font-bold mb-6 shadow-2xl">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  👥 Tim Pengelola
                </div>
                <h2 className="text-5xl font-black text-white mb-6">Pengelola Penginapan</h2>
                <p className="text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                  Kenali tim pengelola yang siap melayani kebutuhan akomodasi Anda
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-800/80 via-gray-700/80 to-zinc-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    Tim Pengelola Wisata
                  </h3>
                  <p className="text-white/80">Tim pengelola destinasi wisata</p>
                </div>

                {/* Manager Profile */}
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white mb-2">Tim Pengelola Wisata</h4>
                        <p className="text-white/70 text-lg mb-2">Pengelola Destinasi</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-white/70 text-sm">5.0 (Terpercaya)</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-green-400 mb-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="font-semibold">Online</span>
                      </div>
                      <p className="text-white/70 text-sm">Siap melayani</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-8">
                  <h4 className="text-2xl font-bold text-white mb-6">Informasi Kontak</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-2xl p-4 border border-white/20 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white/70 text-sm">Telepon</p>
                          <p className="text-white font-bold">+62 812-3456-7890</p>
                        </div>
                      </div>
                      <button className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-110">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                    </div>

                    <div className="bg-white/10 rounded-2xl p-4 border border-white/20 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-white/70 text-sm">WhatsApp</p>
                          <p className="text-white font-bold">+62 812-3456-7890</p>
                        </div>
                      </div>
                      <button className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-110">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                  <h4 className="text-2xl font-bold text-white mb-6">Aksi Cepat</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-lg shadow-2xl">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Telepon
                    </button>
                    <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 text-lg shadow-2xl">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      WhatsApp
                    </button>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-xl font-bold text-white mb-2">Jam Operasional</h5>
                      <p className="text-white/70 text-lg">Senin - Minggu: 08:00 - 17:00 WIB</p>
                      <p className="text-white/50 text-sm">*Jam operasional dapat berubah sesuai kondisi</p>
                    </div>
                  </div>
                </div>

                {/* Footer Tags */}
                <div className="mt-8 pt-6 border-t border-white/20">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-yellow-400/20 text-yellow-300 px-4 py-2 rounded-full border border-yellow-400/30">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Terpercaya
                    </div>
                    <div className="flex items-center gap-2 bg-blue-400/20 text-blue-300 px-4 py-2 rounded-full border border-blue-400/30">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Respon Cepat
                    </div>
                    <div className="flex items-center gap-2 bg-green-400/20 text-green-300 px-4 py-2 rounded-full border border-green-400/30">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 20.25V12m0 0V7.5m0 4.5l3-3m-3 3l-3-3m6 7.5V12m0 0V7.5m0 4.5l3-3m-3 3l-3-3" />
                      </svg>
                      Lokal
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-24 text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <BiShield className="text-4xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Terpercaya</h3>
                  <p className="text-white/80 text-lg">Penginapan terverifikasi dan terpercaya</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <FaClock className="text-4xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Respon Cepat</h3>
                  <p className="text-white/80 text-lg">Layanan customer service 24/7</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <BiMap className="text-4xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Lokasi Strategis</h3>
                  <p className="text-white/80 text-lg">Mudah dijangkau dan akses transportasi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenginapanDetail;
