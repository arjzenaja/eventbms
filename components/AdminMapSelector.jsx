"use client";
import { useState, useEffect } from 'react';
import { BiMap, BiNavigation, BiTime, BiCar, BiWalk, BiTargetLock } from 'react-icons/bi';

const AdminMapSelector = ({ 
  location, 
  onLocationChange, 
  onCoordinatesChange, 
  initialCoordinates = null 
}) => {
  const [coordinates, setCoordinates] = useState(initialCoordinates || { lat: '', lng: '' });
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if Google Maps API key is available
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Get default coordinates based on location name
  const getDefaultCoordinates = (locationName) => {
    if (!locationName) return { lat: -7.4211, lng: 109.2344 }; // Default to Purwokerto
    
    const loc = locationName.toLowerCase();
    if (loc.includes('baturraden')) {
      return { lat: -7.3056, lng: 109.2194 };
    } else if (loc.includes('purwokerto')) {
      return { lat: -7.4211, lng: 109.2344 };
    } else if (loc.includes('ajibarang')) {
      return { lat: -7.4167, lng: 109.0667 };
    } else if (loc.includes('wangon')) {
      return { lat: -7.5167, lng: 109.0500 };
    }
    
    return { lat: -7.4211, lng: 109.2344 }; // Default to Purwokerto
  };

  // Update coordinates when location changes
  useEffect(() => {
    if (location && !coordinates.lat && !coordinates.lng) {
      const defaultCoords = getDefaultCoordinates(location);
      setCoordinates(defaultCoords);
      onCoordinatesChange(defaultCoords);
    }
  }, [location, coordinates, onCoordinatesChange]);

  // Geocoding function to get coordinates from address
  const getCoordinatesFromAddress = async (address) => {
    if (!apiKey) {
      // Fallback to default coordinates
      const defaultCoords = getDefaultCoordinates(address);
      setCoordinates(defaultCoords);
      onCoordinatesChange(defaultCoords);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        const newCoordinates = { lat, lng };
        setCoordinates(newCoordinates);
        onCoordinatesChange(newCoordinates);
      } else {
        // Fallback to default coordinates
        const defaultCoords = getDefaultCoordinates(address);
        setCoordinates(defaultCoords);
        onCoordinatesChange(defaultCoords);
        setError('Tidak dapat menemukan koordinat yang tepat, menggunakan koordinat default');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      // Fallback to default coordinates
      const defaultCoords = getDefaultCoordinates(address);
      setCoordinates(defaultCoords);
      onCoordinatesChange(defaultCoords);
      setError('Gagal mendapatkan koordinat, menggunakan koordinat default');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle location input change
  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    onLocationChange(newLocation);
    
    // Auto-update coordinates if location is provided
    if (newLocation.trim()) {
      getCoordinatesFromAddress(newLocation);
    }
  };

  // Handle manual coordinate input
  const handleCoordinateChange = (field, value) => {
    const newCoordinates = { ...coordinates, [field]: value };
    setCoordinates(newCoordinates);
    onCoordinatesChange(newCoordinates);
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolokasi tidak didukung di browser ini');
      return;
    }

    setIsLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCoordinates(newCoordinates);
        onCoordinatesChange(newCoordinates);
        setIsLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Gagal mendapatkan lokasi saat ini');
        setIsLoading(false);
      }
    );
  };

  // Open in Google Maps
  const openInGoogleMaps = () => {
    if (coordinates.lat && coordinates.lng) {
      const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="space-y-4">
      {/* Location Input */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Lokasi *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={handleLocationChange}
            required
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
            placeholder="Contoh: Banyumas, Indonesia"
          />
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md transition-colors flex items-center gap-2"
            title="Gunakan lokasi saat ini"
          >
            <BiTargetLock className="w-4 h-4" />
            {isLoading ? '...' : 'GPS'}
          </button>
        </div>
      </div>

      {/* Coordinates Display */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <BiMap className="w-4 h-4" />
            Koordinat GPS
          </h4>
          <button
            type="button"
            onClick={openInGoogleMaps}
            disabled={!coordinates.lat || !coordinates.lng}
            className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 text-sm flex items-center gap-1 transition-colors"
            title="Buka di Google Maps"
          >
            <BiNavigation className="w-3 h-3" />
            Buka di Maps
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              value={coordinates.lat}
              onChange={(e) => handleCoordinateChange('lat', parseFloat(e.target.value) || '')}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="-7.4211"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={coordinates.lng}
              onChange={(e) => handleCoordinateChange('lng', parseFloat(e.target.value) || '')}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="109.2344"
            />
          </div>
        </div>

        {/* Coordinate Preview */}
        {coordinates.lat && coordinates.lng && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800 font-mono">
            {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            ⚠️ {error}
          </div>
        )}

        {/* API Key Notice */}
        {!apiKey && (
          <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
            💡 <strong>Tips:</strong> Tambahkan Google Maps API key di <code className="bg-gray-100 px-1 rounded">.env.local</code> untuk geocoding otomatis
          </div>
        )}
      </div>

      {/* Map Preview Toggle */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsMapVisible(!isMapVisible)}
          className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2 transition-colors"
        >
          <BiMap className="w-4 h-4" />
          {isMapVisible ? 'Sembunyikan' : 'Tampilkan'} Peta
        </button>
        
        {coordinates.lat && coordinates.lng && (
          <span className="text-xs text-gray-500">
            Koordinat tersimpan
          </span>
        )}
      </div>

      {/* Map Preview */}
      {isMapVisible && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {apiKey ? (
            <div className="h-64 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <BiMap className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Peta akan ditampilkan di sini</p>
                <p className="text-xs text-gray-500">
                  Koordinat: {coordinates.lat}, {coordinates.lng}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 bg-gray-100 flex items-center justify-center">
              <div className="text-center text-gray-600">
                <BiMap className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Peta tidak tersedia</p>
                <p className="text-xs text-gray-500">
                  Tambahkan Google Maps API key untuk melihat peta
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminMapSelector;
