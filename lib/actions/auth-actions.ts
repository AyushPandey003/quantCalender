"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { authenticateUser, createUser, generateToken, setAuthCookie, clearAuthCookie, getCurrentUser } from "@/lib/auth"

export interface AuthResult {
  success: boolean
  error?: string
  user?: {
    id: string
    email: string
    name: string
    avatar?: string
    plan: string
  }
}

export async function signInAction(email: string, password: string): Promise<AuthResult> {
  try {
    if (!email || !password) {
      return { success: false, error: "Email and password are required" }
    }

    const user = await authenticateUser(email, password)

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    const token = await generateToken(user)
    await setAuthCookie(token)

    // Revalidate auth-related paths
    revalidatePath("/", "layout")

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        plan: user.plan,
      },
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return { success: false, error: "Sign in failed" }
  }
}

export async function signUpAction(email: string, password: string, name: string): Promise<AuthResult> {
  try {
    if (!email || !password || !name) {
      return { success: false, error: "Email, password, and name are required" }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, error: "Invalid email format" }
    }

    // Basic password validation
    if (password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters long" }
    }

    const user = await createUser(email, password, name)

    if (!user) {
      return { success: false, error: "User already exists" }
    }

    const token = await generateToken(user)
    await setAuthCookie(token)

    // Revalidate auth-related paths
    revalidatePath("/", "layout")

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        plan: user.plan,
      },
    }
  } catch (error) {
    console.error("Sign up error:", error)
    return { success: false, error: "Sign up failed" }
  }
}

export async function signOutAction(): Promise<{ success: boolean }> {
  try {
    await clearAuthCookie()

    // Revalidate auth-related paths
    revalidatePath("/", "layout")

    // Redirect to home page
    redirect("/")
  } catch (error) {
    console.error("Sign out error:", error)
    return { success: false }
  }
}

export async function getCurrentUserAction() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      plan: user.plan,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}
