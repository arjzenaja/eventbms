"use client";

import { useState } from "react";
import Image from "next/image";
import { BiZoomIn, BiZoomOut, BiX } from "react-icons/bi";

const DestinationGallery = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const mainImage = images?.[0] || "/placeholder.jpg";
  const secondaryImage = images?.[1];

  const handleImageClick = (index) => {
    setSelectedImage(index);
    setIsZoomed(true);
  };

  const closeZoom = () => {
    setIsZoomed(false);
  };

  const nextImage = () => {
    if (images && images.length > 1) {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images && images.length > 1) {
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <>
      <section className="space-y-4" aria-label="Galeri gambar">
        {/* Main Image */}
        <div className="relative w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
          <Image
            src={mainImage}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            alt={`Gambar utama ${title}`}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            onClick={() => handleImageClick(0)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <BiZoomIn className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Secondary Image */}
        {secondaryImage && secondaryImage !== mainImage && (
          <div className="relative w-full h-[150px] sm:h-[200px] rounded-xl overflow-hidden shadow-lg group cursor-pointer">
            <Image
              src={secondaryImage}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              alt={`Gambar tambahan ${title}`}
              sizes="(max-width: 768px) 100vw, 50vw"
              onClick={() => handleImageClick(1)}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <BiZoomIn className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        )}

        {/* Image Counter */}
        {images && images.length > 1 && (
          <div className="text-center text-sm text-slate-600 dark:text-gray-400">
            {images.length} gambar tersedia
          </div>
        )}
      </section>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeZoom}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors duration-200"
              aria-label="Tutup galeri"
            >
              <BiX className="text-3xl" />
            </button>

            {/* Navigation Buttons */}
            {images && images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10"
                  aria-label="Gambar sebelumnya"
                >
                  <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                    <span className="text-2xl">‹</span>
                  </div>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10"
                  aria-label="Gambar selanjutnya"
                >
                  <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                    <span className="text-2xl">›</span>
                  </div>
                </button>
              </>
            )}

            {/* Image */}
            <div className="relative">
              <Image
                src={images?.[selectedImage] || mainImage}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                alt={`Gambar ${selectedImage + 1} dari ${title}`}
              />
            </div>

            {/* Image Counter */}
            {images && images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full text-sm">
                {selectedImage + 1} / {images.length}
              </div>
            )}

            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={() => setIsZoomed(false)}
                className="text-white hover:text-gray-300 transition-colors duration-200"
                aria-label="Kembalikan ukuran"
              >
                <BiZoomOut className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DestinationGallery;
