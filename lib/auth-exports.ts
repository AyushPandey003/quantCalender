// Server Actions
export {
  signInAction,
  signUpAction,
  signOutAction,
  getCurrentUserAction,
  signIn,
  signUp,
  signOut,
  type AuthState,
} from './actions/auth'

// Server-side utilities
export {
  getUser,
  requireAuth,
  redirectIfAuthenticated,
  requirePlan,
} from './server-auth'

// Client components
export { SignInForm } from '../components/auth/sign-in-form'
export { SignUpForm } from '../components/auth/sign-up-form'
export { SignOutButton } from '../components/auth/sign-out-button'
export { ProtectedRoute } from '../components/auth/protected-route'
export { AuthProvider, useAuthContext } from '../components/auth/auth-provider'

// Types
export type { User } from './auth'
export type { Session } from './client-session'
