import Image from "next/image";
import { BiCalendar, BiTime, BiMap } from "react-icons/bi";
import { EventContext } from "@/context/EventContext";
import { useContext } from "react";

const Event = ({ event  }) => {
  const { formatDate } = useContext(EventContext);
  const dbDate = event.date;
  const formattedDate = formatDate(dbDate); 
  return (
    <div className="bg-white/5 hover:bg-white/10 transition-all h-[440px] rounded-3xl flex flex-col justify-start p-4 w-[320px] sm:w-full mx-auto sm:mx-0">
      <div className="relative w-full h-[320px] mb-10"> 
        <Image
          src={event.img_sm}
          fill
          alt=""
          quality={100}
          className="rounded-2xl object-cover"
         />
         <div className="absolute -bottom-[24px] left-4 bg-[#3B82F6] w-[110px] h-[48px] text-[13px] uppercase font-medium rounded-full flex items-center justify-center">
          {event.type}
         </div>
      </div>
      <div className="pl-4 flex flex-col justify-between h-[50%]">
        <div>
          {event.type !== "wisata-alam" && (
            <div className="flex items-center gap-2 text-[#3B82F6] mb-2">
              <div className="flex items-center gap-1">
                <BiCalendar/> 
                {/* hardcoded date - change it later */}
                <div>{formattedDate}</div>
              </div>
              <div className="flex items-center gap-1">
                <BiTime/> 
                <div>{event.hour}</div>
              </div>
            </div>
          )}
          <h4 className="h4 mb-4">{event.title}</h4>
          {event.title && event.title.toLowerCase() === "hutan pinus limpakuwus" && event.short_description && (
            <p className="text-white/70 text-base text-justify mb-4">
              {event.short_description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 pb-2">
          <BiMap className="text-xl text-[#3B82F6]"/>
          <p className="text-sm font-light text-white/70">{event.location}</p>
        </div>
      </div>
    </div>
  );
};

export default Event;
