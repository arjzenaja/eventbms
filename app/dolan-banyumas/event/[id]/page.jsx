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
import UpcomingEvents from "../../../../components/UpcomingEvents";
import RatingReviews from "../../../../components/RatingReviews";
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
      {/* Enhanced Hero Section */}
      <div className="relative pt-24 pb-20 overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-rose-500/30"></div>
        <div className="absolute inset-0 bg-[url('/pattern_bg.png')] opacity-10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-300/20 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-pink-300/20 rounded-full blur-xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-rose-300/20 rounded-full blur-xl animate-bounce delay-2000"></div>
        <div className="absolute top-60 right-1/3 w-14 h-14 bg-violet-300/20 rounded-full blur-xl animate-bounce delay-3000"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            {/* Enhanced Back Button */}
            <div className="flex justify-start mt-16 mb-8">
              <a 
                href="/dolan-banyumas" 
                className="group inline-flex items-center gap-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-2xl text-lg font-bold text-purple-700 dark:text-purple-300 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-x-1 shadow-xl hover:shadow-2xl border border-purple-200 dark:border-purple-700"
              >
                <div className="w-12 h-12 bg-purple-500/30 group-hover:bg-purple-500/40 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl">
                  <BiNavigation className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </div>
                <span>Kembali ke Dolan Banyumas</span>
              </a>
            </div>

            {/* Enhanced Event Badge */}
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white px-8 py-4 rounded-full text-lg font-bold mb-8 shadow-2xl">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
              <BiStar className="w-6 h-6" style={{ animationDuration: '3s' }} />
              <span>🎉 Event Spesial</span>
            </div>
            
            {/* Enhanced Main Title */}
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 mb-8 leading-tight">
              {event.title}
            </h1>
            
            {/* Enhanced Event Meta Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-700 dark:text-gray-300 mb-8">
              {event.location && (
                <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border border-purple-200 dark:border-purple-700">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <BiMap className="text-white w-4 h-4" />
                  </div>
                  <span className="font-bold text-lg">{event.location}</span>
                </div>
              )}
              {event.date && (
                <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border border-pink-200 dark:border-pink-700">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
                    <BiCalendar className="text-white w-4 h-4" />
                  </div>
                  <span className="font-bold text-lg">
                    {event.date}
                    {event.end_date && event.end_date !== event.date && ` - ${event.end_date}`}
                  </span>
                </div>
              )}
              {event.time && (
                <div className="flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border border-blue-200 dark:border-blue-700">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                    <BiTime className="text-white w-4 h-4" />
                  </div>
                  <span className="font-bold text-lg">
                    {event.time}
                    {event.end_time && ` - ${event.end_time}`}
                  </span>
                </div>
              )}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`group flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${
                  isLiked 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-2xl' 
                    : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-700 backdrop-blur-sm'
                }`}
              >
                <BiHeart className={`w-6 h-6 group-hover:scale-110 transition-transform ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Disukai' : 'Sukai Event'}
              </button>
              
              <a 
                href={sanitizedPhone ? `tel:${sanitizedPhone}` : undefined}
                className="group flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <BiPhone className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Hubungi Sekarang
              </a>
              
              <button 
                onClick={() => navigator.share?.({ title: event.title, url: currentUrl })}
                className="group flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl backdrop-blur-sm border border-blue-200 dark:border-blue-700"
              >
                <BiShare className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Bagikan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Gallery Section */}
          <div className="mb-16">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-black text-gray-900 dark:text-white">Galeri Event</h2>
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">Lihat dokumentasi dan foto-foto event yang menarik</p>
              </div>
              <PhotoGallery 
                images={[event.img_lg, event.img_sm, ...(event.gallery || [])].filter(Boolean)} 
                title={event.title} 
              />
            </div>
          </div>

          {/* Enhanced Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Left Column - Main Info */}
            <div className="xl:col-span-2 space-y-12">
              {/* Enhanced About Event */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white">Tentang Event</h3>
                    <p className="text-purple-600 dark:text-purple-400 font-bold text-lg">Informasi lengkap event</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200/30 dark:border-purple-700/30">
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {event.description || "Deskripsi event tidak tersedia. Silakan hubungi penyelenggara untuk informasi lebih lanjut tentang event ini."}
                  </p>
                </div>
              </div>

              {/* Enhanced Event Type & Category */}
              {(event.event_type || event.category) && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white">Kategori Event</h3>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {event.event_type && (
                      <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        {event.event_type}
                      </span>
                    )}
                    {event.category && (
                      <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        {event.category}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Enhanced Highlights / Rangkaian Acara */}
              {Array.isArray(event?.highlights) && event.highlights.length > 0 && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white">Rangkaian Acara</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-5 rounded-2xl border border-purple-200/30 dark:border-purple-700/30 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                          <span className="text-white text-lg font-bold">{index + 1}</span>
                        </div>
                        <span className="text-lg text-gray-700 dark:text-gray-300 font-bold">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Performers / Pengisi Acara */}
              {Array.isArray(event?.performers) && event.performers.length > 0 && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white">Pengisi Acara</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {event.performers.map((performer, index) => (
                      <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-2xl border border-yellow-200/30 dark:border-yellow-700/30 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="text-lg text-gray-700 dark:text-gray-300 font-bold">{performer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Facilities */}
              {Array.isArray(event?.facilities) && event.facilities.length > 0 && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white">Fasilitas & Keamanan</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {event.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center gap-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-2xl border border-green-200/30 dark:border-green-700/30 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-lg text-gray-700 dark:text-gray-300 font-bold">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Additional Information */}
              {event.additional_info && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white">Informasi Tambahan</h3>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/30 dark:border-blue-700/30">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line font-medium">
                      {event.additional_info}
                    </p>
                  </div>
                </div>
              )}

              {/* Enhanced Links */}
              {(event.poster_link || event.ticket_link) && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white">Link & Dokumentasi</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.poster_link && (
                      <a 
                        href={event.poster_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                      >
                        <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-lg font-bold">Lihat Poster</span>
                      </a>
                    )}
                    {event.ticket_link && (
                      <a 
                        href={event.ticket_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                      >
                        <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        <span className="text-lg font-bold">Beli Tiket Online</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Enhanced Schedule */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white">Jadwal Event</h3>
                </div>
                <EventSchedule event={event} />
              </div>

              {/* Enhanced Organizers */}
              {Array.isArray(event?.organizers) && event.organizers.length > 0 && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
                  <Organizers event={event} />
                </div>
              )}

              {/* Enhanced Packages Section */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white">Pilihan Paket</h3>
                </div>
                <EventPackages event={event} />
              </div>

              {/* Enhanced Map Section */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <BiMap className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white">Lokasi Event</h3>
                  </div>
                  <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">Lihat lokasi event di peta interaktif</p>
                </div>
                <ErrorBoundary>
                  <SmartMap destination={event} onDistanceCalculated={setMapDistance} />
                </ErrorBoundary>
              </div>
            </div>

            {/* Enhanced Right Column - Sidebar */}
            <div className="space-y-12">
              {/* Enhanced Ticket */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">Beli Tiket</h3>
                </div>
                <BuyTicket event={event} />
              </div>

              {/* Enhanced Rating & Reviews Section */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <BiStar className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">Rating & Ulasan</h3>
                </div>
                <RatingReviews 
                  rating={parseFloat(event.rating) || 4.5}
                  reviewCount={0}
                  onWriteReview={(reviewData) => {
                    // Handle review submission
                    console.log('Review submitted:', reviewData);
                  }}
                  storageKey={`reviews:event:${event?.id || params?.id || 'unknown'}`}
                />
              </div>

              {/* Enhanced Event Info Card */}
              <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shadow-xl">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black">Informasi Event</h3>
                  </div>
                  <p className="text-purple-100 text-lg font-medium">Detail lengkap event</p>
                </div>
                <div className="space-y-6">
                  {event.contact && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30 hover:bg-white/30 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center">
                          <BiPhone className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-sm text-purple-100 font-bold">Kontak</div>
                          <div className="text-lg font-black">{event.contact}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {event.location && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30 hover:bg-white/30 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center">
                          <BiMap className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-sm text-purple-100 font-bold">Lokasi</div>
                          <div className="text-lg font-black">{event.location}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {(event.date || event.event_date) && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30 hover:bg-white/30 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center">
                          <BiCalendar className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-sm text-purple-100 font-bold">Tanggal</div>
                          <div className="text-lg font-black">{event.date || event.event_date}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {(event.organizer || (Array.isArray(event?.organizers) && event.organizers.length > 0)) && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30 hover:bg-white/30 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center">
                          <BiUser className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-sm text-purple-100 font-bold">Penyelenggara</div>
                          <div className="text-lg font-black">
                            {event.organizer || (event.organizers?.[0]?.name) || 'Penyelenggara Event'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {event.event_type && (
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30 hover:bg-white/30 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center">
                          <BiStar className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-sm text-purple-100 font-bold">Jenis Event</div>
                          <div className="text-lg font-black">{event.event_type}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

      {/* Enhanced Additional Info Cards removed by request: Informasi Lokasi & Informasi Cuaca */}

      {/* Transportasi Publik removed by request */}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Upcoming Events */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* <UpcomingEvents /> */}
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
    