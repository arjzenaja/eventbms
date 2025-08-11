import React from 'react';
import { BiRightArrowAlt } from 'react-icons/bi';

const EventPerMonth = () => {
  // Sample data - bisa diganti dengan data dari API
  const monthlyData = [
    { month: 'November', count: 1 },
    { month: 'Agustus', count: 1 },
    { month: 'Desember', count: 2 },
    { month: 'Januari', count: 3 }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Event per Bulan</h3>
      
      <div className="space-y-3">
        {monthlyData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">{item.month}</span>
            <div className="flex items-center gap-3">
              <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 font-semibold">{item.count}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 mt-4 pt-4">
        <div className="flex justify-end">
          <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
            Lihat Semua
            <BiRightArrowAlt className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPerMonth;
