"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { BiMap, BiPhone, BiTime, BiMoney } from "react-icons/bi";

const OlehOlehDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/oleh_oleh/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch destination");
        }
        const data = await res.json();
        setDestination(data.oleh_oleh || data.destination || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDestination();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Destinasi Tidak Ditemukan</h1>
          <p className="text-gray-400 mb-6">Destinasi yang Anda cari tidak ditemukan.</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen flex items-center py-8 sm:py-48">
      <div className="container mx-auto">
        <div className="w-full max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button 
              onClick={() => window.history.back()} 
              className="text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-2"
            >
              ← Kembali ke Destinasi
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">{destination.title}</h1>
            <div className="flex items-center gap-2 text-gray-400">
              <BiMap className="text-xl" />
              <span>{destination.location}</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
                <Image
                  src={destination.img_lg || "/placeholder.jpg"}
                  fill
                  className="object-cover"
                  alt={destination.title}
                  priority
                />
              </div>
              {destination.img_sm && destination.img_sm !== destination.img_lg && (
                <div className="relative w-full h-[200px] rounded-xl overflow-hidden">
                  <Image
                    src={destination.img_sm}
                    fill
                    className="object-cover"
                    alt={destination.title}
                  />
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              {/* Type Badge */}
              <div className="inline-block bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                {destination.type}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Deskripsi</h3>
                <p className="text-gray-300 leading-relaxed">
                  {destination.description || destination.short_description || "Deskripsi tidak tersedia"}
                </p>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destination.entrance_fee && (
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg">
                    <BiMoney className="text-2xl text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Harga</p>
                      <p className="text-white font-medium">{destination.entrance_fee}</p>
                    </div>
                  </div>
                )}

                {destination.contact && (
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg">
                    <BiPhone className="text-2xl text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Kontak</p>
                      <p className="text-white font-medium">{destination.contact}</p>
                    </div>
                  </div>
                )}

                {destination.address && (
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg">
                    <BiMap className="text-2xl text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Alamat</p>
                      <p className="text-white font-medium">{destination.address}</p>
                    </div>
                  </div>
                )}

                {destination.created_at && (
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-lg">
                    <BiTime className="text-2xl text-purple-400" />
                    <div>
                      <p className="text-sm text-gray-400">Ditambahkan</p>
                      <p className="text-white font-medium">
                        {new Date(destination.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Features */}
              {destination.features && destination.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Fitur & Fasilitas</h3>
                  <div className="flex flex-wrap gap-2">
                    {destination.features.map((feature, index) => (
                      <span
                        key={index}
                        className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Badge */}
              {destination.recommended && (
                <div className="inline-flex items-center gap-2 bg-yellow-600/20 text-yellow-300 px-4 py-2 rounded-full">
                  <span className="text-xl">⭐</span>
                  <span className="font-medium">Direkomendasikan</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OlehOlehDetail;
