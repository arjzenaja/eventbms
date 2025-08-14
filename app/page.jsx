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
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                <span className="text-blue-400 italic text-2xl md:text-3xl">Selamat Datang di</span><br />
                Dolan Banyumas
              </h2>
              <p className="text-gray-300 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
                Platform wisata terdepan yang menghadirkan pengalaman lengkap untuk menjelajahi keindahan alam, 
                kekayaan budaya, dan cita rasa kuliner yang memukau di jantung Jawa Tengah
              </p>
            </div>

            {/* Dolan Banyumas Section */}
            <div className="py-16 bg-gradient-to-b">
              <div className="container mx-auto px-4">
                {/* What is Dolan Banyumas */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                  <div className="space-y-4">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                      Apa itu <span className="text-blue-400">Dolan Banyumas</span>?
                    </h3>
                    <div className="space-y-4">
                      <p className="text-gray-300 text-base leading-relaxed">
                        <strong className="text-blue-400">"Dolan"</strong> dalam bahasa Jawa berarti berwisata atau jalan-jalan. 
                        Dolan Banyumas adalah platform komprehensif yang menghadirkan semua yang perlu Anda ketahui 
                        tentang destinasi wisata di Kabupaten Banyumas.
                      </p>
                      <p className="text-gray-300 text-base leading-relaxed">
                        Kami menyediakan informasi lengkap tentang objek wisata alam yang memukau, kuliner tradisional yang lezat, 
                        penginapan nyaman, oleh-oleh khas, desa wisata yang autentik, dan layanan biro perjalanan terpercaya.
                      </p>
                      <p className="text-gray-300 text-base leading-relaxed">
                        Dengan Dolan Banyumas, perjalanan Anda di Banyumas akan menjadi pengalaman yang berkesan, 
                        terorganisir, dan penuh dengan kejutan menyenangkan.
                      </p>
                    </div>
                  </div>
                  <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src="/hero/bunderan batur.jpg"
                      fill
                      alt="Bunderan Batur Banyumas"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                </div>

                {/* Why Choose Banyumas */}
                <div className="mb-16">
                  <div className="text-center mb-12">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      Mengapa Memilih <span className="text-blue-400">Banyumas</span>?
                    </h3>
                    <p className="text-gray-400 text-base max-w-2xl mx-auto">
                      Temukan keunikan dan keindahan yang membuat Banyumas menjadi destinasi wisata yang tak terlupakan
                    </p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                         <div className="bg-white/5 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-200 group">
                       <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                         <BiHeart className="text-white text-2xl" />
                       </div>
                       <h4 className="text-lg font-semibold text-white mb-3">Keindahan Alam</h4>
                       <p className="text-gray-300 text-sm leading-relaxed">
                         Dari pegunungan hijau Gunung Slamet, air terjun yang memukau, hingga hutan pinus yang sejuk. 
                         Banyumas memiliki panorama alam yang menakjubkan.
                       </p>
                     </div>
                     <div className="bg-white/5 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-200 group">
                       <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                         <BiRestaurant className="text-white text-2xl" />
                       </div>
                       <h4 className="text-lg font-semibold text-white mb-3">Kuliner Tradisional</h4>
                       <p className="text-gray-300 text-sm leading-relaxed">
                         Nikmati cita rasa autentik masakan Jawa dengan sentuhan lokal yang unik dan lezat. 
                         Dari soto sokaraja hingga nopia.
                       </p>
                     </div>
                     <div className="bg-white/5 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-200 group">
                       <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                         <BiStar className="text-white text-2xl" />
                       </div>
                       <h4 className="text-lg font-semibold text-white mb-3">Budaya Lokal</h4>
                       <p className="text-gray-300 text-sm leading-relaxed">
                         Rasakan keramahan masyarakat dan pelajari tradisi budaya yang masih terjaga dengan baik. 
                         Dari kesenian tradisional hingga adat istiadat yang unik.
                       </p>
                     </div>
                  </div>
                </div>

                {/* What We Offer */}
                <div className="mb-16">
                  <div className="text-center mb-12">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                      Apa yang Kami <span className="text-blue-400">Tawarkan</span>?
                    </h3>
                    <p className="text-gray-400 text-base max-w-2xl mx-auto">
                      Layanan lengkap untuk memenuhi semua kebutuhan wisata Anda di Banyumas
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                    <div className="bg-white/10 rounded-xl p-5 text-center hover:bg-white/15 transition-all duration-200">
                      <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BiCamera className="text-white text-xl" />
                      </div>
                      <h4 className="text-base font-semibold text-white mb-2">Objek Wisata</h4>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Destinasi alam, budaya, dan sejarah yang menarik
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-5 text-center hover:bg-white/15 transition-all duration-200">
                      <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BiRestaurant className="text-white text-xl" />
                      </div>
                      <h4 className="text-base font-semibold text-white mb-2">Kuliner</h4>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Restoran dan warung tradisional dengan cita rasa autentik
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-5 text-center hover:bg-white/15 transition-all duration-200">
                      <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BiHotel className="text-white text-xl" />
                      </div>
                      <h4 className="text-base font-semibold text-white mb-2">Penginapan</h4>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Hotel, homestay, dan villa dengan fasilitas lengkap
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-5 text-center hover:bg-white/15 transition-all duration-200">
                      <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <BiGift className="text-white text-xl" />
                      </div>
                      <h4 className="text-base font-semibold text-white mb-2">Oleh-oleh</h4>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        Souvenir dan makanan khas untuk dibawa pulang
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Services */}
                <div className="mb-16">
                  <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                    <div className="space-y-6">
                      <div className="text-center lg:text-left">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                          Layanan <span className="text-blue-400">Tambahan</span>
                        </h3>
                        <p className="text-gray-400 text-base">
                          Nikmati pengalaman wisata yang lebih lengkap dengan layanan khusus kami
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 group">
                          <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <BiMap className="text-white text-lg" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2">Desa Wisata</h4>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              Jelajahi desa-desa tradisional dengan budaya yang masih terjaga dan pengalaman hidup bersama masyarakat lokal.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 group">
                          <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <BiCar className="text-white text-lg" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2">Biro Perjalanan</h4>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              Layanan tour guide dan paket wisata yang terpercaya untuk memastikan perjalanan Anda aman dan nyaman.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4 group">
                          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <BiCalendar className="text-white text-lg" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2">Event & Acara</h4>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              Informasi lengkap tentang festival, acara budaya, dan kegiatan menarik yang berlangsung di Banyumas.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative h-40 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200">
                        <Image
                          src="/hero/caub.jpg"
                          fill
                          alt="Wisata Banyumas"
                          className="object-cover"
                        />
                      </div>
                      <div className="relative h-40 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200">
                        <Image
                          src="/hero/menara teratai.jpg"
                          fill
                          alt="Menara Teratai"
                          className="object-cover"
                        />
                      </div>
                      <div className="relative h-40 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200">
                        <Image
                          src="/objekwisata/hutanpinus.jpg"
                          fill
                          alt="Hutan Pinus"
                          className="object-cover"
                        />
                      </div>
                      <div className="relative h-40 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-200">
                        <Image
                          src="/hero/bunderan batur.jpg"
                          fill
                          alt="Bunderan Batur"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-10 shadow-xl max-w-4xl mx-auto">
                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
                      Siap Berpetualang di <span className="text-yellow-300">Banyumas</span>?
                    </h3>
                    <p className="text-blue-100 text-base md:text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
                      Mulai perjalanan Anda sekarang dan temukan keajaiban yang tersembunyi di setiap sudut Banyumas. 
                      Kami siap membantu Anda merencanakan petualangan yang tak terlupakan.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link
                        href="/dolan-banyumas"
                        className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-200 text-base shadow-lg"
                      >
                        Jelajahi Semua Wisata Di Banyumas
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
