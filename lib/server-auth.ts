import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { User } from '@/lib/auth'

/**
 * Server-side utility to get the current user
 * Returns null if not authenticated
 */
export async function getUser(): Promise<User | null> {
  return await getCurrentUser()
}

/**
 * Server-side utility that requires authentication
 * Redirects to sign-in page if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }
  
  return user
}

/**
 * Server-side utility that redirects authenticated users
 * Useful for sign-in/sign-up pages
 */
export async function redirectIfAuthenticated(redirectTo: string = '/dashboard'): Promise<void> {
  const user = await getCurrentUser()
  
  if (user) {
    redirect(redirectTo)
  }
}

/**
 * Server-side utility to check if user has specific plan
 */
export async function requirePlan(requiredPlan: 'pro' | 'enterprise'): Promise<User> {
  const user = await requireAuth()
  
  const planLevels = { free: 0, pro: 1, enterprise: 2 }
  const userLevel = planLevels[user.plan]
  const requiredLevel = planLevels[requiredPlan]
  
  if (userLevel < requiredLevel) {
    redirect('/dashboard?upgrade=true')
  }
  
  return user
}
