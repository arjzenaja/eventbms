"use client";

import { useContext } from "react";
import { EventContext } from "@/context/EventContext";

// components
import Hero from "@/components/hero";
import EventList from "@/components/Event/EventList";
import UpcomingEvents from "@/components/UpcomingEvents";
import RecommendedEvent from "@/components/RecommendedEvent";
import DownloadApp from "@/components/DownloadApp";

const Home = () => {
  const { showEventlist, handleClearSearch } = useContext(EventContext);
  console.log(showEventlist);
  return (
    <div> 
      <Hero/>
      <div className="flex flex-col justify-center items-center">
      </div>
      {showEventlist ? (
        <div className="container mx-auto">
          <EventList />
        </div>
      ) : (
        <div>
          <div className="container mx-auto">
            {/* upcoming events slider */}
            <UpcomingEvents/>
            {/* download app section */}
            <DownloadApp />
            {/* recommended events slider */}
            <RecommendedEvent/>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
