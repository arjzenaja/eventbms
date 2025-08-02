"use client";
"use client";
import React, { useState } from "react";

import { FaTags } from "react-icons/fa";

const DropdownHarga = ({ packages }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [selectedType, setSelectedType] = useState('weekday');
  const selectedPkg = packages[selectedIdx];

  // Ambil harga sesuai tipe
  const price = selectedPkg.prices ? selectedPkg.prices[selectedType] : selectedPkg.price;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[#23262e] rounded-xl p-6 shadow border border-[#2a2d36]">
        <label className="font-bold text-xl text-white flex items-center gap-2 mb-4">
          <FaTags className="text-[#bada55] text-2xl" /> Pilih Paket
        </label>
        <select
          className="bg-[#181a20] text-white rounded px-4 py-3 pr-12 border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#bada55] w-full text-lg mb-2 appearance-none relative"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M5 8L10 13L15 8\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.5rem center', backgroundSize: '1.5rem' }}
          value={selectedIdx}
          onChange={e => setSelectedIdx(Number(e.target.value))}
        >
          {packages.map((pkg, idx) => (
            <option key={idx} value={idx}>
              {pkg.name || pkg.desc}
            </option>
          ))}
        </select>
        {/* Dropdown weekday/weekend */}
        {selectedPkg.prices && (
          <select
            className="bg-[#181a20] text-white rounded px-4 py-2 border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#bada55] w-full text-base mt-2 appearance-none relative"
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
          >
            <option value="weekday">Weekday</option>
            <option value="weekend">Weekend</option>
          </select>
        )}
      </div>
      <div className="bg-[#23262e] rounded-xl p-6 shadow border border-[#2a2d36] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 flex-1">
          <img src={selectedPkg.image} alt={selectedPkg.name} className="w-32 h-20 object-cover rounded-md border border-[#444]" />
          <div>
            <div className="text-2xl font-bold text-white mb-2">{selectedPkg.desc || selectedPkg.name}</div>
            <div className="text-sm text-gray-400 mb-2">{selectedPkg.details || ""}</div>
            {selectedPkg.type && (
              <div className="text-xs text-[#bada55] font-semibold">Tipe: {selectedPkg.type}</div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 min-w-[180px]">
          <span className="text-green-300 font-bold text-2xl">Rp {price?.toLocaleString("id-ID")}</span>
          <button className="mt-3 bg-[#a4d007] hover:bg-[#bada55] text-black font-bold px-6 py-2 rounded-lg transition-all duration-200 shadow hover:scale-105">Beli Sekarang</button>
        </div>
      </div>
    </div>
  );
};

export default DropdownHarga;
