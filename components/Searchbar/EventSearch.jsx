import React, { useContext } from 'react'
import { Input } from '../ui/input';
import { EventContext } from '@/context/EventContext';

import { BiSearch } from 'react-icons/bi';

const EventSearch = () => {
  const { searchTerm, setSearchTerm } = useContext(EventContext);
  return (
    <div className='flex items-center gap-[10px] w-full xl:w-[190px]'>
              <div className='text-lg text-[#3B82F6]'>
        <BiSearch />
      </div>
      <Input
        value={searchTerm}
        type="text"
        placeholder="Cari Jelajahi Banyumas"
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-0 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder-white/70 shadow-none"
        style={{ backgroundColor: 'transparent' }}
      />
    </div> 
  )
};

export default EventSearch;
