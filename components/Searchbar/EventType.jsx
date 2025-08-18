import { BiLayer, BiChevronDown } from "react-icons/bi";

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
        value={selectedType || "all-types"}
        onValueChange={(value) => setSelectedType(value)}
      >
        <SelectTrigger className="bg-transparent border-none focus:ring-0 focus:ring-offset-0 text-left p-0 capitalize text-gray-900 dark:text-white shadow-none font-medium flex items-center justify-between">
          <SelectValue placeholder="Semua Tipe" />
          <BiChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300 ml-2" />
        </SelectTrigger>
        <SelectContent className="z-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-none rounded-lg backdrop-blur-md">
          <SelectGroup>
            <SelectLabel className="font-semibold text-gray-900 dark:text-white px-3 py-2">Semua Tipe</SelectLabel>
            {allTypes.map((type, index) => (
              <SelectItem 
                key={`type-${type}-${index}`} 
                value={type === "Semua Tipe" ? "all-types" : type}
                className="text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer px-3 py-2"
              >
                {type === "Semua Tipe" ? "Semua Tipe" : type.replace(/-/g, ' ')}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EventType;
