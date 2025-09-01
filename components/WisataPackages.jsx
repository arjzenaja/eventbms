"use client";
import React, { useState, useEffect } from "react";
import { FaMapMarkedAlt, FaUsers, FaClock, FaCheck, FaStar, FaComments } from "react-icons/fa";

const WisataPackages = ({ destination }) => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua Paket');

  useEffect(() => {
    const fetchPackages = async () => {
      if (!destination?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/destinations/packages?destinationId=${destination.id}`);
        const data = await response.json();
        
        if (data.success && data.packages && data.packages.length > 0) {
          // Convert facilities string to array
          const packagesWithFacilities = data.packages.map(pkg => ({
            ...pkg,
            facilities: pkg.facilities ? 
              pkg.facilities.split(/[,\n]/).map(f => f.trim()).filter(Boolean) : 
              []
          }));
          setPackages(packagesWithFacilities);
        } else {
          // Use demo data if no packages found
          const demoPackages = [
            {
              id: 1,
              name: "Paket Standar",
              duration: "1 hari",
              capacity: "2-4 orang",
              description: "Paket wisata standar dengan fasilitas lengkap dan pemandu lokal",
              price: 150000,
              facilities: ["Tiket masuk", "Pemandu lokal", "Makan siang", "Transportasi"],
              popular: false,
              category: "Paket Standar"
            },
            {
              id: 2,
              name: "Paket Deluxe",
              duration: "2 hari 1 malam",
              capacity: "2-6 orang",
              description: "Paket wisata premium dengan akomodasi dan fasilitas lengkap",
              price: 450000,
              facilities: ["Tiket masuk", "Pemandu profesional", "Akomodasi", "Makan 3x", "Transportasi", "+1 fasilitas lainnya"],
              popular: true,
              category: "Paket Deluxe"
            },
            {
              id: 3,
              name: "Paket Keluarga",
              duration: "3 hari 2 malam",
              capacity: "4-8 orang",
              description: "Paket wisata keluarga dengan aktivitas khusus anak-anak",
              price: 750000,
              facilities: ["Tiket masuk", "Pemandu keluarga", "Akomodasi", "Makan 3x", "Aktivitas anak", "Transportasi", "+1 fasilitas lainnya"],
              popular: false,
              category: "Paket Keluarga"
            }
          ];
          setPackages(demoPackages);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        // Use demo data on error
        const demoPackages = [
          {
            id: 1,
            name: "Paket Standar",
            duration: "1 hari",
            capacity: "2-4 orang",
            description: "Paket wisata standar dengan fasilitas lengkap dan pemandu lokal",
            price: 150000,
            facilities: ["Tiket masuk", "Pemandu lokal", "Makan siang", "Transportasi"],
            popular: false,
            category: "Paket Standar"
          },
          {
            id: 2,
            name: "Paket Deluxe",
            duration: "2 hari 1 malam",
            capacity: "2-6 orang",
            description: "Paket wisata premium dengan akomodasi dan fasilitas lengkap",
            price: 450000,
            facilities: ["Tiket masuk", "Pemandu profesional", "Akomodasi", "Makan 3x", "Transportasi", "+1 fasilitas lainnya"],
            popular: true,
            category: "Paket Deluxe"
          },
          {
            id: 3,
            name: "Paket Keluarga",
            duration: "3 hari 2 malam",
            capacity: "4-8 orang",
            description: "Paket wisata keluarga dengan aktivitas khusus anak-anak",
            price: 750000,
            facilities: ["Tiket masuk", "Pemandu keluarga", "Akomodasi", "Makan 3x", "Aktivitas anak", "Transportasi", "+1 fasilitas lainnya"],
            popular: false,
            category: "Paket Keluarga"
          }
        ];
        setPackages(demoPackages);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, [destination?.id]);

  // Get unique categories
  const categories = ['Semua Paket', ...new Set(packages.map(pkg => pkg.category))];
  
  // Filter packages by category
  const filteredPackages = selectedCategory === 'Semua Paket' 
    ? packages 
    : packages.filter(pkg => pkg.category === selectedCategory);

  // Get category counts
  const getCategoryCount = (category) => {
    if (category === 'Semua Paket') return packages.length;
    return packages.filter(pkg => pkg.category === category).length;
  };

  const formatPrice = (price) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const handleBookPackage = (pkg) => {
    // Handle booking logic here
    console.log(`Booking package: ${pkg.name}`);
    // You can integrate with WhatsApp or booking system
    const message = `Halo, saya tertarik dengan ${pkg.name} untuk ${destination?.title || 'destinasi wisata'} dengan harga ${formatPrice(pkg.price)}.`;
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Memuat paket wisata...</p>
        </div>
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FaMapMarkedAlt className="text-gray-400 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Belum Ada Paket Wisata
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Paket wisata untuk destinasi ini belum tersedia. Silakan hubungi admin untuk informasi lebih lanjut.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <FaMapMarkedAlt className="w-4 h-4" />
          <span>Pilihan Paket Wisata</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Paket Wisata Tersedia
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Pilih paket wisata yang sesuai dengan kebutuhan dan budget Anda
        </p>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
              selectedCategory === category
                ? 'bg-green-600 text-white shadow-lg transform scale-105'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <span>{category}</span>
            <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
              {getCategoryCount(category)}
            </span>
          </button>
        ))}
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Popular Badge */}
            {pkg.popular && (
              <div className="absolute top-4 left-4 z-10">
                <div className="inline-flex items-center gap-1 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  <FaStar className="w-3 h-3" />
                  <span>POPULAR</span>
                </div>
              </div>
            )}

            {/* Package Icon */}
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaMapMarkedAlt className="text-white text-2xl" />
              </div>
              
              {/* Package Name */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {pkg.name}
              </h3>

              {/* Duration and Capacity */}
              <div className="flex items-center justify-center gap-6 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <FaClock className="w-4 h-4" />
                  <span>{pkg.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaUsers className="w-4 h-4" />
                  <span>{pkg.capacity}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                {pkg.description}
              </p>

              {/* Package Type */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <FaMapMarkedAlt className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Tipe Paket</span>
                </div>
                <p className="text-gray-900 dark:text-white font-semibold mt-1">
                  {pkg.name}
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {formatPrice(pkg.price)}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-sm">
                  per paket
                </div>
              </div>

              {/* Facilities */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <FaCheck className="w-4 h-4 text-green-500" />
                  Fasilitas Paket:
                </h4>
                <ul className="space-y-2">
                  {pkg.facilities.map((facility, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      {facility}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Book Button */}
              <button
                onClick={() => handleBookPackage(pkg)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <FaComments className="w-4 h-4" />
                Pilih Paket Ini
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State for Filtered Results */}
      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FaMapMarkedAlt className="text-gray-400 text-2xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Tidak ada paket untuk kategori ini
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Coba pilih kategori lain atau hubungi admin untuk informasi lebih lanjut.
          </p>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          * Harga dapat berubah sewaktu-waktu. Silakan hubungi kami untuk informasi terbaru.
        </p>
      </div>
    </div>
  );
};

export default WisataPackages;
