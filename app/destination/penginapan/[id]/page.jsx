"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  BiMap, 
  BiPhone, 
  BiTime, 
  BiMoney, 
  BiArrowBack, 
  BiStar, 
  BiShare, 
  BiHeart,
  BiWifi,
  BiCar,
  BiCoffee,
  BiBed,
  BiShower,
  BiTv,
  BiCheckCircle,
  BiCalendar,
  BiUser,
  BiMessageRoundedDetail
} from "react-icons/bi";
import DetailSkeleton from "@/components/DetailSkeleton";
import ErrorState from "@/components/ErrorState";

const PenginapanDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [travelTimes, setTravelTimes] = useState(null);
  const [weather, setWeather] = useState(null);

  const fetchDestination = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`/api/penginapan/${id}`);
      if (!res.ok) {
        throw new Error("Gagal memuat data destinasi penginapan");
      }
      const data = await res.json();
      setDestination(data.penginapan || data.destination || data);
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

  useEffect(() => {
    if (!navigator?.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setUserLocation(null);
      },
      { enableHighAccuracy: true, maximumAge: 60000 }
    );
  }, []);

  const getLatLngFromDestination = (dest) => {
    if (!dest) return null;
    const lat = dest.latitude ?? dest.lat ?? dest.gps_lat ?? dest.coord_lat ?? null;
    const lng = dest.longitude ?? dest.lng ?? dest.gps_lng ?? dest.coord_lng ?? null;
    if (typeof lat === "number" && typeof lng === "number") return { lat, lng };
    if (typeof lat === "string" && typeof lng === "string") return { lat: parseFloat(lat), lng: parseFloat(lng) };
    if (typeof dest.coordinates === "string") {
      const parts = dest.coordinates.split(",").map((v) => parseFloat(v.trim()));
      if (parts.length === 2 && parts.every((n) => !Number.isNaN(n))) {
        return { lat: parts[0], lng: parts[1] };
      }
    }
    return null;
  };

  const haversineDistance = (a, b) => {
    if (!a || !b) return null;
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    return R * c;
  };

  const estimateTravelTimes = (km) => {
    if (km == null) return null;
    const speeds = { mobil: 40, motor: 35, bus: 25, kereta: 60, jalan: 5, sepeda: 15 };
    const toMin = (kmh) => Math.round((km / kmh) * 60);
    return {
      mobil: toMin(speeds.mobil),
      motor: toMin(speeds.motor),
      bus: toMin(speeds.bus),
      kereta: toMin(speeds.kereta),
      jalan: toMin(speeds.jalan),
      sepeda: toMin(speeds.sepeda),
    };
  };

  useEffect(() => {
    const target = getLatLngFromDestination(destination);
    if (!target || !userLocation) return;
    const km = haversineDistance(userLocation, target);
    setDistanceKm(km ? Math.round(km * 10) / 10 : null);
    setTravelTimes(estimateTravelTimes(km));
  }, [userLocation, destination]);

  useEffect(() => {
    const target = getLatLngFromDestination(destination);
    if (!target) return;
    const run = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${target.lat}&longitude=${target.lng}&current=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,relative_humidity_2m,uv_index`;
        const res = await fetch(url);
        if (!res.ok) return;
        const data = await res.json();
        setWeather(data.current || null);
      } catch {
        setWeather(null);
      }
    };
    run();
  }, [destination]);

  const handleBack = () => {
    router.back();
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: destination.title,
        text: destination.description,
        url: window.location.href,
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareMenu(false);
  };

  const handleBooking = () => {
    // Implement booking functionality
    alert("Fitur booking akan segera hadir!");
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'WiFi': BiWifi,
      'Parking': BiCar,
      'Restaurant': BiCoffee,
      'Room Service': BiBed,
      'Spa': BiShower,
      'TV': BiTv,
    };
    return iconMap[amenity] || BiCheckCircle;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<BiStar key={i} className="text-yellow-400 fill-current" />);
    }
    if (hasHalfStar) {
      stars.push(<BiStar key="half" className="text-yellow-400 fill-current opacity-50" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<BiStar key={`empty-${i}`} className="text-gray-300" />);
    }
    return stars;
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !destination) {
    return (
      <ErrorState
        title="Destinasi Tidak Ditemukan"
        message="Destinasi penginapan yang Anda cari tidak ditemukan atau telah dihapus."
        onRetry={fetchDestination}
        onBack={handleBack}
      />
    );
  }

  const images = [
    destination.img_lg,
    destination.img_sm,
    ...(destination.additional_images || [])
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20">
      <div className="container mx-auto py-8 sm:py-12">
        <div className="w-full max-w-[1200px] mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
            <button 
              onClick={handleBack}
                className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center gap-2 transition-colors duration-200 font-medium"
              aria-label="Kembali ke halaman destinasi"
            >
              <BiArrowBack className="text-xl" />
              Kembali ke Destinasi
            </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="p-2 text-slate-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                  aria-label="Bagikan"
                >
                  <BiShare className="text-xl" />
                </button>
                <button
                  onClick={handleFavorite}
                  className={`p-2 transition-colors duration-200 ${
                    isFavorite 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-slate-600 dark:text-gray-400 hover:text-red-500'
                  }`}
                  aria-label="Tambah ke favorit"
                >
                  <BiHeart className={`text-xl ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-2">
              {destination.title}
            </h1>
                <div className="flex items-center gap-4 text-slate-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
              <BiMap className="text-xl" aria-hidden="true" />
              <span>{destination.location}</span>
                  </div>
                  {destination.rating && (
                    <div className="flex items-center gap-1">
                      {renderStars(parseFloat(destination.rating))}
                      <span className="ml-1 text-sm font-medium">{destination.rating}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="inline-block bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  {destination.type}
                </div>
                {destination.recommended && (
                  <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-4 py-2 rounded-full">
                    <BiStar className="text-xl" aria-hidden="true" />
                    <span className="font-medium text-sm">Direkomendasikan</span>
                  </div>
                )}
              </div>

              {/* Lokasi Destinasi */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Lokasi Destinasi</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">{destination.location || destination.address}</p>
                {(() => {
                  const ll = getLatLngFromDestination(destination);
                  const addrQuery = encodeURIComponent(destination.address || destination.location || destination.title || "");
                  const gmaps = ll
                    ? `https://www.google.com/maps?q=${ll.lat},${ll.lng}`
                    : `https://www.google.com/maps/search/?api=1&query=${addrQuery}`;
                  const waze = ll
                    ? `https://waze.com/ul?ll=${ll.lat}%2C${ll.lng}&navigate=yes`
                    : (addrQuery ? `https://waze.com/ul?q=${addrQuery}` : null);
                  const apple = ll
                    ? `http://maps.apple.com/?ll=${ll.lat},${ll.lng}`
                    : (addrQuery ? `http://maps.apple.com/?q=${addrQuery}` : null);
                  return (
                    <>
                      {ll ? (
                        <div className="text-xs text-slate-500 dark:text-gray-400 mb-3">Koordinat GPS: {ll.lat.toFixed(6)}, {ll.lng.toFixed(6)}</div>
                      ) : (
                        <div className="text-xs text-amber-600 dark:text-amber-300 mb-3">Koordinat belum tersedia. Menggunakan alamat untuk navigasi.</div>
                      )}
                      <div className="space-y-2">
                        <a href={gmaps} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition">Buka di Google Maps</a>
                        {waze && (
                          <a href={waze} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition">Buka di Waze</a>
                        )}
                        {apple && (
                          <a href={apple} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-semibold py-2.5 px-4 rounded-lg transition">Buka di Apple Maps</a>
                        )}
                      </div>
                      <p className="mt-3 text-[11px] text-slate-400">Tips: Untuk peta interaktif, tambahkan Maps API key di file <code>.env.local</code></p>
                    </>
                  );
                })()}
              </div>
            </div>
          </header>

          {/* Share Menu */}
          {showShareMenu && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Bagikan</h3>
                <div className="space-y-3">
                  <button
                    onClick={copyToClipboard}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                  >
                    Salin Link
                  </button>
                  <button
                    onClick={() => setShowShareMenu(false)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Image Section */}
            <div className="lg:col-span-2 space-y-4" aria-label="Galeri gambar">
              <div className="relative w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={images[selectedImage] || "/placeholder.jpg"}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  alt={`Gambar ${selectedImage + 1} ${destination.title}`}
                  priority
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                          index === selectedImage 
                            ? 'bg-white' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Gambar ${index + 1}`}
                      />
                    ))}
                </div>
              )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-full h-20 rounded-lg overflow-hidden transition-all duration-200 ${
                        index === selectedImage 
                          ? 'ring-2 ring-green-500' 
                          : 'hover:ring-2 hover:ring-green-300'
                      }`}
                    >
                      <Image
                        src={image}
                        fill
                        className="object-cover"
                        alt={`Thumbnail ${index + 1}`}
                        sizes="(max-width: 768px) 25vw, 16vw"
                      />
                    </button>
                  ))}
                </div>
              )}
              </div>

            {/* Info Section */}
            <div className="space-y-6" aria-label="Informasi destinasi">
              {/* Quick Actions */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-slate-700">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <a
                    href={destination.contact ? `tel:${destination.contact}` : "#"}
                    className="flex items-center justify-center gap-2 py-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-gray-200 transition"
                  >
                    <BiPhone className="text-lg" />
                    <span className="text-sm font-medium">Telepon</span>
                  </a>
                  <a
                    href={destination.whatsapp ? `https://wa.me/${destination.whatsapp}` : (destination.contact ? `https://wa.me/${destination.contact}` : "#")}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-gray-200 transition"
                  >
                    <span className="text-lg">🟢</span>
                    <span className="text-sm font-medium">WhatsApp</span>
                  </a>
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 py-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-gray-200 transition"
                  >
                    <BiShare className="text-lg" />
                    <span className="text-sm font-medium">Bagikan</span>
                  </button>
                </div>
              </div>
              {/* Price and Booking */}
                {destination.price_range && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
                  <div className="text-center mb-4">
                    <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Mulai dari</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {destination.price_range}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-gray-400">per malam</p>
                    </div>
                  <button
                    onClick={handleBooking}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <BiCalendar className="text-xl" />
                    Pesan Sekarang
                  </button>
                  </div>
                )}

              {/* Quick Info */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                  Informasi Kontak
                </h3>
                <div className="space-y-4">
                {destination.contact && (
                    <div className="flex items-center gap-3">
                      <BiPhone className="text-xl text-green-600 dark:text-green-400" aria-hidden="true" />
                    <div>
                        <p className="text-sm text-slate-500 dark:text-gray-400">Telepon</p>
                      <p className="text-slate-800 dark:text-white font-medium">{destination.contact}</p>
                    </div>
                  </div>
                )}

                {destination.address && (
                    <div className="flex items-start gap-3">
                      <BiMap className="text-xl text-green-600 dark:text-green-400 mt-1" aria-hidden="true" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-gray-400">Alamat</p>
                      <p className="text-slate-800 dark:text-white font-medium">{destination.address}</p>
                    </div>
                  </div>
                )}

                {destination.check_in_time && (
                    <div className="flex items-center gap-3">
                      <BiTime className="text-xl text-green-600 dark:text-green-400" aria-hidden="true" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-gray-400">Check-in</p>
                      <p className="text-slate-800 dark:text-white font-medium">{destination.check_in_time}</p>
                    </div>
                  </div>
                )}

                {destination.check_out_time && (
                    <div className="flex items-center gap-3">
                      <BiTime className="text-xl text-green-600 dark:text-green-400" aria-hidden="true" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-gray-400">Check-out</p>
                      <p className="text-slate-800 dark:text-white font-medium">{destination.check_out_time}</p>
                    </div>
                  </div>
                )}
                </div>
              </div>

              {/* Amenities */}
              {destination.amenities && destination.amenities.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                    Fasilitas
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {destination.amenities.map((amenity, index) => {
                      const IconComponent = getAmenityIcon(amenity);
                      return (
                        <div key={index} className="flex items-center gap-2">
                          <IconComponent className="text-green-600 dark:text-green-400" />
                          <span className="text-sm text-slate-700 dark:text-gray-300">{amenity}</span>
                        </div>
                      );
                    })}
                    </div>
                  </div>
                )}
              </div>
          </div>

          {/* Description Section */}
          <section className="mt-12 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-4">
              Deskripsi
            </h2>
            <p className="text-slate-600 dark:text-gray-300 leading-relaxed text-lg">
              {destination.description || destination.short_description || "Deskripsi tidak tersedia"}
            </p>
          </section>

          {/* Jarak & Waktu Tempuh */}
          <section className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-4">Jarak & Waktu Tempuh</h2>
            {distanceKm != null ? (
              <>
                <div className="text-slate-700 dark:text-gray-300 mb-4">Jarak dari lokasi Anda: <span className="font-semibold">{distanceKm} km</span></div>
                {travelTimes && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40"><div className="font-semibold">Mobil</div><div>{travelTimes.mobil} menit</div></div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40"><div className="font-semibold">Motor</div><div>{travelTimes.motor} menit</div></div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40"><div className="font-semibold">Bus</div><div>{travelTimes.bus} menit</div></div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40"><div className="font-semibold">Kereta</div><div>{travelTimes.kereta} menit</div></div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40"><div className="font-semibold">Jalan Kaki</div><div>{travelTimes.jalan} menit</div></div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40"><div className="font-semibold">Sepeda</div><div>{travelTimes.sepeda} menit</div></div>
                  </div>
                )}
                <div className="mt-6">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Tips Perjalanan</h3>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-gray-300 space-y-1">
                    <li>Waktu terbaik berangkat pagi atau sore hari.</li>
                    <li>Hindari hari libur nasional untuk mengurangi kemacetan.</li>
                    <li>Siapkan bekal dan air minum untuk perjalanan panjang.</li>
                  </ul>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500 dark:text-gray-400">Aktifkan lokasi perangkat untuk menghitung jarak dan waktu tempuh.</p>
            )}
          </section>

          {/* Informasi Cuaca */}
          <section className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-4">Informasi Cuaca</h2>
            {weather ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-700 dark:text-gray-300">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/40">
                  <div className="text-xs text-slate-500">Suhu</div>
                  <div className="text-lg font-semibold">{Math.round(weather.temperature_2m)}°C</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/40">
                  <div className="text-xs text-slate-500">Terasa</div>
                  <div className="text-lg font-semibold">{Math.round(weather.apparent_temperature)}°C</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/40">
                  <div className="text-xs text-slate-500">Kelembaban</div>
                  <div className="text-lg font-semibold">{weather.relative_humidity_2m}%</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/40">
                  <div className="text-xs text-slate-500">Angin</div>
                  <div className="text-lg font-semibold">{Math.round(weather.wind_speed_10m)} km/j</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-500 dark:text-gray-400">
                Cuaca tidak tersedia saat ini. Pastikan koordinat destinasi terisi untuk menampilkan cuaca sekitar.
              </div>
            )}
          </section>
          {/* Reviews Section */}
          <section className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">
                Ulasan Pengunjung
                  </h2>
              <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium flex items-center gap-2">
                <BiMessageRoundedDetail className="text-xl" />
                Tulis Ulasan
              </button>
                  </div>
            
            <div className="text-center py-8">
              <BiUser className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-gray-400 mb-2">Belum ada ulasan</p>
              <p className="text-sm text-slate-400 dark:text-gray-500">
                Jadilah yang pertama memberikan ulasan untuk penginapan ini
              </p>
                </div>
          </section>

          {/* Similar Accommodations */}
          <section className="mt-8">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">
              Penginapan Serupa
                  </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder for similar accommodations */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-slate-700">
                <div className="w-full h-32 bg-gray-200 dark:bg-slate-700 rounded-lg mb-3"></div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-1">Penginapan Serupa</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">Fitur akan segera hadir</p>
                  </div>
                </div>
            </section>
        </div>
      </div>
    </main>
  );
};

export default PenginapanDetail;
