import { EventContext } from '@/context/EventContext';
import React, { useContext } from 'react'
import Event from './Event';
import SkeletonGrid from '../SkeletonGrid';
import Link from 'next/link';

const EventList = () => {
  const { filteredEvents, isLoading, error } = useContext(EventContext);
  if (error) return <p>Error : {error}</p>;

  if (filteredEvents.length === 0 && !isLoading) {
    return (
      <div className='h-[80vh]'>
        <p className='text-white/80 text-center'>Tidak ada data ditemukan</p>
      </div>
    )
  }

  if (isLoading) {
    return <SkeletonGrid itemCount={12}/>;
  } else {
    const resolveHref = (item) => {
      const category = (item.category || '').toLowerCase();
      if (category === 'events' || category === 'event') return `/dolan-banyumas/event/${item.id}`;
      // map normalized slugs to route directories
      const mapped =
        category === 'oleh-oleh' ? 'oleh_oleh' :
        category === 'desa-wisata' ? 'desa_wisata' :
        category === 'biro-perjalanan' ? 'biro_perjalanan' : category;
      return `/dolan-banyumas/${mapped}/${item.id}`;
    };

    return ( 
      <div>
        <h1 className='h4 mb-6'>{filteredEvents.length} result found</h1>
        <div className='grid grid-cols-1 xl:grid-cols-4 gap-[30px] mb-32'>
          {filteredEvents.map((event, index) => {
            return (
              <div key={index} className='relative'>
                <Link className='absolute inset-0 z-10' href={resolveHref(event)} aria-label={`Lihat ${event.title}`}></Link>
                <Event event={event}/>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export default EventList;
