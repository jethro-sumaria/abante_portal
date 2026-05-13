import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get the auth token from cookies
  const authToken = request.cookies.get('sb-session-token')?.value || 
                    request.cookies.get('sb-auth-token')?.value

  // Add CORS headers
  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { 
      status: 200, 
      headers: response.headers 
    })
  }

  // Allow public routes
  if (pathname === '/' || pathname.startsWith('/_')) {
    return response
  }

  // Admin login page
  if (pathname === '/admin') {
    if (authToken) {
      // Redirect to dashboard if already authenticated
      const dashboardUrl = request.nextUrl.clone()
      dashboardUrl.pathname = '/admin/dashboard'
      return NextResponse.redirect(dashboardUrl)
    }
    return response
  }

  // Protect all admin routes (except login) - requires authentication
  if (pathname.startsWith('/admin')) {
    if (!authToken) {
      // Redirect to login if not authenticated
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin'
      return NextResponse.redirect(loginUrl)
    }
    return response
  }

  return response
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
