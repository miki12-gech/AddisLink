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
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // This directs the request to your Render Backend
        // Make sure to set NEXT_PUBLIC_API_URL in Vercel settings!
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ]
  },
};

module.exports = nextConfig;