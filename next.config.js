/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  reactStrictMode: true,
  // swcMinify removed — deprecated in Next.js 14, it's the default now
  poweredByHeader: false,
  compress: true,
  // experimental.optimizeCss removed — requires critters at runtime,
  // which is a devDependency and crashes Vercel builds
};

module.exports = nextConfig;