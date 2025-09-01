import Image from "next/image";
import { BiCalendar, BiTime, BiMap, BiStar } from "react-icons/bi";
import { HiArrowRight } from "react-icons/hi";
import { EventContext } from "@/context/EventContext";
import { useContext } from "react";

const Event = ({ event  }) => {
  const { formatDate } = useContext(EventContext);
  const dbDate = event?.date;
  const formattedDate = dbDate ? formatDate(dbDate) : 'Tanggal tidak tersedia'; 
  
  return (
    <div className="group h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white/95 dark:hover:bg-gray-800/95 transition-all duration-300 rounded-3xl overflow-hidden border border-gray-200/40 dark:border-gray-700/40 hover:border-blue-300/60 dark:hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-2xl dark:hover:shadow-blue-500/20 transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-48 sm:h-56 overflow-hidden"> 
        <Image
          src={event?.img_sm || "/placeholder.jpg"}
          fill
          alt={event?.title || "Event image"}
          quality={100}
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm">
          {event?.type || "Event"}
        </div>
        
        {/* Rating Badge */}
        {event?.rating && (
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
            <BiStar className="text-yellow-400 text-sm" />
            {event.rating}
          </div>
        )}
        
        {/* Hover Arrow */}
        <div className="absolute bottom-3 right-3 bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
          <HiArrowRight className="text-sm" />
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5 sm:p-6 flex flex-col h-full">
        {/* Title */}
        <h3 className="text-gray-900 dark:text-white font-bold text-lg sm:text-xl mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
          {event?.title || "Judul tidak tersedia"}
        </h3>
        
        {/* Description */}
        {event?.short_description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">
            {event.short_description}
          </p>
        )}
        
        {/* Features & Facilities */}
        {event?.features && Array.isArray(event.features) && event.features.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5">
              {event.features.slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg text-xs font-medium border border-blue-200/50 dark:border-blue-700/30"
                >
                  {feature}
                </span>
              ))}
              {event.features.length > 2 && (
                <span className="bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-lg text-xs font-medium border border-gray-200/50 dark:border-gray-600/30">
                  +{event.features.length - 2} lagi
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-3">
          <BiMap className="text-blue-500 dark:text-blue-400 text-base flex-shrink-0" />
          <span className="truncate font-medium">{event?.location || "Lokasi tidak tersedia"}</span>
        </div>
        
        {/* Date and Time */}
        <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-sm mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1.5">
            <BiCalendar className="text-blue-500 dark:text-blue-400 text-base flex-shrink-0"/>
            <span className="font-medium">{formattedDate}</span>
          </div>
          {event?.time && (
            <div className="flex items-center gap-1.5">
              <BiTime className="text-blue-500 dark:text-blue-400 text-base flex-shrink-0"/>
              <span className="font-medium">{event.time}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Event;
