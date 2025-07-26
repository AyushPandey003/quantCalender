import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { db } from "./db"
import { users, userSettings } from "./db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

// Use a more secure secret generation
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long")
  }
  return new TextEncoder().encode(secret)
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  plan: "free" | "pro" | "enterprise"
  createdAt: string
  lastLoginAt: string
}

export interface JWTPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

// Generate JWT token
export async function generateToken(user: User): Promise<string> {
  const secret = getJWTSecret()

  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token expires in 7 days
    .sign(secret)

  return token
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
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

// Get current user from request
export async function getCurrentUser(request?: NextRequest): Promise<User | null> {
  try {
    let token: string | undefined

    if (request) {
      // For middleware/API routes
      token = request.cookies.get("auth-token")?.value
    } else {
      // For server components
      const cookieStore = await cookies()
      token = cookieStore.get("auth-token")?.value
    }

    if (!token) {
      return null
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return null
    }

    // Fetch user data from database
    const [dbUser] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        avatar: users.avatar,
        plan: users.plan,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1)

    if (!dbUser) {
      return null
    }

    // Convert database user to our User interface
    const user: User = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      avatar: dbUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.email}`,
      plan: dbUser.plan.toLowerCase() as "free" | "pro" | "enterprise",
      createdAt: dbUser.createdAt.toISOString(),
      lastLoginAt: dbUser.lastLoginAt?.toISOString() || new Date().toISOString(),
    }

    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Set auth cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

// Authenticate user (database implementation)
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    // Find user in database
    const [dbUser] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        avatar: users.avatar,
        plan: users.plan,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!dbUser) {
      return null
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, dbUser.passwordHash)
    if (!isPasswordValid) {
      return null
    }

    // Update last login time
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, dbUser.id))

    // Convert database user to our User interface
    const user: User = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      avatar: dbUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.email}`,
      plan: dbUser.plan.toLowerCase() as "free" | "pro" | "enterprise",
      createdAt: dbUser.createdAt.toISOString(),
      lastLoginAt: new Date().toISOString(),
    }

    return user
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}

// Create new user (database implementation)
export async function createUser(email: string, password: string, name: string): Promise<User | null> {
  try {
    // Check if user already exists
    const [existingUser] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)

    if (existingUser) {
      return null // User already exists
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create new user in database
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name,
        passwordHash,
        plan: "FREE",
        emailVerified: false,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        avatar: users.avatar,
        plan: users.plan,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
      })

    // Create default user settings
    await db.insert(userSettings).values({
      userId: newUser.id,
    })

    // Convert database user to our User interface
    const user: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.email}`,
      plan: newUser.plan.toLowerCase() as "free" | "pro" | "enterprise",
      createdAt: newUser.createdAt.toISOString(),
      lastLoginAt: newUser.lastLoginAt?.toISOString() || new Date().toISOString(),
    }

    return user
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}
