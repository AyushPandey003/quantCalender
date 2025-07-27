import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

// Cookie configuration
const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
}

const ACCESS_TOKEN_COOKIE = "access-token"
const REFRESH_TOKEN_COOKIE = "refresh-token"

/**
 * Set access token cookie
 */
export async function setAccessTokenCookie(token: string, maxAge: number = 15 * 60) {
  const cookieStore = await cookies()
  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    ...COOKIE_CONFIG,
    maxAge,
  })
}

/**
 * Set refresh token cookie
 */
export async function setRefreshTokenCookie(token: string, maxAge: number = 7 * 24 * 60 * 60) {
  const cookieStore = await cookies()
  cookieStore.set(REFRESH_TOKEN_COOKIE, token, {
    ...COOKIE_CONFIG,
    maxAge,
  })
}

/**
 * Get access token from cookies
 */
export async function getAccessTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value
}

/**
 * Get refresh token from cookies
 */
export async function getRefreshTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value
}

/**
 * Get access token from request (for middleware)
 */
export function getAccessTokenFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
}

/**
 * Get refresh token from request (for middleware)
 */
export function getRefreshTokenFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get(REFRESH_TOKEN_COOKIE)?.value
}

/**
 * Clear all auth cookies
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.delete(ACCESS_TOKEN_COOKIE)
  cookieStore.delete(REFRESH_TOKEN_COOKIE)
}

/**
 * Clear specific auth cookie
 */
export async function clearAuthCookie(cookieName: string) {
  const cookieStore = await cookies()
  cookieStore.delete(cookieName)
} 