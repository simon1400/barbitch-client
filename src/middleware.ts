import type { NextRequest } from 'next/server'

import { resolveBookPath } from 'lib/bookPath'
import { NextResponse } from 'next/server'

// Jen adresy pod /book/ — samotné /book ani zbytek webu middleware neprochází.
// Query se při přesměrování ZACHOVÁVÁ: nese gclid/utm z reklam, bez něj by se
// ztratilo měření konverzí.
export function middleware(request: NextRequest) {
  const target = resolveBookPath(request.nextUrl.pathname)
  if (!target) return NextResponse.next()

  // Obyčejné URL, ne nextUrl.clone(): NextURL by vrátil lomítko na konec.
  const url = new URL(target, request.url)
  url.search = request.nextUrl.search
  return NextResponse.redirect(url, 301)
}

export const config = {
  matcher: ['/book/:path+'],
}
