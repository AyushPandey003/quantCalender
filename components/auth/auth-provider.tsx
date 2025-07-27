"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useAuthClient } from "@/hooks/use-auth-client"
import type { User, LoginCredentials, RegisterCredentials, AuthResult } from "@/lib/auth/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  signIn: (credentials: LoginCredentials) => Promise<AuthResult>
  signUp: (credentials: RegisterCredentials) => Promise<AuthResult>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthClient()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}
