const RELOAD_KEY = 'barbitch_chunk_reload_at'
const RELOAD_COOLDOWN_MS = 15_000

const CHUNK_ERROR_PATTERNS = [
  /Loading chunk [\w-]+ failed/i,
  /Loading CSS chunk [\w-]+ failed/i,
  /Failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /Importing a module script failed/i,
]

/**
 * Detects a webpack/Next.js chunk-loading failure. These are almost always
 * caused by a fresh deploy invalidating the chunk hashes a stale tab still
 * references — not by an actual code bug.
 */
export function isChunkLoadError(err: unknown): boolean {
  if (!err) return false
  if (
    typeof err === 'object' &&
    'name' in err &&
    (err as { name?: string }).name === 'ChunkLoadError'
  ) {
    return true
  }
  const msg = typeof err === 'string' ? err : (err as { message?: string })?.message || ''
  if (!msg) return false
  return CHUNK_ERROR_PATTERNS.some((p) => p.test(msg))
}

/**
 * Reloads the page once to pull the fresh build (new chunk hashes). Guarded by a
 * cooldown in sessionStorage so a genuinely broken deploy can't cause a reload
 * loop. Returns true if a reload was triggered — caller should then stop
 * (skip reporting/rendering the error boundary), false if the cooldown is
 * still active (treat the error as real: report it and let it surface).
 */
export function attemptChunkReload(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || '0')
    const now = Date.now()
    if (last && now - last < RELOAD_COOLDOWN_MS) return false
    sessionStorage.setItem(RELOAD_KEY, String(now))
    window.location.reload()
    return true
  } catch {
    return false
  }
}
