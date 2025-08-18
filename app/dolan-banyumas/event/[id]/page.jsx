// components
import EventSchedule from "@/components/EventSchedule";
import Image from "next/image";
import Timer from "@/components/Timer";
import CustomSelect from "@/components/CustomSelect";
import Organizers from "@/components/Organizers";
import DropdownKetentuan from "../../../event/[id]/DropdownKetentuan"; // pastikan sudah di-import

import { FaRegCircleCheck } from 'react-icons/fa6'
import { BiMap } from 'react-icons/bi'
import BuyTicket from "@/components/BuyTicket";
import { headers } from 'next/headers';

const EventDetails = async ({ params }) => {
  const { id } = await params;

  // fetch event based on the id 
  const fetchEvent = async (id) => {
    try {
      const headersList = await headers();
      const host = headersList.get('host');
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      const baseUrl = `${protocol}://${host}`;
      
      console.log(`Fetching event from: ${baseUrl}/api/events/${id}`);
      
      const res = await fetch(`${baseUrl}/api/events/${id}`, {
        cache: 'no-store'
      });
      
      if (!res.ok) {
        console.error(`HTTP error! status: ${res.status}`);
        throw new Error(`Failed to fetch event: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log('API response:', data);
      
      if (!data.success && data.message) {
        throw new Error(data.message);
      }
      
      return data.event || data; // Handle both API response format and direct data
    } catch (error) {
      console.error('Error fetching event:', error);
      throw new Error(`Failed to fetch event: ${error.message}`);
    }
  }; 

  let event;
  try {
    event = await fetchEvent(id);
  } catch (error) {
    console.error('Error in EventDetails:', error);
    // Return a simple error page
    return (
      <section className='flex items-center py-8 sm:py-48'>
        <div className="container mx-auto">
          <div className="w-full max-w-[600px] mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-4">The event you're looking for could not be found.</p>
            <a href="/dolan-banyumas" className="text-blue-600 hover:underline">
              Back to Events
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='flex items-center py-8 sm:py-48'>
      <div className="container mx-auto">
        <div className="w-full max-w-[600px] xl:max-w-none mx-auto">
          {/* event details 1 */}
          <div className="flex flex-col gap-8 xl:gap-24 xl:flex-row pt-28 pb-12 sm:py-0 xl:mb-24">
            {/* image */}
            <div className="relative w-full h-[320px] xl:max-w-[670px] xl:h-[500px] rounded-2xl overflow-hidden mb-12 xl:mb-0">
              <Image 
                src={event.img_lg || event.img_sm || "/placeholder.jpg"}
                fill
                className="object-cover mix-blend-lighten"
                quality={100}
                alt={event.title || "Event image"}
              />
            </div>
            {/* info */}
            <div className="flex w-full max-w-[460px] flex-col justify-center gap-8 flex-1 sm:mb-12 xl:mb-0">
              <div>
                <h2 className="h2 mb-4">{event.title || 'Untitled Event'}</h2>
                {event.type !== "objek-wisata" && event.type !== "wisata-alam" ? (
                  <EventSchedule event={event}/>
                ) : (
                  <div className='flex items-center gap-2 text-white/80 mb-2'>
                    <BiMap className='text-2xl text-blue-600'/>
                    <p>{event.location || 'Location not specified'}</p>
                  </div>
                )}
              </div>
               {event.type !== "objek-wisata" && event.type !== "wisata-alam" && (event.date || event.event_date) && <Timer event={event}/>}
              {event?.seats && Array.isArray(event.seats) && event.seats.length > 0 && (
                <>
                  <CustomSelect event={event}/>
                  <BuyTicket event={event}/>
                </>
              )}
            </div>
          </div>

          {/* event details 2 */}
          <div className="flex flex-col xl:flex-row gap-8 xl:gap-24">
            {/* text */}
            <div className="w-full xl:max-w-[670px] flex flex-col gap-8 xl:gap-12">
              <p className="text-grey text-justify leading-relaxed">{event.description || 'No description available'}</p>
              {/* Harga Paket dari database */}
              {event.packages && Array.isArray(event.packages) && event.packages.length > 0 && (
                <div className="flex flex-col gap-4">
                  {event.packages.map((pkg, idx) => {
                    // Ensure price is valid before rendering
                    const weekdayPrice = pkg?.prices?.weekday;
                    const isValidPrice = weekdayPrice && !isNaN(Number(weekdayPrice)) && Number(weekdayPrice) > 0;
                    
                    return (
                      <div key={idx} className="bg-[#23262e] rounded-xl flex flex-col md:flex-row items-center justify-between p-4 shadow border border-[#2a2d36]">
                        <div className="flex items-center gap-4 flex-1">
                          <img src={pkg?.image || "/placeholder.jpg"} alt={pkg?.name || "Package"} className="w-28 h-16 object-cover rounded-md border border-[#444]" />
                          <div>
                            <div className="text-lg font-bold text-white">{pkg?.desc || pkg?.name || 'Package'}</div>
                            {/* Harga di bawah judul */}
                            <div className="text-gray-400 text-base mb-1">
                              {isValidPrice ? `Rp ${Number(weekdayPrice).toLocaleString('id-ID')} / peserta` : 'Harga tidak tersedia'}
                            </div>
                            <div className="text-xs text-gray-400">{pkg?.details || ''}</div>
                            <DropdownKetentuan ketentuan={pkg?.ketentuan} />
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
                          <button className="bg-[#a4d007] hover:bg-[#8bc200] text-black font-bold px-4 py-2 rounded transition">Beli Sekarang</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* End Harga Paket */}
              <div>
                <h3 className="h3 mb-6">Requirements for the event</h3>
                <ul className="flex flex-col gap-4">
                  <li className="flex gap-3 items-center">
                    <span className="text-[#3B82F6] text-xl"> 
                      <FaRegCircleCheck/>
                    </span>
                    <p className="text-grey">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum, vero obcaecati! Dolore commodi accusamus eaque corporis, hic officiis pariatur? At eveniet odit corporis nisi, aut voluptates excepturi molestias! Exercitationem, libero.
                    </p>
                  </li>
                  <li className="flex gap-3 items-center">
                    <span className="text-[#3B82F6] text-xl"> 
                      <FaRegCircleCheck/>
                    </span>
                    <p className="text-grey">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum, vero obcaecati! Dolore commodi accusamus eaque corporis, hic officiis pariatur? At eveniet odit corporis nisi, aut voluptates excepturi molestias! Exercitationem, libero.
                    </p>
                  </li>
                  <li className="flex gap-3 items-center">
                    <span className="text-[#3B82F6] text-xl"> 
                      <FaRegCircleCheck/>
                    </span>
                    <p className="text-grey">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum, vero obcaecati! Dolore commodi accusamus eaque corporis, hic officiis pariatur? At eveniet odit corporis nisi, aut voluptates excepturi molestias! Exercitationem, libero.
                    </p>
                  </li>
                  <li className="flex gap-3 items-center">
                    <span className="text-[#3B82F6] text-xl"> 
                      <FaRegCircleCheck/>
                    </span>
                    <p className="text-grey">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum, vero obcaecati! Dolore commodi accusamus eaque corporis, hic officiis pariatur? At eveniet odit corporis nisi, aut voluptates excepturi molestias! Exercitationem, libero.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            {/* organizers */}
            <div className="w-full max-w-[460px]">
              <Organizers event={event}/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
