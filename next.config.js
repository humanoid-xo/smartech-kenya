/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors:  true },

  // Don't bundle prisma — use native node modules at runtime
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com'           },
      { protocol: 'https', hostname: 'images.unsplash.com'          },
      { protocol: 'https', hostname: 'via.placeholder.com'          },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com'    },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'www.urbanappliances.co.ke'    },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options',        value: 'DENY'                           },
        { key: 'X-Content-Type-Options',  value: 'nosniff'                        },
        { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin'},
      ],
    }];
  },
};

module.exports = nextConfig;
