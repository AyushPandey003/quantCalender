import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { users } from "../db/schema"
import { db } from "../db"
import type { User, LoginCredentials, RegisterCredentials } from "./types"

/**
 * Create a new user
 */
export async function createUser(credentials: RegisterCredentials): Promise<User | null> {
  try {
    // Check if user already exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, credentials.email))
      .limit(1)

    if (existingUser.length > 0) {
      return null // User already exists
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(credentials.password, saltRounds)

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: credentials.email,
        name: credentials.name,
        passwordHash,
        plan: "FREE",
        createdAt: new Date(),
        lastLoginAt: new Date(),
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

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.email}`,
      plan: newUser.plan.toLowerCase() as "free" | "pro" | "enterprise",
      createdAt: newUser.createdAt.toISOString(),
      lastLoginAt: newUser.lastLoginAt?.toISOString() || new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(credentials: LoginCredentials): Promise<User | null> {
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
      .where(eq(users.email, credentials.email))
      .limit(1)

    if (!dbUser) {
      return null
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(credentials.password, dbUser.passwordHash)
    if (!isPasswordValid) {
      return null
    }

    // Update last login time
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, dbUser.id))

    // Convert database user to our User interface
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      avatar: dbUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.email}`,
      plan: dbUser.plan.toLowerCase() as "free" | "pro" | "enterprise",
      createdAt: dbUser.createdAt.toISOString(),
      lastLoginAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
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
      .where(eq(users.id, userId))
      .limit(1)

    if (!dbUser) {
      return null
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      avatar: dbUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.email}`,
      plan: dbUser.plan.toLowerCase() as "free" | "pro" | "enterprise",
      createdAt: dbUser.createdAt.toISOString(),
      lastLoginAt: dbUser.lastLoginAt?.toISOString() || new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
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
      .where(eq(users.email, email))
      .limit(1)

    if (!dbUser) {
      return null
    }

    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      avatar: dbUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.email}`,
      plan: dbUser.plan.toLowerCase() as "free" | "pro" | "enterprise",
      createdAt: dbUser.createdAt.toISOString(),
      lastLoginAt: dbUser.lastLoginAt?.toISOString() || new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Partial<Pick<User, "name" | "avatar">>): Promise<User | null> {
  try {
    const [updatedUser] = await db
      .update(users)
      .set({
        name: updates.name,
        avatar: updates.avatar,
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        avatar: users.avatar,
        plan: users.plan,
        createdAt: users.createdAt,
        lastLoginAt: users.lastLoginAt,
      })

    if (!updatedUser) {
      return null
    }

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatar: updatedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${updatedUser.email}`,
      plan: updatedUser.plan.toLowerCase() as "free" | "pro" | "enterprise",
      createdAt: updatedUser.createdAt.toISOString(),
      lastLoginAt: updatedUser.lastLoginAt?.toISOString() || new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return null
  }
} 