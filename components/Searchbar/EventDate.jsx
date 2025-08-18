"use client";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover } from "@/components/ui/popover";

import { BiCalendar, BiChevronDown } from "react-icons/bi";
import { useContext } from "react";
import { EventContext } from "@/context/EventContext";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";

const EventDate = () => {
  const { selectedDate, setSelectedDate } = useContext(EventContext);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  return (
    <div className="flex w-full items-center gap-[10px] xl:w-[190px]">
      <div className="text-lg text-[#3B82F6]">
        <BiCalendar />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="w-full justify-start p-0 bg-transparent hover:bg-transparent text-white shadow-none">
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>Pilih Tanggal</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-transparent border-0 shadow-none">
          <Calendar
            mode="single"
            selected={selectedDate}
            className="bg-transparent text-white rounded-xl p-4 shadow-none"
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
        <div className="text-[26px] text-white">
          <BiChevronDown/>
        </div>
      </Popover>
    </div>
  );
};

export default EventDate;
