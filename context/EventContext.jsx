"use client";

import React, { createContext, useEffect, useState, useMemo } from "react";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEventlist, setShowEventlist] = useState(false);
 
  // current filter inputs 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("");``

  // applied filters (after sumbt)
  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: "",
    selectedLocation: "",
  });

  // filtered events based on applied filters
  const filteredEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset jam ke 00:00:00

    return events.filter((event) => {
      // check event date (exclude past events)
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0); // reset jam ke 00:00:00
      if (eventDate < today) return false;

      // check search term 
      const matchesSearch = appliedFilters.searchTerm
        ? event.title
          .toLowerCase()
          .includes(appliedFilters.searchTerm.toLowerCase())
        : true;

      // check location 
      const matchesLocation = appliedFilters.selectedLocation
        ? event.location.toLowerCase() === 
          appliedFilters.selectedLocation.toLowerCase()
        : true;

      // check date 
      const matchesDate = appliedFilters.selectedDate
        ? eventDate.toDateString() === 
          new Date(appliedFilters.selectedDate).toDateString()
        : true;

      // check type
      const matchesType = appliedFilters.selectedType
        ? event.type.toLowerCase() === 
          appliedFilters.selectedType.toLowerCase()
        : true;

      return matchesSearch && matchesLocation && matchesDate && matchesType;
    });
  }, [events, appliedFilters]);

  // fetch evet 
  useEffect(()=> {
    const fetchEvents = async () =>{
      // start loader 
      setIsLoading(true);
      try{
        const res  = await fetch("http://localhost:4000/events");
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data);
        // stop loader
        setIsLoading(false);
      } catch(err) {
        setError(err);
        //  stop loader
        setIsLoading(false);
      };
    };

    fetchEvents();
  }, []);

  const handleSumbit = () => {
    setIsLoading(true);
    setShowEventlist(true);
    setAppliedFilters({ 
      searchTerm, 
      selectedLocation, 
      selectedDate, 
      selectedType }); // tambahkan selectedDate
    setTimeout(() => {
      setIsLoading(false);
    }, 2500); 
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowEventlist(false);
    setSelectedLocation("");
    setSelectedDate(null);
    setSelectedType("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // format options 
    const options = { weekday: "short", month: "short", day: "numeric" };
    // return formatted date
    return date.toLocaleDateString("en-US", options);
  };

  return (
     <EventContext.Provider 
      value={{ 
        events, 
        isLoading, 
        error, 
        searchTerm, 
        setSearchTerm, 
        filteredEvents,
        handleSumbit,
        handleClearSearch,
        showEventlist, 
        selectedLocation,
        setSelectedLocation,
        selectedDate,
        setSelectedDate,
        selectedType,
        setSelectedType,
        formatDate,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;