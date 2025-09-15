import React, { useContext } from 'react'
import { Input } from '../ui/input';
import { EventContext } from '@/context/EventContext';
import { useTheme } from '@/context/ThemeContext';

import { BiSearch } from 'react-icons/bi';

const EventSearch = () => {
  const { searchTerm, setSearchTerm } = useContext(EventContext);
  const { isDark } = useTheme();
  
  return (
    <div className='flex items-center gap-3 w-full'>
      <div className='text-blue-400'>
        <BiSearch className="w-5 h-5" />
      </div>
      <Input
        value={searchTerm}
        type="text"
        placeholder="Cari Kategori"
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`w-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${isDark ? 'text-white placeholder:text-gray-300' : 'text-gray-900 placeholder:text-gray-500'} shadow-none p-0 h-auto`}
        style={{ backgroundColor: 'transparent' }}
      />
    </div> 
  )
};

export default EventSearch;
