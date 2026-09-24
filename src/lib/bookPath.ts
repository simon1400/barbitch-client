// Adresy rezervace: které tvary pouštíme dál a kam přesměrovat zbytek.
// Middleware (src/middleware.ts) tím chrání Google před mrtvými adresy
// z doby Noona — ty vracely 200 s hláškou „systém je nedostupný“ a Google Ads
// na ně posílal placené kliky (s207). Test: tests/bookPath.test.mjs.

// documentId ve Strapi 5 = přesně 24 malých písmen/číslic. Regex je
// záměrně citlivý na velikost písmen: ID z Noona obsahují velká písmena.
const ID = '[a-z0-9]{24}'

const ALLOWED_BOOK_PATHS: readonly RegExp[] = [
  new RegExp(`^/book/${ID}$`), // výběr specialistky
  new RegExp(`^/book/${ID}/(?:extras|any|${ID})$`), // doplňky / kalendář
  new RegExp(`^/book/reservation/${ID}$`), // dokončení rezervace (hold)
]

// Noona event_type id základní služby → náš documentId (salon_services.noona_base_id,
// staženo z produkce 24.09.2026). Staré odkazy tak vedou na tutéž službu, ne na
// obecný výběr. Mistrové z Noona se nemapují — výběr specialistky proběhne znovu.
export const LEGACY_NOONA_SERVICES: Readonly<Record<string, string>> = {
  KokGs5qtRUFocO6LbT8uUn8z: 'gjjkx0j7gzq8vrx4d3qt8vo8', // 1D (Classic)
  eT9fsXB3rL5mt43P4JUYGqGw: 'd4onu8jnqq3203mn0ximzes5', // 2D
  oUAlYuPFy5uTTiyWZbP9lL5i: 'dfw1asklew1ng5947mjpy5j9', // 3D
  xIOmYs9km5NimL47NnXFw1sj: 'tj8x37kibh079icpjsgevdiv', // 4D
  l5WrfhcchZPdianVneFtXtfY: 'u3yx846ja471j55qishse8by', // 5D
  sOz9CBAhAdhw9UdcomN0Ekue: 'rbv2t8q2wgg29hiqyuwah220', // 6D
  eWxq335P0DyX2qtuuDNfKImn: 'sjhuxknwgpte5k70ph8ykqhl', // 7D
  m2qnSiPCQMHCbbJyll0A58q8: 'izxus1xij7dg5ywaelsdxd81', // Barvení obočí + úprava tvaru
  '30TkOSh1rWTHrfem9ZTrDN7Y': 'u9702xxkd8zfrt2wrqaflda5', // Barvení řas
  TxwrPJQ3Iah7jG0eoRgGBVUG: 'j5f5hoa1imw9xlk457qwzlqx', // Doplnění řas
  vGLNXJZY5WLm7yripBsF58XZ: 'wpz9svnhaxx6m5fsyrk8lael', // Gel lak manikúra
  lHd41w645UKw74fAWxiovwLB: 'ir35yzrv5tegll495ycpfaox', // Hygienická manikúra
  LfXo7DUt6TizYsjCovlri5d3: 'vnvp0wo3ty73jg7oym49g5zl', // IBX Regenerace nehtů
  '4QZL5dlrb3OBPdhY8tWR47Ez': 'e454j1n9634rum6gwp4m2zlv', // Korekce do 5 dnů
  MEVfzjakaJGVo2TLDwyxMkTX: 'yweui1qlykefvleaxcnk04as', // Korekce do 5 dnů
  '7VyNrKG84dgxPEtHNs2nISMk': 'h5dc97zjdpq8lp7tnn6os9h7', // Laminace + úprava tvaru
  fwmNBQFznycJVSRxnXIaLTku: 'q2dh2qnf4u9jl85dec6i9ka1', // Lash lifting
  sEdHRkNHBl2Y6dYJpsBNK0bb: 'n3fmp5uoage0om83gp4xx7b8', // Prodloužení nehtů
  '3k6EJ7OCAvrQVkE4UaiKHvwZ': 'y5ql1yg4mbg0igrp6hwi6bxh', // Sundání nehtů
  Kadqalp4zBE3by4E6Me0B97j: 'qwd3vhlsw6kaxz6yyvlx7myz', // Sundání řas
  yRLMMskiPVEPUYGsjXdJuH1F: 'hae8vbr4wrmtzuy5p09z7j77', // Úprava tvaru, korekce voskem / pinzetou
}

/**
 * Kam přesměrovat adresu pod /book/. `null` = adresa je v pořádku, pustit dál.
 * - lomítko na konci → stejná adresa bez něj (jako to dělá Next sám);
 * - známé ID služby z Noona → /book/<documentId>/extras (vstup, který používá ceník);
 * - cokoli jiného → /book.
 */
export const resolveBookPath = (pathname: string): string | null => {
  if (!pathname.startsWith('/book/')) return null

  let path = pathname
  while (path.endsWith('/')) path = path.slice(0, -1)
  if (ALLOWED_BOOK_PATHS.some((re) => re.test(path))) {
    return path === pathname ? null : path
  }

  // hasOwn: „/book/constructor“ nesmí sáhnout do prototypu objektu
  const segment = path.split('/')[2] ?? ''
  if (Object.hasOwn(LEGACY_NOONA_SERVICES, segment)) {
    return `/book/${LEGACY_NOONA_SERVICES[segment]}/extras`
  }

  return '/book'
}
