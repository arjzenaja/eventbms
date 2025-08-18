import Image from "next/image";
import { BiCalendar, BiTime, BiMap, BiStar } from "react-icons/bi";
import { EventContext } from "@/context/EventContext";
import { useContext } from "react";

const Event = ({ event  }) => {
  const { formatDate } = useContext(EventContext);
  const dbDate = event.date;
  const formattedDate = formatDate(dbDate); 
  return (
    <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-sm hover:bg-gray-100/90 dark:hover:bg-white/10 transition-all duration-300 rounded-3xl overflow-hidden border border-gray-200/60 dark:border-white/10 hover:border-gray-300/80 dark:hover:border-white/20 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-2xl dark:hover:shadow-blue-500/10 group-hover:scale-[1.02]">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden"> 
        <Image
          src={event.img_sm || "/placeholder.jpg"}
          fill
          alt={event.title || "Event image"}
          quality={100}
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg">
          {event.type || "Event"}
        </div>
        {/* Rating Badge */}
        {event.rating && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <BiStar className="text-yellow-400" />
            {event.rating}
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-gray-800 dark:text-white font-bold text-xl mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {event.title}
        </h3>
        
        {/* Description */}
        {event.short_description && (
          <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
            {event.short_description}
          </p>
        )}
        
        {/* Features & Facilities */}
        {event.features && event.features.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {event.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full text-xs"
                >
                  {feature}
                </span>
              ))}
              {event.features.length > 3 && (
                <span className="bg-gray-100 dark:bg-gray-600/20 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                  +{event.features.length - 3} lagi
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
          <BiMap className="text-blue-500 dark:text-blue-400 text-lg" />
          <span className="truncate">{event.location}</span>
        </div>
        
        {/* Date and Time */}
        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm mt-3">
          <div className="flex items-center gap-1">
            <BiCalendar className="text-blue-500 dark:text-blue-400 text-base"/>
            <span>{formattedDate}</span>
          </div>
          {event.time && (
            <div className="flex items-center gap-1">
              <BiTime className="text-blue-500 dark:text-blue-400 text-base"/>
              <span>{event.time}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Event;
