import { jwtVerify, SignJWT } from "jose"
import type { JWTPayload, RefreshTokenPayload, User } from "./types"

// Browser-compatible UUID generation
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || JWT_SECRET

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long")
}

const getJWTSecret = () => new TextEncoder().encode(JWT_SECRET)
const getRefreshTokenSecret = () => new TextEncoder().encode(REFRESH_TOKEN_SECRET)

// Access token configuration
const ACCESS_TOKEN_EXPIRY = "15m" // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d" // 7 days

/**
 * Generate access token for user
 */
export async function generateAccessToken(user: User): Promise<string> {
  const secret = getJWTSecret()
  
  return new SignJWT({
    userId: user.id,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(secret)
}

/**
 * Generate refresh token for user
 */
export async function generateRefreshToken(user: User): Promise<{ token: string; tokenId: string }> {
  const secret = getRefreshTokenSecret()
  const tokenId = generateUUID()
  
  const token = await new SignJWT({
    userId: user.id,
    tokenId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(secret)

  return { token, tokenId }
}

/**
 * Verify access token
 */
export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = getJWTSecret()
    const { payload } = await jwtVerify(token, secret)

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
    console.error("Access token verification failed:", error)
    return null
  }
}

/**
 * Verify refresh token
 */
export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
  try {
    const secret = getRefreshTokenSecret()
    const { payload } = await jwtVerify(token, secret)

    if (typeof payload.userId === "string" && typeof payload.tokenId === "string") {
      return {
        userId: payload.userId,
        tokenId: payload.tokenId,
        iat: payload.iat as number,
        exp: payload.exp as number,
      }
    }
    return null
  } catch (error) {
    console.error("Refresh token verification failed:", error)
    return null
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(payload: JWTPayload | RefreshTokenPayload): boolean {
  return Date.now() >= payload.exp * 1000
}

/**
 * Get token expiry time in milliseconds
 */
export function getTokenExpiryTime(payload: JWTPayload | RefreshTokenPayload): number {
  return payload.exp * 1000
} 