import React, { useContext } from 'react'
import { EventContext } from '@/context/EventContext';
//  components
import Searchbar from "@/components/Searchbar/Searchbar";
import Image from "next/image";

const Hero = () => {
  const { handleClearSearch } = useContext(EventContext);
  return (
    
    <section className='h-screen xl:h-[800px] mb-16 relative'>
      {/* Single Background Image */}
      <div className='absolute inset-0 -z-10'>
        <Image
          src="/hero/caub.jpg"
          fill
          alt="Hero Background Banyumas"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className='container mx-auto h-full flex flex-col justify-center items-center pt-12 xl:pt-0'>
        <div className='w-full max-w-[684px] text-center mx-auto flex flex-col gap-2'>
          <div className='pretitle'>Jelajahi Keindahan</div>
          <h1 className="h1">
            JELAJAHI WISATA<br />BANYUMAS
          </h1>
          <p className='text-sm xl:text-lg font-light text-white/90 dark:text-white/80 mb-4 xl:mb-12 max-w-[480px] xl:max-w-none mx-auto'>
            Nikmati pengalaman wisata yang tak terlupakan dengan berbagai destinasi menarik, kuliner lezat, dan budaya yang kaya di Banyumas.
          </p>
        </div>

        <div>
          <Searchbar />
          <div className='w-full mt-3 relative flex justify-center'>
            {/* clear search button */}
            <button 
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md border border-white/30 dark:border-white/20 rounded-full text-white text-xs font-medium transition-all duration-200 hover:scale-105 shadow-md" 
              onClick={() => handleClearSearch()}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Hapus
            </button>
          </div>
        </div>
      </div>
    </section>
  );    
};

export default Hero;
