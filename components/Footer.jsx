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
