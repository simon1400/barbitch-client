import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */

const withNextIntl = createNextIntlPlugin();

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
    SERVER_IP: process.env.SERVER_IP,
    GOOGLE_API: process.env.GOOGLE_API,
  },
  images: {
    remotePatterns: [
      { hostname: 'scontent-prg1-1.cdninstagram.com' },
      { hostname: 'scontent.cdninstagram.com' },
      { hostname: 'strapi.barbitch.cz' },
      { hostname: 'localhost' },
    ],
  },
}

export default withNextIntl(nextConfig)
