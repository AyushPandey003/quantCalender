"use client"

import { useEffect } from "react"
import { useSession } from "../lib/client-session"

export function useAuth() {
  const session = useSession()

  useEffect(() => {
    // Refresh user data on mount
    session.refreshUser()
  }, [])

  return {
    user: session.user,
    isLoading: session.isLoading,
    isAuthenticated: session.isAuthenticated,
    signIn: session.signIn,
    signUp: session.signUp,
    signOut: session.signOut,
    refreshUser: session.refreshUser,
  }
}
