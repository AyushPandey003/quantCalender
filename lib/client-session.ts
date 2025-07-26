"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { signInAction, signUpAction, signOutAction, getCurrentUserAction } from "./actions/auth-actions"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  plan: string
}

interface SessionState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; message: string }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const result = await signInAction(email, password)
          if (result.success && result.user) {
            set({
              user: result.user,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            set({ isLoading: false })
          }
          return { success: result.success, message: result.message }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, message: "An error occurred during sign in" }
        }
      },

      signUp: async (email: string, password: string, name: string) => {
        set({ isLoading: true })
        try {
          const result = await signUpAction(email, password, name)
          if (result.success && result.user) {
            set({
              user: result.user,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            set({ isLoading: false })
          }
          return { success: result.success, message: result.message }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, message: "An error occurred during sign up" }
        }
      },

      signOut: async () => {
        set({ isLoading: true })
        try {
          await signOutAction()
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        } catch (error) {
          console.error("Sign out error:", error)
          set({ isLoading: false })
        }
      },

      refreshUser: async () => {
        set({ isLoading: true })
        try {
          const user = await getCurrentUserAction()
          set({
            user: user
              ? {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  avatar: user.avatar,
                  plan: user.plan,
                }
              : null,
            isAuthenticated: !!user,
            isLoading: false,
          })
        } catch (error) {
          console.error("Refresh user error:", error)
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        })
      },
    }),
    {
      name: "session-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
