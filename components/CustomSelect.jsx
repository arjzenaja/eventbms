"use client";

import { TicketContext } from '@/context/TicketContext';
import { useContext, useEffect } from 'react';

import { FaTicketAlt } from "react-icons/fa";
import { BiChevronDown } from 'react-icons/bi';

const CustomSelect = ({ event }) => {
  const { seat, showMenu, setShowMenu, handleSeat, initalizeEvent } =
    useContext(TicketContext);

  // initalize event
  useEffect(() => {
    initalizeEvent(event);
  }, []);
  return (
    <div 
      onClick={(e) => {
        setShowMenu((prev) => !prev); // toggle the menu state
        e.stopPropagation(); // prevent event bubling 
      }}
      className='custom-select bg-secondary w-full h-[64px] rounded-full flex items-center justify-between px-8 relative cursor-pointer select-none'
    >
      <div className='flex items-center gap-2 w-full'>
        <div className='text-xl text-blue-600'>
          <FaTicketAlt/>
        </div>
        <div className='flex items-center justify-between w-full'>
          <div className='flex-1 capitalize'>{seat.seat}</div>
          <div className='flex items-center gap-2'>
            <div className='font-semibold'>Rp {seat.price}</div>
            <div className='text-sm text-white/60'>Per Orang</div>
          </div>
        </div>
      </div>
      {/* menu */}
      {showMenu && (
        <ul className='bg-secondary absolute top-[70px] left-0 overflow-hidden w-full rounded-3xl h-[200px]'>
          {event.seats.map((seat, index) => (
            <li
              key={index}
              className='cursor-pointer hover:bg-white/5 px-8 py-5'
              onClick={(e) => {
                handleSeat(seat.seat, seat.price);
                e.stopPropagation();
              }}
            >
              <div className='flex justify-between'>
                <div className='capitalize'>{seat.seat}</div>
                <div>Rp{seat.price}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
