import "server-only"

import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { prisma } from "./db"
import bcrypt from "bcryptjs"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this-in-production")

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
  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token expires in 7 days
    .sign(JWT_SECRET)

  return token
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
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

// Get current user from request
export async function getCurrentUser(request?: NextRequest): Promise<User | null> {
  try {
    const cookieStore = request ? { get: (name: string) => request.cookies.get(name) } : await cookies()

    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return null
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return null
    }

    // Fetch user data from database
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        plan: true,
        createdAt: true,
        lastLoginAt: true,
      },
    })

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
    const dbUser = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        plan: true,
        createdAt: true,
        lastLoginAt: true,
        passwordHash: true,
      },
    })

    if (!dbUser) {
      return null
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, dbUser.passwordHash)
    if (!isPasswordValid) {
      return null
    }

    // Update last login time
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { lastLoginAt: new Date() },
    })

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
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return null // User already exists
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create new user in database
    const dbUser = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        plan: "FREE",
        emailVerified: false,
        settings: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        plan: true,
        createdAt: true,
        lastLoginAt: true,
      },
    })

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
    console.error("Error creating user:", error)
    return null
  }
}
