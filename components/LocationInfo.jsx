"use client";
import { useState, useEffect, useMemo } from 'react';
import { BiMap, BiTime, BiCar, BiWalk, BiBus, BiTrain } from 'react-icons/bi';

const LocationInfo = ({ destination, mapDistance }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [travelTimes, setTravelTimes] = useState({});

  // Get destination coordinates
  const getDestinationCoords = () => {
    if (destination?.coordinates) {
      return destination.coordinates;
    }
    
    // Fallback coordinates based on location name
    const location = destination?.location?.toLowerCase() || '';
    if (location.includes('baturraden')) {
      return { lat: -7.3056, lng: 109.2194 };
    } else if (location.includes('purwokerto')) {
      return { lat: -7.4211, lng: 109.2344 };
    } else if (location.includes('ajibarang')) {
      return { lat: -7.4167, lng: 109.0667 };
    } else if (location.includes('wangon')) {
      return { lat: -7.5167, lng: 109.0500 };
    }
    
    return { lat: -7.4211, lng: 109.2344 }; // Default to Purwokerto
  };

  const destinationCoords = useMemo(() => getDestinationCoords(), [
    destination?.coordinates?.lat,
    destination?.coordinates?.lng,
    destination?.location
  ]);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied');
        }
      );
    }
  }, []);

  useEffect(() => {
    // Use map distance if available, otherwise calculate
    if (mapDistance) {
      setDistance(mapDistance.distance);
      // Parse duration from map distance
      const durationText = mapDistance.duration;
      const durationMatch = durationText.match(/(\d+)\s*(jam|menit)/);
      if (durationMatch) {
        const value = parseInt(durationMatch[1]);
        const unit = durationMatch[2];
        const minutes = unit === 'jam' ? value * 60 : value;
        setTravelTimes({
          car: minutes,
          motorcycle: Math.round(minutes * 0.8),
          bus: Math.round(minutes * 1.5),
          train: Math.round(minutes * 1.2),
          walking: Math.round(minutes * 8),
          cycling: Math.round(minutes * 3)
        });
      }
    } else if (userLocation && destinationCoords) {
      calculateTravelInfo(userLocation, destinationCoords);
    }
  }, [userLocation, mapDistance, destinationCoords?.lat, destinationCoords?.lng]);

  const calculateTravelInfo = (origin, destination) => {
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLon = (destination.lng - origin.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    setDistance(distance.toFixed(1));
    
    // Calculate travel times for different transportation modes
    const times = {
      car: Math.round(distance * 1.5), // 40 km/h average
      motorcycle: Math.round(distance * 1.2), // 50 km/h average
      bus: Math.round(distance * 2.5), // 24 km/h average (including stops)
      train: Math.round(distance * 2.0), // 30 km/h average (including stops)
      walking: Math.round(distance * 12), // 5 km/h average
      cycling: Math.round(distance * 4) // 15 km/h average
    };
    
    setTravelTimes(times);
  };

  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} menit`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours} jam ${mins} menit` : `${hours} jam`;
    }
  };

  const getTransportationIcon = (mode) => {
    switch (mode) {
      case 'car':
        return <BiCar className="w-5 h-5" />;
      case 'motorcycle':
        return <BiCar className="w-5 h-5" />;
      case 'bus':
        return <BiBus className="w-5 h-5" />;
      case 'train':
        return <BiTrain className="w-5 h-5" />;
      case 'walking':
        return <BiWalk className="w-5 h-5" />;
      case 'cycling':
        return <BiWalk className="w-5 h-5" />;
      default:
        return <BiTime className="w-5 h-5" />;
    }
  };

  const getTransportationColor = (mode) => {
    switch (mode) {
      case 'car':
        return 'from-blue-500 to-blue-600';
      case 'motorcycle':
        return 'from-green-500 to-green-600';
      case 'bus':
        return 'from-purple-500 to-purple-600';
      case 'train':
        return 'from-orange-500 to-orange-600';
      case 'walking':
        return 'from-red-500 to-red-600';
      case 'cycling':
        return 'from-teal-500 to-teal-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getTransportationLabel = (mode) => {
    switch (mode) {
      case 'car':
        return 'Mobil';
      case 'motorcycle':
        return 'Motor';
      case 'bus':
        return 'Bus';
      case 'train':
        return 'Kereta';
      case 'walking':
        return 'Jalan Kaki';
      case 'cycling':
        return 'Sepeda';
      default:
        return mode;
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-gray-600 shadow-lg">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <BiMap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        Informasi Lokasi
      </h3>

      {/* Address */}
      {destination.address && (
        <div className="mb-6 p-4 bg-slate-50 dark:bg-gray-700/50 rounded-xl">
          <div className="flex items-start gap-3">
            <BiMap className="text-xl text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-600 dark:text-gray-400 font-medium mb-1">Alamat Lengkap</p>
              <p className="text-slate-800 dark:text-white leading-relaxed">{destination.address}</p>
            </div>
          </div>
        </div>
      )}

      {/* Distance Information */}
      {distance && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">Jarak & Waktu Tempuh</h4>
          
          {/* Distance Card */}
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800/50 rounded-xl flex items-center justify-center">
                  <BiMap className="text-2xl text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-gray-400 font-medium">Jarak dari Lokasi Anda</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-white">{distance} km</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transportation Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(travelTimes).map(([mode, time]) => (
              <div
                key={mode}
                className="p-3 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-lg border border-slate-200 dark:border-gray-600 hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${getTransportationColor(mode)} rounded-lg flex items-center justify-center text-white`}>
                    {getTransportationIcon(mode)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-gray-200 truncate">
                      {getTransportationLabel(mode)}
                    </p>
                    <p className="text-lg font-bold text-slate-800 dark:text-white">
                      {formatTime(time)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location Tips */}
      <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700/30">
        <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
            <BiTime className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
          </div>
          Tips Perjalanan
        </h4>
        
        <div className="space-y-2 text-sm text-slate-700 dark:text-gray-300">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Waktu terbaik untuk berkunjung: Pagi hari (08:00-11:00) atau Sore hari (15:00-17:00)</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Hindari hari libur nasional untuk menghindari keramaian</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Pastikan kendaraan dalam kondisi prima untuk perjalanan jauh</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Bawa bekal dan air minum untuk perjalanan</span>
          </div>
        </div>
      </div>

      {/* Weather Info Placeholder */}
      <div className="mt-4 p-4 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl border border-sky-200 dark:border-sky-700/30">
        <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Informasi Cuaca</h4>
        <p className="text-sm text-slate-600 dark:text-gray-400">
          Cuaca di {destination.location} saat ini sedang cerah berawan. Suhu berkisar 25-30°C.
        </p>
      </div>
    </div>
  );
};

export default LocationInfo;
