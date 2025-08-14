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
  const [selectedLocation, setSelectedLocation] = useState("all-locations");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // applied filters (after sumbt)
  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: "",
    selectedLocation: "all-locations",
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
      const matchesLocation = appliedFilters.selectedLocation && appliedFilters.selectedLocation !== "all-locations"
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

  // fetch aggregated destinations for user page
  useEffect(() => {
    const fetchAllDestinations = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/destinations");
        if (!res.ok) throw new Error("Failed to fetch destinations");
        const data = await res.json();

        const normalizeType = (value) => {
          if (!value || typeof value !== "string") return value;
          return value.toLowerCase().trim().replace(/\s+/g, "-");
        };

        const destinations = data?.destinations ?? {};
        const keys = [
          "wisata",
          "kuliner",
          "penginapan",
          "oleh_oleh",
          "desa_wisata",
          "biro_perjalanan",
          "events",
        ];

        const keyToSlug = (k) => (
          k === "oleh_oleh" ? "oleh-oleh" :
          k === "desa_wisata" ? "desa-wisata" :
          k === "biro_perjalanan" ? "biro-perjalanan" : k
        );

        const combined = keys.flatMap((key) => {
          const items = destinations?.[key]?.data ?? [];
          const categorySlug = keyToSlug(key);
          return items.map((item) => ({
            ...item,
            img_sm: item.img_sm || "/placeholder.jpg",
            img_lg: item.img_lg || "/placeholder.jpg",
            type: normalizeType(item.type),
            category: categorySlug, // force normalized category slug for routing
            __categoryKey: key,
          }));
        });

        setEvents(combined);
        setIsLoading(false);
      } catch (err) {
        setError(err?.message || "Failed to load data");
        setIsLoading(false);
      }
    };

    fetchAllDestinations();
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
    setSelectedLocation("all-locations");
    setSelectedDate("");
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