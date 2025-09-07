import Image from "next/image";
import Link from "next/link";
import { BiDownload, BiStar, BiHeart, BiCamera, BiMap } from "react-icons/bi";

const DownloadApp = () => {
  return (
    <section className="w-full bg-[#E0F2FE] mb-16 rounded-2xl bg-pattern bg-cover py-16 px-8 xl:py-20 xl:px-20 bg-blend-multiply flex items-center justify-center relative overflow-hidden min-h-[600px]">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-500 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-500 rounded-full blur-xl animate-pulse"></div>
      </div>
      
      <div className="flex flex-col xl:flex-row items-center gap-16 relative z-10 w-full max-w-7xl mx-auto">
        {/* text */}
        <div className="flex-1 text-center xl:text-left">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-2xl mb-6 shadow-lg">
            <BiDownload className="text-xl" />
            <span className="font-bold">Download Aplikasi</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
            <span className="text-white drop-shadow-2xl">
              Mayuh Dolan Maring Banyumas!
            </span>
          </h2>
          
          <div className="space-y-6 max-w-[500px] mx-auto xl:mx-0">
            <p className="text-gray-800 text-lg leading-relaxed font-semibold drop-shadow-sm">
              Dolan Banyumas adalah aplikasi yang memudahkan para traveler dalam menemukan guide untuk menikmati indahnya Banyumas dengan fasilitas lengkap dari objek wisata, desa wisata, penginapan, kuliner, dan oleh-oleh.
            </p>
            <p className="text-gray-800 text-lg leading-relaxed font-semibold drop-shadow-sm">
              Anda tidak perlu lagi pusing bila berkunjung ke Banyumas, cukup dengan Dolan Banyumas segala yang anda butuhkan selama di Banyumas akan terpenuhi, ayo plesir Banyumas!
            </p>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-[500px] mx-auto xl:mx-0">
            <div className="flex items-center gap-2 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
              <BiCamera className="text-blue-600 text-lg" />
              <span className="text-gray-700 text-sm font-semibold">Wisata</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
              <BiMap className="text-green-600 text-lg" />
              <span className="text-gray-700 text-sm font-semibold">Desa Wisata</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
              <BiHeart className="text-red-600 text-lg" />
              <span className="text-gray-700 text-sm font-semibold">Kuliner</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
              <BiStar className="text-purple-600 text-lg" />
              <span className="text-gray-700 text-sm font-semibold">Oleh-oleh</span>
            </div>
          </div>
        </div>
        
        {/* button */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">
          <div className="text-center mb-4">
            <p className="text-gray-800 text-lg font-bold mb-2 drop-shadow-sm">Download Sekarang</p>
            <p className="text-gray-700 text-sm font-medium drop-shadow-sm">Tersedia di platform favorit Anda</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center">
            <Link href="/" className="group relative flex w-[200px] h-[70px] hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-white rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300"></div>
              <Image src="/download/app-store.svg" fill className="object-contain p-2" alt="Download on App Store" />
            </Link>
            <Link href="/" className="group relative flex w-[200px] h-[70px] hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-white rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300"></div>
              <Image src="/download/google-play.svg" fill className="object-contain p-2" alt="Get it on Google Play" />
            </Link>
          </div>
          
          {/* Additional info */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-700 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Offline Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Update Terbaru</span>
            </div>
          </div>
        </div>
      </div> 
    </section>
  );
};

export default DownloadApp;
