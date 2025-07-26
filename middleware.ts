import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCurrentUserPayload } from "@/lib/auth-middleware"

// Define protected routes
const protectedRoutes = ["/dashboard", "/settings"]
const authRoutes = ["/signin", "/signup"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userPayload = await getCurrentUserPayload(request)

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the current route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // If user is not authenticated and trying to access protected route
  if (isProtectedRoute && !userPayload) {
    const signInUrl = new URL("/", request.url)
    signInUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // If user is authenticated and trying to access auth routes
  if (isAuthRoute && userPayload) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
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
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
