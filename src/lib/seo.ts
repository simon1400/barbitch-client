export const SITE_URL = 'https://barbitch.cz'

/**
 * Výchozí Open Graph / Twitter obrázek pro stránky, které nemají vlastní.
 * Stejný sociální banner, který se používá v rezervaci a voucheru.
 */
export const DEFAULT_OG_IMAGE = {
  url: '/assets/bigBaner.jpg',
  width: 1200,
  height: 630,
  alt: 'Barbitch Beauty Studio Brno',
} as const

/**
 * Reálné agregované hodnocení z Google Business profilu.
 *
 * ⚠️ NEodvozovat z kolekce `google-reviews` — ta drží jen vybraný podmnožinový
 * vzorek recenzí (rating ≥ 4, s textem), ne všechny. Počítáním z ní by se počet
 * podhodnotil a průměr nadhodnotil. Tato konstanta odráží celý veřejný profil.
 * Aktualizovat ručně podle reálného Google profilu.
 */
export const GOOGLE_RATING = {
  ratingValue: 4.6,
  reviewCount: 113,
  bestRating: 5,
} as const
