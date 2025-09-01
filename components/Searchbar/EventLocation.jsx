import { EventContext } from '@/context/EventContext';
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
  
  // Ensure events is an array and filter out invalid locations
  const validLocations = Array.isArray(events) 
    ? events
        .filter(event => event && event.location)
        .map(event => event.location)
        .filter(location => location && typeof location === 'string' && location.trim() !== '')
    : [];
  
  // Filter out any empty or invalid locations from the Set
  const filteredLocations = Array.from(new Set(validLocations))
    .filter(location => location && typeof location === 'string' && location.trim() !== '');
  
  const uniqueLocations = [
    "Cari lokasi",
    ...filteredLocations
  ];

  console.log("Events array:", events);
  console.log("Valid locations:", validLocations);
  console.log("Unique locations:", uniqueLocations);

  return (
    <div className='flex items-center gap-[10px] w-full xl:w-[190px] select-none'>
      {/* icon */}
      <div className='text-lg text-[#3B82F6]'>
        <BiMap />
      </div>
      <Select
        value={selectedLocation}
        onValueChange={(value) => setSelectedLocation(value)}
      >
        <SelectTrigger className="bg-transparent border-none focus:ring-0 focus:ring-offset-0 text-left p-0 text-white shadow-none font-medium flex items-center justify-between">
          <SelectValue placeholder="Cari lokasi" />
        </SelectTrigger>
        <SelectContent className="z-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-none rounded-lg backdrop-blur-md">
          <SelectGroup>
            <SelectLabel className="font-semibold text-gray-900 dark:text-white px-3 py-2">Location</SelectLabel>
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
                  <SelectItem key={`location-${value}-${index}`} value={value} className="text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer px-3 py-2">
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
