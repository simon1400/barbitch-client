// Náborová kampaň — administrátor/ka salonu.
// ──────────────────────────────────────────────────────────────────────────
// VYPNUTÍ PO OBSAZENÍ POZICE: stačí změnit `enabled` na `false` a nasadit.
// Tím zmizí horní lišta na celém webu. Stránka /kariera zůstane dostupná
// (jen na ni nic neodkazuje) — případně ji můžeš později smazat.
// ──────────────────────────────────────────────────────────────────────────

export const HIRING = {
  // Hlavní vypínač celé kampaně (horní lišta).
  enabled: true,

  // Text běžící v horní liště (opakuje se v nekonečné smyčce).
  marquee: 'HLEDÁME ADMINISTRÁTORKU',

  // Zvýrazněná výzva za textem v liště.
  cta: 'PŘIDEJ SE',

  // Kam lišta i tlačítka vedou.
  href: '/kariera',

  // ── Data pro JobPosting (Google for Jobs / strukturovaná data) ──
  // Oficiální název pozice (klíčové slovo pro vyhledávání — narozdíl od
  // hravého H1 „Hledáme adminku“).
  jobTitle: 'Administrátorka salonu',
  // Typ úvazku: FULL_TIME | PART_TIME | CONTRACTOR | OTHER
  employmentType: 'FULL_TIME',
  // Datum zveřejnění inzerátu (YYYY-MM-DD). Drž stabilní — neměň při každém buildu.
  datePosted: '2026-05-31',
  // Platnost inzerátu do (YYYY-MM-DD). Po obsazení nech projít / vypni `enabled`.
  validThrough: '2026-08-31',
  // Mzda pro JobPosting (Google for Jobs). unitText: HOUR | DAY | WEEK | MONTH | YEAR.
  salaryValue: 150,
  salaryCurrency: 'CZK',
  salaryUnit: 'HOUR',
} as const
