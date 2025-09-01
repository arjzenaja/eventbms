"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { BiMap, BiPhone, BiTime, BiMoney, BiArrowBack, BiStar, BiShare } from "react-icons/bi";
import { FaWhatsapp } from "react-icons/fa";
import DetailSkeleton from "@/components/DetailSkeleton";
import ErrorState from "@/components/ErrorState";

const WisataDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDestination = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`/api/wisata/${id}`);
      if (!res.ok) {
        throw new Error("Gagal memuat data destinasi wisata");
      }
      const data = await res.json();
      setDestination(data.destination || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDestination();
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const parseContact = (contact) => {
    if (typeof contact === 'string') {
      try {
        return JSON.parse(contact);
      } catch {
        return { phone: contact };
      }
    }
    return contact || {};
  };

  const contactInfo = parseContact(destination?.contact);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !destination) {
    return (
      <ErrorState
        title="Destinasi Tidak Ditemukan"
        message="Destinasi wisata yang Anda cari tidak ditemukan atau telah dihapus."
        onRetry={fetchDestination}
        onBack={handleBack}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto py-8 sm:py-12">
        <div className="w-full max-w-[1200px] mx-auto">
          {/* Header */}
          <header className="mb-8">
            <button 
              onClick={handleBack}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 flex items-center gap-2 transition-colors duration-200 font-medium"
              aria-label="Kembali ke halaman destinasi"
            >
              <BiArrowBack className="text-xl" />
              Kembali ke Destinasi
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-2">
              {destination.title}
            </h1>
            <div className="flex items-center gap-2 text-slate-600 dark:text-gray-400">
              <BiMap className="text-xl" aria-hidden="true" />
              <span>{destination.location}</span>
            </div>
          </header>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Section */}
            <section className="space-y-4" aria-label="Galeri gambar">
              <div className="relative w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={destination.img_lg || "/placeholder.jpg"}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  alt={`Gambar utama ${destination.title}`}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {destination.img_sm && destination.img_sm !== destination.img_lg && (
                <div className="relative w-full h-[150px] sm:h-[200px] rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={destination.img_sm}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    alt={`Gambar tambahan ${destination.title}`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
            </section>

            {/* Info Section */}
            <section className="space-y-6" aria-label="Informasi destinasi">
              {/* Type Badge */}
              <div className="inline-block bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destination.entrance_fee && (
                  <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/50 p-4 rounded-lg shadow-sm">
                    <BiMoney className="text-2xl text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-gray-400">Biaya Masuk</p>
                      <p className="text-slate-800 dark:text-white font-medium">{destination.entrance_fee}</p>
                    </div>
                  </div>
                )}

                {destination.contact && (
                  <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/50 p-4 rounded-lg shadow-sm">
                    <BiPhone className="text-2xl text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-gray-400">Kontak</p>
                      <p className="text-slate-800 dark:text-white font-medium">{destination.contact}</p>
                    </div>
                  </div>
                )}

                {destination.address && (
                  <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/50 p-4 rounded-lg shadow-sm">
                    <BiMap className="text-2xl text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    <div>
                      <p className="text-sm text-slate-500 dark:text-gray-400">Alamat</p>
                      <p className="text-slate-800 dark:text-white font-medium">{destination.address}</p>
                    </div>
                  </div>
                )}

                {destination.created_at && (
                  <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/50 p-4 rounded-lg shadow-sm">
                    <BiTime className="text-2xl text-blue-600 dark:text-blue-400" aria-hidden="true" />
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
              </div>

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
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {feature}
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

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-4">Aksi Cepat</h3>
                
                {/* Main Action Buttons - Horizontal Layout */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {/* Telepon Button */}
                  {contactInfo.phone ? (
                    <a 
                      href={`tel:${contactInfo.phone}`}
                      className="flex flex-col items-center justify-center gap-2 bg-amber-600/80 hover:bg-amber-500 text-white font-medium py-3 px-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <BiPhone className="text-2xl" />
                      <span className="text-xs">Telepon</span>
                    </a>
                  ) : (
                    <button className="flex flex-col items-center justify-center gap-2 bg-amber-600/80 hover:bg-amber-500 text-white font-medium py-3 px-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                      <BiPhone className="text-2xl" />
                      <span className="text-xs">Telepon</span>
                    </button>
                  )}
                  
                  {/* WhatsApp Button */}
                  {contactInfo.whatsapp ? (
                    <a 
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, '')}?text=Halo, saya tertarik dengan destinasi wisata ${destination.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center gap-2 bg-green-600/80 hover:bg-green-500 text-white font-medium py-3 px-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <FaWhatsapp className="text-2xl" />
                      <span className="text-xs">WhatsApp</span>
                    </a>
                  ) : (
                    <button className="flex flex-col items-center justify-center gap-2 bg-green-600/80 hover:bg-green-500 text-white font-medium py-3 px-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                      <FaWhatsapp className="text-2xl" />
                      <span className="text-xs">WhatsApp</span>
                    </button>
                  )}
                  
                  {/* Arahkan Button */}
                  <button className="flex flex-col items-center justify-center gap-2 bg-purple-600/80 hover:bg-purple-500 text-white font-medium py-3 px-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <BiMap className="text-2xl" />
                    <span className="text-xs">Arahkan</span>
                  </button>
                  
                  {/* Bagikan Button */}
                  <button 
                    onClick={async () => {
                      try {
                        if (navigator.share) {
                          await navigator.share({
                            title: destination.title,
                            text: destination.description || destination.short_description,
                            url: window.location.href,
                          });
                        } else if (navigator.clipboard) {
                          await navigator.clipboard.writeText(window.location.href);
                          alert('Link telah disalin');
                        }
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="flex flex-col items-center justify-center gap-2 bg-red-600/80 hover:bg-red-500 text-white font-medium py-3 px-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <BiShare className="text-2xl" />
                    <span className="text-xs">Bagikan</span>
                  </button>
                </div>
                
                {/* Additional Info */}
                <div className="text-orange-100 text-sm">
                  <p>Pilih aksi yang ingin Anda lakukan</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WisataDetail;
