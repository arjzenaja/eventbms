import { BiLayer } from "react-icons/bi";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useContext } from "react";
import { EventContext } from "@/context/EventContext";

const EventType = () => {
  const { events, selectedType, setSelectedType } = useContext(EventContext);

  const uniqueTypes = [
    "Semua Kategori",
    "Objek Wisata",
    "Kuliner", 
    "Penginapan",
    "Oleh-oleh",
    "Desa Wisata",
    "Biro Perjalanan",
    "Event"
  ];

  return (
    <div className="flex items-center gap-[10px] w-full xl:w-[190px]">
      {/* icon */}
            <div className='text-lg text-[#3B82F6]'>
              <BiLayer />
            </div>
            <Select
              value={selectedType ?? null}
              onValueChange={(value) => setSelectedType(value)}
            >
              <SelectTrigger className="bg-transparent border-none focus:ring-0 focus:ring-offset-0 text-left p-0 capitalize">
                <SelectValue placeholder="Kategori Wisata" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Kategori</SelectLabel>
                  {uniqueTypes.map((type, index) => (
                    <SelectItem key={index} value={type === "Semua Kategori" ? null : type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
    </div>
  )
}

export default EventType
