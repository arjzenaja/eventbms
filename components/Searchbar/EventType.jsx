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

  // New hierarchical structure based on user requirements
  const categoryTypes = [
    {
      category: "Wisata",
      types: [
        "wisata-alam",
        "wisata-taman", 
        "wisata-budaya",
        "wisata-sejarah",
        "wisata-buatan",
        "wisata-minat-khusus",
        "wisata-religi"
      ]
    },
    {
      category: "Kuliner",
      types: [
        "cafe",
        "resto",
        "kedai",
        "rumah-makan"
      ]
    },
    {
      category: "Penginapan",
      types: [
        "hotel",
        "vila",
        "homestay"
      ]
    },
    {
      category: "Oleh-oleh",
      types: [
        "pakaian",
        "makanan"
      ]
    },
    {
      category: "Desa Wisata",
      types: [
        "desa-wisata"
      ]
    },
    {
      category: "Biro Perjalanan",
      types: [
        "biro-perjalanan"
      ]
    },
    {
      category: "Event",
      types: [
        "event-banyumas",
        "event"
      ]
    }
  ];

  // Flatten all types for the main dropdown
  const allTypes = [
    "Semua Tipe",
    ...categoryTypes.flatMap(cat => cat.types)
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
          <SelectValue placeholder="Semua Tipe" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Semua Tipe</SelectLabel>
            {allTypes.map((type, index) => (
              <SelectItem 
                key={index} 
                value={type === "Semua Tipe" ? null : type} 
                className="capitalize"
              >
                {type === "Semua Tipe" ? "Semua Tipe" : 
                 type === "wisata-alam" ? "Wisata Alam" :
                 type === "wisata-taman" ? "Wisata Taman" :
                 type === "wisata-budaya" ? "Wisata Budaya" :
                 type === "wisata-sejarah" ? "Wisata Sejarah" :
                 type === "wisata-buatan" ? "Wisata Buatan" :
                 type === "wisata-minat-khusus" ? "Wisata Minat Khusus" :
                 type === "wisata-religi" ? "Wisata Religi" :
                 type === "cafe" ? "Cafe" :
                 type === "resto" ? "Resto" :
                 type === "kedai" ? "Kedai" :
                 type === "rumah-makan" ? "Rumah Makan" :
                 type === "hotel" ? "Hotel" :
                 type === "vila" ? "Vila" :
                 type === "homestay" ? "Homestay" :
                 type === "pakaian" ? "Pakaian" :
                 type === "makanan" ? "Makanan" :
                 type === "desa-wisata" ? "Desa Wisata" :
                 type === "biro-perjalanan" ? "Biro Perjalanan" :
                 type === "event-banyumas" ? "Event Banyumas" :
                 type === "event" ? "Event" : type
                }
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default EventType
