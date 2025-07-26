"use client"

import type { User } from "./auth"

export interface Session {
  user: User | null
  isLoading: boolean
  error: string | null
}

// Client-side session management using Server Actions
export class SessionManager {
  private static instance: SessionManager
  private session: Session = {
    user: null,
    isLoading: true,
    error: null,
  }
  private listeners: Set<(session: Session) => void> = new Set()

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  subscribe(listener: (session: Session) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.session))
  }

  async initialize() {
    try {
      this.session = { ...this.session, isLoading: true, error: null }
      this.notify()

      // Import the server action dynamically to avoid SSR issues
      const { getCurrentUserAction } = await import("@/lib/actions/auth-actions")
      const user = await getCurrentUserAction()

      if (user) {
        this.session = { user, isLoading: false, error: null }
      } else {
        this.session = { user: null, isLoading: false, error: null }
      }
    } catch (error) {
      this.session = {
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      }
    }
    this.notify()
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { signInAction } = await import("@/lib/actions/auth-actions")
      const result = await signInAction(email, password)

      if (result.success && result.user) {
        this.session = { user: result.user, isLoading: false, error: null }
        this.notify()
        return { success: true }
      } else {
        return { success: false, error: result.error || "Sign in failed" }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      }
    }
  }

  async signUp(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { signUpAction } = await import("@/lib/actions/auth-actions")
      const result = await signUpAction(email, password, name)

      if (result.success && result.user) {
        this.session = { user: result.user, isLoading: false, error: null }
        this.notify()
        return { success: true }
      } else {
        return { success: false, error: result.error || "Sign up failed" }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      }
    }
  }

  async signOut(): Promise<void> {
    try {
      const { signOutAction } = await import("@/lib/actions/auth-actions")
      await signOutAction()

      this.session = { user: null, isLoading: false, error: null }
      this.notify()
    } catch (error) {
      console.error("Sign out error:", error)
      this.session = { user: null, isLoading: false, error: null }
      this.notify()
    }
  }

  getSession(): Session {
    return this.session
  }
}
