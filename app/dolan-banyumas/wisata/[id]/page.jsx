"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { BiMap, BiPhone, BiTime, BiMoney, BiStar, BiHeart, BiShare, BiArrowBack } from "react-icons/bi";
import { FaWhatsapp, FaInstagram, FaGlobe } from "react-icons/fa";
import PhotoGallery from "../../../../components/PhotoGallery";
import ErrorBoundary from "../../../../components/ErrorBoundary";
import SmartMap from "../../../../components/SmartMap";
import TourismManager from "../../../../components/TourismManager";
import WisataPackages from "../../../../components/WisataPackages";
import BuyTicket from "../../../../components/BuyTicket";
import RatingReviews from "../../../../components/RatingReviews";
import { TicketProvider } from "../../../../context/TicketContext";
import LoadingToast from "../../../../components/LoadingToast";
import ExploreNotification from "../../../../components/ExploreNotification";

const WisataDetail = () => {
  const SHOW_WISATA_TICKET = false; // hide Buy Ticket section (not deleted)
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapDistance, setMapDistance] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showLoadingToast, setShowLoadingToast] = useState(false);
  const [showExploreNotification, setShowExploreNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('loading');

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setIsLoading(true);
        setShowLoadingToast(true);
        setShowExploreNotification(true);
        setNotificationType('loading');
        const res = await fetch(`/api/wisata/${id}?t=${Date.now()}` , { cache: 'no-store' });
        if (!res.ok) {
          throw new Error("Failed to fetch destination");
        }
        const data = await res.json();
        setDestination(data.wisata || data.destination || data);
        
        // Show success notification
        setNotificationType('success');
        setTimeout(() => {
          setShowExploreNotification(false);
        }, 2000);
      } catch (err) {
        setError(err.message);
        setNotificationType('error');
        setTimeout(() => {
          setShowExploreNotification(false);
        }, 3000);
      } finally {
        setIsLoading(false);
        setShowLoadingToast(false);
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
          return [
            { type: 'phone', value: contact },
            { type: 'whatsapp', value: contact }
          ];
        } catch {
          // If parsing fails, assume it's a phone number and also create WhatsApp entry
          return [
            { type: 'phone', value: contact },
            { type: 'whatsapp', value: contact }
          ];
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

  // Function to shorten URL for display
  const shortenUrl = (url) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      // Remove www. prefix and show only domain + path (max 30 chars)
      let displayUrl = urlObj.hostname.replace(/^www\./, '');
      if (urlObj.pathname !== '/') {
        displayUrl += urlObj.pathname;
      }
      // Truncate if too long
      if (displayUrl.length > 30) {
        displayUrl = displayUrl.substring(0, 27) + '...';
      }
      return displayUrl;
    } catch {
      // If URL parsing fails, return truncated original
      return url.length > 30 ? url.substring(0, 27) + '...' : url;
    }
  };
  

  
  // Validate that destination doesn't contain any objects that could cause rendering issues
  const safeDestination = {
    ...destination,
    manager: destination?.manager || '',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Enhanced Hero Section */}
      <div className="relative pt-24 pb-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-300/20 rounded-full blur-xl animate-bounce"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-indigo-300/20 rounded-full blur-xl animate-bounce delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-300/20 rounded-full blur-xl animate-bounce delay-2000"></div>
          <div className="absolute top-60 right-1/3 w-14 h-14 bg-cyan-300/20 rounded-full blur-xl animate-bounce delay-3000"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          {/* Enhanced Back Button */}
          <button 
            onClick={() => window.history.back()} 
            className="group mt-12 mb-10 inline-flex items-center gap-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 transform hover:-translate-x-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border border-blue-200 dark:border-blue-800 hover:shadow-2xl"
          >
            <BiArrowBack className="text-xl group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Kembali ke Dolan Banyumas</span>
          </button>

          {/* Enhanced Hero Content */}
          <div className="max-w-6xl mx-auto text-center mb-16">
            {/* Enhanced Category Badge */}
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-full mb-8 shadow-2xl border border-blue-400/30">
              <BiStar className="text-xl animate-pulse" style={{ animationDuration: '3s' }} />
              <span className="text-lg font-bold capitalize tracking-wide">{safeDestination.type}</span>
            </div>
            
            {/* Enhanced Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-8 leading-tight bg-gradient-to-r from-gray-900 via-blue-600 to-indigo-600 dark:from-white dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              {safeDestination.title}
            </h1>
            
            {/* Enhanced Location and Recommendation */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-700 dark:text-gray-400 mb-12">
              <div className="flex items-center gap-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border border-white/60 dark:border-gray-700/50">
                <BiMap className="text-2xl text-blue-600 dark:text-blue-500" />
                <span className="font-bold text-gray-800 dark:text-gray-200 text-lg">{safeDestination.location}</span>
              </div>
              {safeDestination.recommended && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full shadow-xl border border-yellow-300/50">
                  <BiStar className="text-xl animate-pulse" style={{ animationDuration: '3s' }} />
                  <span className="text-lg font-bold">Direkomendasikan</span>
                </div>
              )}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className={`group flex items-center gap-4 px-10 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl ${
                  isLiked 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-500/25' 
                    : 'bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 shadow-xl border border-gray-200/50 dark:border-gray-700/50'
                }`}
              >
                <BiHeart className={`text-2xl group-hover:scale-110 transition-transform ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-bold text-lg">{isLiked ? 'Disukai' : 'Sukai'}</span>
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
                className="group flex items-center gap-4 bg-white/90 dark:bg-gray-800/90 text-gray-800 dark:text-gray-300 px-10 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700/90 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
              >
                <BiShare className="text-2xl group-hover:scale-110 transition-transform" />
                <span className="font-bold text-lg">Bagikan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-8 lg:space-y-10">
              {/* Enhanced Gallery */}
              <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-gray-700/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Galeri Foto</h3>
                      <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                <ErrorBoundary>
                  <PhotoGallery
                    images={[safeDestination.img_lg, safeDestination.img_sm, ...(safeDestination.gallery || [])].filter(Boolean)}
                    title={safeDestination.title}
                  />
                </ErrorBoundary>
                </div>
              </div>

              {/* Enhanced Description */}
              <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Tentang Destinasi</h2>
                      <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    </div>
                </div>
                
                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg bg-gradient-to-r from-gray-50 to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-800">
                    {safeDestination.description || safeDestination.short_description || "Deskripsi destinasi tidak tersedia"}
                  </p>
                  </div>
                </div>
              </div>

              {/* Pengelola Wisata */}
              <TourismManager destination={safeDestination} contactInfo={contactInfo} />

              {/* Enhanced Map */}
              <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border border-white/60 dark:border-gray-700/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 rounded-3xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <BiMap className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Peta Lokasi</h3>
                      <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                <ErrorBoundary>
                  <SmartMap
                    destination={safeDestination}
                    onDistanceCalculated={setMapDistance}
                  />
                </ErrorBoundary>
                </div>
              </div>


              {/* Paket Wisata - Hidden */}
              {/* <div className="bg-white/85 dark:bg-gray-800/70 backdrop-blur-sm rounded-3xl p-5 border border-white/60 dark:border-gray-700/50 shadow-xl hover-lift animate-scale-in">
                <ErrorBoundary>
                  <WisataPackages destination={safeDestination} />
                </ErrorBoundary>
              </div> */}
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-8 lg:space-y-10">
              {/* Enhanced Info Card */}
              <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Informasi Destinasi</h3>
                      <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                    </div>
                </div>
                
                {safeDestination.entrance_fee && (
                    <div className="mb-10">
                      <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-3xl p-8 text-white text-center shadow-2xl border border-green-400/30 relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                        
                        <div className="relative">
                          <div className="flex items-center justify-center gap-3 mb-4">
                            <BiMoney className="text-3xl" />
                            <span className="text-xl font-bold opacity-90">Harga Tiket</span>
                      </div>
                          <div className="text-4xl font-bold mb-3">{safeDestination.entrance_fee}</div>
                          <div className="text-lg opacity-80">per orang</div>
                        </div>
                    </div>
                  </div>
                )}

                {safeDestination.address && (
                    <div className="mb-10">
                      <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                        <BiMap className="text-2xl text-blue-600 dark:text-blue-500" />
                      Alamat Lengkap
                    </h4>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50 shadow-lg">
                        <span className="text-gray-800 dark:text-gray-300 leading-relaxed text-lg">{safeDestination.address}</span>
                    </div>
                  </div>
                )}

                {safeDestination.created_at && (
                    <div className="mb-10">
                      <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                        <BiTime className="text-2xl text-amber-600 dark:text-amber-500" />
                      Ditambahkan
                    </h4>
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200/50 dark:border-amber-700/50 shadow-lg">
                        <span className="text-amber-800 dark:text-amber-300 font-bold text-lg">
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
                    <div className="space-y-6">
                      <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                        <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Kontak & Informasi
                    </h4>
                    
                      <div className="grid grid-cols-1 gap-4">
                      {contactInfo.map((contact, index) => {
                        switch (contact.type) {
                          case 'phone':
                            return (
                              <a 
                                key={index}
                                href={`tel:${contact.value}`}
                                  className="group flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-300 transform hover:scale-105 shadow-lg border border-blue-200/50 dark:border-blue-700/50"
                              >
                                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <BiPhone className="text-2xl text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-1">Telepon</div>
                                    <div className="text-blue-800 dark:text-blue-300 font-bold text-lg">{contact.value}</div>
                                </div>
                                  <svg className="w-6 h-6 text-blue-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </a>
                            );
                          case 'whatsapp':
                            return (
                              <a 
                                key={index}
                                href={`https://wa.me/${contact.value.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo, saya tertarik dengan destinasi ${safeDestination.title}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                  className="group flex items-center gap-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 transition-all duration-300 transform hover:scale-105 shadow-lg border border-green-200/50 dark:border-green-700/50"
                              >
                                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <FaWhatsapp className="text-2xl text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-green-600 dark:text-green-400 mb-1">WhatsApp</div>
                                    <div className="text-green-800 dark:text-green-300 font-bold text-lg">Chat Sekarang</div>
                                </div>
                                  <svg className="w-6 h-6 text-green-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </a>
                            );
                          case 'instagram':
                            return (
                              <a 
                                key={index}
                                href={`https://instagram.com/${contact.value.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                  className="group flex items-center gap-4 p-5 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-900/30 dark:hover:to-rose-900/30 transition-all duration-300 transform hover:scale-105 shadow-lg border border-pink-200/50 dark:border-pink-700/50"
                              >
                                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <FaInstagram className="text-2xl text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-pink-600 dark:text-pink-400 mb-1">Instagram</div>
                                    <div className="text-pink-800 dark:text-pink-300 font-bold text-lg">{contact.value}</div>
                                </div>
                                  <svg className="w-6 h-6 text-pink-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </a>
                            );
                          case 'website':
                            return (
                              <a 
                                key={index}
                                href={contact.value}
                                target="_blank"
                                rel="noopener noreferrer"
                                  className="group flex items-center gap-4 p-5 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl hover:from-purple-100 hover:to-violet-100 dark:hover:from-purple-900/30 dark:hover:to-violet-900/30 transition-all duration-300 transform hover:scale-105 shadow-lg border border-purple-200/50 dark:border-purple-700/50"
                                title={contact.value}
                              >
                                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <FaGlobe className="text-2xl text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-purple-600 dark:text-purple-400 mb-1">Website</div>
                                    <div className="text-purple-800 dark:text-purple-300 font-bold text-lg">{shortenUrl(contact.value)}</div>
                                </div>
                                  <svg className="w-6 h-6 text-purple-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </a>
                            );
                          case 'email':
                            return (
                              <a 
                                key={index}
                                href={`mailto:${contact.value}`}
                                  className="group flex items-center gap-4 p-5 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 rounded-2xl hover:from-gray-100 hover:to-slate-100 dark:hover:from-gray-800/70 dark:hover:to-slate-800/70 transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
                              >
                                  <div className="w-14 h-14 bg-gradient-to-br from-gray-500 to-slate-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <svg className="text-2xl text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Email</div>
                                    <div className="text-gray-800 dark:text-gray-300 font-bold text-lg">{contact.value}</div>
                                </div>
                                  <svg className="w-6 h-6 text-gray-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </a>
                            );
                          default:
                            return null;
                        }
                      })}
                    </div>
                  </div>
                )}

                  {/* Enhanced Pengelola Wisata */}
                {safeDestination.manager && (
                    <div className="mt-8">
                      <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Pengelola Wisata</h4>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                            <div className="font-bold text-gray-800 dark:text-white text-lg">{safeDestination.manager}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Pengelola Destinasi</div>
                        </div>
                      </div>
                      
                        {/* Enhanced Contact Pengelola */}
                      {(() => {
                        const phoneContact = contactInfo.find(c => c.type === 'phone');
                        const whatsappContact = contactInfo.find(c => c.type === 'whatsapp');
                        
                        if (phoneContact || whatsappContact) {
                          return (
                              <div className="mt-6 flex gap-3">
                              {phoneContact && (
                                <a 
                                  href={`tel:${phoneContact.value}`}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-center py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    <BiPhone className="inline mr-2 text-lg" />
                                  Telepon
                                </a>
                              )}
                              {whatsappContact && (
                                <a 
                                  href={`https://wa.me/${whatsappContact.value.replace(/\D/g, '')}?text=Halo, saya ingin bertanya tentang destinasi ${destination.title}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-center py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    <FaWhatsapp className="inline mr-2 text-lg" />
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
              </div>


              {/* Enhanced Features Section */}
              {destination.features && destination.features.length > 0 && (
                <div className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/60 dark:border-gray-700/60 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-red-500/5 rounded-3xl"></div>
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Fitur & Fasilitas</h3>
                        <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      </div>
                  </div>
                  
                    <div className="space-y-4">
                    {destination.features.map((feature, index) => (
                        <div key={index} className="group/item flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                          <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full group-hover/item:scale-125 transition-transform"></div>
                          <span className="text-lg text-purple-700 dark:text-purple-300 font-medium">{feature}</span>
                      </div>
                    ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Purchase Section (hidden by flag) */}
              {SHOW_WISATA_TICKET && destination.entrance_fee && (
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
                  
                  {/* Ticket Purchase Section */}
                  <TicketProvider>
                    <BuyTicket event={{
                      id: destination.id,
                      title: destination.title,
                      img_lg: destination.img_lg,
                      location: destination.location,
                      seats: [{
                        seat: 'general',
                        price: Number(destination.entrance_fee.replace(/[^\d]/g, '')) || 0,
                        desc: 'Tiket masuk umum'
                      }]
                    }} />
                  </TicketProvider>
                </div>
              )}

              {/* Enhanced Quick Actions */}
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl border border-orange-400/30 hover-lift animate-fade-in-right">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Aksi Cepat</h3>
                  <p className="text-orange-100 text-sm">Pilih aksi yang ingin Anda lakukan</p>
                </div>
                
                {/* Enhanced Action Buttons - Larger Size */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Telepon Button */}
                  {(() => {
                    const phoneContact = contactInfo.find(c => c.type === 'phone');
                    return phoneContact ? (
                      <a 
                        href={`tel:${phoneContact.value}`}
                        className="group flex flex-col items-center justify-center gap-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-8 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl border border-white/20"
                      >
                        <div className="w-16 h-16 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <BiPhone className="text-3xl" />
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">Telepon</div>
                          <div className="text-sm opacity-80">Hubungi langsung</div>
                        </div>
                      </a>
                    ) : (
                      <button className="group flex flex-col items-center justify-center gap-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-8 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl border border-white/20">
                        <div className="w-16 h-16 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <BiPhone className="text-3xl" />
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">Telepon</div>
                          <div className="text-sm opacity-80">Hubungi langsung</div>
                        </div>
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
                        className="group flex flex-col items-center justify-center gap-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-8 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl border border-white/20"
                      >
                        <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <FaWhatsapp className="text-3xl" />
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">WhatsApp</div>
                          <div className="text-sm opacity-80">Chat sekarang</div>
                        </div>
                      </a>
                    ) : (
                      <button className="group flex flex-col items-center justify-center gap-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-8 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl border border-white/20">
                        <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <FaWhatsapp className="text-3xl" />
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">WhatsApp</div>
                          <div className="text-sm opacity-80">Chat sekarang</div>
                        </div>
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
                    className="group flex flex-col items-center justify-center gap-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-8 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl border border-white/20"
                  >
                    <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <BiMap className="text-3xl" />
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">Arahkan</div>
                      <div className="text-sm opacity-80">Buka di Maps</div>
                    </div>
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
                    className="group flex flex-col items-center justify-center gap-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-8 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl border border-white/20"
                  >
                    <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <BiShare className="text-3xl" />
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">Bagikan</div>
                      <div className="text-sm opacity-80">Share link</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Enhanced Package Pricing Section - Hidden */}
              {/* <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 border border-white/60 dark:border-gray-700/50 shadow-2xl hover-lift animate-scale-in">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Pilihan Paket Wisata</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Pilih paket yang sesuai dengan kebutuhan Anda</p>
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-semibold border border-green-200/60 dark:border-green-700/50 shadow-md">
                    <div className="w-2 h-2 bg-green-600 dark:bg-green-500 rounded-full animate-pulse"></div>
                    <span>Paket Tersedia</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200/60 dark:border-blue-700/50 rounded-3xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-800 dark:text-white">Paket Standar</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                          </div>
                          <span className="text-sm text-yellow-600 dark:text-yellow-400 font-semibold bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">Recommended</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-1">
                        {destination.entrance_fee || destination.price_range || "Rp Gratis"}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-400 font-medium">per orang</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h5 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Fitur yang termasuk:
                    </h5>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        "Tiket Masuk",
                        "Panduan Wisata",
                        "Fasilitas Dasar",
                        "Asuransi Perjalanan",
                        "Parkir Gratis",
                        "WiFi Area"
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/40 rounded-xl border border-white/60 dark:border-gray-700/30">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h5 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-600 dark:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Syarat & Ketentuan:
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-200/50 dark:border-amber-700/50">
                        <h6 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3">Syarat:</h6>
                        <div className="space-y-2">
                          {[
                            "Min. 1 orang",
                            "Bayar full H-7",
                            "Konfirmasi H-3",
                            "Valid ID diperlukan"
                          ].map((term, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-amber-600 dark:bg-amber-500 rounded-full"></div>
                              <span className="text-xs text-amber-700 dark:text-amber-400">{term}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 border border-red-200/50 dark:border-red-700/50">
                        <h6 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-3">Pembatalan:</h6>
                        <div className="space-y-2">
                          {[
                            "H-7: 100% refund",
                            "H-3: 50% refund",
                            "H-1: 0% refund",
                            "Force majeure: 100%"
                          ].map((term, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-red-600 dark:bg-red-500 rounded-full"></div>
                              <span className="text-xs text-red-700 dark:text-red-400">{term}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

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
                    className="group w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3 text-lg"
                  >
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                    </svg>
                    <span>Pilih Paket Ini</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Rating & Reviews Section - Moved to Bottom */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <RatingReviews 
            rating={parseFloat(destination.rating) || 4.5}
            reviewCount={0}
            onWriteReview={(reviewData) => {
              // Handle review submission
              console.log('Review submitted:', reviewData);
            }}
            storageKey={`reviews:wisata:${destination?.id || params?.id || 'unknown'}`}
          />
        </div>
      </div>
      
      {/* Loading Toast */}
      <LoadingToast 
        show={showLoadingToast}
        title="Memuat konten wisata..."
        message="Mohon tunggu sebentar"
        onClose={() => setShowLoadingToast(false)}
      />
      
      {/* Explore Notification */}
      <ExploreNotification 
        show={showExploreNotification}
        title={notificationType === 'loading' ? 'Memuat Konten Wisata...' : 
               notificationType === 'success' ? 'Konten Berhasil Dimuat!' : 
               'Gagal Memuat Konten'}
        message={notificationType === 'loading' ? 'Mohon tunggu sebentar' : 
                 notificationType === 'success' ? 'Informasi wisata telah siap untuk dilihat' : 
                 'Terjadi kesalahan saat memuat konten'}
        type={notificationType}
        onClose={() => setShowExploreNotification(false)}
        onRefresh={() => window.location.reload()}
        autoClose={notificationType !== 'loading'}
        autoCloseDelay={notificationType === 'success' ? 2000 : 3000}
      />
    </div>
  );
};

export default WisataDetail;
