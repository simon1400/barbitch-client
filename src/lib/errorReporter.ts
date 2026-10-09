const NOISE_PATTERNS = [
  /ResizeObserver loop/i,
  /^Script error\.?$/i,
  /chrome-extension:\/\//i,
  /moz-extension:\/\//i,
  /safari-extension:\/\//i,
  /^Non-Error promise rejection captured/i,
  /Load failed/i,
  /AbortError/i,
  /cancel(l)?ed/i,
  // Встроенные браузеры соцсетей подмешивают в страницу свои скрипты, и те падают
  // сами по себе: Instagram/Seznam на iOS — window.webkit.messageHandlers,
  // Facebook на Android — «Error invoking postMessage: Java object is gone».
  /window\.webkit\.messageHandlers/i,
  /Error invoking postMessage/i,
  /iabjs:\/\//i,
  // Автоперевод Chrome/Google Translate меняет текст страницы до гидратации или
  // под React — тот падает на несовпадении (#418, «Hydration failed») или на
  // removeChild/insertBefore. Перевод не запрещаем (решение владельца, s248);
  // цена — настоящая ошибка гидратации тоже не попадёт в журнал.
  /Minified React error #418/i,
  /Hydration failed/i,
  /Failed to execute '(removeChild|insertBefore)' on 'Node'/i,
  // Окружение заморозило history (headless-бот Chrome 79), Next не может его обернуть.
  /Cannot assign to read only property '(pushState|replaceState)'/i,
]

// Стек есть, но ни одного кадра из наших бандлов (/_next/) — упал чужой код:
// скрипт, который встроенный браузер (Instagram, Facebook, Chrome на iOS)
// подмешивает в страницу, или сторонний тег. Примеры: «Maximum call stack size
// exceeded» в «barbitch.cz/service/rasy:225» (у нас HTML в одну строку) и в
// кадрах вовсе без адреса («fl@», «dl@» — код без файла, Chrome на iOS).
// Кадр: V8 — «    at …», Safari/Firefox — «имя@…» (имя без пробелов, может быть пустым).
const isForeignStack = (stack: string): boolean => {
  const frames = stack.split('\n').filter((l) => /^\s+at\s/.test(l) || /^[^\s@]*@/.test(l))
  return frames.length > 0 && !frames.some((l) => l.includes('/_next/'))
}

const recentHashes = new Map<string, number>()
const THROTTLE_MS = 10_000

function hashString(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = (h * 33) ^ s.charCodeAt(i)
  }
  return (h >>> 0).toString(36)
}

function isNoise(msg: string, stack: string, url: string): boolean {
  return NOISE_PATTERNS.some((p) => p.test(msg) || p.test(url)) || isForeignStack(stack)
}

function getSessionId(): string {
  if (typeof localStorage === 'undefined') return ''
  try {
    const raw = localStorage.getItem('barbitch_chat')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.sessionId) return String(parsed.sessionId)
    }
  } catch {
    /* ignore */
  }
  let id = localStorage.getItem('barbitch_error_session')
  if (!id) {
    id = `err_${Date.now().toString(36)}_${crypto.randomUUID().slice(0, 8)}`
    try {
      localStorage.setItem('barbitch_error_session', id)
    } catch {
      /* ignore */
    }
  }
  return id
}

export type ErrorSource = 'window-error' | 'unhandled-rejection' | 'react-error' | 'manual'

export interface ReportInput {
  message: string
  stack?: string
  source?: ErrorSource
  url?: string
}

export function reportClientError(input: ReportInput): void {
  if (typeof window === 'undefined') return

  const message = (input.message || '').slice(0, 1000)
  const stack = (input.stack || '').slice(0, 8000)
  if (!message || isNoise(message, stack, input.url || '')) return

  const hash = hashString(`${message}::${stack.split('\n').slice(0, 3).join('\n')}`)

  const now = Date.now()
  const last = recentHashes.get(hash)
  if (last && now - last < THROTTLE_MS) return
  recentHashes.set(hash, now)

  if (recentHashes.size > 200) {
    const cutoff = now - THROTTLE_MS
    for (const [k, t] of recentHashes) {
      if (t < cutoff) recentHashes.delete(k)
    }
  }

  const apiUrl = process.env.NEXT_PUBLIC_APP_API || 'https://strapi.barbitch.cz'
  const environment = process.env.NODE_ENV === 'development' ? 'development' : 'production'

  const payload = {
    message,
    stack,
    source: input.source || 'window-error',
    url: input.url || window.location.href,
    userAgent: navigator.userAgent,
    sessionId: getSessionId(),
    environment,
  }

  try {
    const body = JSON.stringify(payload)
    const endpoint = `${apiUrl}/api/client-error-logs/report`
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' })
      navigator.sendBeacon(endpoint, blob)
    } else {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {})
    }
  } catch {
    /* never break user flow */
  }
}
