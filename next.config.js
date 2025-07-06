/** @type {import('next').NextConfig} */
const nextConfig = {
  "standalone": true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
