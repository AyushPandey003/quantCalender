import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// JWT Configuration for middleware (lightweight)
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long")
  }
  return new TextEncoder().encode(secret)
}

interface UserPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

/**
 * Lightweight user payload verification for middleware
 * Only verifies JWT without database access
 */
async function getCurrentUserPayload(request: NextRequest): Promise<UserPayload | null> {
  try {
    const token = request.cookies.get("access-token")?.value

    if (!token) {
      return null
    }

    const secret = getJWTSecret()
    const { payload } = await jwtVerify(token, secret)

    // Ensure the payload has the required fields
    if (typeof payload.userId === "string" && typeof payload.email === "string") {
      return {
        userId: payload.userId,
        email: payload.email,
        iat: payload.iat as number,
        exp: payload.exp as number,
      }
    }

    return null
  } catch (error) {
    console.error("Token verification failed in middleware:", error)
    return null
  }
}

// Define protected routes
const protectedRoutes = ["/dashboard", "/settings", "/calendar"]
const authRoutes = ["/signin", "/signup"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes, static files, and other assets
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

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
