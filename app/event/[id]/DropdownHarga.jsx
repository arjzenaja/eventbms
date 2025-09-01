"use client";
import React, { useState } from "react";
import { FaTags, FaCheck, FaThumbsUp, FaBriefcase, FaBuilding } from "react-icons/fa";

const DropdownHarga = ({ packages }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [selectedType, setSelectedType] = useState('weekday');
  const selectedPkg = packages[selectedIdx];

  // Ambil harga sesuai tipe
  const price = selectedPkg.prices ? selectedPkg.prices[selectedType] : selectedPkg.price;

  // Get package features (assuming they're stored in includes or details)
  const getPackageFeatures = (pkg) => {
    if (pkg.includes && Array.isArray(pkg.includes)) {
      return pkg.includes;
    } else if (pkg.includes && typeof pkg.includes === 'string') {
      return pkg.includes.split(',').map(s => s.trim()).filter(Boolean);
    } else if (pkg.details) {
      return [pkg.details];
    }
    return ['Fasilitas lengkap', 'Dokumentasi', 'Sertifikat', 'Support 24/7'];
  };

  const features = getPackageFeatures(selectedPkg);

  // Get icon for package type
  const getPackageIcon = (pkg, index) => {
    if (pkg.type === 'business' || index === 1) return FaBriefcase;
    if (pkg.type === 'enterprise' || index === 2) return FaBuilding;
    return FaThumbsUp; // default for free/basic
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Pilih Paket Wisata
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Pilih paket yang sesuai dengan kebutuhan Anda
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Plan Options */}
          <div className="lg:col-span-1 space-y-4">
            {packages.map((pkg, idx) => {
              const IconComponent = getPackageIcon(pkg, idx);
              const isSelected = idx === selectedIdx;
              const pkgPrice = pkg.prices ? pkg.prices[selectedType] : pkg.price;
              
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedIdx(idx)}
                  className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    isSelected 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  } rounded-xl p-4 shadow-sm`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-white/20' : 'bg-purple-100 dark:bg-purple-900/30'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          isSelected ? 'text-white' : 'text-purple-600 dark:text-purple-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${
                          isSelected ? 'text-white' : 'text-gray-900 dark:text-white'
                        }`}>
                          {pkg.name || pkg.desc || `Paket ${idx + 1}`}
                        </h3>
                        <p className={`text-sm ${
                          isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          Untuk {idx === 0 ? 'individu' : idx === 1 ? 'kelompok kecil' : 'kelompok besar'}
                        </p>
                      </div>
                    </div>
                    <div className={`text-right ${
                      isSelected ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      <div className="font-bold text-lg">
                        {pkgPrice ? `Rp ${Number(pkgPrice).toLocaleString('id-ID')}` : 'Gratis'}
                      </div>
                      <div className={`text-xs ${
                        isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {pkg.unit || '/orang'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Section - Plan Details */}
          <div className="lg:col-span-2">
            <div className="bg-purple-600 rounded-2xl overflow-hidden shadow-xl">
              {/* Header */}
              <div className="bg-purple-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-1">
                  {selectedPkg.name || selectedPkg.desc || 'Paket Terpilih'}
                </h3>
                <p className="text-purple-100">
                  Untuk {selectedIdx === 0 ? 'individu' : selectedIdx === 1 ? 'kelompok kecil' : 'kelompok besar'}
                </p>
              </div>

              {/* Content */}
              <div className="bg-white dark:bg-gray-800 p-6">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                    {price ? `Rp ${Number(price).toLocaleString('id-ID')}` : 'Gratis'}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {selectedPkg.unit || '/orang'}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaCheck className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Additional Info */}
                {selectedPkg.details && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Detail Tambahan:</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{selectedPkg.details}</p>
                  </div>
                )}

                {/* Purchase Button */}
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Beli Paket Sekarang
                </button>
              </div>
      </div>
          </div>
        </div>

        {/* Weekday/Weekend Selector */}
        {selectedPkg.prices && (
          <div className="mt-6 text-center">
            <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setSelectedType('weekday')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedType === 'weekday'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Weekday
              </button>
              <button
                onClick={() => setSelectedType('weekend')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedType === 'weekend'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Weekend
              </button>
            </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default DropdownHarga;
