// Server-side auth exports
export {
  getCurrentUser,
  authenticateUser,
  createUser,
  generateToken,
  setAuthCookie,
  clearAuthCookie,
  verifyToken,
  type User,
  type JWTPayload,
} from './auth'

// Server actions exports
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

// Server-side utilities exports
export {
  getUser,
  requireAuth,
  redirectIfAuthenticated,
  requirePlan,
} from './server-auth'

// Client-side exports
export { SessionManager, type Session } from './client-session'
