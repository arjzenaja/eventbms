"use client";
import { useState, useEffect, useRef } from 'react';
import { BiMap, BiNavigation, BiTime, BiCar, BiWalk } from 'react-icons/bi';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

const InteractiveMap = ({ destination, onDistanceCalculated }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isLoaded: isMapLoaded, error: mapError, isHidden } = useGoogleMaps();

  // If component should be hidden (no API key), return null
  if (isHidden) {
    return null;
  }

  // Show loading state
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

  const destinationCoords = getDestinationCoords();

                  useEffect(() => {
    let isMounted = true;

    if (isMapLoaded && mapRef.current && isMounted && !isInitialized) {
      // Add a small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        if (isMounted && mapRef.current && !isInitialized) {
          initializeMap();
        }
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }

    // Cleanup function
    return () => {
      isMounted = false;
      try {
        // Clear any existing maps and markers
        if (map && window.google && window.google.maps) {
          // Clear all listeners
          window.google.maps.event.clearInstanceListeners(map);
          // Set map to null
          setMap(null);
        }
        if (marker) {
          marker.setMap(null);
          setMarker(null);
        }
        
        // Reset initialization state
        setIsInitialized(false);
        
        // Clear map container content safely
        if (mapRef.current && document.contains(mapRef.current)) {
          try {
            while (mapRef.current.firstChild) {
              mapRef.current.removeChild(mapRef.current.firstChild);
            }
          } catch (domError) {
            console.warn('Error clearing map container:', domError);
          }
        }
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
    };
  }, [isMapLoaded, isInitialized]);

  const initializeMap = () => {
    if (!window.google || !mapRef.current) return;

    try {
      // Check if component is still mounted
      if (!mapRef.current) return;

      // Check if already initialized to prevent multiple instances
      if (isInitialized) {
        console.warn('Map already initialized, skipping initialization');
        return;
      }

      // Check if map already exists to prevent multiple instances
      if (map) {
        console.warn('Map already exists, skipping initialization');
        return;
      }

      // Check if map container is still in DOM and has proper structure
      if (!mapRef.current || !mapRef.current.parentNode || !document.contains(mapRef.current)) {
        console.warn('Map container not found in DOM, skipping initialization');
        return;
      }

      // Clear any existing content in the map container
      if (mapRef.current.children.length > 0) {
        while (mapRef.current.firstChild) {
          mapRef.current.removeChild(mapRef.current.firstChild);
        }
      }

      // Create map instance
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: destinationCoords,
        zoom: 15,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      });

      // Create marker
      const markerInstance = new window.google.maps.Marker({
        position: destinationCoords,
        map: mapInstance,
        title: destination.title,
        animation: window.google.maps.Animation.DROP,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#3B82F6"/>
              <circle cx="20" cy="20" r="12" fill="white"/>
              <circle cx="20" cy="20" r="8" fill="#3B82F6"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20)
        }
      });

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold; color: #1F2937;">
              ${destination.title}
            </h3>
            <p style="margin: 0; font-size: 14px; color: #6B7280;">
              ${destination.location}
            </p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #9CA3AF;">
              ${destinationCoords.lat.toFixed(6)}, ${destinationCoords.lng.toFixed(6)}
            </p>
          </div>
        `
      });

      // Add click listener to marker
      markerInstance.addListener('click', () => {
        if (mapRef.current) {
          infoWindow.open(mapInstance, markerInstance);
        }
      });

      // Add click listener to map to close info window
      mapInstance.addListener('click', () => {
        if (mapRef.current) {
          infoWindow.close();
        }
      });

      // Check if component is still mounted before setting state
      if (mapRef.current) {
        setMap(mapInstance);
        setMarker(markerInstance);
        setIsLoading(false);
        setIsInitialized(true);
      }

      // Calculate distance if user location is available
      if (navigator.geolocation && mapRef.current) {
        const geolocationOptions = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Check if component is still mounted
            if (!mapRef.current) return;

            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
            // Add user location marker
            const userMarker = new window.google.maps.Marker({
              position: userLocation,
              map: mapInstance,
              title: 'Lokasi Anda',
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15" cy="15" r="15" fill="#10B981"/>
                    <circle cx="15" cy="15" r="8" fill="white"/>
                    <circle cx="15" cy="15" r="4" fill="#10B981"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(30, 30),
                anchor: new window.google.maps.Point(15, 15)
              }
            });

            // Calculate and display route
            const directionsService = new window.google.maps.DirectionsService();
            const directionsRenderer = new window.google.maps.DirectionsRenderer({
              map: mapInstance,
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#3B82F6',
                strokeWeight: 4,
                strokeOpacity: 0.8
              }
            });

            directionsService.route(
              {
                origin: userLocation,
                destination: destinationCoords,
                travelMode: window.google.maps.TravelMode.DRIVING
              },
              (result, status) => {
                // Check if component is still mounted
                if (!mapRef.current) return;

                if (status === 'OK') {
                  try {
                    directionsRenderer.setDirections(result);
                    
                    // Calculate distance and time
                    const route = result.routes[0];
                    const distance = route.legs[0].distance.text;
                    const duration = route.legs[0].duration.text;
                    
                    if (onDistanceCalculated && mapRef.current) {
                      onDistanceCalculated({
                        distance: distance,
                        duration: duration,
                        userLocation: userLocation
                      });
                    }
                  } catch (routeError) {
                    console.error('Error setting directions:', routeError);
                  }
                }
              }
            );
          },
          (error) => {
            console.log('Location access denied or error:', error);
          },
          geolocationOptions
        );
      }

    } catch (err) {
      console.error('Error initializing map:', err);
      if (mapRef.current) {
        setIsLoading(false);
      }
    }
  };

  const openInMaps = (platform = 'google') => {
    try {
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
      
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error opening maps:', error);
    }
  };

  const copyCoordinates = () => {
    try {
      const coords = `${destinationCoords.lat}, ${destinationCoords.lng}`;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(coords).then(() => {
          // Show success message
          alert('Koordinat berhasil disalin!');
        }).catch((error) => {
          console.error('Error copying coordinates:', error);
          // Fallback for older browsers
          try {
            const textArea = document.createElement('textarea');
            textArea.value = coords;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            if (document.body.contains(textArea)) {
              document.body.removeChild(textArea);
            }
            alert('Koordinat berhasil disalin!');
          } catch (fallbackError) {
            console.error('Fallback copy failed:', fallbackError);
            alert('Gagal menyalin koordinat. Silakan salin manual: ' + coords);
          }
        });
      } else {
        // Fallback for older browsers
        try {
          const textArea = document.createElement('textarea');
          textArea.value = coords;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          if (document.body.contains(textArea)) {
            document.body.removeChild(textArea);
          }
          alert('Koordinat berhasil disalin!');
        } catch (fallbackError) {
          console.error('Fallback copy failed:', fallbackError);
          alert('Gagal menyalin koordinat. Silakan salin manual: ' + coords);
        }
      }
    } catch (error) {
      console.error('Error copying coordinates:', error);
      alert('Gagal menyalin koordinat. Silakan salin manual: ' + `${destinationCoords.lat}, ${destinationCoords.lng}`);
    }
  };

        if (mapError) {
        return (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-gray-600 shadow-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <BiMap className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Peta Tidak Dapat Dimuat</h3>
              <p className="text-slate-600 dark:text-gray-400 mb-4">{mapError.message}</p>
              <div className="space-y-2">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Coba Lagi
                </button>
                <button
                  onClick={() => openInMaps('google')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Buka di Google Maps
                </button>
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
        Peta Interaktif
      </h3>

      {/* Map Container */}
      <div className="relative mb-6">
                 <div 
           ref={mapRef}
           className="w-full h-80 rounded-xl border border-slate-200 dark:border-gray-600 overflow-hidden"
           style={{ 
             background: isLoading ? 'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)' : 'transparent',
             position: 'relative'
           }}
           key={`map-container-${destination?.id || 'default'}`}
         >
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-800/90">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-600 dark:text-gray-400">Memuat peta...</p>
              </div>
            </div>
          )}
        </div>

        {/* Map Controls Overlay */}
        {isMapLoaded && !isLoading && (
          <div className="absolute top-4 right-4 flex flex-col gap-2">
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
        )}

        {/* Coordinates Overlay */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="text-xs text-slate-600 dark:text-gray-400">Koordinat</div>
          <div className="text-sm font-mono text-slate-800 dark:text-white">
            {destinationCoords.lat.toFixed(6)}, {destinationCoords.lng.toFixed(6)}
          </div>
        </div>
      </div>

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
      <div className="flex flex-wrap gap-2 mt-3">
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
  );
};

export default InteractiveMap;
