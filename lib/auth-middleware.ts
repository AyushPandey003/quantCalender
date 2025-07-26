import { jwtVerify } from "jose"
import type { NextRequest } from "next/server"

// Use a more secure secret generation
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    console.error("JWT_SECRET must be at least 32 characters long")
    return new TextEncoder().encode("fallback-secret-key-for-development-only-change-in-production")
  }
  return new TextEncoder().encode(secret)
}

export interface JWTPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

// Verify JWT token (middleware-safe version)
export async function verifyTokenMiddleware(token: string): Promise<JWTPayload | null> {
  try {
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
    console.error("Token verification failed:", error)
    return null
  }
}

// Get current user JWT payload from request (middleware-safe version)
export async function getCurrentUserPayload(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return null
    }

    return await verifyTokenMiddleware(token)
  } catch (error) {
    console.error("Get user payload error:", error)
    return null
  }
}
