/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['fs', 'path'],
  images: {
    unoptimized: true
  }
};

export default nextConfig;
