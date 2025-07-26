"use client"

import { useState, useEffect } from "react"
import { SessionManager, type Session } from "@/lib/client-session"

export function useAuth() {
  const [session, setSession] = useState<Session>({
    user: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const sessionManager = SessionManager.getInstance()

    // Initialize session
    sessionManager.initialize()

    // Subscribe to session changes
    const unsubscribe = sessionManager.subscribe(setSession)

    // Set initial session
    setSession(sessionManager.getSession())

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    const sessionManager = SessionManager.getInstance()
    return await sessionManager.signIn(email, password)
  }

  const signUp = async (email: string, password: string, name: string) => {
    const sessionManager = SessionManager.getInstance()
    return await sessionManager.signUp(email, password, name)
  }

  const signOut = async () => {
    const sessionManager = SessionManager.getInstance()
    await sessionManager.signOut()
  }

  return {
    user: session.user,
    isLoading: session.isLoading,
    error: session.error,
    isAuthenticated: !!session.user,
    signIn,
    signUp,
    signOut,
  }
}
