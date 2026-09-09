import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PAGES = ['/orders', '/dashboard', '/owner-menu']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get('owner_session')?.value
  const isAuthenticated = session === process.env.OWNER_PASSWORD

  const isProtectedPage = PROTECTED_PAGES.some((path) => pathname.startsWith(path))
  const isProtectedApi =
    pathname.startsWith('/api/menu-items') ||
    pathname.startsWith('/api/orders/')

  if (isProtectedPage && !isAuthenticated) {
    const loginUrl = new URL('/owner-login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  if (isProtectedApi && !isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/orders/:path*',
    '/dashboard/:path*',
    '/owner-menu/:path*',
    '/api/menu-items/:path*',
    '/api/orders/:path*',
  ],
}