"use client";

import { BiMap, BiPhone, BiTime, BiMoney, BiStar } from "react-icons/bi";

const DestinationInfo = ({ destination, theme = "blue" }) => {
  const getThemeColors = () => {
    switch (theme) {
      case "orange":
        return {
          primary: "text-orange-600 dark:text-orange-400",
          bg: "bg-orange-100 dark:bg-orange-900/30",
          text: "text-orange-800 dark:text-orange-300",
          badge: "bg-orange-600 dark:bg-orange-500"
        };
      case "green":
        return {
          primary: "text-green-600 dark:text-green-400",
          bg: "bg-green-100 dark:bg-green-900/30",
          text: "text-green-800 dark:text-green-300",
          badge: "bg-green-600 dark:bg-green-500"
        };
      case "purple":
        return {
          primary: "text-purple-600 dark:text-purple-400",
          bg: "bg-purple-100 dark:bg-purple-900/30",
          text: "text-purple-800 dark:text-purple-300",
          badge: "bg-purple-600 dark:bg-purple-500"
        };
      case "teal":
        return {
          primary: "text-teal-600 dark:text-teal-400",
          bg: "bg-teal-100 dark:bg-teal-900/30",
          text: "text-teal-800 dark:text-teal-300",
          badge: "bg-teal-600 dark:bg-teal-500"
        };
      default:
        return {
          primary: "text-blue-600 dark:text-blue-400",
          bg: "bg-blue-100 dark:bg-blue-900/30",
          text: "text-blue-800 dark:text-blue-300",
          badge: "bg-blue-600 dark:bg-blue-500"
        };
    }
  };

  const colors = getThemeColors();

  const infoItems = [
    {
      icon: BiMoney,
      label: "Biaya Masuk",
      value: destination.entrance_fee || destination.price_range,
      show: destination.entrance_fee || destination.price_range
    },
    {
      icon: BiPhone,
      label: "Kontak",
      value: destination.contact,
      show: destination.contact
    },
    {
      icon: BiMap,
      label: "Alamat",
      value: destination.address,
      show: destination.address
    },
    {
      icon: BiTime,
      label: "Jam Buka",
      value: destination.opening_hours,
      show: destination.opening_hours
    },
    {
      icon: BiTime,
      label: "Check-in",
      value: destination.check_in_time,
      show: destination.check_in_time
    },
    {
      icon: BiTime,
      label: "Check-out",
      value: destination.check_out_time,
      show: destination.check_out_time
    }
  ].filter(item => item.show);

  return (
    <div className="space-y-6">
      {/* Type Badge */}
      <div className={`inline-block ${colors.badge} text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm`}>
        {destination.type}
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
          Deskripsi
        </h2>
        <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
          {destination.description || destination.short_description || "Deskripsi tidak tersedia"}
        </p>
      </div>

      {/* Quick Info */}
      {infoItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {infoItems.map((item, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <item.icon className={`text-2xl ${colors.primary}`} aria-hidden="true" />
              <div>
                <p className="text-sm text-slate-500 dark:text-gray-400">{item.label}</p>
                <p className="text-slate-800 dark:text-white font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Created Date */}
      {destination.created_at && (
        <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/50 p-4 rounded-lg shadow-sm">
          <BiTime className={`text-2xl ${colors.primary}`} aria-hidden="true" />
          <div>
            <p className="text-sm text-slate-500 dark:text-gray-400">Ditambahkan</p>
            <p className="text-slate-800 dark:text-white font-medium">
              {new Date(destination.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      )}

      {/* Features */}
      {destination.features && destination.features.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
            Fitur & Fasilitas
          </h2>
          <div className="flex flex-wrap gap-2">
            {destination.features.map((feature, index) => (
              <span
                key={index}
                className={`${colors.bg} ${colors.text} px-3 py-1 rounded-full text-sm font-medium`}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Room Types */}
      {destination.room_types && destination.room_types.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3">
            Jenis Kamar
          </h2>
          <div className="flex flex-wrap gap-2">
            {destination.room_types.map((roomType, index) => (
              <span
                key={index}
                className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-medium"
              >
                {roomType}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Badge */}
      {destination.recommended && (
        <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-4 py-2 rounded-full">
          <BiStar className="text-xl" aria-hidden="true" />
          <span className="font-medium">Direkomendasikan</span>
        </div>
      )}
    </div>
  );
};

export default DestinationInfo;
