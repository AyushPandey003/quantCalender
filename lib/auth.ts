import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

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
    return payload as JWTPayload
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

    // In a real app, you'd fetch user data from database
    // For demo purposes, we'll return mock data
    const user: User = {
      id: payload.userId,
      email: payload.email,
      name: payload.email.split("@")[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${payload.email}`,
      plan: "pro",
      createdAt: "2024-01-01T00:00:00Z",
      lastLoginAt: new Date().toISOString(),
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

// Mock user database (in production, use a real database)
const mockUsers: Record<string, User> = {
  "john@example.com": {
    id: "1",
    email: "john@example.com",
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john@example.com",
    plan: "pro",
    createdAt: "2024-01-01T00:00:00Z",
    lastLoginAt: new Date().toISOString(),
  },
  "jane@example.com": {
    id: "2",
    email: "jane@example.com",
    name: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane@example.com",
    plan: "enterprise",
    createdAt: "2024-01-15T00:00:00Z",
    lastLoginAt: new Date().toISOString(),
  },
}

// Authenticate user (mock implementation)
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  // In production, verify password hash against database
  const user = mockUsers[email]
  if (user && password === "password123") {
    return {
      ...user,
      lastLoginAt: new Date().toISOString(),
    }
  }
  return null
}

// Create new user (mock implementation)
export async function createUser(email: string, password: string, name: string): Promise<User | null> {
  // In production, hash password and save to database
  if (mockUsers[email]) {
    return null // User already exists
  }

  const newUser: User = {
    id: Math.random().toString(36).substring(2),
    email,
    name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    plan: "free",
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  }

  mockUsers[email] = newUser
  return newUser
}
