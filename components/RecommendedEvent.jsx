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
import Event from './Event/Event';
import SkeletonGrid from './SkeletonGrid';

// Context
import { EventContext } from '@/context/EventContext';

const RecommendedEvent = () => {
  const { events } = useContext(EventContext);

  const filteredRecommendedEvents = events.filter(
    (event) => event.recommended === true
  );

  const swiperBreakpoints = {
    640: { slidesPerView: 2 },
    1024: { slidesPerView: 3 },
    1310: { slidesPerView: 4 },
  };

  const swiperPagination = {
    dynamicBullets: true,
    clickable: true,
  };

  return (
    <section className="mb-32">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h3 className="pretitle text-blue-600 dark:text-blue-400">
          Rekomendasi Untuk Anda
        </h3>
        <h2 className="h2 text-gray-900 dark:text-white">
          Jelajahi Favorit
        </h2>
      </div>

      {/* Content Section */}
      {filteredRecommendedEvents.length > 0 ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          pagination={swiperPagination}
          breakpoints={swiperBreakpoints}
          modules={[Pagination]}
          className="w-full h-[500px]"
        >
          {filteredRecommendedEvents.map((event, index) => (
            <SwiperSlide key={event.id || index} className="select-none">
              <Link href={`/dolan-banyumas/event/${event.id}`}>
                <Event event={event} />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <SkeletonGrid itemCount={4} />
      )}
    </section>
  );
};

export default RecommendedEvent;
