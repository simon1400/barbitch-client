/**
 * 301 starých adres článků blogu (s291, audit blogu 16.11.2026 — BLOG_AUDIT_2026-11-16.md).
 *
 * Čte ho `next.config.ts` (proto tu nejsou importy přes aliasy) a seznamy článků:
 * přesměrovaný článek nesmí být v /blog, „Souvisejících“, na hlavní, v sitemapě ani ve feedu.
 *
 * `enabled` zapínat až ve chvíli, kdy cíl existuje a starý článek může zmizet:
 *  • nový slug (lash lifting, modeláž, nejmodernější nehty) — majitelka nejdřív publikuje
 *    článek s novou adresou, pak `enabled: true` + nasadit, pak starý zruší (Unpublish);
 *  • slučované / mazané — `enabled: true` + nasadit, pak starý zruší.
 * Zapnutý redirect přebije i ještě publikovaný článek (Next přesměruje dřív, než stránku vykreslí).
 */
export interface BlogRedirect {
  /** Slug starého článku (`/blog/<from>`). */
  from: string
  /** Cílová cesta na webu. */
  to: string
  enabled: boolean
}

export const BLOG_REDIRECTS: BlogRedirect[] = [
  // Sloučit / smazat (audit §2): obsah se přenáší do cílového článku.
  {
    from: 'nasivani-ras-typy-efekty-a-pece-po-procedure',
    to: '/blog/jak-dlouho-vydrzi-prodlouzene-rasy-a-co-jejich-zivotnost-ovlivnuje',
    enabled: true,
  },
  {
    from: 'halloween-beauty-brno-2025',
    to: '/blog/podzimni-manikura-2025-tipy-na-peci-a-trendy-barvy',
    enabled: true,
  },
  { from: 'tipy-na-darky-k-narozeninam', to: '/darkovy-voucher', enabled: true },
  {
    from: 'beauty-priprava-na-jaro-v-brne-jak-sladit-oboci-rasy-a-manikuru-do-jednoho-fresh-looku',
    to: '/blog/jarni-manikura-2026-nejhezci-barvy-minimalisticke-designy-a-pece-po-zime',
    enabled: true,
  },
  {
    from: 'jarni-restart-oboci-jak-po-zime-ozivit-tvar-barvu-a-hustotu',
    to: '/blog/laminace-oboci-v-brne-co-to-je-jak-probiha-a-komu-se-hodi',
    enabled: true,
  },
  // Nová adresa — zapnout až po publikaci článku s novým slugem.
  {
    from: 'lash-lifting-2025-kompletni-pruvodce-krasnymi-rasami',
    to: '/blog/lash-lifting-brno',
    enabled: false,
  },
  {
    from: 'modelaz-nehtu-brno-top-salony-ceny-a-recenze',
    to: '/blog/modelaz-nehtu-brno',
    enabled: false,
  },
  {
    from: 'luxusni-manikura-v-brne-trendy-roku-2025',
    to: '/blog/nejmodernejsi-nehty',
    enabled: false,
  },
]

const ACTIVE = BLOG_REDIRECTS.filter((redirect) => redirect.enabled)

/** Slugy článků, které už web přesměrovává jinam. */
export const REDIRECTED_POST_SLUGS = new Set(ACTIVE.map((redirect) => redirect.from))

/**
 * Konečný cíl cesty: když cíl jednoho redirectu je sám přesměrovaný, jde se rovnou
 * na konec (Google řetězce 301 nemá rád). Na cyklus pojistka počtem kroků.
 */
export const finalBlogTarget = (path: string): string => {
  let current = path
  for (let step = 0; step < 10; step += 1) {
    const next = ACTIVE.find((redirect) => `/blog/${redirect.from}` === current)
    if (!next) return current
    current = next.to
  }
  return current
}

/** Záznamy pro `redirects()` v `next.config.ts`. */
export const blogRedirectRules = () =>
  ACTIVE.map((redirect) => ({
    source: `/blog/${redirect.from}`,
    destination: finalBlogTarget(redirect.to),
    permanent: true,
  }))
