/**
 * Výchozí texty nové hlavní stránky (s286) a doplňování cen do FAQ.
 *
 * Všechno, co jde editovat ve Strapi (homepage.seoTitle, lead, whyItems, faq…),
 * má tady náhradu: stránka musí vypadat hotově i se Strapi, který nová pole ještě
 * nezná, a s prázdným konceptem před „Publish“.
 */
import type { IFaqItem, IServicePrices, IWhyItem } from 'fetch/home'

export const DEFAULT_SEO_TITLE = 'Manikúra, řasy a obočí v centru Brna'
export const DEFAULT_SLOGAN = 'Become an icon'
export const DEFAULT_LEAD =
  'Beauty salon Barbitch na Křenové 294/16. Otevřeno každý den 10:00–19:00, termín si vybereš online.'
export const DEFAULT_SERVICES_TITLE = 'Co u nás uděláme'
export const DEFAULT_ABOUT_TITLE = 'Beauty salon v centru Brna'
export const DEFAULT_OPEN_HOURS_SHORT = 'Každý den 10:00–19:00'
// Nezlomitelná mezera přes kód znaku — doslovnou NBSP lint odmítá a escape „opraví“ na ni.
const NBSP = String.fromCharCode(0xa0)

export const DEFAULT_ADDRESS = `Křenová 294/16, 602${NBSP}00 Brno`
export const DEFAULT_PHONE = '+420 776 527 194'
export const REVIEW_URL = 'https://g.page/r/CWD-fYwFfro0EBM/review'

export const DEFAULT_WHY_ITEMS: IWhyItem[] = [
  { title: 'Korekce do 5 dnů zdarma', text: 'Když něco nesedí, opravíme to' },
  {
    title: 'Bitchcard',
    text: 'Věrnostní program pro stálé klientky',
    linkLabel: 'Zjistit více',
    linkUrl: '/bitchcard',
  },
  {
    title: 'Otevřeno každý den',
    text: 'Včetně víkendů 10:00–19:00',
    linkLabel: 'Kde nás najdeš',
    linkUrl: '/kontakt',
  },
  {
    title: 'Rezervace online',
    text: 'Službu, mistryni i čas si vybereš sama',
    linkLabel: 'Rezervovat termín',
    linkUrl: '/book',
  },
]

/**
 * Značky v odpovědích FAQ:
 * - `{cena:manikura|oboci|rasy}` — nejnižší cena služby webu („od“ v sekci s rukou);
 * - `{cena:<název služby v katalogu>}` — základní cena té položky („Gel lak manikúra“);
 * - `{cesta}` — `contact.howToGetThere` (MHD, parkování); prázdné = zmizí.
 * Cena se tak mění sama s katalogem, odpověď se nepřepisuje.
 */
export const DEFAULT_FAQ: IFaqItem[] = [
  {
    title: 'Kde salon Barbitch najdu?',
    content: '<p>Na adrese Křenová 294/16, 602 00 Brno. {cesta}</p>',
  },
  {
    title: 'Jak se objednám?',
    content: '<p>Online: vybereš službu, mistryni a čas. Nebo zavolej na +420 776 527 194.</p>',
  },
  {
    title: 'Kolik stojí gel lak manikúra?',
    content:
      '<p>Gel lak manikúra stojí {cena:Gel lak manikúra}, hygienická manikúra {cena:Hygienická manikúra}. Všechny ceny jsou v ceníku.</p>',
  },
  {
    title: 'Jak dlouho trvá manikúra?',
    content: '<p>Přibližně 60–90 minut podle typu služby a designu.</p>',
  },
  { title: 'Kdy máte otevřeno?', content: '<p>Každý den včetně víkendu, 10:00–19:00.</p>' },
  { title: 'Můžu platit kartou?', content: '<p>Ano, kartou i hotově.</p>' },
]

/** Tři služby webu v sekci s rukou: nadpis, výchozí popis, odkaz s klíčovou kotvou. */
export const HOME_SERVICES: Record<
  'manikura' | 'oboci' | 'rasy',
  { heading: string; text: string; anchor: string; pricePrefix: string }
> = {
  manikura: {
    heading: 'Manikúra',
    text: 'Hygienická manikúra, gel lak, prodloužení nehtů a IBX regenerace.',
    anchor: 'Manikúra a gelové nehty',
    pricePrefix: 'od',
  },
  oboci: {
    heading: 'Obočí',
    text: 'Laminace, barvení a úprava tvaru voskem nebo pinzetou.',
    anchor: 'Laminace a úprava obočí',
    pricePrefix: 'od',
  },
  rasy: {
    heading: 'Řasy',
    text: 'Prodlužování řas od klasiky 1D po objem, doplnění, lash lifting a barvení.',
    anchor: 'Prodlužování řas a lash lifting',
    pricePrefix: 'prodloužení od',
  },
}

// cs-CZ dělí tisíce nezlomitelnou mezerou — „1 090 Kč“ se nerozdělí na dva řádky
export const formatKc = (n: number) => `${n.toLocaleString('cs-CZ')}${NBSP}Kč`

const normalizeKey = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

/**
 * Doplní značky cen a cesty do HTML odpovědi. Neznámá cena → „podle ceníku“
 * (věta zůstane gramaticky použitelná a nic neslibuje).
 */
export const fillFaqAnswer = (
  html: string,
  ctx: {
    prices: IServicePrices
    catalog: { title: string; price: number }[]
    howToGetThere?: string | null
  },
) => {
  const byTitle = new Map(ctx.catalog.map((s) => [normalizeKey(s.title), s.price]))
  const cesta = (ctx.howToGetThere || '').trim()
  return html
    .replaceAll(/\{cena:([^}]+)\}/g, (_, raw: string) => {
      const key = raw.trim()
      const min = (ctx.prices as unknown as Record<string, number | null>)[key]
      const price = typeof min === 'number' ? min : byTitle.get(normalizeKey(key))
      if (typeof price !== 'number' || price <= 0) return 'podle ceníku'
      return typeof min === 'number' ? `od ${formatKc(price)}` : formatKc(price)
    })
    .replaceAll('{cesta}', cesta)
    .replaceAll(' </p>', '</p>')
}

/** Mezery do jedné (bez regexu s kvantifikátorem — sonarjs/slow-regex). */
const collapseSpaces = (text: string) => text.split(/\s/).filter(Boolean).join(' ')

/** Text bez HTML — pro JSON-LD `FAQPage`. */
export const stripHtml = (html: string) => {
  let out = ''
  let inTag = false
  for (const ch of html) {
    if (ch === '<') {
      inTag = true
      out += ' '
    } else if (ch === '>') {
      inTag = false
    } else if (!inTag) {
      out += ch
    }
  }
  return collapseSpaces(out.replaceAll('&nbsp;', ' ').replaceAll('&amp;', '&'))
}

/** Zkrácení recenze po slovech (rozhodnutí majitele: ~180 znaků). */
const REVIEW_MAX_CHARS = 180
const TRAILING = new Set([' ', ',', '.', ';', ':', '–', '-'])
export const truncateWords = (text: string, max = REVIEW_MAX_CHARS) => {
  const clean = collapseSpaces(text)
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max + 1)
  const lastSpace = cut.lastIndexOf(' ')
  let short = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : clean.slice(0, max)
  while (short && TRAILING.has(short.at(-1) as string)) short = short.slice(0, -1)
  return `${short}…`
}

/** Velikost citace podle délky (zadání §5, sekce 7). */
export const quoteSizeClass = (text: string) => {
  const n = text.length
  if (n <= 26) return 'text-[clamp(40px,6vw,84px)] tracking-[-2px]'
  if (n <= 60) return 'text-[clamp(32px,4.4vw,60px)] tracking-[-1.5px]'
  return 'text-[clamp(26px,3vw,40px)] tracking-[-0.5px]'
}
