import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const socials = [
  {
    src: "/footer/facebook.svg",
    path: "https://facebook.com",
    name: "Facebook"
  },
  {
    src: "/footer/instagram.svg",
    path: "https://instagram.com",
    name: "Instagram"
  },
  {
    src: "/footer/x.svg",
    path: "https://x.com",
    name: "X (Twitter)"
  },
  {
    src: "/footer/youtube.svg",
    path: "https://youtube.com",
    name: "YouTube"
  },
];

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle email subscription logic here
    console.log('Email submitted:', email);
    setEmail(''); // Clear the input after submission
  };

  return (
    <footer className='bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden pt-16'>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern bg-cover bg-center opacity-10"></div>
      
      <div className='relative z-10 container mx-auto border-b border-white/20'>
        {/* text & form socials */}
        <div className='flex flex-col max-w-[550px] mx-auto text-center'>
          {/* text */}
          <div className='mb-9'>
            <h2 className='text-3xl xl:text-[44px] leading-[120%] font-semibold text-white mb-3'>
              DOLAN Banyumas
            </h2>
            <p className='text-blue-100 text-lg'>Platform wisata terdepan untuk menjelajahi keindahan Banyumas</p>
          </div>
          
          {/* form */}
          <form className='relative flex items-center mb-16' onSubmit={handleSubmit}>
            <input 
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder='Masukkan email Anda untuk update wisata'
              className='pl-8 w-full h-[60px] rounded-full outline-none placeholder:text-blue-300 text-gray-900 text-sm border-0 shadow-lg'
            />
            <button 
              type="submit" 
              className='bg-white hover:bg-blue-50 transition-all w-[114px] h-[52px] rounded-full text-sm font-semibold text-blue-600 absolute right-1 shadow-lg'
            >
              Join
            </button>
          </form>
          
          {/* socials */}
          <div className='mb-[72px] flex gap-8 mx-auto'>
            {socials.map((icon, index) => {
              return (
                <Link
                  href={icon.path}
                  key={index}
                  className='relative w-[24px] h-[24px] hover:scale-110 transition-transform duration-200'
                  title={icon.name}
                >
                  <Image 
                    src={icon.src} 
                    fill 
                    alt={`${icon.name} social icon`}
                    className="filter brightness-0 invert"
                  />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* KATEGORI Section */}
      <div className='py-16 relative z-10 border-b border-white/20'>
        <div className='container mx-auto px-4'>
          <div className='text-center'>
            <h2 className='text-3xl md:text-4xl font-bold text-yellow-400 mb-12 tracking-wide'>
              KATEGORI
            </h2>
            
            <div className='flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16'>
              <Link href="/destinations?category=travel-agency" className='group flex items-center gap-3 text-white hover:text-yellow-400 transition-colors duration-300'>
                <svg className='w-5 h-5 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z' />
                </svg>
                <span className='text-lg font-medium'>Biro Perjalanan</span>
              </Link>
              
              <Link href="/destinations?category=tourism-village" className='group flex items-center gap-3 text-white hover:text-yellow-400 transition-colors duration-300'>
                <svg className='w-5 h-5 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                </svg>
                <span className='text-lg font-medium'>Desa Wisata</span>
              </Link>
              
              <Link href="/destinations?category=culinary" className='group flex items-center gap-3 text-white hover:text-yellow-400 transition-colors duration-300'>
                <svg className='w-5 h-5 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
                </svg>
                <span className='text-lg font-medium'>Kuliner</span>
              </Link>
              
              <Link href="/destinations?category=tourist-attraction" className='group flex items-center gap-3 text-white hover:text-yellow-400 transition-colors duration-300'>
                <svg className='w-5 h-5 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z' clipRule='evenodd' />
                </svg>
                <span className='text-lg font-medium'>Objek Wisata</span>
              </Link>
              
              <Link href="/destinations?category=souvenirs" className='group flex items-center gap-3 text-white hover:text-yellow-400 transition-colors duration-300'>
                <svg className='w-5 h-5 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                </svg>
                <span className='text-lg font-medium'>Oleh-oleh</span>
              </Link>
              
              <Link href="/destinations?category=accommodation" className='group flex items-center gap-3 text-white hover:text-yellow-400 transition-colors duration-300'>
                <svg className='w-5 h-5 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z' />
                </svg>
                <span className='text-lg font-medium'>Penginapan</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* KONTAK & COUNTER PENGUNJUNG Section */}
      <div className='py-16 relative z-10 border-b border-white/20'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
            
            {/* KONTAK Section */}
            <div className='text-white'>
              <div className='mb-8'>
                <h3 className='text-2xl font-bold text-yellow-400 mb-2 tracking-wide'>KONTAK</h3>
                <div className='w-16 h-1 bg-yellow-400 rounded-full'></div>
              </div>
              
              <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10'>
                <h4 className='text-white text-lg font-semibold mb-6 leading-relaxed'>
                  Dinas Pemuda, Olahraga, Kebudayaan Dan Pariwisata Kabupaten Banyumas
                </h4>
                
                <div className='space-y-6'>
                  <div className='flex items-start gap-4 group'>
                    <div className='w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center group-hover:bg-yellow-400/30 transition-colors duration-300'>
                      <svg className='w-6 h-6 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <p className='text-blue-100 text-sm leading-relaxed'>
                        Jl. Prof. Dr. Suharso No.45, Mangunjaya, Purwokerto Lor, Kec. Purwokerto Tim., Kabupaten Banyumas, Jawa Tengah 53114
                      </p>
                    </div>
                  </div>
                  
                  <div className='flex items-center gap-4 group'>
                    <div className='w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center group-hover:bg-yellow-400/30 transition-colors duration-300'>
                      <svg className='w-6 h-6 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <p className='text-white font-medium text-base'>(0281) 637629</p>
                    </div>
                  </div>
                  
                  <div className='flex items-center gap-4 group'>
                    <div className='w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center group-hover:bg-yellow-400/30 transition-colors duration-300'>
                      <svg className='w-6 h-6 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                        <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <p className='text-white font-medium text-base'>dinporabudpar@banyumaskab.go.id</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Social Media Icons */}
              <div className='mt-8'>
                <h5 className='text-white font-semibold mb-4 text-sm uppercase tracking-wider'>Ikuti Kami</h5>
                <div className='flex gap-4'>
                  <Link href="https://youtube.com" className='w-12 h-12 bg-white/10 hover:bg-red-600 rounded-xl flex items-center justify-center transition-all duration-300 group'>
                    <svg className='w-6 h-6 text-white group-hover:scale-110 transition-transform' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'/>
                    </svg>
                  </Link>
                  <Link href="https://instagram.com" className='w-12 h-12 bg-white/10 hover:bg-pink-600 rounded-xl flex items-center justify-center transition-all duration-300 group'>
                    <svg className='w-6 h-6 text-white group-hover:scale-110 transition-transform' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.281c-.49 0-.875-.385-.875-.875s.385-.875.875-.875.875.385.875.875-.385.875-.875.875zm-7.83 1.75c-1.297 0-2.448.49-3.323 1.297-.807.875-1.297 2.026-1.297 3.323s.49 2.448 1.297 3.323c.875.807 2.026 1.297 3.323 1.297s2.448-.49 3.323-1.297c.807-.875 1.297-2.026 1.297-3.323s-.49-2.448-1.297-3.323c-.875-.807-2.026-1.297-3.323-1.297z'/>
                    </svg>
                  </Link>
                  <Link href="https://facebook.com" className='w-12 h-12 bg-white/10 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 group'>
                    <svg className='w-6 h-6 text-white group-hover:scale-110 transition-transform' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
                    </svg>
                  </Link>
                  <Link href="https://x.com" className='w-12 h-12 bg-white/10 hover:bg-gray-800 rounded-xl flex items-center justify-center transition-all duration-300 group'>
                    <svg className='w-6 h-6 text-white group-hover:scale-110 transition-transform' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* COUNTER PENGUNJUNG Section */}
            <div className='text-white'>
              <div className='mb-8'>
                <h3 className='text-2xl font-bold text-yellow-400 mb-2 tracking-wide'>COUNTER PENGUNJUNG</h3>
                <div className='w-16 h-1 bg-yellow-400 rounded-full'></div>
              </div>
              
              <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10'>
                <div className='space-y-6'>
                  <div className='flex justify-between items-center py-3 border-b border-white/10'>
                    <span className='text-blue-100 font-medium'>Pengunjung Hari Ini</span>
                    <span className='text-white font-bold text-xl bg-yellow-400/20 px-4 py-2 rounded-lg'>135</span>
                  </div>
                  
                  <div className='flex justify-between items-center py-3 border-b border-white/10'>
                    <span className='text-blue-100 font-medium'>Pengunjung Bulan Ini</span>
                    <span className='text-white font-bold text-xl bg-yellow-400/20 px-4 py-2 rounded-lg'>2,379</span>
                  </div>
                  
                  <div className='flex justify-between items-center py-3 border-b border-white/10'>
                    <span className='text-blue-100 font-medium'>Pengunjung Tahun Ini</span>
                    <span className='text-white font-bold text-xl bg-yellow-400/20 px-4 py-2 rounded-lg'>66,854</span>
                  </div>
                  
                  <div className='flex justify-between items-center py-3 border-b border-white/10'>
                    <span className='text-blue-100 font-medium'>Total Pengunjung</span>
                    <span className='text-white font-bold text-xl bg-yellow-400/20 px-4 py-2 rounded-lg'>217,825</span>
                  </div>
                  
                  <div className='flex justify-between items-center py-3'>
                    <span className='text-blue-100 font-medium'>Pengunjung Online</span>
                    <span className='text-white font-bold text-xl bg-green-500/20 px-4 py-2 rounded-lg text-green-400'>10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* copyright */}
      <div className='py-8 relative z-10'>
        <div className='container mx-auto'>
          <div className='flex flex-col md:flex-row gap-6 items-center justify-end'>
            {/* logo */}
            <Link href="/" className='flex items-center gap-2'>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">DB</span>
              </div>
                              <span className="text-white font-semibold text-lg">Dolan Banyumas</span>
            </Link>
            
            <p className='text-sm text-blue-100 text-center flex-1'>
              Copyright &copy; 2025 Dolan Banyumas. All rights reserved.
            </p>
            
            {/* socials */}
            <div className="flex gap-4">
              {socials.map((social, index) => {
                return (
                  <Link 
                    href={social.path} 
                    key={index}
                    className="text-blue-200 hover:text-white transition-colors"
                    title={social.name}
                  >
                    {social.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
