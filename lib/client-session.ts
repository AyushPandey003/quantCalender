"use client"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  plan: "free" | "pro" | "enterprise"
  createdAt: string
  lastLoginAt: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  plan: string
}

interface SessionState {
  user: User | null
  isLoading: boolean
  error: string | null
}

type SessionSubscriber = (session: Session) => void

class ClientSessionManager {
  private static instance: ClientSessionManager
  private session: Session = {
    user: null,
    isLoading: true,
    error: null,
  }
  private subscribers: Set<SessionSubscriber> = new Set()
  private initialized = false

  static getInstance(): ClientSessionManager {
    if (!ClientSessionManager.instance) {
      ClientSessionManager.instance = new ClientSessionManager()
    }
    return ClientSessionManager.instance
  }

  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      this.setSession({ ...this.session, isLoading: true, error: null })
      
      // Check for existing session
      const response = await fetch('/api/auth/session', {
        credentials: 'include',
      })

      if (response.ok) {
        const userData = await response.json()
        this.setSession({
          user: userData.user,
          isLoading: false,
          error: null,
        })
      } else {
        this.setSession({
          user: null,
          isLoading: false,
          error: null,
        })
      }
    } catch (error) {
      this.setSession({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize session',
      })
    }

    this.initialized = true
  }

  subscribe(callback: SessionSubscriber): () => void {
    this.subscribers.add(callback)
    return () => {
      this.subscribers.delete(callback)
    }
  }

  getSession(): Session {
    return this.session
  }

  private setSession(newSession: Session): void {
    this.session = newSession
    this.subscribers.forEach(callback => callback(newSession))
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      this.setSession({ ...this.session, isLoading: true, error: null })

      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        this.setSession({
          user: data.user,
          isLoading: false,
          error: null,
        })
        return { success: true }
      } else {
        this.setSession({
          user: null,
          isLoading: false,
          error: data.error || 'Sign in failed',
        })
        return { success: false, error: data.error || 'Sign in failed' }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed'
      this.setSession({
        user: null,
        isLoading: false,
        error: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  }

  async signUp(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    try {
      this.setSession({ ...this.session, isLoading: true, error: null })

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (response.ok) {
        this.setSession({
          user: data.user,
          isLoading: false,
          error: null,
        })
        return { success: true }
      } else {
        this.setSession({
          user: null,
          isLoading: false,
          error: data.error || 'Sign up failed',
        })
        return { success: false, error: data.error || 'Sign up failed' }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed'
      this.setSession({
        user: null,
        isLoading: false,
        error: errorMessage,
      })
      return { success: false, error: errorMessage }
    }
  }

  async signOut(): Promise<void> {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      this.setSession({
        user: null,
        isLoading: false,
        error: null,
      })
    }
  }
}

export const SessionManager = ClientSessionManager
