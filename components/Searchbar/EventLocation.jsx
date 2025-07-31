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
  console.log("events:", events);
  console.log("event locations:", events.map(e => e.location));

  const uniqueLocations = [
    "All locations",
    ...new Set(events.map(event => event.location)),
  ];

  console.log(uniqueLocations);

  return (
    <div className='flex items-center gap-[10px] w-full xl:w-[190px] select-none'>
      {/* icon */}
      <div className='text-lg text-accent'>
        <BiMap />
      </div>
      <Select
        value={selectedLocation}
        onValueChange={(value) => setSelectedLocation(value)}
      >
        <SelectTrigger className="bg-transparent border-none focus:ring-0 focus:ring-offset-0 text-left p-0 ">
          <SelectValue placeholder="Event Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Location</SelectLabel>
            {uniqueLocations.map((location, index) => (
              <SelectItem key={index} value={location === "All locations" ? null : location}>
                {location}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    
  );
};

export default EventLocation;
