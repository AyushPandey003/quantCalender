// Types
export type {
  User,
  JWTPayload,
  AuthResult,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  RefreshTokenPayload,
} from "./types"

// Core auth service
export {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  refreshAccessToken,
  getCurrentUserPayload,
  requireAuth,
  redirectIfAuthenticated,
} from "./auth-service"

// Server actions
export {
  signInAction,
  signUpAction,
  signOutAction,
  getCurrentUserAction,
  signInDirect,
  signUpDirect,
} from "./actions"

// User service
export {
  createUser,
  authenticateUser,
  getUserById,
  getUserByEmail,
  updateUserProfile,
} from "./user-service"

// JWT utilities
export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  isTokenExpired,
  getTokenExpiryTime,
} from "./jwt"

// Cookie utilities
export {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  getAccessTokenCookie,
  getRefreshTokenCookie,
  clearAuthCookies,
  clearAuthCookie,
  getAccessTokenFromRequest,
  getRefreshTokenFromRequest,
} from "./cookies" 