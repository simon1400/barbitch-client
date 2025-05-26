/* eslint-disable ts/no-require-imports */
import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  env: {
    IG_ACCESS_TOKEN: process.env.IG_ACCESS_TOKEN,
    APP_API: process.env.APP_API,
    APP_DOMAIN: process.env.APP_DOMAIN,
    GOOGLE_API: process.env.GOOGLE_API,
    PIXEL_ID: process.env.PIXEL_ID,
    PIXEL_ACCESS_TOKEN: process.env.PIXEL_ACCESS_TOKEN,
    FEATURABLE_WIDGET_ID: process.env.FEATURABLE_WIDGET_ID,
    NOONA_COMPANY_ID: process.env.NOONA_COMPANY_ID,
    NOONA_TOKEN: process.env.NOONA_TOKEN,
  },
  compress: true,
  experimental: {
    optimizeCss: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  modularizeImports: {
    'date-fns': {
      transform: 'date-fns/{{member}}',
    },
  },
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'res.cloudinary.com' },
      { hostname: 'scontent.cdninstagram.com' },
      { hostname: 'strapi.barbitch.cz' },
      { hostname: 'localhost' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}

export default withBundleAnalyzer(nextConfig)
