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

const EventType = () => {
  const { events, selectedType, setSelectedType } = useContext(EventContext);
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
    <div className="flex items-end xl:items-center gap-4 xl:gap-6 w-full max-w-[420px]">
      {/* Kategori Dropdown */}
      <div className="flex flex-col gap-1 flex-1 min-w-[170px]">
        <label className="text-white font-bold text-xs">Kategori</label>
        <div className="flex items-center gap-2">
          <div className='text-sm text-[#3B82F6]'>
            <BiLayer />
          </div>
          <Select
            value={selectedCategory}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="bg-white/20 border border-blue-300 rounded-md focus:ring-0 focus:ring-offset-0 text-left px-3 py-2 text-white placeholder-gray-300 shadow-none font-medium flex items-center justify-between text-sm h-9">
              <SelectValue placeholder="Pilih Kategori" />
              <BiChevronDown className="w-3 h-3 text-white" />
            </SelectTrigger>
            <SelectContent className="z-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-none rounded-lg backdrop-blur-md">
              <SelectGroup>
                <SelectLabel className="font-semibold text-gray-900 dark:text-white px-3 py-2">Kategori</SelectLabel>
                {categoryTypes.map((cat, index) => (
                  <SelectItem 
                    key={`category-${cat.category}-${index}`} 
                    value={cat.category}
                    className="text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer px-3 py-2"
                  >
                    {cat.category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sub Kategori Dropdown */}
      <div className="flex flex-col gap-1 flex-1 min-w-[190px]">
        <label className="text-white font-bold text-xs">Sub Kategori</label>
        <div className="flex items-center gap-2">
          <div className='text-sm text-[#3B82F6]'>
            <BiLayer />
          </div>
          <Select
            value={selectedSubCategory}
            onValueChange={handleSubCategoryChange}
            disabled={!selectedCategory}
          >
            <SelectTrigger className="bg-white/20 border border-blue-300 rounded-md focus:ring-0 focus:ring-offset-0 text-left px-3 py-2 text-white placeholder-gray-300 shadow-none font-medium flex items-center justify-between text-sm h-9 disabled:opacity-50">
              <SelectValue placeholder="Pilih Sub Kategori" />
              <BiChevronDown className="w-3 h-3 text-white" />
            </SelectTrigger>
            <SelectContent className="z-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl dark:shadow-none rounded-lg backdrop-blur-md">
              <SelectGroup>
                <SelectLabel className="font-semibold text-gray-900 dark:text-white px-3 py-2">Sub Kategori</SelectLabel>
                {selectedCategory && getSubCategories(selectedCategory).map((subCat, index) => (
                  <SelectItem 
                    key={`subcategory-${subCat}-${index}`} 
                    value={subCat}
                    className="text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer px-3 py-2"
                  >
                    {subCat.replace(/-/g, ' ')}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default EventType;
