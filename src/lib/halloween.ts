// Sezónní Halloween hero na hlavní stránce (varianta 1B „Exponát — dark lab“).
// ──────────────────────────────────────────────────────────────────────────
// VYPNUTÍ: stačí změnit `enabled` na `false` a nasadit. Hlavní stránka pak
// vykreslí obvyklý `Top` s růžovým pozadím a hlavička se vrátí do světlé
// podoby. Po datu `to` (včetně) se kampaň vypne sama — stránky se obnovují
// jednou za hodinu (ISR), takže nejpozději do hodiny po půlnoci.
// ──────────────────────────────────────────────────────────────────────────

import { formatInTimeZone } from 'date-fns-tz'

export const HALLOWEEN = {
  // Hlavní vypínač (hero na `/`, tmavá hlavička a páska v menu).
  enabled: true,

  // Období kampaně (YYYY-MM-DD, pražský čas, obě data včetně). Z nich se
  // skládá i text štítku „24.10 – 31.10“.
  from: '2026-10-24',
  to: '2026-10-31',

  // Nadpis, pokud by ve Strapi (homepage.title) nic nebylo. Poslední slovo
  // „bliká“ bíle jako neon.
  title: 'Become an icon',

  // Štítek nad nadpisem: „Exponát 001 · Halloween 24.10 – 31.10“
  // (na mobilu bez slova „Halloween“).
  badge: 'Exponát 001',

  // Dva řádky pod nadpisem, druhý je růžový. `{day}` → „dnes“ / „zítra“ /
  // „31.10“ podle data (viz `halloweenDayWord`).
  subtitle: 'Neotvírat. Nereanimovat.',
  subtitleAccent: 'Halloween {day}. Ještě je kam se vejít.',

  // Vedlejší (obrysové) tlačítko vedle „Rezervovat termín“ — vede rovnou na
  // výběr služby; den Halloweenu je v kalendáři rezervace označen 🎃.
  secondary: {
    label: 'Volné termíny {day}',
    labelMobile: 'Termíny {day}',
    href: '/book',
  },

  // Visačka vpravo nahoře (HTML, ne obrázek) — celá je odkaz na rezervaci.
  // `{day}` → dnes / zítra / 31.10.
  tag: {
    big: 'Halloween',
    line: 'Volné termíny {day}',
    small: 'Klikni a rezervuj →',
  },

  // Vpravo pod visačkou (jen desktop), součást téhož odkazu.
  status: 'volno {day}',
  statusNote: 'Halloween design k manikúře',

  // Fráze v běžící liště dole (vede na rezervaci).
  marquee: [
    'Halloween {day} — poslední volné termíny →',
    'Halloween design k manikúře',
    'Neotvírat. Nereanimovat.',
    'Podezřele růžový',
  ],
} as const

const pragueDay = (date: Date) => formatInTimeZone(date, 'Europe/Prague', 'yyyy-MM-dd')

// Volat jen na serveru (stránka/hlavička) a výsledek předat klientským
// komponentám propem — jinak by se server a prohlížeč kolem půlnoci mohly
// rozejít a hydratace by nesedla.
export const isHalloweenOn = (now: Date = new Date()): boolean => {
  if (!HALLOWEEN.enabled) return false
  const day = pragueDay(now)
  return day >= HALLOWEEN.from && day <= HALLOWEEN.to
}

// Jak se v textech říká dni Halloweenu (`to`): „dnes“ v den D, „zítra“ den
// před ním, jinak „31.10“. Počítat jen na serveru (stránka se obnovuje
// jednou za hodinu), výsledek dosadit do textů přes `halloweenText`.
export const halloweenDayWord = (now: Date = new Date()): string => {
  const day = pragueDay(now)
  if (day === HALLOWEEN.to) return 'dnes'
  const next = new Date(now)
  next.setUTCDate(next.getUTCDate() + 1)
  if (pragueDay(next) === HALLOWEEN.to) return 'zítra'
  const [, m, d] = HALLOWEEN.to.split('-')
  return `${Number(d)}.${Number(m)}`
}

// Dosadí `{day}` do textu z konfigurace.
export const halloweenText = (text: string, dayWord: string): string =>
  text.replace(/\{day\}/g, dayWord)

// Je dané datum (lokální den prohlížeče) dnem Halloweenu? Pro odznak 🎃 v
// kalendáři rezervace — porovnává se jen datum, ne „teď“, takže bez rizika
// rozdílu server/prohlížeč.
export const isHalloweenDay = (date: Date): boolean => {
  if (!HALLOWEEN.enabled) return false
  const ymd = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  return ymd === HALLOWEEN.to
}

// „24.10 – 31.10“
export const halloweenDates = (): string => {
  const short = (ymd: string) => {
    const [, m, d] = ymd.split('-')
    return `${Number(d)}.${Number(m)}`
  }
  return `${short(HALLOWEEN.from)} – ${short(HALLOWEEN.to)}`
}
