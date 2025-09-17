"use client";
import React, { useContext, useState, useEffect } from 'react';

//  import swiper react components
import { Swiper, SwiperSlide } from 'swiper/react';

// import swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';

import { EventContext } from '@/context/EventContext';

// components
import Link from 'next/link';
import Event from './Event/Event';
import SkeletonGrid from './SkeletonGrid';

const UpcomingEvents = () => {
  const { events } = useContext(EventContext);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    // Show all events for upcoming events section
    setFilteredEvents(events);
  }, [events]);

  return (
    <section className='mb-16'>
      <div className='mb-12 text-center pt-20'>
        <h3 className='pretitle'>Event</h3>
        <h2 className="h2">Event Terdekat</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mt-4">
          Temukan event menarik yang akan berlangsung di Banyumas
        </p>
      </div> 
      
      {/* slider */}
      {filteredEvents.length > 0 ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          pagination={{ dynamicBullets: true, clickable: true }}
          breakpoints={{ 
            640: { slidesPerView: 2},
            1024: { slidesPerView: 3},
            1310: { slidesPerView: 4},
          }}
          modules={[Pagination]}
          className='w-full h-[500px]'
        >
          {filteredEvents.map((event, index) => {
            // Determine the correct route based on the item's category
            const getItemRoute = (item) => {
              if (item.__categoryKey) {
                switch (item.__categoryKey) {
                  case 'wisata':
                    return `/destination/wisata/${item.id}`;
                  case 'kuliner':
                    return `/destination/kuliner/${item.id}`;
                  case 'penginapan':
                    return `/destination/penginapan/${item.id}`;
                  case 'oleh_oleh':
                    return `/destination/oleh-oleh/${item.id}`;
                  case 'desa_wisata':
                    return `/destination/desa-wisata/${item.id}`;
                  case 'biro_perjalanan':
                    return `/destination/biro-perjalanan/${item.id}`;
                  case 'events':
                  default:
                    return `/dolan-banyumas/event/${item.id}`;
                }
              }
              // Fallback to event route if no category key
              return `/dolan-banyumas/event/${item.id}`;
            };

            return (
              <SwiperSlide key={index} className='select-none'>
                <Link href={getItemRoute(event)}>
                  <Event event={event}/>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      ): (
        <SkeletonGrid itemCount={16}/>
      )}
    </section>
  );
};

export default UpcomingEvents
