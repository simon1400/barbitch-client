import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  output: 'standalone',
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
        // Dřív mířil na /blog — pro Google soft-404. Míří na článek, který
        // tím slugem byl původně myšlen.
        source: '/blog/halloween-beauty-2025',
        destination: '/blog/halloween-beauty-brno-2025',
        permanent: true,
      },
      {
        // `/hiring` je prázdná kopie `/kariera` (0 slov, jen H1).
        // Drž v souladu s `REDIRECTED_ARTICLE_SLUGS` v `src/fetch/sitemap.ts`.
        source: '/hiring',
        destination: '/kariera',
        permanent: true,
      },
    ]
  },
  env: {
    APP_API: process.env.APP_API,
    APP_DOMAIN: process.env.APP_DOMAIN,
    PIXEL_ID: process.env.PIXEL_ID,
    PIXEL_ACCESS_TOKEN: process.env.PIXEL_ACCESS_TOKEN,
    // NOONA_* здесь больше нет: клиент к Noona не обращается вовсе
    // (booking-флоу и прайс работают через собственный движок /api/engine/*).
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
