"use client";

import { useContext } from "react";
import { EventContext } from "@/context/EventContext";

// components
import HeroSection from "@/components/HeroSection";
import EventList from "@/components/Event/EventList";
import RecommendedEvent from "@/components/RecommendedEvent";
import DownloadApp from "@/components/DownloadApp";
import Image from "next/image";
import Link from "next/link";
import { BiMap, BiStar, BiHeart, BiCamera, BiRestaurant, BiHotel, BiGift, BiCar, BiCalendar, BiTrendingUp, BiShield, BiAward } from "react-icons/bi";
 

const Home = () => {
  const { showEventlist, handleClearSearch } = useContext(EventContext);
  console.log(showEventlist);
  return (
    <div className="min-h-screen"> 
      <HeroSection/>
      
      {showEventlist ? (
        <div className="container mx-auto py-16">
          <EventList />
        </div>
      ) : (
        <div className="relative">
          {/* Features Section */}
          <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900/60 dark:via-blue-900/40 dark:to-indigo-900/50 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-slate-300/30 to-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-indigo-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-300/30 to-slate-300/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
              <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse delay-500"></div>
              <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-gradient-to-br from-slate-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-1500"></div>
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white px-8 py-4 rounded-2xl mb-8 shadow-2xl backdrop-blur-sm border border-white/20">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <BiAward className="text-xl" />
                  </div>
                  <span className="font-bold text-lg">Fitur Unggulan</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
                  Mengapa Memilih <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">Dolan Banyumas</span>?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-xl md:text-2xl max-w-5xl mx-auto leading-relaxed font-light">
                  Platform wisata terdepan yang menghadirkan pengalaman lengkap untuk menjelajahi keindahan alam, 
                  kekayaan budaya, dan cita rasa kuliner yang memukau di jantung Jawa Tengah
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-8xl mx-auto">
                <div className="group">
                  <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-10 text-center hover:bg-white dark:hover:bg-gray-800 hover:-translate-y-6 transition-all duration-700 shadow-2xl hover:shadow-3xl border border-white/50 dark:border-gray-700/50 overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    <div className="relative z-10">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl shadow-blue-500/25">
                        <BiCamera className="text-white text-4xl" />
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-6 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">500+ Destinasi</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-medium">
                        Jelajahi berbagai objek wisata alam, budaya, dan sejarah yang menarik di Banyumas
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="group">
                  <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-10 text-center hover:bg-white dark:hover:bg-gray-800 hover:-translate-y-6 transition-all duration-700 shadow-2xl hover:shadow-3xl border border-white/50 dark:border-gray-700/50 overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    <div className="relative z-10">
                      <div className="w-24 h-24 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl shadow-green-500/25">
                        <BiRestaurant className="text-white text-4xl" />
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-6 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">Kuliner Lokal</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-medium">
                        Nikmati cita rasa autentik masakan Jawa dengan sentuhan lokal yang unik dan lezat
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="group">
                  <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-10 text-center hover:bg-white dark:hover:bg-gray-800 hover:-translate-y-6 transition-all duration-700 shadow-2xl hover:shadow-3xl border border-white/50 dark:border-gray-700/50 overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    <div className="relative z-10">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-violet-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl shadow-purple-500/25">
                        <BiHotel className="text-white text-4xl" />
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-6 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Penginapan</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-medium">
                        Temukan hotel, homestay, dan villa dengan fasilitas lengkap untuk kenyamanan Anda
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="group">
                  <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-10 text-center hover:bg-white dark:hover:bg-gray-800 hover:-translate-y-6 transition-all duration-700 shadow-2xl hover:shadow-3xl border border-white/50 dark:border-gray-700/50 overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    <div className="relative z-10">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-500 via-red-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl shadow-orange-500/25">
                        <BiGift className="text-white text-4xl" />
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-6 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">Oleh-oleh</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-medium">
                        Bawa pulang souvenir dan makanan khas Banyumas sebagai kenangan perjalanan
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* About Dolan Banyumas Section */}
          <section className="py-20 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                    <span className="text-2xl">💡</span>
                    <span className="font-semibold">Tentang Kami</span>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                    Apa itu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Dolan Banyumas</span>?
                  </h3>
                  <div className="space-y-6">
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                      <strong className="text-blue-600 dark:text-blue-400">"Dolan"</strong> dalam bahasa Jawa berarti berwisata atau jalan-jalan. 
                      Dolan Banyumas adalah platform komprehensif yang menghadirkan semua yang perlu Anda ketahui 
                      tentang destinasi wisata di Kabupaten Banyumas.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                      Kami menyediakan informasi lengkap tentang objek wisata alam yang memukau, kuliner tradisional yang lezat, 
                      penginapan nyaman, oleh-oleh khas, desa wisata yang autentik, dan layanan biro perjalanan terpercaya.
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                      Dengan Dolan Banyumas, perjalanan Anda di Banyumas akan menjadi pengalaman yang berkesan, 
                      terorganisir, dan penuh dengan kejutan menyenangkan.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Informasi Terverifikasi</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Update Berkala</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span>User Experience Terbaik</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                      src="/hero/bunderan batur.jpg"
                      fill
                      alt="Bunderan Batur Banyumas"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <p className="text-lg font-bold">Bunderan Batur</p>
                      <p className="text-sm opacity-90">Ikon Kota Banyumas</p>
                    </div>

                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <BiStar className="text-white text-3xl" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <BiHeart className="text-white text-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Banyumas Section */}
          <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                  <BiTrendingUp className="text-xl" />
                  <span className="font-semibold">Keunggulan</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Mengapa Memilih <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Banyumas</span>?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xl max-w-4xl mx-auto leading-relaxed">
                  Temukan keunikan dan keindahan yang membuat Banyumas menjadi destinasi wisata yang tak terlupakan
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                <div className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:-translate-y-4 transition-all duration-500 shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-700">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <BiHeart className="text-white text-4xl" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pengalaman Unik</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                      Setiap destinasi menawarkan pengalaman yang berbeda dan tak terlupakan. 
                      Dari wisata alam hingga budaya, setiap momen akan menjadi kenangan berharga.
                    </p>
                  </div>
                </div>
                
                <div className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center hover:bg-gradient-to-br hover:from-green-50 hover:to-blue-50 dark:hover:from-green-900/20 dark:hover:to-blue-900/20 hover:-translate-y-4 transition-all duration-500 shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-700">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <BiCamera className="text-white text-4xl" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Keindahan Alam</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                      Dari pegunungan hijau Gunung Slamet, air terjun yang memukau, hingga hutan pinus yang sejuk. 
                      Banyumas memiliki panorama alam yang menakjubkan.
                    </p>
                  </div>
                </div>
                
                <div className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50 dark:hover:from-orange-900/20 dark:hover:to-red-900/20 hover:-translate-y-4 transition-all duration-500 shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-700">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <BiRestaurant className="text-white text-4xl" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Kuliner Tradisional</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                      Nikmati cita rasa autentik masakan Jawa dengan sentuhan lokal yang unik dan lezat. 
                      Dari soto sokaraja hingga nopia.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-20 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                  <span className="text-2xl">🎯</span>
                  <span className="font-semibold">Layanan</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                  Apa yang Kami <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Tawarkan</span>?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xl max-w-4xl mx-auto leading-relaxed">
                  Layanan lengkap untuk memenuhi semua kebutuhan wisata Anda di Banyumas
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                <div className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 text-center hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:-translate-y-3 transition-all duration-500 shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <BiCamera className="text-white text-2xl" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Objek Wisata</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      Destinasi alam, budaya, dan sejarah yang menarik
                    </p>
                  </div>
                </div>
                
                <div className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 text-center hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50 dark:hover:from-orange-900/20 dark:hover:to-red-900/20 hover:-translate-y-3 transition-all duration-500 shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <BiRestaurant className="text-white text-2xl" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Kuliner</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      Restoran dan warung tradisional dengan cita rasa autentik
                    </p>
                  </div>
                </div>
                
                <div className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 text-center hover:bg-gradient-to-br hover:from-green-50 hover:to-blue-50 dark:hover:from-green-900/20 dark:hover:to-blue-900/20 hover:-translate-y-3 transition-all duration-500 shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <BiHotel className="text-white text-2xl" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Penginapan</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      Hotel, homestay, dan villa dengan fasilitas lengkap
                    </p>
                  </div>
                </div>
                
                <div className="group">
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 text-center hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 hover:-translate-y-3 transition-all duration-500 shadow-lg hover:shadow-xl border border-gray-100 dark:border-gray-700">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <BiGift className="text-white text-2xl" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Oleh-oleh</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      Souvenir dan makanan khas untuk dibawa pulang
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Services Section */}
          <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
                <div className="space-y-8">
                  <div className="text-center lg:text-left">
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                      <span className="text-2xl">🚀</span>
                      <span className="font-semibold">Layanan Premium</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                      Layanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Tambahan</span>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xl">
                      Nikmati pengalaman wisata yang lebih lengkap dengan layanan khusus kami
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-5 group">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                        <BiMap className="text-white text-2xl" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Desa Wisata</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                          Jelajahi desa-desa tradisional dengan budaya yang masih terjaga dan pengalaman hidup bersama masyarakat lokal.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-5 group">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                        <BiCar className="text-white text-2xl" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Biro Perjalanan</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                          Layanan tour guide dan paket wisata yang terpercaya untuk memastikan perjalanan Anda aman dan nyaman.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-5 group">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                        <BiCalendar className="text-white text-2xl" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Event & Acara</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                          Informasi lengkap tentang festival, acara budaya, dan kegiatan menarik yang berlangsung di Banyumas.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-500 group">
                    <Image
                      src="/hero/caub.jpg"
                      fill
                      alt="Wisata Banyumas"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-sm font-medium">Curug Cipendok</p>
                    </div>
                  </div>
                  <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-500 group">
                    <Image
                      src="/hero/menara teratai.jpg"
                      fill
                      alt="Menara Teratai"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-sm font-medium">Menara Teratai</p>
                    </div>
                  </div>
                  <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-500 group">
                    <Image
                      src="/objekwisata/hutanpinus.jpg"
                      fill
                      alt="Hutan Pinus"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-sm font-medium">Hutan Pinus</p>
                    </div>
                  </div>
                  <div className="relative h-48 rounded-3xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-500 group">
                    <Image
                      src="/hero/bunderan batur.jpg"
                      fill
                      alt="Bunderan Batur"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-sm font-medium">Bunderan Batur</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            {/* Animated Stars */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping"></div>
              <div className="absolute top-20 right-20 w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
              <div className="absolute bottom-20 left-20 w-2 h-2 bg-white rounded-full animate-ping"></div>
              <div className="absolute bottom-10 right-10 w-1 h-1 bg-yellow-300 rounded-full animate-ping"></div>
              <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-white rounded-full animate-ping"></div>
              <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center">
                <div className="bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-cyan-600/90 backdrop-blur-xl rounded-3xl p-16 shadow-2xl max-w-7xl mx-auto relative overflow-hidden group hover:shadow-3xl transition-all duration-700 border border-white/20">
                  {/* Enhanced Background elements */}
                  <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse floating"></div>
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse floating-delayed"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse floating-more-delayed"></div>
                    <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-white rounded-full blur-xl animate-pulse floating"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-white rounded-full blur-lg animate-pulse floating-delayed"></div>
                  </div>
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-shimmer"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-5xl md:text-7xl font-black text-white mb-8 group-hover:scale-105 transition-transform duration-700 leading-tight">
                      Siap Berpetualang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 animate-pulse">Banyumas</span>?
                    </h3>
                    <p className="text-blue-100 text-xl md:text-2xl mb-12 max-w-6xl mx-auto leading-relaxed font-light">
                      Mulai perjalanan Anda sekarang dan temukan keajaiban yang tersembunyi di setiap sudut Banyumas. 
                      Kami siap membantu Anda merencanakan petualangan yang tak terlupakan.
                    </p>
                    
                    <div className="flex flex-col lg:flex-row gap-8 justify-center items-center mb-12">
                      <Link
                        href="/dolan-banyumas"
                        className="group bg-white text-blue-600 px-12 py-6 rounded-2xl font-black hover:bg-gray-50 hover:scale-105 transition-all duration-500 text-xl shadow-2xl hover:shadow-3xl hover:shadow-blue-500/25 border-2 border-transparent hover:border-blue-200"
                      >
                        <span className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <BiMap className="text-white text-lg" />
                          </div>
                          Jelajahi Semua Wisata Di Banyumas
                          <span className="group-hover:translate-x-2 transition-transform duration-300 text-2xl">→</span>
                        </span>
                      </Link>
                      <Link
                        href="/about"
                        className="group bg-transparent border-2 border-white/80 text-white px-12 py-6 rounded-2xl font-black hover:bg-white hover:text-blue-600 transition-all duration-500 text-xl hover:scale-105 backdrop-blur-sm"
                      >
                        <span className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                            <BiStar className="text-white text-lg group-hover:text-white" />
                          </div>
                          Pelajari Lebih Lanjut
                          <span className="group-hover:translate-x-2 transition-transform duration-300 text-2xl">→</span>
                        </span>
                      </Link>
                    </div>
                    
                    {/* Enhanced Additional info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                      <div className="flex items-center justify-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-blue-100 font-semibold">Gratis & Terpercaya</span>
                      </div>
                      <div className="flex items-center justify-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-blue-100 font-semibold">Update Real-time</span>
                      </div>
                      <div className="flex items-center justify-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                        <span className="text-blue-100 font-semibold">Support 24/7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Download App Section */}
          <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4">
              <DownloadApp />
            </div>
          </section>
          
          {/* Recommended Events Section */}
          <section className="py-20 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
                  <span className="text-2xl">🎉</span>
                  <span className="font-semibold">Event Terbaru</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">Menarik</span> di Banyumas
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xl max-w-3xl mx-auto">
                  Jangan lewatkan acara-acara seru dan festival budaya yang berlangsung di Banyumas
                </p>
              </div>
              <RecommendedEvent/>
            </div>
          </section>
        </div>
      )}
      
      {/* Spacer for Footer */}
      <div className="mb-16"></div>
    </div>
  );
};

export default Home;

