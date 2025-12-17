/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.telegram.org' },
      { protocol: 'https', hostname: 'res.cloudinary.com' }
    ],
  },
  // Add this section 👇
};

module.exports = nextConfig;