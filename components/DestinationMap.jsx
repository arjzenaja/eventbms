"use client";
import { useState, useEffect } from 'react';
import { BiMap, BiNavigation, BiTime, BiCar, BiWalk } from 'react-icons/bi';

const DestinationMap = ({ destination }) => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [travelTime, setTravelTime] = useState(null);

  // Check if API key is available
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  // If no API key, hide the component
  if (!apiKey) {
    return null;
  }

  // Default coordinates for Banyumas center (Purwokerto)
  const banyumasCenter = { lat: -7.4211, lng: 109.2344 };
  
  // Get coordinates from destination or use default
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
    
    return banyumasCenter;
  };

  const destinationCoords = getDestinationCoords();

  useEffect(() => {
    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        setIsMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsMapLoaded(true);
      script.onerror = () => {
        console.warn('Google Maps failed to load, using fallback');
        setIsMapLoaded(true); // Still set to true to show fallback
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, [apiKey]);

  useEffect(() => {
    // Get user location for distance calculation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied, using default');
        }
      );
    }
  }, []);

  useEffect(() => {
    // Calculate distance and travel time
    if (userLocation && destinationCoords) {
      calculateDistance(userLocation, destinationCoords);
    }
  }, [userLocation, destinationCoords]);

  const calculateDistance = (origin, destination) => {
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
    // Estimate travel time (assuming average speed of 40 km/h)
    setTravelTime(Math.round(distance * 1.5)); // 1.5 minutes per km
  };

  const openInMaps = (platform = 'google') => {
    const { lat, lng } = destinationCoords;
    const title = encodeURIComponent(destination.title);
    
    let url;
    if (platform === 'google') {
      url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    } else if (platform === 'apple') {
      url = `http://maps.apple.com/?q=${title}&ll=${lat},${lng}`;
    } else if (platform === 'waze') {
      url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
    }
    
    window.open(url, '_blank');
  };

  const copyCoordinates = () => {
    const coords = `${destinationCoords.lat}, ${destinationCoords.lng}`;
    navigator.clipboard.writeText(coords).then(() => {
      // Show success message
      alert('Koordinat berhasil disalin!');
    });
  };

  if (!isMapLoaded) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-gray-600 shadow-lg">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-gray-600 shadow-lg">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-3">
        <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
          <BiMap className="w-4 h-4 text-green-600 dark:text-green-400" />
        </div>
        Lokasi & Peta
      </h3>

      {/* Map Container */}
      <div className="relative mb-6">
        <div 
          id="map" 
          className="w-full h-64 rounded-xl border border-slate-200 dark:border-gray-600 overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
            position: 'relative'
          }}
        >
          {/* Fallback Map Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <BiMap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-slate-600 dark:text-gray-400 font-medium">
                {destination.title}
              </p>
              <p className="text-slate-500 dark:text-gray-500 text-sm">
                {destination.location}
              </p>
            </div>
          </div>
          
          {/* Map Overlay Info */}
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-xs text-slate-600 dark:text-gray-400">Koordinat</div>
            <div className="text-sm font-mono text-slate-800 dark:text-white">
              {destinationCoords.lat.toFixed(6)}, {destinationCoords.lng.toFixed(6)}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={() => openInMaps('google')}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
            title="Buka di Google Maps"
          >
            <BiNavigation className="w-4 h-4" />
          </button>
          <button
            onClick={() => openInMaps('waze')}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
            title="Buka di Waze"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Location Information */}
      <div className="space-y-4">
        {/* Address */}
        {destination.address && (
          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
            <BiMap className="text-xl text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-600 dark:text-gray-400 font-medium">Alamat Lengkap</p>
              <p className="text-slate-800 dark:text-white">{destination.address}</p>
            </div>
          </div>
        )}

        {/* Distance & Travel Time */}
        {distance && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <BiCar className="text-xl text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-slate-600 dark:text-gray-400 font-medium">Jarak</p>
                <p className="text-slate-800 dark:text-white font-semibold">{distance} km</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <BiTime className="text-xl text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm text-slate-600 dark:text-gray-400 font-medium">Estimasi Waktu</p>
                <p className="text-slate-800 dark:text-white font-semibold">{travelTime} menit</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => openInMaps('google')}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <BiNavigation className="w-5 h-5" />
            Buka di Maps
          </button>
          
          <button
            onClick={copyCoordinates}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <BiMap className="w-5 h-5" />
            Salin Koordinat
          </button>
        </div>

        {/* Additional Navigation Options */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => openInMaps('apple')}
            className="flex items-center gap-2 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Apple Maps
          </button>
          
          <button
            onClick={() => openInMaps('waze')}
            className="flex items-center gap-2 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-700 dark:text-gray-300 px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            Waze
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationMap;
