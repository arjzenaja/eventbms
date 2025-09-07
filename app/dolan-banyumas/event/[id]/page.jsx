"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import PhotoGallery from "../../../../components/PhotoGallery";
import ErrorBoundary from "../../../../components/ErrorBoundary";
import SmartMap from "../../../../components/SmartMap";
import LocationInfo from "../../../../components/LocationInfo";
import WeatherInfo from "../../../../components/WeatherInfo";
import TransportInfo from "../../../../components/TransportInfo";
import EventSchedule from "../../../../components/EventSchedule";
import BuyTicket from "../../../../components/BuyTicket";
import EventPackages from "../../../../components/EventPackages";
import Organizers from "../../../../components/Organizers";
import RecommendedEvent from "../../../../components/RecommendedEvent";
import UpcomingEvents from "../../../../components/UpcomingEvents";
import { BiMap, BiPhone, BiTime, BiCalendar, BiShare, BiHeart, BiNavigation, BiStar, BiUser } from "react-icons/bi";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapDistance, setMapDistance] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const sanitizedPhone = useMemo(() => {
    if (!event?.contact) return "";
    return event.contact.toString().replace(/[^0-9+]/g, "");
  }, [event]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error("Failed to fetch event");
        const data = await res.json();
        setEvent(data.event || data);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-pink-500 rounded-full animate-spin mx-auto" style={{ animationDelay: '-0.5s' }}></div>
          </div>
          <div className="text-purple-800 dark:text-purple-200 text-lg font-semibold">Memuat Event...</div>
          <div className="text-purple-600 dark:text-purple-300 text-sm mt-1">Mohon tunggu sebentar</div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Event Tidak Ditemukan</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">Event yang Anda cari tidak tersedia atau telah dihapus dari sistem.</p>
          <a href="/dolan-banyumas" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            <BiNavigation className="w-4 h-4" />
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  const mapsQuery = encodeURIComponent(event?.address || event?.location || event?.title || "");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative pt-24 pb-20 overflow-visible">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-rose-600/10"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Back Button */}
            <div className="flex justify-start mt-12 mb-6">
              <a 
                href="/dolan-banyumas" 
                className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium text-purple-700 dark:text-purple-300 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 border border-purple-200 dark:border-purple-700"
              >
                <BiNavigation className="w-4 h-4" />
                Kembali
              </a>
            </div>

            {/* Event Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <BiStar className="w-4 h-4" />
              🎉 Event Spesial
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              {event.title}
            </h1>
            
            {/* Event Meta Info */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-gray-600 dark:text-gray-300 mb-8">
              {event.location && (
                <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 dark:border-gray-700/30 shadow-lg">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <BiMap className="text-white w-3 h-3" />
                  </div>
                  <span className="font-semibold text-sm">{event.location}</span>
                </div>
              )}
              {event.date && (
                <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 dark:border-gray-700/30 shadow-lg">
                  <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <BiCalendar className="text-white w-3 h-3" />
                  </div>
                  <span className="font-semibold text-sm">
                    {event.date}
                    {event.end_date && event.end_date !== event.date && ` - ${event.end_date}`}
                  </span>
                </div>
              )}
              {event.time && (
                <div className="flex items-center gap-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 dark:border-gray-700/30 shadow-lg">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <BiTime className="text-white w-3 h-3" />
                  </div>
                  <span className="font-semibold text-sm">
                    {event.time}
                    {event.end_time && ` - ${event.end_time}`}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  isLiked 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-xl' 
                    : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 border border-gray-200 dark:border-gray-600'
                }`}
              >
                <BiHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Disukai' : 'Sukai Event'}
              </button>
              
              <a 
                href={sanitizedPhone ? `tel:${sanitizedPhone}` : undefined}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <BiPhone className="w-4 h-4" />
                Hubungi Sekarang
              </a>
              
              <button 
                onClick={() => navigator.share?.({ title: event.title, url: currentUrl })}
                className="flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 border border-gray-200 dark:border-gray-600"
              >
                <BiShare className="w-4 h-4" />
                Bagikan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Gallery Section */}
          <div className="mb-12">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Galeri Event</h2>
                <p className="text-gray-600 dark:text-gray-400">Lihat dokumentasi dan foto-foto event yang menarik</p>
              </div>
              <PhotoGallery 
                images={[event.img_lg, event.img_sm, ...(event.gallery || [])].filter(Boolean)} 
                title={event.title} 
              />
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="xl:col-span-2 space-y-8">
              {/* About Event */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Tentang Event</h3>
                    <p className="text-purple-600 dark:text-purple-400 font-medium text-sm">Informasi lengkap event</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-purple-200/30 dark:border-purple-700/30">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {event.description || "Deskripsi event tidak tersedia. Silakan hubungi penyelenggara untuk informasi lebih lanjut tentang event ini."}
                  </p>
                </div>
              </div>

              {/* Event Type & Category */}
              {(event.event_type || event.category) && (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 shadow-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Kategori Event</h3>
                  <div className="flex flex-wrap gap-3">
                    {event.event_type && (
                      <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full">
                        {event.event_type}
                      </span>
                    )}
                    {event.category && (
                      <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium rounded-full">
                        {event.category}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Highlights / Rangkaian Acara */}
              {Array.isArray(event?.highlights) && event.highlights.length > 0 && (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 shadow-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Rangkaian Acara</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {event.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200/30 dark:border-purple-700/30">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performers / Pengisi Acara */}
              {Array.isArray(event?.performers) && event.performers.length > 0 && (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 shadow-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pengisi Acara</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {event.performers.map((performer, index) => (
                      <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-yellow-200/30 dark:border-yellow-700/30 text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{performer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Facilities */}
              {Array.isArray(event?.facilities) && event.facilities.length > 0 && (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 shadow-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Fasilitas & Keamanan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {event.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-lg border border-green-200/30 dark:border-green-700/30">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              {event.additional_info && (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 shadow-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Informasi Tambahan</h3>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-200/30 dark:border-blue-700/30">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {event.additional_info}
                    </p>
                  </div>
                </div>
              )}

              {/* Links */}
              {(event.poster_link || event.ticket_link) && (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 shadow-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Link & Dokumentasi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.poster_link && (
                      <a 
                        href={event.poster_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Lihat Poster</span>
                      </a>
                    )}
                    {event.ticket_link && (
                      <a 
                        href={event.ticket_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <span className="font-medium">Beli Tiket Online</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Schedule */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Jadwal Event</h3>
                <EventSchedule event={event} />
              </div>

              {/* Organizers */}
              {Array.isArray(event?.organizers) && event.organizers.length > 0 && (
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 shadow-2xl">
                  <Organizers event={event} />
                </div>
              )}

              {/* Packages Section */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 shadow-2xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pilihan Paket</h3>
                <EventPackages event={event} />
              </div>

              {/* Map Section */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-white/30 dark:border-gray-700/30 shadow-2xl">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Lokasi Event</h3>
                  <p className="text-gray-600 dark:text-gray-400">Lihat lokasi event di peta interaktif</p>
                </div>
                <ErrorBoundary>
                  <SmartMap destination={event} onDistanceCalculated={setMapDistance} />
                </ErrorBoundary>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Ticket */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Beli Tiket</h3>
                <BuyTicket event={event} />
              </div>

              {/* Event Info Card */}
              <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 rounded-2xl p-6 text-white shadow-2xl">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-1">Informasi Event</h3>
                  <p className="text-purple-100 text-xs">Detail lengkap event</p>
                </div>
                <div className="space-y-4">
                  {event.contact && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                          <BiPhone className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs text-purple-100 font-medium">Kontak</div>
                          <div className="font-bold">{event.contact}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {event.location && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                          <BiMap className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs text-purple-100 font-medium">Lokasi</div>
                          <div className="font-bold">{event.location}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(event.date || event.event_date) && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                          <BiCalendar className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs text-purple-100 font-medium">Tanggal</div>
                          <div className="font-bold">{event.date || event.event_date}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {(event.organizer || (Array.isArray(event?.organizers) && event.organizers.length > 0)) && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                          <BiUser className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs text-purple-100 font-medium">Penyelenggara</div>
                          <div className="font-bold">
                            {event.organizer || (event.organizers?.[0]?.name) || 'Penyelenggara Event'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {event.event_type && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                          <BiStar className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs text-purple-100 font-medium">Jenis Event</div>
                          <div className="font-bold">{event.event_type}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Info Cards */}
              <ErrorBoundary>
                <LocationInfo destination={event} mapDistance={mapDistance} />
              </ErrorBoundary>

              <ErrorBoundary>
                <WeatherInfo destination={event} />
              </ErrorBoundary>

              <ErrorBoundary>
                <TransportInfo destination={event} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations & Upcoming */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <RecommendedEvent />
          <UpcomingEvents />
        </div>
      </div>

      {/* JSON-LD */}
      {event && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Event", name: event.title, location: event.location, startDate: event.date || event.event_date, image: [event.img_lg, event.img_sm].filter(Boolean), url: currentUrl, description: event.description || undefined }) }} />
      )}
    </div>
  );
};

export default EventDetails;
    