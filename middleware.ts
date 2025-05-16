import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { validateEnvOrThrow } from "@/lib/env-validation"

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Protected routes that require authentication
const protectedRoutes = ["/account", "/checkout", "/auth/reset-password"]

    const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

    // If accessing a protected route without a session, redirect to login
    if (isProtectedRoute && !session) {
      const redirectUrl = new URL("/auth/login", req.url)
      redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    // Add CORS headers for API routes
    if (req.nextUrl.pathname.startsWith('/api')) {
      // Get the origin from the request headers
      const origin = req.headers.get('origin') || '*'
      
      // Create a new response with CORS headers
      const corsResponse = NextResponse.next()
      
      // Set CORS headers
      corsResponse.headers.set('Access-Control-Allow-Origin', origin)
      corsResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      corsResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      corsResponse.headers.set('Access-Control-Max-Age', '86400')
      
      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        return new NextResponse(null, { 
          status: 204,
          headers: corsResponse.headers
        })
      }
      
      return corsResponse
    }

    return res
  } catch (error) {
    console.error("Middleware error:", error)
    // In case of error, allow the request to continue to avoid blocking the site
    return NextResponse.next()
  }
}

// Only run middleware on specific paths
export const config = {
  matcher: ["/account/:path*", "/checkout/:path*", "/auth/reset-password/:path*", "/api/:path*"],
}
