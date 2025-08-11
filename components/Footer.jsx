import Image from 'next/image';
import Link from 'next/link';

const socials = [
  {
    src: "/footer/facebook.svg",
    path: "",
  },
  {
    src: "/footer/instagram.svg",
    path: "",
  },
  {
    src: "/footer/x.svg",
    path: "",
  },
  {
    src: "/footer/youtube.svg",
    path: "",
  },
  // {
  //   src: "/footer/linkedin.svg",
  //   path: "",
  // },
];

const Footer = () => {
  return (
          <footer className='bg-blue-600 bg-pattern bg-cover bg-blend-multiply pt-16'>
      <div className='container mx-auto border-b border-white/40'>
        {/* text & form socials */}
        <div className='flex flex-col max-w-[550px] mx-auto text-center'>
          {/* text */}
          <div className='mb-9'>
            <h2 className='h2 mb-3'>Your Event Connection</h2>
            <p>Join our list for exclusive event updates and insider tips.</p>
          </div>
          {/* form */}
          <form className='relative flex items-center mb-16'>
            <input 
              type="text"
              placeholder='Your Email Address'
              className='pl-8 w-full h-[60px] rounded-full outline-none placeholder:text-primary/80 text-primary text-sm'
            />
            <button className='bg-secondary hover:bg-secondary-hover transition-all w-[114px] h-[52px] rounded-full text-sm uppercase absolute right-1'>
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
                  className='relative w-[20px] h-[20px]'
                >
                  <Image src={icon.src} fill alt=""/>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      {/* copyright */}
      <div className='py-8'>
        <div className='container mx-auto'>
          <div className='flex flex-col md:flex-row gap-6 items-center justify-between'>
           {/* logo */}
            <Link href="/" className='relative flex w-[78px] h-[30px]'>
              {/* <Image src="/logo.svg" alt=""/> */}
              logo
            </Link>
            <p className='text-sm'>Copyright &copy; 2025. All rights reserved.</p>
            {/* socials */}
            <div>
              {socials.map((social, index) => {
                return <Link href={social.path} key={index}></Link>
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
