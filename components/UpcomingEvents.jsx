"use client";
import React, { useContext, useState, useEffect } from 'react';

//  import swiper react components
import { Swiper, SwiperSlide } from 'swiper/react';

// import swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination } from 'swiper/modules';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { EventContext } from '@/context/EventContext';

// components
import Link from 'next/link';
import Image from 'next/image';
import Event from './Event/Event';
import SkeletonGrid from './SkeletonGrid';

const UpcomingEvents = () => {
  const { events } = useContext(EventContext);
  const [eventValue, setEventValue] = useState('all');
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const filterEvents = () => {
      if (eventValue === 'all') {
          setFilteredEvents(events);
      } else {
        const result = events.filter((event) => event.type === eventValue);
        setFilteredEvents(result);
      }
    };

    filterEvents();
  }, [eventValue, events]);
  // console.log(eventValue);
  return (
    <section className='mb-16'>
      <div className='mb-12 text-center pt-20'>
        <h3 className='pretitle'>Upcoming</h3>
        <h2 className="h2">Popular Events</h2>
      </div> 
      <div className='flex flex-col xl:flex-row items-center justify-between mb-12'>
        <Tabs value={eventValue} onValueChange={setEventValue} className='bg-none w-full max-w-[600px] h-full flex justify-center items-center mb-12 xl:mb-0'>
          <TabsList className="flex flex-col lg:flex-row gap-6 bg-transparent w-full h-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sport">
              <Image src="/upcoming/sport.svg" alt="sport" width={18} height={18} /> Sport</TabsTrigger>
            <TabsTrigger value="music">
              <Image src="/upcoming/music.svg" alt="music" width={18} height={18} /> Music</TabsTrigger>
            <TabsTrigger value="food">
              <Image src="/upcoming/food.svg" alt="food" width={18} height={18} /> Food</TabsTrigger>
            <TabsTrigger value="art">
              <Image src="/upcoming/art.svg" alt="art" width={18} height={18} /> Art</TabsTrigger>
          </TabsList>
        </Tabs>
        <Link href={""} className='uppercase border-b-2 border-accent text-sm font-semibold text-accent'>See all events</Link>
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
          {filteredEvents.map((event, index) => (
            <SwiperSlide key={index} className='select-none'>
              <Link href={`/event/${event.id}`}>
                <Event event={event}/>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ): (
        <SkeletonGrid itemCount={4}/>
      )}
    </section>
  );
};

export default UpcomingEvents
