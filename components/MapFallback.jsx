"use client";
import { BiMap, BiNavigation, BiTime, BiCar, BiWalk } from 'react-icons/bi';

const MapFallback = ({ destination }) => {
  // Get destination coordinates for fallback
  const getDestinationCoords = () => {
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
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-gray-600 shadow-lg">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <BiMap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Lokasi Destinasi</h3>
        <p className="text-slate-600 dark:text-gray-400">
          {destination.location}
        </p>
      </div>

      {/* Coordinate Display */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Koordinat GPS</p>
            <p className="font-mono text-sm text-gray-800 dark:text-white">
              {destinationCoords.lat}, {destinationCoords.lng}
            </p>
          </div>
          <button
            onClick={copyCoordinates}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
          >
            Salin
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => openInMaps('google')}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <BiNavigation className="w-5 h-5" />
          Buka di Google Maps
        </button>
        
        <button
          onClick={() => openInMaps('waze')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <BiCar className="w-5 h-5" />
          Buka di Waze
        </button>
        
        <button
          onClick={() => openInMaps('apple')}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <BiTime className="w-5 h-5" />
          Buka di Apple Maps
        </button>
      </div>

      {/* Setup Notice */}
      <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          💡 <strong>Tips:</strong> Untuk menampilkan peta interaktif, tambahkan Google Maps API key di file <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">.env.local</code>
        </p>
      </div>
    </div>
  );
};

export default MapFallback;
