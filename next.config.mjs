/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // For Cloudflare Pages with @cloudflare/next-on-pages
  // Don't use output: 'export' - it breaks dynamic features
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  
  // Performance optimizations for high traffic
  experimental: {
    // Optimize package imports for faster builds
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    // Server actions optimization
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Compression for faster delivery
  compress: true,
  
  // Power by header
  poweredByHeader: false,
  
  // Trailing slashes for SEO
  trailingSlash: true,
  
  // Cache headers for static assets
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|gif|ico|css|js)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig
