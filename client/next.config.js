/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Next.js 16: Turbopack is now default bundler
  turbopack: {},
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
