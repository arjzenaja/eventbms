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
import { useContext, useState } from "react";
import { EventContext } from "@/context/EventContext";
import { useTheme } from "@/context/ThemeContext";

const EventType = () => {
  const { events, selectedType, setSelectedType } = useContext(EventContext);
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  // Hierarchical structure with Kategori and Sub Kategori
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

  // Get sub categories based on selected category
  const getSubCategories = (category) => {
    const found = categoryTypes.find(cat => cat.category === category);
    return found ? found.types : [];
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory("");
    setSelectedType(""); // Reset type selection
  };

  // Handle sub category change
  const handleSubCategoryChange = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setSelectedType(subCategory);
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="text-blue-400">
        <BiLayer className="w-5 h-5" />
      </div>
      <Select
        value={selectedSubCategory}
        onValueChange={handleSubCategoryChange}
      >
        <SelectTrigger className={`bg-transparent border-none focus:ring-0 focus:ring-offset-0 text-left p-0 ${isDark ? 'text-white' : 'text-gray-900'} shadow-none font-medium flex items-center justify-between`}>
          <SelectValue placeholder="Kategori Wisata" />
        </SelectTrigger>
        <SelectContent className="z-30 bg-white/95 backdrop-blur-md border border-gray-200/30 shadow-xl rounded-lg">
          <SelectGroup>
            <SelectLabel className="font-semibold text-gray-900 px-3 py-2">Kategori Wisata</SelectLabel>
            {categoryTypes.map((cat, index) => (
              <SelectItem 
                key={`category-${cat.category}-${index}`} 
                value={cat.category}
                className="text-gray-900 hover:bg-blue-50 cursor-pointer px-3 py-2"
              >
                {cat.category}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EventType;
