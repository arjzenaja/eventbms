"use client";
import React, { useContext } from 'react'
import { EventContext } from '@/context/EventContext';
import { BiCalendar, BiMap, BiTime, BiCalendarAlt } from 'react-icons/bi';

const EventSchedule = ({ event }) => {
  const { formatDate } = useContext(EventContext);
  const dbDate = event?.date || event?.event_date;
  const endDate = event?.end_date;
  const formattedDate = dbDate ? formatDate(dbDate) : null;
  const formattedEndDate = endDate ? formatDate(endDate) : null;
  
  return (
    <div className="space-y-4">
      {/* Date Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200/30 dark:border-purple-700/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <BiCalendar className="text-white w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Tanggal Mulai</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{formattedDate || '-'}</p>
        </div>

        {endDate && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200/30 dark:border-green-700/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <BiCalendarAlt className="text-white w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Tanggal Selesai</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">End Date</p>
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formattedEndDate || '-'}</p>
          </div>
        )}
      </div>

      {/* Time Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200/30 dark:border-blue-700/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <BiTime className="text-white w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Waktu Mulai</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Start Time</p>
            </div>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{event?.time || event?.hour || event?.event_time || '-'}</p>
        </div>

        {event?.end_time && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-4 rounded-xl border border-orange-200/30 dark:border-orange-700/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <BiTime className="text-white w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Waktu Selesai</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">End Time</p>
              </div>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{event.end_time}</p>
          </div>
        )}
      </div>

      {/* Location */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 p-4 rounded-xl border border-gray-200/30 dark:border-gray-700/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-500 rounded-xl flex items-center justify-center">
            <BiMap className="text-white w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Lokasi Event</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Event Location</p>
          </div>
        </div>
        <p className="text-lg font-bold text-gray-900 dark:text-white">{event?.location || '-'}</p>
        {event?.address && event.address !== event.location && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.address}</p>
        )}
      </div>
    </div>
  );
};

export default EventSchedule;
