"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { BiMap, BiPhone, BiTime, BiMoney, BiStar, BiHeart, BiShare, BiArrowBack } from "react-icons/bi";
import { FaWhatsapp, FaInstagram, FaGlobe } from "react-icons/fa";
import PhotoGallery from "../../../../components/PhotoGallery";
import ErrorBoundary from "../../../../components/ErrorBoundary";
import SmartMap from "../../../../components/SmartMap";
import LocationInfo from "../../../../components/LocationInfo";
import WeatherInfo from "../../../../components/WeatherInfo";
import TransportInfo from "../../../../components/TransportInfo";
import TourismManager from "../../../../components/TourismManager";
import WisataPackages from "../../../../components/WisataPackages";

const WisataDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapDistance, setMapDistance] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/wisata/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch destination");
        }
        const data = await res.json();
        setDestination(data.wisata || data.destination || data);
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

  const parseContact = (contact) => {
    if (!contact) return [];
    
    try {
      // If it's a string, try to parse it as JSON
      if (typeof contact === 'string') {
        try {
          const parsed = JSON.parse(contact);
          if (Array.isArray(parsed)) return parsed;
          // If it's an object, convert to array format
          if (typeof parsed === 'object') {
            return [{
              type: 'phone',
              value: parsed.phone || contact
            }];
          }
          return [{ type: 'phone', value: contact }];
        } catch {
          // If parsing fails, assume it's a phone number
          return [{ type: 'phone', value: contact }];
        }
      }
      
      // If it's an object, convert to array format
      if (typeof contact === 'object' && contact !== null) {
        const result = [];
        
        if (contact.phone) result.push({ type: 'phone', value: String(contact.phone) });
        if (contact.whatsapp) result.push({ type: 'whatsapp', value: String(contact.whatsapp) });
        if (contact.instagram) result.push({ type: 'instagram', value: String(contact.instagram) });
        if (contact.website) result.push({ type: 'website', value: String(contact.website) });
        if (contact.email) result.push({ type: 'email', value: String(contact.email) });
        
        return result;
      }
    } catch (error) {
      console.error('Error parsing contact:', error);
    }
    
    return [];
  };

  const contactInfo = parseContact(destination?.contact);
  

  
  // Validate that destination doesn't contain any objects that could cause rendering issues
  const safeDestination = {
    ...destination,
    contact: typeof destination?.contact === 'string' ? destination.contact : JSON.stringify(destination?.contact || ''),
    features: Array.isArray(destination?.features) ? destination.features : [],
    pricing: typeof destination?.pricing === 'object' ? JSON.stringify(destination.pricing) : destination?.pricing,
    coordinates: typeof destination?.coordinates === 'object' ? JSON.stringify(destination.coordinates) : destination?.coordinates
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-blue-600 dark:text-blue-400 text-xl">Memuat Destinasi...</div>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <BiStar className="text-4xl text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Destinasi Tidak Ditemukan</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Destinasi wisata yang Anda cari tidak tersedia.</p>
          <button 
            onClick={() => window.history.back()} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <BiArrowBack className="inline mr-2" />
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="relative pt-24 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20"></div>
        <div className="relative container mx-auto px-4">
          <button 
            onClick={() => window.history.back()} 
            className="group mb-6 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 transform hover:-translate-x-1"
          >
            <BiArrowBack className="text-xl group-hover:scale-110 transition-transform" />
            <span className="font-medium">Kembali ke Dolan Banyumas</span>
          </button>

          <div className="max-w-4xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full mb-3 border border-blue-200 dark:border-blue-700">
              <BiStar className="text-lg" />
              <span className="text-sm font-medium capitalize">{safeDestination.type}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-3 leading-tight">
              {safeDestination.title}
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <BiMap className="text-xl text-blue-500" />
                <span className="font-medium">{safeDestination.location}</span>
              </div>
              {safeDestination.recommended && (
                <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-700">
                  <BiStar className="text-lg" />
                  <span className="text-sm font-medium">Direkomendasikan</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  isLiked 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30'
                }`}
              >
                <BiHeart className={`text-lg ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{isLiked ? 'Disukai' : 'Sukai'}</span>
              </button>
              
              <button 
                onClick={async () => {
                  try {
                    if (navigator.share) {
                      await navigator.share({
                        title: destination.title,
                        text: destination.description || destination.short_description,
                        url: window.location.href
                      });
                    } else if (navigator.clipboard) {
                      await navigator.clipboard.writeText(window.location.href);
                      alert('Link telah disalin ke clipboard!');
                    }
                  } catch (err) {
                    console.error('Error sharing:', err);
                  }
                }}
                className="flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700/80"
              >
                <BiShare className="text-lg" />
                <span className="text-sm font-medium">Bagikan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              {/* Gallery */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-white/50 dark:border-gray-700/50 shadow-xl">
                <ErrorBoundary>
                  <PhotoGallery
                    images={[safeDestination.img_lg, safeDestination.img_sm, ...(safeDestination.gallery || [])].filter(Boolean)}
                    title={safeDestination.title}
                  />
                </ErrorBoundary>
              </div>

              {/* Description */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 dark:border-gray-700/50 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tentang Destinasi</h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {safeDestination.description || safeDestination.short_description || "Deskripsi destinasi tidak tersedia"}
                  </p>
                </div>
              </div>

              {/* Pengelola Wisata */}
              <TourismManager destination={safeDestination} contactInfo={contactInfo} />

              {/* Map */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-white/50 dark:border-gray-700/50 shadow-xl">
                <ErrorBoundary>
                  <SmartMap
                    destination={safeDestination}
                    onDistanceCalculated={setMapDistance}
                  />
                </ErrorBoundary>
              </div>

              {/* Location Info */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-white/50 dark:border-gray-700/50 shadow-xl">
                <ErrorBoundary>
                  <LocationInfo destination={safeDestination} mapDistance={mapDistance} />
                </ErrorBoundary>
              </div>

              {/* Weather Info */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-white/50 dark:border-gray-700/50 shadow-xl">
                <ErrorBoundary>
                  <WeatherInfo destination={safeDestination} />
                </ErrorBoundary>
              </div>

              {/* Transport Info */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-white/50 dark:border-gray-700/50 shadow-xl">
                <ErrorBoundary>
                  <TransportInfo destination={safeDestination} />
                </ErrorBoundary>
              </div>

              {/* Paket Wisata */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-white/50 dark:border-gray-700/50 shadow-xl">
                <ErrorBoundary>
                  <WisataPackages destination={safeDestination} />
                </ErrorBoundary>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Info Card */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-white/50 dark:border-gray-700/50 shadow-xl">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Informasi Destinasi</h3>
                
                {safeDestination.entrance_fee && (
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 text-white text-center">
                      <div className="text-sm opacity-90 mb-1">Harga Tiket</div>
                      <div className="text-2xl font-bold">{safeDestination.entrance_fee}</div>
                    </div>
                  </div>
                )}

                {safeDestination.address && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Alamat</h4>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <BiMap className="text-xl text-blue-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{safeDestination.address}</span>
                    </div>
                  </div>
                )}

                {safeDestination.created_at && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Ditambahkan</h4>
                    <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                      <BiTime className="text-xl text-amber-500" />
                      <span className="text-amber-700 dark:text-amber-300">
                        {new Date(safeDestination.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                )}

                {contactInfo.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Kontak</h4>
                    
                    {contactInfo.map((contact, index) => {
                      switch (contact.type) {
                        case 'phone':
                          return (
                            <a 
                              key={index}
                              href={`tel:${contact.value}`}
                              className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                            >
                              <BiPhone className="text-xl text-blue-500" />
                              <span className="text-blue-700 dark:text-blue-300">{contact.value}</span>
                            </a>
                          );
                        case 'whatsapp':
                          return (
                            <a 
                              key={index}
                              href={`https://wa.me/${contact.value.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo, saya tertarik dengan destinasi ${safeDestination.title}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                            >
                              <FaWhatsapp className="text-xl text-green-500" />
                              <span className="text-green-700 dark:text-green-300">WhatsApp</span>
                            </a>
                          );
                        case 'instagram':
                          return (
                            <a 
                              key={index}
                              href={`https://instagram.com/${contact.value.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/30 rounded-xl hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors"
                            >
                              <FaInstagram className="text-xl text-pink-500" />
                              <span className="text-pink-700 dark:text-pink-300">{contact.value}</span>
                            </a>
                          );
                        case 'website':
                          return (
                            <a 
                              key={index}
                              href={contact.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                            >
                              <FaGlobe className="text-xl text-purple-500" />
                              <span className="text-purple-700 dark:text-purple-300">{contact.value}</span>
                            </a>
                          );
                        case 'email':
                          return (
                            <a 
                              key={index}
                              href={`mailto:${contact.value}`}
                              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900/50 transition-colors"
                            >
                              <svg className="text-xl text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span className="text-gray-700 dark:text-gray-300">{contact.value}</span>
                            </a>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                )}

                {/* Pengelola Wisata */}
                {safeDestination.manager && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Pengelola Wisata</h4>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-white">{safeDestination.manager}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Pengelola Destinasi</div>
                        </div>
                      </div>
                      
                      {/* Contact Pengelola */}
                      {(() => {
                        const phoneContact = contactInfo.find(c => c.type === 'phone');
                        const whatsappContact = contactInfo.find(c => c.type === 'whatsapp');
                        
                        if (phoneContact || whatsappContact) {
                          return (
                            <div className="mt-4 flex gap-2">
                              {phoneContact && (
                                <a 
                                  href={`tel:${phoneContact.value}`}
                                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                                >
                                  <BiPhone className="inline mr-1" />
                                  Telepon
                                </a>
                              )}
                              {whatsappContact && (
                                <a 
                                  href={`https://wa.me/${whatsappContact.value.replace(/\D/g, '')}?text=Halo, saya ingin bertanya tentang destinasi ${destination.title}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-center py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                                >
                                  <FaWhatsapp className="inline mr-1" />
                                  WhatsApp
                                </a>
                              )}
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                )}
              </div>

              {/* Features Section */}
              {destination.features && destination.features.length > 0 && (
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-white/50 dark:border-gray-700/50 shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Fitur & Fasilitas</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {destination.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-purple-700 dark:text-purple-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Purchase Section */}
              {destination.entrance_fee && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm rounded-3xl p-6 border border-blue-200/50 dark:border-blue-700/50 shadow-xl">
                  {/* Header with Icon */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">Beli Tiket</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pesan tiket masuk Anda</p>
                    </div>
                  </div>
                  
                  {/* Price Display */}
                  <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4 mb-6 border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Harga per orang</span>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                          {destination.entrance_fee}
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-4 mb-6 border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah Tiket</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pilih jumlah tiket yang diinginkan</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setQty(Math.max(1, qty - 1))}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <div className="min-w-[60px] text-center">
                          <span className="text-2xl font-bold text-gray-800 dark:text-white">{qty}</span>
                        </div>
                        <button 
                          onClick={() => setQty(qty + 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-4 mb-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm opacity-90">Total Pembayaran</span>
                        <div className="text-2xl font-bold mt-1">
                          {(() => {
                            const price = Number(destination.entrance_fee.replace(/[^\d]/g, '')) || 0;
                            return `Rp ${(price * qty).toLocaleString('id-ID')}`;
                          })()}
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      const price = Number(destination.entrance_fee.replace(/[^\d]/g, '')) || 0;
                      const total = `Rp ${(price * qty).toLocaleString('id-ID')}`;
                      const msg = `Halo, saya ingin membeli ${qty} tiket untuk ${destination.title}. Total: ${total}`;
                      
                      const whatsappContact = contactInfo.find(c => c.type === 'whatsapp');
                      const phoneContact = contactInfo.find(c => c.type === 'phone');
                      
                      if (whatsappContact) {
                        window.open(`https://wa.me/${whatsappContact.value.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                      } else if (phoneContact) {
                        window.location.href = `tel:${phoneContact.value}`;
                      }
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-3 text-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    <span>Beli Tiket Sekarang</span>
                  </button>

                  {/* Additional Info */}
                  <div className="text-center mt-4">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      💳 Pembayaran aman • ⚡ Proses cepat • 🎫 Tiket digital
                    </p>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-4">Aksi Cepat</h3>
                
                {/* Main Action Buttons - Horizontal Layout */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {/* Telepon Button */}
                  {(() => {
                    const phoneContact = contactInfo.find(c => c.type === 'phone');
                    return phoneContact ? (
                      <a 
                        href={`tel:${phoneContact.value}`}
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
                    );
                  })()}
                  
                  {/* WhatsApp Button */}
                  {(() => {
                    const whatsappContact = contactInfo.find(c => c.type === 'whatsapp');
                    return whatsappContact ? (
                      <a 
                        href={`https://wa.me/${whatsappContact.value.replace(/\D/g, '')}?text=Halo, saya tertarik dengan destinasi wisata ${destination.title}`}
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
                    );
                  })()}
                  
                  {/* Arahkan Button */}
                  <button 
                    onClick={() => {
                      const address = safeDestination.address || safeDestination.location;
                      if (address) {
                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
                      }
                    }}
                    className="flex flex-col items-center justify-center gap-2 bg-purple-600/80 hover:bg-purple-500 text-white font-medium py-3 px-2 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <BiMap className="text-2xl" />
                    <span className="text-xs">Arahkan</span>
                  </button>
                  
                  {/* Bagikan Button */}
                  <button 
                    onClick={async () => {
                      try {
                        if (navigator.share) {
                          await navigator.share({
                            title: safeDestination.title,
                            text: safeDestination.description || safeDestination.short_description,
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

              {/* Package Pricing Section */}
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-white/50 dark:border-gray-700/50 shadow-xl">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Pilihan Paket Wisata</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Pilih paket yang sesuai dengan kebutuhan Anda</p>
                  <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-medium mt-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Paket Tersedia</span>
                  </div>
                </div>

                {/* Package Card */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-4">
                  {/* Package Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white">Paket Standar</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Recommended</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {destination.entrance_fee || destination.price_range || "Rp Gratis"}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">per orang</div>
                    </div>
                  </div>

                  {/* Features Included */}
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Fitur yang termasuk:</h5>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-700 dark:text-gray-300">Tiket Masuk</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-700 dark:text-gray-300">Panduan Wisata</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-700 dark:text-gray-300">Fasilitas Dasar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-700 dark:text-gray-300">Asuransi</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Syarat & Ketentuan:</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h6 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Syarat:</h6>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">Min. 1 orang</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">Bayar full H-7</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">Konfirmasi H-3</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h6 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Pembatalan:</h6>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">H-7: 100%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">H-3: 50%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">H-1: 0%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <button 
                    onClick={() => {
                      const price = destination.entrance_fee || destination.price_range || "Rp Gratis";
                      const msg = `Halo, saya tertarik dengan Paket Standar untuk ${destination.title}. Harga: ${price}`;
                      
                      const whatsappContact = contactInfo.find(c => c.type === 'whatsapp');
                      const phoneContact = contactInfo.find(c => c.type === 'phone');
                      
                      if (whatsappContact) {
                        window.open(`https://wa.me/${whatsappContact.value.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
                      } else if (phoneContact) {
                        window.location.href = `tel:${phoneContact.value}`;
                      }
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    <span>Pilih Paket Ini</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WisataDetail;
