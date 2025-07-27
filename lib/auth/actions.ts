"use server"

import { signIn, signUp, signOut, getCurrentUser } from "./auth-service"
import type { LoginCredentials, RegisterCredentials, AuthResult, User } from "./types"

/**
 * Server action for sign in form
 */
export async function signInAction(
  prevState: AuthResult | undefined,
  formData: FormData
): Promise<AuthResult> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  return signIn({ email, password })
}

/**
 * Server action for sign up form
 */
export async function signUpAction(
  prevState: AuthResult | undefined,
  formData: FormData
): Promise<AuthResult> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  return signUp({ email, password, name })
}

/**
 * Server action for sign out
 */
export async function signOutAction(): Promise<AuthResult> {
  return signOut()
}

/**
 * Server action to get current user
 */
export async function getCurrentUserAction(): Promise<{ user: User | null }> {
  const user = await getCurrentUser()
  return { user }
}

/**
 * Direct sign in function for programmatic use
 */
export async function signInDirect(credentials: LoginCredentials): Promise<AuthResult> {
  return signIn(credentials)
}

/**
 * Direct sign up function for programmatic use
 */
export async function signUpDirect(credentials: RegisterCredentials): Promise<AuthResult> {
  return signUp(credentials)
} 