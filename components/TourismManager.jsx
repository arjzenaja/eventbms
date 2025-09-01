"use client";
import { BiPhone, BiEnvelope, BiMap, BiTime, BiStar, BiUser, BiBuilding } from 'react-icons/bi';
import { FaWhatsapp, FaInstagram, FaGlobe } from 'react-icons/fa';

const TourismManager = ({ destination, contactInfo }) => {
  console.log('TourismManager rendering with:', { destination, contactInfo });
  
  return (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
          <BiBuilding className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Pengelola Wisata</h3>
          <p className="text-gray-600 dark:text-gray-400">Tim pengelola destinasi wisata</p>
        </div>
      </div>

      {/* Manager Profile Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-5 mb-6 border border-blue-200 dark:border-blue-700">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <BiUser className="w-8 h-8 text-white" />
          </div>
          
          {/* Manager Info */}
          <div className="flex-1">
            <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
              {destination?.manager || "Tim Pengelola Wisata"}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-2">Pengelola Destinasi</p>
            
            {/* Rating Badge */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <BiStar className="w-4 h-4 text-yellow-500 fill-current" />
                <BiStar className="w-4 h-4 text-yellow-500 fill-current" />
                <BiStar className="w-4 h-4 text-yellow-500 fill-current" />
                <BiStar className="w-4 h-4 text-yellow-500 fill-current" />
                <BiStar className="w-4 h-4 text-yellow-500 fill-current" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">5.0 (Terpercaya)</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Siap melayani
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4 mb-6">
        <h5 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Informasi Kontak</h5>
        
        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Phone */}
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <BiPhone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Telepon</p>
                <p className="font-medium text-gray-800 dark:text-white">+62 812-3456-7890</p>
              </div>
              <a 
                href="tel:+6281234567890"
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
              >
                <BiPhone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-4 border border-green-100 dark:border-green-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <FaWhatsapp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">WhatsApp</p>
                <p className="font-medium text-gray-800 dark:text-white">+62 812-3456-7890</p>
              </div>
              <a 
                href="https://wa.me/6281234567890?text=Halo, saya tertarik dengan destinasi wisata"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h5 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Aksi Cepat</h5>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Call Button */}
          <a 
            href="tel:+6281234567890"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <BiPhone className="w-5 h-5" />
            <span>Telepon</span>
          </a>

          {/* WhatsApp Button */}
          <a 
            href="https://wa.me/6281234567890?text=Halo, saya tertarik dengan destinasi wisata"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <FaWhatsapp className="w-5 h-5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <BiTime className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h6 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">Jam Operasional</h6>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Senin - Minggu: 08:00 - 17:00 WIB
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              *Jam operasional dapat berubah sesuai kondisi
            </p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <BiStar className="w-3 h-3 text-yellow-500 fill-current" />
          <span>Terpercaya</span>
        </div>
        <div className="flex items-center gap-1">
          <BiTime className="w-3 h-3 text-green-500" />
          <span>Respon Cepat</span>
        </div>
        <div className="flex items-center gap-1">
          <BiMap className="w-3 h-3 text-blue-500" />
          <span>Lokal</span>
        </div>
      </div>
    </div>
  );
};

export default TourismManager;
