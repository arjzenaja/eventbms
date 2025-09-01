import { useEffect } from 'react';

// Image optimization utilities
export const imageConfig = {
  // Quality settings for different image types
  quality: {
    thumbnail: 60,
    preview: 75,
    full: 85,
    high: 90
  },
  
  // Sizes for responsive images
  sizes: {
    thumbnail: "96px",
    small: "(max-width: 640px) 100vw, 300px",
    medium: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    large: "(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw",
    full: "100vw"
  },
  
  // Blur placeholder data URL (tiny base64 encoded image)
  blurDataURL: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
};

// Get optimized image props based on type
export const getOptimizedImageProps = (type = 'medium', options = {}) => {
  const config = {
    quality: imageConfig.quality[type] || imageConfig.quality.medium,
    sizes: imageConfig.sizes[type] || imageConfig.sizes.medium,
    placeholder: 'blur',
    blurDataURL: imageConfig.blurDataURL,
    loading: type === 'thumbnail' ? 'lazy' : 'eager',
    ...options
  };
  
  return config;
};

// Preload image for smooth navigation
export const preloadImage = (src, callback) => {
  if (!src) return;
  
  const img = new window.Image();
  img.onload = () => {
    if (callback) callback(src);
  };
  img.onerror = () => {
    console.warn(`Failed to preload image: ${src}`);
  };
  img.src = src;
};

// Preload multiple images
export const preloadImages = (imageUrls, callback) => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;
  
  let loadedCount = 0;
  const totalImages = imageUrls.length;
  
  const onImageLoad = () => {
    loadedCount++;
    if (loadedCount === totalImages && callback) {
      callback();
    }
  };
  
  imageUrls.forEach(url => preloadImage(url, onImageLoad));
};

// Check if image is loaded
export const isImageLoaded = (src) => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
};

// Lazy loading utility
export const useLazyLoading = (ref, callback, options = {}) => {
  const { threshold = 0.1, rootMargin = '50px' } = options;
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, callback, threshold, rootMargin]);
};
