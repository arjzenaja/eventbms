"use client";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "@/context/ThemeContext";

import { BiCalendar, BiChevronDown } from "react-icons/bi";
import { useContext } from "react";
import { EventContext } from "@/context/EventContext";

const EventDate = () => {
  const { selectedDate, setSelectedDate } = useContext(EventContext);
  const { isDark } = useTheme();
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  return (
    <div className="flex w-full items-center gap-3">
      <div className="text-blue-400">
        <BiCalendar className="w-5 h-5" />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button className={`w-full justify-start p-0 bg-transparent hover:bg-transparent ${isDark ? 'text-white' : 'text-gray-900'} shadow-none font-medium`}>
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>Pilih Tanggal</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-md border border-gray-200/30 shadow-xl">
          <Calendar
            mode="single"
            selected={selectedDate}
            className="bg-transparent text-gray-900 rounded-xl p-4"
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <BiChevronDown className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-900'} opacity-70`} />
    </div>
  );
};

export default EventDate;
