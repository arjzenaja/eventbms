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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from './ui/dropdown-menu';

import { EventContext } from '@/context/EventContext';

// components
import Link from 'next/link';
import Image from 'next/image';
import Event from './Event/Event';
import SkeletonGrid from './SkeletonGrid';

// icons
import { BiHome, BiMap, BiRestaurant, BiHotel, BiGift, BiBuilding, BiCar, BiCalendar, BiChevronDown } from 'react-icons/bi';

const UpcomingEvents = () => {
  const { events } = useContext(EventContext);
  const [eventValue, setEventValue] = useState('home');
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const filterEvents = () => {
      if (eventValue === 'home') {
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
        <h3 className='pretitle'>Wisata</h3>
        <h2 className="h2">Destinasi Banyumas</h2>
      </div> 
      <div className='flex flex-col xl:flex-row items-center justify-between mb-12'>
        <Tabs value={eventValue} onValueChange={setEventValue} className='bg-none w-full max-w-[800px] h-full flex justify-start items-center mb-12 xl:mb-0'>
          <TabsList className="flex flex-col lg:flex-row gap-6 bg-transparent w-full h-full justify-start">
            <TabsTrigger value="home" className="flex items-center gap-2 px-4 py-2">
              <BiHome className="text-lg" /> Semua
            </TabsTrigger>
            {/* Objek Wisata dengan dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <TabsTrigger value="objek-wisata" className="flex items-center gap-2 px-4 py-2">
                    <BiMap className="text-lg" /> Objek Wisata <BiChevronDown className="text-base" />
                  </TabsTrigger>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setEventValue('wisata-alam')}>Wisata Alam</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventValue('wisata-taman')}>Wisata Taman</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventValue('wisata-budaya')}>Wisata Budaya</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventValue('wisata-sejarah')}>Wisata Sejarah</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventValue('wisata-buatan')}>Wisata Buatan</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventValue('wisata-minat-khusus')}>Wisata Minat Khusus</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventValue('wisata-religi')}>Wisata Religi</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Kuliner dengan dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <TabsTrigger value="kuliner" className="flex items-center gap-2 px-4 py-2">
                    <BiRestaurant className="text-lg" /> Kuliner <BiChevronDown className="text-base" />
                  </TabsTrigger>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setEventValue('cafe')}>Cafe</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventValue('resto')}>Resto</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventValue('kedai')}>Kedai</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventValue('rumah-makan')}>Rumah Makan</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Penginapan dengan dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <TabsTrigger value="penginapan" className="flex items-center gap-2 px-4 py-2">
                    <BiHotel className="text-lg" /> Penginapan <BiChevronDown className="text-base" />
                  </TabsTrigger>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setEventValue('hotel')}>Hotel</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventValue('vila')}>Vila</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventValue('homestay')}>Homestay</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Oleh-oleh dengan dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <TabsTrigger value="oleh-oleh" className="flex items-center gap-2 px-4 py-2">
                    <BiGift className="text-lg" /> Oleh-oleh <BiChevronDown className="text-base" />
                  </TabsTrigger>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setEventValue('pakian')}>Pakian</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventValue('makanan')}>Makanan</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Desa Wisata tanpa dropdown */}
            <TabsTrigger value="desa-wisata" className="flex items-center gap-2 px-4 py-2">
              <BiBuilding className="text-lg" /> Desa Wisata
            </TabsTrigger>
            {/* Biro Perjalanan tanpa dropdown */}
            <TabsTrigger value="biro-perjalanan" className="flex items-center gap-2 px-4 py-2">
              <BiCar className="text-lg" /> Biro Perjalanan
            </TabsTrigger>
            {/* Event dengan dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <TabsTrigger value="event" className="flex items-center gap-2 px-4 py-2">
                    <BiCalendar className="text-lg" /> Event <BiChevronDown className="text-base" />
                  </TabsTrigger>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setEventValue('event-banyumas')}>Event Banyumas</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEventValue('event-masyarakat')}>Event Masyarakat</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TabsList>
        </Tabs>
        {/* <Link href={""} className='uppercase border-b-2 border-accent text-sm font-semibold text-accent'>Lihat Semua</Link> */}
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
        <SkeletonGrid itemCount={16}/>
      )}
    </section>
  );
};

export default UpcomingEvents
