import type { NextConfig } from 'next'

import { blogRedirectRules, finalBlogTarget } from './src/lib/blogRedirects'

/** Staré adresy bez /service/ apod. → současná stránka (301). */
const OLD_PATHS: [string, string][] = [
  ['/manikura', '/service/manikura'],
  ['/nehty', '/service/manikura'],
  ['/rasy', '/service/rasy'],
  ['/oboci', '/service/oboci'],
  ['/kontakty', '/kontakt'],
  ['/about', '/o-nas'],
]

/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      // Staré krátké adresy (Bing 23.11.2026: /manikura 404 s externím odkazem).
      // Výslovně 301: `permanent: true` dává 308.
      ...OLD_PATHS.map(([source, destination]) => ({
        source,
        destination,
        statusCode: 301 as const,
      })),
      {
        source: '/blog/co-je-laminace-oboci',
        destination: '/service/oboci',
        permanent: true,
      },
      {
        // Dřív mířil na /blog — pro Google soft-404. Míří na článek, který
        // tím slugem byl původně myšlen.
        source: '/blog/halloween-beauty-2025',
        // Halloween článek se od s291 sám přesměrovává — rovnou na konec řetězce.
        destination: finalBlogTarget('/blog/halloween-beauty-brno-2025'),
        permanent: true,
      },
      {
        // `/hiring` je prázdná kopie `/kariera` (0 slov, jen H1).
        // Drž v souladu s `REDIRECTED_ARTICLE_SLUGS` v `src/fetch/sitemap.ts`.
        source: '/hiring',
        destination: '/kariera',
        permanent: true,
      },
      {
        // Stará akční stránka bitchcard — Google ji pořád zkouší, vracela 404.
        source: '/bitchcard-2025',
        destination: '/cenik',
        statusCode: 301,
      },
      // Staré adresy článků blogu (s291) — seznam a zapínání v `src/lib/blogRedirects.ts`.
      ...blogRedirectRules(),
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
    // Kratší srcset (s305): výchozích 16 šířek (16–3840 px) dávalo u každé fotky
    // ~2,7 KB atributu — na hlavní stránce desítky KB HTML. Telefon 2× = 828,
    // dlaždice 272–340 px 2× = 640, desktop 1920, velké retina 2560.
    imageSizes: [96, 128, 256, 384],
    deviceSizes: [640, 828, 1080, 1200, 1920, 2560],
  },
}

export default nextConfig
