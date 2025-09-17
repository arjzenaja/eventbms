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

  // Handle category change (when selecting main category)
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedSubCategory("");
    setSelectedType(category.toLowerCase().replace(/\s+/g, "-"));
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="text-blue-400">
        <BiLayer className="w-5 h-5" />
      </div>
      <Select
        value={selectedSubCategory || selectedCategory}
        onValueChange={(value) => {
          // Check if it's a main category or subcategory
          const isMainCategory = categoryTypes.some(cat => cat.category === value);
          if (isMainCategory) {
            handleCategorySelect(value);
          } else {
            handleSubCategoryChange(value);
          }
        }}
      >
        <SelectTrigger className={`bg-transparent border-none focus:ring-0 focus:ring-offset-0 text-left p-0 ${isDark ? 'text-white hover:bg-gray-700/50' : 'text-gray-900 hover:bg-gray-100/50'} shadow-none font-medium flex items-center justify-between`}>
          <SelectValue placeholder="Kategori Wisata" />
        </SelectTrigger>
        <SelectContent className={`z-30 ${isDark ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-md border ${isDark ? 'border-gray-600/30' : 'border-gray-200/30'} shadow-xl rounded-lg max-h-80 overflow-y-auto`}>
          <SelectGroup>
            <SelectLabel className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} px-3 py-2`}>Kategori Wisata</SelectLabel>
            {categoryTypes.map((cat, index) => (
              <div key={`category-${cat.category}-${index}`}>
                <SelectItem 
                  value={cat.category}
                  className={`${isDark ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-blue-50'} cursor-pointer px-3 py-2 font-medium`}
                >
                  {cat.category}
                </SelectItem>
                {cat.types.map((type, typeIndex) => (
                  <SelectItem 
                    key={`type-${type}-${typeIndex}`} 
                    value={type}
                    className={`${isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-blue-50'} cursor-pointer px-6 py-2 text-sm`}
                  >
                    {type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </div>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EventType;
