"use client";
import React, { useEffect, useState, useMemo } from 'react'

const Timer = ({ event }) => {
  // calculate the target event date and time using useMemo to prevent recreation
  const eventDate = useMemo(() => new Date(`${event.date}T${event.hour}`), [event.date, event.hour]);

  // state to track the remaining time in miliseconds
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // handle the countdown timer logic
  useEffect(() => {
    // Set client flag to true after component mounts
    setIsClient(true);
    
    // Initialize time remaining
    const now = new Date();
    const initialTimeLeft = eventDate - now;
    setTimeRemaining(initialTimeLeft > 0 ? initialTimeLeft : 0);

    // set up an interval that updates every seconds
    const interval = setInterval(() => {
      const now = new Date(); // get current time 
      const timeLeft = eventDate - now; // calculate the remaining time 

      // if the time is up, clear the interval and stop the countdown
      if (timeLeft <= 0) {
        clearInterval(interval);
        setTimeRemaining(0);
      } else {
        setTimeRemaining(timeLeft) // update the remaining time state
      }
    }, 1000); // runs every 1000 miliseconds (1 seconds)

    // cleanup function to celar the interval when the component unmounts
    return () => clearInterval(interval);
  }, [eventDate]); // dependency array ensures the effect runs only when 'eventDate' changes

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className='flex flex-wrap gap-4'>
        <div className='text-center border-[3px] border-[#3B82F6] rounded-full w-[100px] h-[100px] flex items-center justify-center'>
          <div>
            <div className='text-3xl font-semibold'>--</div>
            <div className='text-sm uppercase font-medium'>Days</div>
          </div>
        </div>
        <div className='text-center border-[3px] border-[#3B82F6] rounded-full w-[100px] h-[100px] flex items-center justify-center'>
          <div>
            <div className='text-3xl font-semibold'>--</div>
            <div className='text-sm uppercase font-medium'>Hours</div>
          </div>
        </div>
        <div className='text-center border-[3px] border-[#3B82F6] rounded-full w-[100px] h-[100px] flex items-center justify-center'>
          <div>
            <div className='text-3xl font-semibold'>--</div>
            <div className='text-sm uppercase font-medium'>Minutes</div>
          </div>
        </div>
        <div className='text-center border-[3px] border-[#3B82F6] rounded-full w-[100px] h-[100px] flex items-center justify-center'>
          <div>
            <div className='text-3xl font-semibold'>--</div>
            <div className='text-sm uppercase font-medium'>Seconds</div>
          </div>
        </div>
      </div>
    );
  }

  // if the countdown has ended, display a message
  if(timeRemaining <= 0) {
    return <div>The Event has already passed!</div>;
  }

  // calculate the remaining days, hours, minutes and seconds from 'timeRemaining'
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24)); // total days
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) 
  ); // remaining hours in the current day 
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)); // remainng minutes in the current hour
  const second = Math.floor((timeRemaining % (1000 * 60)) / 1000); // in the current minute

  return (
  <div className='flex flex-wrap gap-4'>
    {/* days */}
    <div className='text-center border-[3px] border-[#3B82F6] rounded-full w-[100px] h-[100px] flex items-center justify-center'>
      <div>
        <div className='text-3xl font-semibold'>{days}</div>
        <div className='text-sm uppercase font-medium'>Days</div>
      </div>
    </div>
    {/* hour */}
    <div className='text-center border-[3px] border-[#3B82F6] rounded-full w-[100px] h-[100px] flex items-center justify-center'>
      <div>
        <div className='text-3xl font-semibold'>{hours}</div>
        <div className='text-sm uppercase font-medium'>Hours</div>
      </div>
    </div>
    {/* minutes */}
    <div className='text-center border-[3px] border-[#3B82F6] rounded-full w-[100px] h-[100px] flex items-center justify-center'>
      <div>
        <div className='text-3xl font-semibold'>{minutes}</div>
        <div className='text-sm uppercase font-medium'>Minutes</div>
      </div>
    </div>
    {/* seconds */}
    <div className='text-center border-[3px] border-[#3B82F6] rounded-full w-[100px] h-[100px] flex items-center justify-center'>
      <div>
        <div className='text-3xl font-semibold'>{second}</div>
        <div className='text-sm uppercase font-medium'>Seconds</div>
      </div>
    </div>
  </div>
  )
}

export default Timer
