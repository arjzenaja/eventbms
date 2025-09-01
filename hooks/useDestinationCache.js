import { useState, useEffect, useCallback } from 'react';

// Cache storage
const destinationCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useDestinationCache = () => {
  const [cache, setCache] = useState(destinationCache);

  // Get cached destination
  const getCachedDestination = useCallback((id) => {
    const cached = destinationCache.get(id);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }, []);

  // Set destination in cache
  const setCachedDestination = useCallback((id, data) => {
    destinationCache.set(id, {
      data,
      timestamp: Date.now()
    });
    setCache(new Map(destinationCache));
  }, []);

  // Clear expired cache entries
  const clearExpiredCache = useCallback(() => {
    const now = Date.now();
    for (const [key, value] of destinationCache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        destinationCache.delete(key);
      }
    }
    setCache(new Map(destinationCache));
  }, []);

  // Clear all cache
  const clearAllCache = useCallback(() => {
    destinationCache.clear();
    setCache(new Map(destinationCache));
  }, []);

  // Get cache stats
  const getCacheStats = useCallback(() => {
    return {
      size: destinationCache.size,
      entries: Array.from(destinationCache.entries()).map(([key, value]) => ({
        id: key,
        age: Date.now() - value.timestamp,
        isExpired: Date.now() - value.timestamp > CACHE_DURATION
      }))
    };
  }, []);

  // Clean up expired cache periodically
  useEffect(() => {
    const interval = setInterval(clearExpiredCache, CACHE_DURATION);
    return () => clearInterval(interval);
  }, [clearExpiredCache]);

  return {
    getCachedDestination,
    setCachedDestination,
    clearExpiredCache,
    clearAllCache,
    getCacheStats,
    cache
  };
};
