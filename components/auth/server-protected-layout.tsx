import { requireAuth } from '@/lib/server-auth'
import type { ReactNode } from 'react'

interface ServerProtectedLayoutProps {
  children: ReactNode
}

/**
 * Server-side protected layout that requires authentication
 * Automatically redirects to sign-in page if not authenticated
 */
export default async function ServerProtectedLayout({ children }: ServerProtectedLayoutProps) {
  // This will redirect to /sign-in if not authenticated
  await requireAuth()
  
  return <>{children}</>
}
