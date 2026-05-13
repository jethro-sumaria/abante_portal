import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get the auth token from cookies
  const authToken = request.cookies.get('sb-session-token')?.value || 
                    request.cookies.get('sb-auth-token')?.value

  // Allow public routes
  if (pathname === '/' || pathname.startsWith('/_')) {
    return NextResponse.next()
  }

  // Admin dashboard - requires authentication
  if (pathname === '/admin/dashboard') {
    if (!authToken) {
      // Redirect to login if not authenticated
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin'
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Admin login page
  if (pathname === '/admin') {
    if (authToken) {
      // Redirect to dashboard if already authenticated
      const dashboardUrl = request.nextUrl.clone()
      dashboardUrl.pathname = '/admin/dashboard'
      return NextResponse.redirect(dashboardUrl)
    }
    return NextResponse.next()
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
