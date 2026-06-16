// Náborová kampaň — lashmakerka (prodlužování řas).
// ──────────────────────────────────────────────────────────────────────────
// VYPNUTÍ PO OBSAZENÍ POZICE: stačí změnit `enabled` na `false` a nasadit.
// Tím zmizí horní lišta na celém webu. Stránka /kariera zůstane dostupná
// (jen na ni nic neodkazuje) — případně ji můžeš později smazat.
// ──────────────────────────────────────────────────────────────────────────

export const HIRING = {
  // Hlavní vypínač celé kampaně (horní lišta).
  enabled: true,

  // Text běžící v horní liště (opakuje se v nekonečné smyčce).
  marquee: 'HLEDÁME LASHMAKERKU',

  // Zvýrazněná výzva za textem v liště.
  cta: 'PŘIDEJ SE',

  // Kam lišta i tlačítka vedou.
  href: '/kariera',

  // ── Data pro JobPosting (Google for Jobs / strukturovaná data) ──
  // Oficiální název pozice (klíčové slovo pro vyhledávání).
  jobTitle: 'Lashmakerka (prodlužování řas)',
  // Typ úvazku: FULL_TIME | PART_TIME | CONTRACTOR | OTHER
  employmentType: 'FULL_TIME',
  // Datum zveřejnění inzerátu (YYYY-MM-DD). Drž stabilní — neměň při každém buildu.
  datePosted: '2026-06-16',
  // Platnost inzerátu do (YYYY-MM-DD). Po obsazení nech projít / vypni `enabled`.
  validThrough: '2026-09-16',
  // Mzda v JobPosting záměrně neuvádíme — lashmakerka je odměňována provizí
  // z odvedené práce, konkrétní podmínky řešíme osobně.
} as const
