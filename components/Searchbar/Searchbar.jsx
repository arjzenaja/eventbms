import React, { useContext } from 'react'
import { EventContext } from '@/context/EventContext';
import { useTheme } from '@/context/ThemeContext';

// components
import EventSearch from './EventSearch';
import EventLocation from './EventLocation';
import EventDate from './EventDate';
import EventType from './EventType';
import { BiRightArrowAlt } from 'react-icons/bi';

const Searchbar = () => {
  const { handleSumbit } = useContext(EventContext);
  const { isDark } = useTheme();
  
  return (
    <div className={`${isDark ? 'bg-gray-800/80' : 'bg-white/90'} backdrop-blur-md w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-max px-8 py-5 xl:px-10 xl:py-5 h-auto xl:h-[65px] rounded-2xl border ${isDark ? 'border-gray-600/30' : 'border-gray-200/50'} shadow-2xl flex flex-col xl:flex-row items-center justify-center gap-4 xl:gap-6 mx-auto text-sm relative`}>
      {/* event search */}
      <div className="flex-1 min-w-0 xl:min-w-[220px]">
        <EventSearch />
      </div>
      
      {/* separator */}
      <div className={`w-px h-7 ${isDark ? 'bg-gray-500/40' : 'bg-gray-300/60'} hidden xl:block`}></div>
      
      {/* event location */}
      <div className="flex-shrink-0 xl:min-w-[200px]">
        <EventLocation/>
      </div>
      
      {/* separator */}
      <div className={`w-px h-7 ${isDark ? 'bg-gray-500/40' : 'bg-gray-300/60'} hidden xl:block`}></div>
      
      {/* event date */}
      <div className="flex-shrink-0 xl:min-w-[200px]">
        <EventDate/>
      </div>
      
      {/* separator */}
      <div className={`w-px h-7 ${isDark ? 'bg-gray-500/40' : 'bg-gray-300/60'} hidden xl:block`}></div>
      
      {/* event type */}
      <div className="flex-shrink-0 xl:min-w-[200px]">
        <EventType/>
      </div>
      
      {/* separator */}
      <div className={`w-px h-7 ${isDark ? 'bg-gray-500/40' : 'bg-gray-300/60'} hidden xl:block`}></div>
      
      {/* submit btn */}
      <div className="flex-shrink-0">
        <button 
          onClick={ handleSumbit } 
          className='w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transform'
        >
          <BiRightArrowAlt className='text-xl text-white'/>
        </button>
      </div>
    </div>
  );
};

export default Searchbar;
