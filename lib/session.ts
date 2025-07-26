"use client"

import type { User } from "./auth"

export interface Session {
  user: User | null
  isLoading: boolean
  error: string | null
}

// Client-side session management
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

      const response = await fetch("/api/auth/me", {
        credentials: "include",
      })

      if (response.ok) {
        const user = await response.json()
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
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        this.session = { user: data.user, isLoading: false, error: null }
        this.notify()
        return { success: true }
      } else {
        return { success: false, error: data.error || "Sign in failed" }
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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (response.ok) {
        this.session = { user: data.user, isLoading: false, error: null }
        this.notify()
        return { success: true }
      } else {
        return { success: false, error: data.error || "Sign up failed" }
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
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      this.session = { user: null, isLoading: false, error: null }
      this.notify()
    }
  }

  getSession(): Session {
    return this.session
  }
}
