import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get auth token from cookies
  const authToken = request.cookies.get('sb-session-token')?.value || 
                    request.cookies.get('sb-auth-token')?.value

  // Redirect to login if accessing /admin/dashboard without auth
  if (pathname === '/admin/dashboard' && !authToken) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Redirect to dashboard if accessing /admin (login) while authenticated
  if (pathname === '/admin' && authToken) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
