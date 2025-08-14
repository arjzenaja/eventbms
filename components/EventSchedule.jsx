"use client";
import React, { useContext } from 'react'
import { EventContext } from '@/context/EventContext';
import { BiCalendar, BiMap } from 'react-icons/bi';

const EventSchedule = ({ event }) => {
  const { formatDate } = useContext(EventContext);
  const dbDate = event?.date || event?.event_date;
  const formattedDate = dbDate ? formatDate(dbDate) : null; 
  return (
    <div className='flex flex-col xl:flex-row gap-4 items-start justify-between'>
      <div className='flex items-center gap-2 text-white/80 mb-2'>
        <BiCalendar className='text-2xl text-blue-600'/>
        <div>{formattedDate || '-'}</div>
      </div>
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-2'>
          <div>•</div>
          <p>{event?.hour || event?.event_time || '-'}</p>
        </div>
      </div>
      <div className='flex items-center gap-2 text-white/80'>
        <BiMap className='text-2xl text-blue-600'/>
        <p>{event.location}</p>
      </div>
    </div>
  );
};

export default EventSchedule;
