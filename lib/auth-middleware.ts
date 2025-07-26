import { jwtVerify } from "jose"
import type { NextRequest } from "next/server"

const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long")
  }
  return new TextEncoder().encode(secret)
}

export interface UserPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

// Lightweight user payload verification for middleware
export async function getCurrentUserPayload(request: NextRequest): Promise<UserPayload | null> {
  try {
    const token = request.cookies.get("auth-token")?.value

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
