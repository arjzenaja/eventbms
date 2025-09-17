"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Maximize2, Download } from 'lucide-react';

const PhotoGallery = ({ images, title, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const thumbnailContainerRef = useRef(null);

  // Memoize filtered images to prevent unnecessary re-computations
  const displayImages = useMemo(() => {
    const validImages = images?.filter(img => img && img.trim() !== '') || [];
    return validImages.length > 0 ? validImages : ['/placeholder.jpg'];
  }, [images]);

  // Reset current index when images change
  useEffect(() => {
    setCurrentIndex(0);
    setLoadedImages(new Set());
  }, [images]);

  // Memoize navigation functions
  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [displayImages.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    );
  }, [displayImages.length]);

  const goToImage = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Scroll thumbnail functions
  const scrollThumbnailsLeft = useCallback(() => {
    if (thumbnailContainerRef.current) {
      thumbnailContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }, []);

  const scrollThumbnailsRight = useCallback(() => {
    if (thumbnailContainerRef.current) {
      thumbnailContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }, []);

  // Optimized image loading handlers
  const handleImageLoad = useCallback((imageSrc) => {
    setLoadedImages(prev => new Set([...prev, imageSrc]));
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Memoize fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Optimized download function
  const downloadImage = useCallback(() => {
    const link = document.createElement('a');
    link.href = displayImages[currentIndex];
    link.download = `${title}-image-${currentIndex + 1}.jpg`;
    link.click();
  }, [displayImages, currentIndex, title]);

  // Preload next and previous images for smooth navigation
  useEffect(() => {
    if (displayImages.length > 1) {
      const preloadImage = (src) => {
        if (!loadedImages.has(src)) {
          const img = new window.Image();
          img.src = src;
          img.onload = () => handleImageLoad(src);
        }
      };

      // Preload current, next, and previous images
      const currentSrc = displayImages[currentIndex];
      const nextSrc = displayImages[(currentIndex + 1) % displayImages.length];
      const prevSrc = displayImages[(currentIndex - 1 + displayImages.length) % displayImages.length];

      preloadImage(currentSrc);
      preloadImage(nextSrc);
      preloadImage(prevSrc);
    }
  }, [currentIndex, displayImages, loadedImages, handleImageLoad]);

  // Keyboard navigation with useCallback
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevImage();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextImage();
    } else if (e.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false);
    }
  }, [prevImage, nextImage, isFullscreen]);

  // Memoize current image for performance
  const currentImage = useMemo(() => displayImages[currentIndex], [displayImages, currentIndex]);

  return (
    <div className={`relative w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'rounded-[2rem] overflow-hidden'} ${className}`}>
      {/* Main Image Container */}
      <div className={`relative w-full h-[400px] rounded-[2rem] overflow-hidden shadow-2xl group mt-3 ${isFullscreen ? 'h-screen' : 'h-[400px]'}`}>
        <Image
          src={currentImage}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-all duration-700 ease-out"
          alt={`${title} - Image ${currentIndex + 1}`}
          priority={currentIndex === 0}
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          onLoad={() => handleImageLoad(currentImage)}
          onError={handleImageError}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm flex items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-white rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Top Controls Bar */}
      {displayImages.length > 1 && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-white font-semibold text-lg truncate">{title}</h3>
              <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {currentIndex + 1} / {displayImages.length}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={downloadImage}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                aria-label="Download image"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                aria-label="Toggle fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              {isFullscreen && (
                <button
                  onClick={toggleFullscreen}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                  aria-label="Close fullscreen"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Arrows - Only show if more than 1 image */}
      {displayImages.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 shadow-lg"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 shadow-lg"
            aria-label="Next image"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </>
      )}

      {/* Controls row below the photo (inside card) */}
      {displayImages.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-3">
          {/* Prev Button (always visible) */}
          <button
            onClick={prevImage}
            className="w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-all duration-200"
            aria-label="Gambar sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dot Indicators */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/30 text-white/90">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button (always visible) */}
          <button
            onClick={nextImage}
            className="w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-all duration-200"
            aria-label="Gambar berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Toggle Thumbnails */}
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-white/90 bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md"
          >
            {showThumbnails ? 'Sembunyikan Gambar' : 'Tampilkan Gambar'}
          </button>
        </div>
      )}

      {/* External dots/toggle removed in favor of overlay controls above */}

      {/* Thumbnail Strip */}
      {showThumbnails && displayImages.length > 1 && (
        <div className="mt-4 bg-white/5 dark:bg-white/5 backdrop-blur-sm rounded-2xl pt-5 pb-3 px-3 border border-white/10 relative">
          <div 
            ref={thumbnailContainerRef}
            className="flex gap-3 overflow-x-auto pb-1 scroll-smooth thumbnail-scroll scrollbar-hide px-2"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent',
              minHeight: '100px',
              maxWidth: '100%',
              cursor: 'grab'
            }}

            onTouchStart={(e) => {
              // Enable touch scrolling
              e.currentTarget.style.cursor = 'grabbing';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.cursor = 'grab';
            }}
          >
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden transition-all duration-200 pt-1 ${
                  index === currentIndex
                    ? 'ring-2 ring-white/80 shadow'
                    : 'ring-1 ring-white/20 hover:ring-white/40'
                }`}
                style={{ minWidth: '96px' }}
              >
                <Image
                  src={image}
                  fill
                  sizes="96px"
                  className="object-cover"
                  alt={`Thumbnail ${index + 1}`}
                  quality={60}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard Navigation */}
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="absolute inset-0 focus:outline-none pointer-events-none"
        aria-label="Photo gallery navigation"
      />

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-40">
          <div className="relative w-full h-full">
            <Image
              src={currentImage}
              fill
              sizes="100vw"
              className="object-contain"
              alt={`${title} - Image ${currentIndex + 1}`}
              quality={90}
              priority
            />
            
            {/* Fullscreen Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={downloadImage}
                className="w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                aria-label="Download image"
              >
                <Download className="w-6 h-6" />
              </button>
              <button
                onClick={toggleFullscreen}
                className="w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                aria-label="Close fullscreen"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Fullscreen Navigation */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-8 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
