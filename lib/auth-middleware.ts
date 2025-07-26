import { jwtVerify } from "jose"
import type { NextRequest } from "next/server"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this-in-production")

export interface JWTPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

// Verify JWT token (middleware-safe version)
export async function verifyTokenMiddleware(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    
    // Ensure the payload has the required fields
    if (typeof payload.userId === 'string' && typeof payload.email === 'string') {
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
