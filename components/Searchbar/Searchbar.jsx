import React, { useContext } from 'react'
import { EventContext } from '@/context/EventContext';

// components
import EventSearch from './EventSearch';
import EventLocation from './EventLocation';
import EventDate from './EventDate';
import EventType from './EventType';
import { BiRightArrowAlt } from 'react-icons/bi';

const Searchbar = () => {
  const { handleSumbit } = useContext(EventContext);
  return (
    <div className='bg-white/5 w-[90vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-max p-8 xl:pl-8 xl:pr-2 h-auto xl:h-[70px] rounded-3xl xl:rounded-full backdrop-blur-[20px] flex flex-col xl:flex-row items-center gap-6 mx-auto text-sm relative'>
    {/* event search */}
    <EventSearch />
    <div className='border h-[20px] border-white/10 hidden xl:flex'></div>
    {/* event location */}
    <EventLocation/>
    <div className='border h-[20px] border-white/10 hidden xl:flex'></div>
    {/* event type */}
    <EventType/>
    <div className='border h-[20px] border-white/10 hidden xl:flex'></div>
    {/* submit btn */}
            <button onClick={ handleSumbit } className='w-full xl:w-[54px] h-[54px] rounded-[40px] xl:rounded-full bg-[#3B82F6] hover:bg-[#2563EB] transition-all flex items-center justify-center'>
      <BiRightArrowAlt className='text-3xl'/>
    </button>
    </div>
  );
};

export default Searchbar;
