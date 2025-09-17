"use client";
import { BiMap, BiNavigation, BiTime, BiCar, BiWalk, BiCurrentLocation } from 'react-icons/bi';

const MapFallback = ({ destination }) => {
  // Get destination coordinates for fallback
  const getDestinationCoords = () => {
    // First try to get from separate latitude/longitude fields
    if (destination?.latitude && destination?.longitude) {
      const lat = parseFloat(destination.latitude);
      const lng = parseFloat(destination.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    
    // Then try coordinates object
    if (destination?.coordinates) {
      // Handle case where coordinates might be a JSON string
      let coords = destination.coordinates;
      if (typeof coords === 'string') {
        try {
          coords = JSON.parse(coords);
        } catch (e) {
          console.warn('Failed to parse coordinates JSON:', e);
        }
      }
      
      // Check if coords has lat and lng properties
      if (coords && typeof coords === 'object' && coords.lat && coords.lng) {
        return {
          lat: parseFloat(coords.lat) || -7.4211,
          lng: parseFloat(coords.lng) || 109.2344
        };
      }
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

  const destinationCoords = getDestinationCoords();

  const openInMaps = (platform = 'google') => {
    const { lat, lng } = destinationCoords;
    const title = encodeURIComponent(destination?.title || 'Destination');
    
    // Ensure lat and lng are valid numbers
    const safeLat = Number(lat || -7.4211);
    const safeLng = Number(lng || 109.2344);
    
    let url;
    if (platform === 'google') {
      url = `https://www.google.com/maps/search/?api=1&query=${safeLat},${safeLng}`;
    } else if (platform === 'apple') {
      url = `http://maps.apple.com/?q=${title}&ll=${safeLat},${safeLng}`;
    } else if (platform === 'waze') {
      url = `https://waze.com/ul?ll=${safeLat},${safeLng}&navigate=yes`;
    }
    
    window.open(url, '_blank');
  };

  const copyCoordinates = () => {
    const safeLat = Number(destinationCoords.lat || 0);
    const safeLng = Number(destinationCoords.lng || 0);
    const coords = `${safeLat}, ${safeLng}`;
    navigator.clipboard.writeText(coords).then(() => {
      // Show success message
      alert('Koordinat berhasil disalin!');
    }).catch(() => {
      // Fallback for older browsers
      alert('Koordinat: ' + coords);
    });
  };

  return (
    <div className="bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-800/90 dark:to-blue-900/20 backdrop-blur-md rounded-3xl p-8 border border-slate-200/50 dark:border-gray-600/50 shadow-2xl relative overflow-hidden group">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-500"></div>
      <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-green-400/5 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-700"></div>
      
      <div className="text-center mb-8 relative z-10">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25 transform hover:scale-105 transition-transform duration-300">
            <BiMap className="w-10 h-10 text-white drop-shadow-sm" />
          </div>
          {/* Status indicator */}
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <BiCurrentLocation className="w-3 h-3 text-white" />
          </div>
          {/* Pulse animation */}
          <div className="absolute inset-0 w-20 h-20 bg-blue-400/30 rounded-2xl mx-auto animate-ping"></div>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Lokasi Destinasi
        </h3>
        <p className="text-slate-600 dark:text-gray-300 text-lg font-medium">
          {destination.location}
        </p>
      </div>

      {/* Coordinate Display */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-gray-700/80 dark:to-blue-900/20 rounded-2xl p-6 mb-8 border border-slate-200/50 dark:border-gray-600/30 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Koordinat GPS</p>
            </div>
            <p className="font-mono text-base text-gray-800 dark:text-white bg-gradient-to-r from-gray-100 to-blue-50 dark:from-gray-800 dark:to-blue-900/30 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 shadow-inner">
              {destinationCoords.lat}, {destinationCoords.lng}
            </p>
          </div>
          <button
            onClick={copyCoordinates}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 ml-4 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            <span className="relative z-10 flex items-center gap-2">
              📋 Salin
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-4">
        <button
          onClick={() => openInMaps('google')}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-red-500/25 transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/30 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
            <BiNavigation className="w-5 h-5" />
          </div>
          <span className="text-lg group-hover:tracking-wide transition-all duration-300">Buka di Google Maps</span>
        </button>
        
        <button
          onClick={() => openInMaps('waze')}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/25 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
            <BiCar className="w-5 h-5" />
          </div>
          <span className="text-lg group-hover:tracking-wide transition-all duration-300">Buka di Waze</span>
        </button>
        
        <button
          onClick={() => openInMaps('apple')}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-gray-500/25 transform hover:scale-105 hover:shadow-xl hover:shadow-gray-500/30 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
            <BiTime className="w-5 h-5" />
          </div>
          <span className="text-lg group-hover:tracking-wide transition-all duration-300">Buka di Apple Maps</span>
        </button>
      </div>

      {/* Setup Notice - Hidden */}
      {/* <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          💡 <strong>Tips:</strong> Untuk menampilkan peta interaktif, tambahkan Google Maps API key di file <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">.env.local</code>
        </p>
      </div> */}
    </div>
  );
};

export default MapFallback;
