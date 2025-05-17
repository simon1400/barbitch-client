import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.('.svg'))

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
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
  images: {
    remotePatterns: [
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'res.cloudinary.com' },
      { hostname: 'scontent.cdninstagram.com' },
      { hostname: 'strapi.barbitch.cz' },
      { hostname: 'localhost' },
    ],
  },
}

export default nextConfig
