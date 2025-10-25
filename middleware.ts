/**
 * Middleware for Route Protection
 *
 * This middleware runs on every request and handles:
 * - Authentication verification
 * - Protected route access control
 * - Redirect unauthenticated users to login
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

// Routes that require authentication
const protectedRoutes = [
  '/listings/create',
  '/listings/my-listings',
  '/chat',
  '/profile',
  '/settings',
]

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/signup', '/verify']

// Public API routes (don't require authentication)
const publicApiRoutes = [
  '/api/auth/send-code',
  '/api/auth/verify-code',
  '/api/auth/signup',
  '/api/auth/login',
  '/api/listings', // Public listings viewing
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files, images, and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Get auth token from cookie
  const token = request.cookies.get('auth_token')?.value

  // Verify token
  let isAuthenticated = false
  if (token) {
    const user = await verifyToken(token)
    isAuthenticated = !!user
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Check if route is an auth route (login, signup)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Check if it's a public API route
  const isPublicApiRoute = publicApiRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Handle protected routes
  if (isProtectedRoute && !isAuthenticated) {
    // Redirect to login page
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Handle auth routes (redirect to browse if already authenticated)
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/browse', request.url))
  }

  // Handle API routes
  if (pathname.startsWith('/api')) {
    // Allow public API routes
    if (isPublicApiRoute) {
      return NextResponse.next()
    }

    // Require authentication for other API routes
    if (!isAuthenticated) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
        },
        { status: 401 }
      )
    }
  }

  // Allow the request to continue
  return NextResponse.next()
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
}
