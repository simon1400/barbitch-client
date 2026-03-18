import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/oboci',
        destination: '/service/oboci',
        permanent: true,
      },
      {
        source: '/blog/co-je-laminace-oboci',
        destination: '/service/oboci',
        permanent: true,
      },
      {
        source: '/blog/halloween-beauty-2025',
        destination: '/blog',
        permanent: true,
      },
    ]
  },
  env: {
    IG_ACCESS_TOKEN: process.env.IG_ACCESS_TOKEN,
    APP_API: process.env.APP_API,
    APP_DOMAIN: process.env.APP_DOMAIN,
    GOOGLE_API: process.env.GOOGLE_API,
    PIXEL_ID: process.env.PIXEL_ID,
    PIXEL_ACCESS_TOKEN: process.env.PIXEL_ACCESS_TOKEN,
    NOONA_COMPANY_ID: process.env.NOONA_COMPANY_ID,
    NOONA_TOKEN: process.env.NOONA_TOKEN,
  },
  compress: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
  reactStrictMode: true,
  modularizeImports: {
    'date-fns': {
      transform: 'date-fns/{{member}}',
    },
  },
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  images: {
    loader: 'custom',
    dangerouslyAllowSVG: true,
  },
}

export default nextConfig
