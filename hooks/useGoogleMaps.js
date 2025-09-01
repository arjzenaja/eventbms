import { useState, useEffect } from 'react';

// Global state to track Google Maps loading
let googleMapsLoadingPromise = null;
let googleMapsLoaded = false;

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(googleMapsLoaded);
  const [error, setError] = useState(null);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // If already loaded, return immediately
    if (googleMapsLoaded) {
      setIsLoaded(true);
      return;
    }

    // If already loading, wait for the existing promise
    if (googleMapsLoadingPromise) {
      googleMapsLoadingPromise
        .then(() => {
          setIsLoaded(true);
        })
        .catch((err) => {
          setError(err);
        });
      return;
    }

    // Check if API key is available
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      // Instead of throwing error, just hide the component
      setIsHidden(true);
      return;
    }

    // Create new loading promise
    googleMapsLoadingPromise = new Promise((resolve, reject) => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        googleMapsLoaded = true;
        resolve();
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        // Wait for existing script to load
        const checkGoogleMaps = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkGoogleMaps);
            googleMapsLoaded = true;
            resolve();
          }
        }, 100);
        return;
      }

      // Create and load script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.id = 'google-maps-script';
      
      script.onload = () => {
        googleMapsLoaded = true;
        resolve();
      };
      
      script.onerror = () => {
        const error = new Error('Google Maps failed to load');
        reject(error);
      };
      
      document.head.appendChild(script);
    });

    // Handle the promise
    googleMapsLoadingPromise
      .then(() => {
        setIsLoaded(true);
      })
      .catch((err) => {
        setError(err);
        console.warn('Google Maps failed to load:', err);
      });

    // Cleanup function
    return () => {
      // Clear any intervals if component unmounts
      if (googleMapsLoadingPromise) {
        // Don't clear the promise as other components might be using it
        // Just let it complete naturally
      }
    };
  }, []);

  return { isLoaded, error, isHidden };
};
