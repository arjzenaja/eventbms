/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['fs', 'path'],
  images: {
    unoptimized: true
  },
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/_favicon',
        permanent: false
      }
    ];
  }
};

export default nextConfig;
