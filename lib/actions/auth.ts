'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { authenticateUser, createUser, generateToken, setAuthCookie, clearAuthCookie, getCurrentUser } from '@/lib/auth'
import type { User } from '@/lib/auth'

// Define the state type for form actions
export interface AuthState {
  success: boolean
  error?: string
  user?: User
}

// Sign in server action
export async function signInAction(
  prevState: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
      }
    }

    // Authenticate user
    const user = await authenticateUser(email, password)
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password',
      }
    }

    // Generate token and set cookie
    const token = await generateToken(user)
    await setAuthCookie(token)

    // Revalidate any pages that depend on auth state
    revalidatePath('/', 'layout')

    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error('Sign in error:', error)
    return {
      success: false,
      error: 'Sign in failed',
    }
  }
}

// Sign up server action
export async function signUpAction(
  prevState: AuthState | undefined,
  formData: FormData
): Promise<AuthState> {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    if (!email || !password || !name) {
      return {
        success: false,
        error: 'Email, password, and name are required',
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Invalid email format',
      }
    }

    // Basic password validation
    if (password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long',
      }
    }

    const user = await createUser(email, password, name)

    if (!user) {
      return {
        success: false,
        error: 'User already exists',
      }
    }

    const token = await generateToken(user)
    await setAuthCookie(token)

    // Revalidate any pages that depend on auth state
    revalidatePath('/', 'layout')

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        plan: user.plan,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
    }
  } catch (error) {
    console.error('Sign up error:', error)
    return {
      success: false,
      error: 'Internal server error',
    }
  }
}

// Sign out server action
export async function signOutAction(): Promise<AuthState> {
  try {
    await clearAuthCookie()
    
    // Revalidate any pages that depend on auth state
    revalidatePath('/', 'layout')
    
    return {
      success: true,
    }
  } catch (error) {
    console.error('Sign out error:', error)
    return {
      success: false,
      error: 'Internal server error',
    }
  }
}

// Get current user server action (for client components that need user data)
export async function getCurrentUserAction(): Promise<{ user: User | null; error?: string }> {
  try {
    const user = await getCurrentUser()
    return { user }
  } catch (error) {
    console.error('Get user error:', error)
    return { user: null, error: 'Failed to get user' }
  }
}

// Direct sign in function for use with custom forms
export async function signIn(email: string, password: string): Promise<AuthState> {
  try {
    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required',
      }
    }

    const user = await authenticateUser(email, password)
    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password',
      }
    }

    const token = await generateToken(user)
    await setAuthCookie(token)

    revalidatePath('/', 'layout')

    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error('Sign in error:', error)
    return {
      success: false,
      error: 'Sign in failed',
    }
  }
}

// Direct sign up function for use with custom forms
export async function signUp(email: string, password: string, name: string): Promise<AuthState> {
  try {
    if (!email || !password || !name) {
      return {
        success: false,
        error: 'Email, password, and name are required',
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: 'Invalid email format',
      }
    }

    if (password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long',
      }
    }

    const user = await createUser(email, password, name)

    if (!user) {
      return {
        success: false,
        error: 'User already exists',
      }
    }

    const token = await generateToken(user)
    await setAuthCookie(token)

    revalidatePath('/', 'layout')

    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error('Sign up error:', error)
    return {
      success: false,
      error: 'Internal server error',
    }
  }
}

// Direct sign out function
export async function signOut(): Promise<void> {
  try {
    await clearAuthCookie()
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}
