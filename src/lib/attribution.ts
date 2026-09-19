// Источник брони (s200): откуда клиент пришёл на сайт. Уходит вместе с бронью в
// POST /api/engine/bookings и попадает в отчёт владельца «Источники броней».
//
// Касание = один заход на сайт: метки из URL (utm_*, gclid, fbclid…), referrer и
// страница входа. Храним два касания:
//   first — самый первый заход (живёт 90 дней),
//   last  — последний НЕ прямой заход: прямой заход не перетирает платный источник,
//           иначе клиентка из рекламы, вернувшаяся по закладке, стала бы «прямой».
//
// Пишется в localStorage всегда, независимо от согласия на cookies — решение владельца
// (19.09.2026). В рекламные системы (Meta/Google) данные по-прежнему уходят только при
// согласии — это отдельный код (fetch/pixel.ts, fetch/googleAds.ts).
import { hasConsentCookie } from 'fetch/pixel'

const STORAGE_KEY = 'bb_attr'
const TTL_MS = 90 * 24 * 60 * 60 * 1000
const MAX_LEN = 300

const PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_id',
  'gclid',
  'gbraid',
  'wbraid',
  'gad_source',
  'gad_campaignid',
  'fbclid',
  'sznclid',
  'msclkid',
] as const

type Touch = Partial<Record<(typeof PARAM_KEYS)[number], string>> & {
  landing?: string
  referrer?: string
  ts: string
}

interface Stored {
  first?: Touch
  last?: Touch
}

export interface BookingAttribution extends Stored {
  consent: boolean
}

// Копия в памяти: переживает переходы внутри сайта, даже если localStorage недоступен
// (приватный режим, заблокированное хранилище).
let memory: Stored = {}
let capturedThisLoad = false

const cut = (s: string) => s.slice(0, MAX_LEN)

const isExpired = (t?: Touch) => !t || !Date.parse(t.ts) || Date.now() - Date.parse(t.ts) > TTL_MS

function readStored(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Stored) : {}
  } catch {
    return {}
  }
}

function writeStored(value: Stored) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // хранилище недоступно — остаётся копия в памяти
  }
}

function externalReferrer(): string | undefined {
  const ref = document.referrer
  if (!ref) return undefined
  try {
    const url = new URL(ref)
    const own = location.hostname.replace(/^www\./, '')
    if (url.hostname.replace(/^www\./, '') === own) return undefined
    // без query: в referrer бывают чужие персональные данные
    return cut(`${url.origin}${url.pathname}`)
  } catch {
    return undefined
  }
}

function currentTouch(): { direct: boolean; touch: Touch } {
  const params = new URLSearchParams(location.search)
  const touch: Touch = { ts: new Date().toISOString(), landing: cut(location.pathname) }
  let hasParams = false
  for (const key of PARAM_KEYS) {
    const value = params.get(key)
    if (value) {
      touch[key] = cut(value)
      hasParams = true
    }
  }
  const referrer = externalReferrer()
  if (referrer) touch.referrer = referrer
  return { direct: !hasParams && !referrer, touch }
}

/** Запомнить заход. Вызывается один раз на загрузку страницы (переходы внутри сайта — не заходы). */
export function captureAttribution() {
  if (typeof window === 'undefined' || capturedThisLoad) return
  capturedThisLoad = true

  const stored = { ...readStored(), ...memory }
  const { direct, touch } = currentTouch()
  const next: Stored = {
    first: isExpired(stored.first) ? touch : stored.first,
    last: isExpired(stored.last) ? undefined : stored.last,
  }
  if (!direct) next.last = touch

  memory = next
  writeStored(next)
}

/** Источник для брони: память страницы, иначе сохранённое в браузере. */
export function getBookingAttribution(): BookingAttribution | undefined {
  if (typeof window === 'undefined') return undefined
  const stored = memory.first || memory.last ? memory : readStored()
  if (!stored.first && !stored.last) return undefined
  return { first: stored.first, last: stored.last, consent: hasConsentCookie() }
}
