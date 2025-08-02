"use client";
import React, { useState } from "react";


const DropdownKetentuan = ({ ketentuan }) => {
  const [open, setOpen] = useState(false);
  if (!ketentuan || ketentuan.length === 0) return null;
  return (
    <div className="mt-3">
      <div
        className={`bg-[#23262e] rounded-2xl shadow border border-[#2a2d36] transition-all duration-300 ${open ? "mb-4" : ""}`}
      >
        <button
          className="w-full flex items-center justify-between px-5 py-4 focus:outline-none"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#23262e] border border-[#444]">
              {/* icon, bisa diganti sesuai kebutuhan */}
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#a4d007"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#23262e">i</text></svg>
            </div>
            <span className="font-bold text-white text-lg">Ketentuan Paket</span>
          </div>
          <span className={`transition-transform duration-300 text-white text-xl ml-6 ${open ? "rotate-180" : ""}`}>{open ? "▲" : "▼"}</span>
        </button>
        {open && (
          <ul className="px-7 pb-5 pt-2 flex flex-col gap-2">
            {ketentuan.map((item, idx) => (
              <li
                key={idx}
                className={`flex items-center gap-2 text-sm text-gray-200 ${item.includes("MINIMAL") ? "font-bold text-[#a4d007]" : ""}`}
              >
                {/* bullet icon */}
                <span className="w-2 h-2 rounded-full bg-[#a4d007] inline-block"></span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DropdownKetentuan;
