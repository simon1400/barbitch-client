import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set('x-next-pathname', request.nextUrl.pathname)
  return response
}

export const config = {
  matcher: ['/:path*'],
}
