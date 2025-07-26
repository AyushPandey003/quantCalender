"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { authenticateUser, createUser, generateToken, setAuthCookie, clearAuthCookie, getCurrentUser } from "../auth"

export interface AuthResult {
  success: boolean
  message: string
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
      return {
        success: false,
        message: "Email and password are required",
      }
    }

    const user = await authenticateUser(email, password)

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      }
    }

    const token = await generateToken(user)
    await setAuthCookie(token)

    revalidatePath("/")

    return {
      success: true,
      message: "Signed in successfully",
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
    return {
      success: false,
      message: "An error occurred during sign in",
    }
  }
}

export async function signUpAction(email: string, password: string, name: string): Promise<AuthResult> {
  try {
    if (!email || !password || !name) {
      return {
        success: false,
        message: "All fields are required",
      }
    }

    if (password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters long",
      }
    }

    const user = await createUser(email, password, name)

    if (!user) {
      return {
        success: false,
        message: "User already exists or registration failed",
      }
    }

    const token = await generateToken(user)
    await setAuthCookie(token)

    revalidatePath("/")

    return {
      success: true,
      message: "Account created successfully",
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
    return {
      success: false,
      message: "An error occurred during registration",
    }
  }
}

export async function signOutAction(): Promise<void> {
  try {
    await clearAuthCookie()
    revalidatePath("/")
  } catch (error) {
    console.error("Sign out error:", error)
    throw new Error("Failed to sign out")
  }
}

export async function getCurrentUserAction() {
  try {
    const user = await getCurrentUser()
    return user
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

export async function redirectToDashboard() {
  redirect("/dashboard")
}

export async function redirectToHome() {
  redirect("/")
}
