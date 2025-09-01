"use client";

import React, { useContext } from 'react';
import Link from 'next/link';

// Swiper components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Components
import Event from '@/components/Event/Event';
import SkeletonGrid from '@/components/SkeletonGrid';

// Context
import { EventContext } from '@/context/EventContext';

const RecommendedEvent = () => {
  const { events } = useContext(EventContext);

  const filteredRecommendedEvents = events.filter(
    (event) => event.recommended === true
  );

  const swiperBreakpoints = {
    640: { slidesPerView: 2, spaceBetween: 20 },
    768: { slidesPerView: 2, spaceBetween: 24 },
    1024: { slidesPerView: 3, spaceBetween: 28 },
    1280: { slidesPerView: 3, spaceBetween: 32 },
    1310: { slidesPerView: 4, spaceBetween: 32 },
  };

  const swiperPagination = {
    dynamicBullets: true,
    clickable: true,
    el: '.swiper-pagination-custom',
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50/80 via-blue-50/40 to-indigo-50/40 dark:from-gray-900/90 dark:via-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm border border-gray-100/50 dark:border-gray-800/50 rounded-3xl mx-4">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">Khusus Untuk Anda</span>
          </div>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Rekomendasi <span className="text-blue-600 dark:text-blue-400">Terbaik</span>
          </h3>
          <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium">
            Jelajahi Destinasi Favorit Kami
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto mt-4">
            Temukan destinasi wisata terpopuler dan terbaik yang telah kami kurasi khusus untuk pengalaman wisata Anda
          </p>
        </div>

        {/* Content Section */}
        {filteredRecommendedEvents.length > 0 ? (
          <div className="relative">
            <Swiper
              slidesPerView={1}
              spaceBetween={24}
              pagination={swiperPagination}
              breakpoints={swiperBreakpoints}
              modules={[Pagination]}
              className="w-full pb-12"
            >
              {filteredRecommendedEvents.map((event, index) => (
                <SwiperSlide key={event.id || index} className="select-none">
                  <div className="h-full flex flex-col">
                    <Link href={`/dolan-banyumas/event/${event.id}`} className="h-full block group">
                      <Event event={event} />
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Custom Pagination - Centered */}
            <div className="swiper-pagination-custom flex justify-center items-center gap-2 mt-6 w-full text-center"></div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-3xl p-12 max-w-2xl mx-auto backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Belum Ada Rekomendasi
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Kami sedang mempersiapkan rekomendasi terbaik untuk Anda. Silakan cek kembali nanti!
              </p>
              <Link 
                href="/dolan-banyumas"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Jelajahi Semua Destinasi
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedEvent;
