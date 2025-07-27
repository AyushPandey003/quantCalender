"use client"

import { useEffect, useState, useCallback } from "react"
import { 
  signInDirect, 
  signUpDirect, 
  signOutAction, 
  getCurrentUserAction 
} from "@/lib/auth/actions"
import type { User, LoginCredentials, RegisterCredentials, AuthResult } from "@/lib/auth/types"

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

interface AuthActions {
  signIn: (credentials: LoginCredentials) => Promise<AuthResult>
  signUp: (credentials: RegisterCredentials) => Promise<AuthResult>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

export function useAuthClient(): AuthState & AuthActions {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
  })

  const refreshUser = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const { user } = await getCurrentUserAction()
      
      setState({
        user,
        isLoading: false,
        error: null,
        isAuthenticated: !!user,
      })
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to refresh user",
        isAuthenticated: false,
      })
    }
  }, [])

  const signIn = useCallback(async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const result = await signInDirect(credentials)
      
      if (result.success && result.user) {
        setState({
          user: result.user,
          isLoading: false,
          error: null,
          isAuthenticated: true,
        })
      } else {
        setState({
          user: null,
          isLoading: false,
          error: result.error || "Sign in failed",
          isAuthenticated: false,
        })
      }
      
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sign in failed"
      setState({
        user: null,
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      })
      return {
        success: false,
        error: errorMessage,
      }
    }
  }, [])

  const signUp = useCallback(async (credentials: RegisterCredentials): Promise<AuthResult> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const result = await signUpDirect(credentials)
      
      if (result.success && result.user) {
        setState({
          user: result.user,
          isLoading: false,
          error: null,
          isAuthenticated: true,
        })
      } else {
        setState({
          user: null,
          isLoading: false,
          error: result.error || "Sign up failed",
          isAuthenticated: false,
        })
      }
      
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sign up failed"
      setState({
        user: null,
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      })
      return {
        success: false,
        error: errorMessage,
      }
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await signOutAction()
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setState({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      })
    }
  }, [])

  // Initialize auth state on mount
  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  return {
    ...state,
    signIn,
    signUp,
    signOut,
    refreshUser,
  }
} 