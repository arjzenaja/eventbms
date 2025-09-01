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
    <div className='bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl w-[90vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-max px-6 py-6 xl:pl-8 xl:pr-4 h-auto xl:h-[80px] rounded-3xl xl:rounded-full border-2 border-white/30 dark:border-gray-700/30 shadow-2xl shadow-black/10 dark:shadow-black/40 flex flex-col xl:flex-row items-center gap-6 xl:gap-8 mx-auto text-sm relative'>
      {/* event search */}
      <div className="flex-1 min-w-0">
        <EventSearch />
      </div>
      
      {/* separator */}
      <div className='border h-[20px] border-gray-300/40 dark:border-gray-600/40 hidden xl:flex'></div>
      
      {/* event location */}
      <div className="flex-shrink-0">
        <EventLocation/>
      </div>
      
      {/* separator */}
      <div className='border h-[20px] border-gray-300/40 dark:border-gray-600/40 hidden xl:flex'></div>
      
      {/* event type - horizontal layout */}
      <div className="flex-shrink-0 pr-2 xl:pr-3">
        <EventType/>
      </div>
      
      {/* separator */}
      <div className='border h-[20px] border-gray-300/40 dark:border-gray-600/40 hidden xl:flex'></div>
      
      {/* submit btn */}
      <div className="flex-shrink-0">
        <button 
          onClick={ handleSumbit } 
          className='w-full xl:w-[60px] h-[60px] rounded-[40px] xl:rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transform'
        >
          <BiRightArrowAlt className='text-3xl text-white'/>
        </button>
      </div>
    </div>
  );
};

export default Searchbar;
