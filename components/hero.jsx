import React, { useContext } from 'react'
import { EventContext } from '@/context/EventContext';
//  components
import Searchbar from "@/components/Searchbar/Searchbar";

const Hero = () => {
  const { handleClearSearch } = useContext(EventContext);
  return (
    
    <section className='h-screen xl:h-[800px] mb-16 relative'>
      <div className='container mx-auto h-full flex flex-col justify-center items-center pt-12 xl:pt-0'>
        <div className='w-full max-w-[684px] text-center mx-auto flex flex-col gap-2'>
          <div className='pretitle'>Jelajahi Keindahan</div>
          <h1 className="h1">
            TEMUKAN DESTINASI WISATA<br />BANYUMAS
          </h1>
          <p className='text-sm xl:text-lg font-light text-white/80 mb-4 xl:mb-12 max-w-[480px] xl:max-w-none mx-auto'>
            Nikmati pengalaman wisata yang tak terlupakan dengan berbagai destinasi menarik, kuliner lezat, dan budaya yang kaya di Banyumas.
          </p>
        </div>

        <div>
          <Searchbar />
          <div className='w-full mt-3 relative flex flex-col justify-center'>
            <p className='text-sm italic font-light text-white/70 text-center mb-3 xl:mb-0'>
              Pilih setidaknya satu kategori atau biarkan kosong untuk melihat semua destinasi.
            </p>
            {/* clear search */}
            <button className="text-blue-600 text-sm xl:absolute right-0" onClick={() => handleClearSearch()}>
              Hapus Pencarian
            </button>
          </div>
        </div>
      </div>
      {/* bg 1 */}
      <div className='absolute bg-primary top-0 left-0 w-[50vw] h-full bg-hero_bg1 bg-blend-color-dodge bg-no-repeat bg-cover -z-10 opacity-50'></div>
      {/* bg 2 */}
      <div className='absolute bg-primary top-0 right-0 w-[50vw] h-full bg-hero_bg2 bg-blend-lighten bg-no-repeat bg-cover -z-10 opacity-50'></div>
    </section>
  );    
};

export default Hero;
