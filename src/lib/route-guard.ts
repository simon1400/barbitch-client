import type { NextRequest } from 'next/server'

/**
 * Lightweight protections for public API routes (no Redis).
 *
 * - sameOrigin: blocks cross-site / tool-driven calls (CSRF + casual abuse).
 *   Not a hard wall against a determined attacker forging the Origin header
 *   via curl, but combined with rate limiting it caps the blast radius for
 *   browser-callable endpoints (voucher / career forms).
 * - rateLimit: in-memory per-key fixed window. Single Next process (PM2).
 */

export const clientIp = (req: NextRequest): string => {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

/** True if the request originates from our own site (Origin/Referer host === request host). */
export const sameOrigin = (req: NextRequest): boolean => {
  const host = req.headers.get('host')
  if (!host) return false
  const source = req.headers.get('origin') || req.headers.get('referer')
  if (!source) return false
  try {
    return new URL(source).host === host
  } catch {
    return false
  }
}

interface Bucket {
  count: number
  resetAt: number
}

/** Create a fixed-window limiter. Returns a function: key -> allowed(boolean). */
export const makeRateLimiter = (max: number, windowMs: number) => {
  const buckets = new Map<string, Bucket>()
  return (key: string): boolean => {
    const now = Date.now()
    let bucket = buckets.get(key)
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs }
      buckets.set(key, bucket)
    }
    bucket.count += 1
    // Opportunistic cleanup so the map can't grow unbounded.
    if (buckets.size > 5000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k)
    }
    return bucket.count <= max
  }
}
