"use client";

import { useContext } from "react";
import { EventContext } from "@/context/EventContext";

// components
import Hero from "@/components/hero";
import EventList from "@/components/Event/EventList";
import RecommendedEvent from "@/components/RecommendedEvent";
import DownloadApp from "@/components/DownloadApp";
import Image from "next/image";
import Link from "next/link";
import { BiMap, BiStar, BiHeart, BiCamera, BiRestaurant, BiHotel, BiGift, BiCar, BiCalendar } from "react-icons/bi";
 

const Home = () => {
  const { showEventlist, handleClearSearch } = useContext(EventContext);
  console.log(showEventlist);
  return (
    <div> 
      <Hero/>
      <div className="flex flex-col justify-center items-center">
      </div>
      {showEventlist ? (
        <div className="container mx-auto">
          <EventList />
        </div>
      ) : (
        <div>
          <div className="container mx-auto">
            
            {/* Main Header */}
            <div className="text-center mb-20 pt-8">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-6">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">Platform Wisata Terdepan</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  <span className="text-blue-600 dark:text-blue-400 italic text-2xl md:text-3xl block mb-2">Selamat Datang di</span>
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                    Dolan Banyumas
                  </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed mb-8">
                  Platform wisata terdepan yang menghadirkan pengalaman lengkap untuk menjelajahi keindahan alam, 
                  kekayaan budaya, dan cita rasa kuliner yang memukau di jantung Jawa Tengah
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-lg">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">🏞️ 500+ Destinasi</span>
                  </div>
                  <div className="bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-lg">
                    <span className="text-green-600 dark:text-green-400 font-semibold">🍜 Kuliner Lokal</span>
                  </div>
                  <div className="bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full shadow-lg">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold">🏨 Penginapan</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dolan Banyumas Section */}
            <div className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-3xl mb-20">
              <div className="container mx-auto px-4">
                {/* What is Dolan Banyumas */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-3 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-6">
                      <span className="text-blue-600 dark:text-blue-400">💡</span>
                      <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">Tentang Kami</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                      Apa itu <span className="text-blue-600 dark:text-blue-400">Dolan Banyumas</span>?
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                        <strong className="text-blue-600 dark:text-blue-400">"Dolan"</strong> dalam bahasa Jawa berarti berwisata atau jalan-jalan. 
                        Dolan Banyumas adalah platform komprehensif yang menghadirkan semua yang perlu Anda ketahui 
                        tentang destinasi wisata di Kabupaten Banyumas.
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                        Kami menyediakan informasi lengkap tentang objek wisata alam yang memukau, kuliner tradisional yang lezat, 
                        penginapan nyaman, oleh-oleh khas, desa wisata yang autentik, dan layanan biro perjalanan terpercaya.
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                        Dengan Dolan Banyumas, perjalanan Anda di Banyumas akan menjadi pengalaman yang berkesan, 
                        terorganisir, dan penuh dengan kejutan menyenangkan.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Informasi Terverifikasi
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Update Berkala
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        User Experience Terbaik
                      </div>
                    </div>
                  </div>
                  <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src="/hero/bunderan batur.jpg"
                      fill
                      alt="Bunderan Batur Banyumas"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm opacity-90">Bunderan Batur</p>
                      <p className="text-xs opacity-75">Ikon Kota Banyumas</p>
                    </div>
                  </div>
                </div>

                {/* Why Choose Banyumas */}
                <div className="mb-20">
                  <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-6">
                      <span className="text-green-600 dark:text-green-400">🌟</span>
                      <span className="text-green-700 dark:text-green-300 text-sm font-medium">Keunggulan</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      Mengapa Memilih <span className="text-blue-600 dark:text-blue-400">Banyumas</span>?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
                      Temukan keunikan dan keindahan yang membuat Banyumas menjadi destinasi wisata yang tak terlupakan
                    </p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700 hover:-translate-y-3 transition-all duration-300 group shadow-lg hover:shadow-xl">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                        <BiHeart className="text-white text-3xl" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Pengalaman Unik</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                        Setiap destinasi menawarkan pengalaman yang berbeda dan tak terlupakan. 
                        Dari wisata alam hingga budaya, setiap momen akan menjadi kenangan berharga.
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700 hover:-translate-y-3 transition-all duration-300 group shadow-lg hover:shadow-xl">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                        <BiCamera className="text-white text-3xl" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Keindahan Alam</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                        Dari pegunungan hijau Gunung Slamet, air terjun yang memukau, hingga hutan pinus yang sejuk. 
                        Banyumas memiliki panorama alam yang menakjubkan.
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700 hover:-translate-y-3 transition-all duration-300 group shadow-lg hover:shadow-xl">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                        <BiRestaurant className="text-white text-3xl" />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Kuliner Tradisional</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                        Nikmati cita rasa autentik masakan Jawa dengan sentuhan lokal yang unik dan lezat. 
                        Dari soto sokaraja hingga nopia.
                      </p>
                    </div>
                  </div>
                </div>

                {/* What We Offer */}
                <div className="mb-20">
                  <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full mb-6">
                      <span className="text-purple-600 dark:text-purple-400">🎯</span>
                      <span className="text-purple-700 dark:text-purple-300 text-sm font-medium">Layanan</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                      Apa yang Kami <span className="text-blue-600 dark:text-blue-400">Tawarkan</span>?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-3xl mx-auto">
                      Layanan lengkap untuk memenuhi semua kebutuhan wisata Anda di Banyumas
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700 hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <BiCamera className="text-white text-2xl" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Objek Wisata</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        Destinasi alam, budaya, dan sejarah yang menarik
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700 hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <BiRestaurant className="text-white text-2xl" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Kuliner</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        Restoran dan warung tradisional dengan cita rasa autentik
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700 hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <BiHotel className="text-white text-2xl" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Penginapan</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        Hotel, homestay, dan villa dengan fasilitas lengkap
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-700 hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <BiGift className="text-white text-2xl" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Oleh-oleh</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        Souvenir dan makanan khas untuk dibawa pulang
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Services */}
                <div className="mb-20">
                  <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                    <div className="space-y-8">
                      <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-3 bg-teal-100 dark:bg-teal-900/30 px-4 py-2 rounded-full mb-6">
                          <span className="text-teal-600 dark:text-teal-400">🚀</span>
                          <span className="text-teal-700 dark:text-teal-300 text-sm font-medium">Layanan Premium</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                          Layanan <span className="text-blue-600 dark:text-blue-400">Tambahan</span>
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                          Nikmati pengalaman wisata yang lebih lengkap dengan layanan khusus kami
                        </p>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-start gap-5 group">
                          <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                            <BiMap className="text-white text-xl" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Desa Wisata</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                              Jelajahi desa-desa tradisional dengan budaya yang masih terjaga dan pengalaman hidup bersama masyarakat lokal.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-5 group">
                          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                            <BiCar className="text-white text-xl" />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Biro Perjalanan</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                              Layanan tour guide dan paket wisata yang terpercaya untuk memastikan perjalanan Anda aman dan nyaman.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-5 group">
                          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                            <BiCalendar className="text-white text-xl" />
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
                      <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                        <Image
                          src="/hero/caub.jpg"
                          fill
                          alt="Wisata Banyumas"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 text-white">
                          <p className="text-sm font-medium">Curug Cipendok</p>
                        </div>
                      </div>
                      <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                        <Image
                          src="/hero/menara teratai.jpg"
                          fill
                          alt="Menara Teratai"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 text-white">
                          <p className="text-sm font-medium">Menara Teratai</p>
                        </div>
                      </div>
                      <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                        <Image
                          src="/objekwisata/hutanpinus.jpg"
                          fill
                          alt="Hutan Pinus"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 text-white">
                          <p className="text-sm font-medium">Hutan Pinus</p>
                        </div>
                      </div>
                      <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                        <Image
                          src="/hero/bunderan batur.jpg"
                          fill
                          alt="Bunderan Batur"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 text-white">
                          <p className="text-sm font-medium">Bunderan Batur</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl p-12 shadow-2xl max-w-5xl mx-auto">
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">
                      Siap Berpetualang di <span className="text-yellow-300">Banyumas</span>?
                    </h3>
                    <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-4xl mx-auto leading-relaxed">
                      Mulai perjalanan Anda sekarang dan temukan keajaiban yang tersembunyi di setiap sudut Banyumas. 
                      Kami siap membantu Anda merencanakan petualangan yang tak terlupakan.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        href="/dolan-banyumas"
                        className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 hover:scale-105 transition-all duration-300 text-lg shadow-lg"
                      >
                        🗺️ Jelajahi Semua Wisata Di Banyumas
                      </Link>
                      <Link
                        href="/about"
                        className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 text-lg"
                      >
                        📖 Pelajari Lebih Lanjut
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Download App Section */}
            <div className="mb-20">
              <DownloadApp />
            </div>
            
            {/* recommended events slider */}
            <RecommendedEvent/>
          </div>
        </div>
      )}
      
      {/* Spacer for Footer */}
      <div className="mb-16"></div>
    </div>
  );
};

export default Home;
