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

  // Dva řádky pod nadpisem, druhý je růžový.
  subtitle: 'Neotvírat. Nereanimovat.',
  subtitleAccent: 'Objednávání pokračuje.',

  // Vedlejší (obrysové) tlačítko vedle „Rezervovat termín“.
  secondary: {
    label: 'Halloween nehty',
    labelMobile: 'Ceník',
    href: '/cenik',
  },

  // Vpravo pod visačkou (jen desktop): „Status: under investigation“.
  status: 'under investigation',
  statusNote: 'Spojitost s incidentem nepotvrzena',

  // Fráze v běžící liště dole (vede na rezervaci).
  marquee: [
    'Objednávání pokračuje →',
    'Controlled beauty zone',
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

// „24.10 – 31.10“
export const halloweenDates = (): string => {
  const short = (ymd: string) => {
    const [, m, d] = ymd.split('-')
    return `${Number(d)}.${Number(m)}`
  }
  return `${short(HALLOWEEN.from)} – ${short(HALLOWEEN.to)}`
}
