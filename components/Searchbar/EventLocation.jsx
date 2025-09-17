import { EventContext } from '@/context/EventContext';
import { useTheme } from '@/context/ThemeContext';
import React, { useContext } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
 } from "@/components/ui/select";

import { BiMap } from 'react-icons/bi';

const EventLocation = () => {
  const { events, selectedLocation, setSelectedLocation } = useContext(EventContext);
  const { isDark } = useTheme();
  
  // Ensure events is an array and filter out invalid locations
  const validLocations = Array.isArray(events) 
    ? events
        .filter(event => event && event.location)
        .map(event => event.location)
        .filter(location => location && typeof location === 'string' && location.trim() !== '')
        .map(location => location.trim())
    : [];
  
  // Filter out any empty or invalid locations from the Set
  const filteredLocations = Array.from(new Set(validLocations))
    .filter(location => location && typeof location === 'string' && location.trim() !== '')
    .sort(); // Sort locations alphabetically
  
  const uniqueLocations = [
    "Cari lokasi",
    ...filteredLocations
  ];

  console.log("Events array:", events);
  console.log("Valid locations:", validLocations);
  console.log("Unique locations:", uniqueLocations);

  return (
    <div className='flex items-center gap-3 w-full select-none'>
      <div className="text-blue-400">
        <BiMap className="w-5 h-5" />
      </div>
      <Select
        value={selectedLocation}
        onValueChange={(value) => setSelectedLocation(value)}
      >
        <SelectTrigger className={`bg-transparent border-none focus:ring-0 focus:ring-offset-0 text-left p-0 ${isDark ? 'text-white hover:bg-gray-700/50' : 'text-gray-900 hover:bg-gray-100/50'} shadow-none font-medium flex items-center justify-between`}>
          <SelectValue placeholder="Cari lokasi" />
        </SelectTrigger>
        <SelectContent className={`z-30 ${isDark ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-md border ${isDark ? 'border-gray-600/30' : 'border-gray-200/30'} shadow-xl rounded-lg`}>
          <SelectGroup>
            <SelectLabel className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} px-3 py-2`}>Location</SelectLabel>
            {uniqueLocations
              .filter(location => location && typeof location === 'string' && location.trim() !== '')
              .map((location, index) => {
                const value = location === "Cari lokasi" ? "all-locations" : location;
                
                // Final validation to ensure value is never empty
                if (!value || value.trim() === '') {
                  console.warn('Skipping location with empty value:', location);
                  return null;
                }
                
                return (
                  <SelectItem key={`location-${value}-${index}`} value={value} className={`${isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-blue-50'} cursor-pointer px-3 py-2`}>
                    {location}
                  </SelectItem>
                );
              })
              .filter(Boolean) // Remove any null items
            }
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    
  );
};

export default EventLocation;
