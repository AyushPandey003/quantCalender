import { revalidatePath } from "next/cache"
import type { NextRequest } from "next/server"
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyAccessToken, 
  verifyRefreshToken 
} from "./jwt"
import { 
  setAccessTokenCookie, 
  setRefreshTokenCookie, 
  getAccessTokenCookie, 
  getRefreshTokenCookie,
  clearAuthCookies,
  getAccessTokenFromRequest,
  getRefreshTokenFromRequest
} from "./cookies"
import { 
  createUser, 
  authenticateUser, 
  getUserById 
} from "./user-service"
import type { 
  User, 
  AuthResult, 
  LoginCredentials, 
  RegisterCredentials,
  JWTPayload 
} from "./types"

/**
 * Sign in user with email and password
 */
export async function signIn(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    if (!credentials.email || !credentials.password) {
      return {
        success: false,
        error: "Email and password are required",
      }
    }

    // Authenticate user
    const user = await authenticateUser(credentials)
    if (!user) {
      return {
        success: false,
        error: "Invalid email or password",
      }
    }

    // Generate tokens
    const accessToken = await generateAccessToken(user)
    const { token: refreshToken } = await generateRefreshToken(user)

    // Set cookies
    await setAccessTokenCookie(accessToken)
    await setRefreshTokenCookie(refreshToken)

    // Revalidate pages
    revalidatePath("/", "layout")

    return {
      success: true,
      message: "Signed in successfully",
      user,
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return {
      success: false,
      error: "An error occurred during sign in",
    }
  }
}

/**
 * Sign up new user
 */
export async function signUp(credentials: RegisterCredentials): Promise<AuthResult> {
  try {
    if (!credentials.email || !credentials.password || !credentials.name) {
      return {
        success: false,
        error: "Email, password, and name are required",
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(credentials.email)) {
      return {
        success: false,
        error: "Invalid email format",
      }
    }

    // Basic password validation
    if (credentials.password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters long",
      }
    }

    // Create user
    const user = await createUser(credentials)
    if (!user) {
      return {
        success: false,
        error: "User already exists",
      }
    }

    // Generate tokens
    const accessToken = await generateAccessToken(user)
    const { token: refreshToken } = await generateRefreshToken(user)

    // Set cookies
    await setAccessTokenCookie(accessToken)
    await setRefreshTokenCookie(refreshToken)

    // Revalidate pages
    revalidatePath("/", "layout")

    return {
      success: true,
      message: "Account created successfully",
      user,
    }
  } catch (error) {
    console.error("Sign up error:", error)
    return {
      success: false,
      error: "An error occurred during sign up",
    }
  }
}

/**
 * Sign out user
 */
export async function signOut(): Promise<AuthResult> {
  try {
    // Clear auth cookies
    await clearAuthCookies()

    // Revalidate pages
    revalidatePath("/", "layout")

    return {
      success: true,
      message: "Signed out successfully",
    }
  } catch (error) {
    console.error("Sign out error:", error)
    return {
      success: false,
      error: "An error occurred during sign out",
    }
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(request?: NextRequest): Promise<User | null> {
  try {
    let accessToken: string | undefined

    if (request) {
      // For middleware/API routes
      accessToken = getAccessTokenFromRequest(request)
    } else {
      // For server components
      accessToken = await getAccessTokenCookie()
    }

    if (!accessToken) {
      return null
    }

    // Verify access token
    const payload = await verifyAccessToken(accessToken)
    if (!payload) {
      return null
    }

    // Get user from database
    const user = await getUserById(payload.userId)
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<AuthResult> {
  try {
    const refreshToken = await getRefreshTokenCookie()
    if (!refreshToken) {
      return {
        success: false,
        error: "No refresh token found",
      }
    }

    // Verify refresh token
    const payload = await verifyRefreshToken(refreshToken)
    if (!payload) {
      // Clear invalid tokens
      await clearAuthCookies()
      return {
        success: false,
        error: "Invalid refresh token",
      }
    }

    // Get user from database
    const user = await getUserById(payload.userId)
    if (!user) {
      await clearAuthCookies()
      return {
        success: false,
        error: "User not found",
      }
    }

    // Generate new access token
    const newAccessToken = await generateAccessToken(user)

    // Set new access token cookie
    await setAccessTokenCookie(newAccessToken)

    return {
      success: true,
      message: "Token refreshed successfully",
      user,
    }
  } catch (error) {
    console.error("Token refresh error:", error)
    await clearAuthCookies()
    return {
      success: false,
      error: "Failed to refresh token",
    }
  }
}

/**
 * Get user payload from request (for server-side use)
 */
export async function getCurrentUserPayload(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const accessToken = getAccessTokenFromRequest(request)
    if (!accessToken) {
      return null
    }

    return await verifyAccessToken(accessToken)
  } catch (error) {
    console.error("Error getting user payload:", error)
    return null
  }
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

/**
 * Redirect if authenticated
 */
export async function redirectIfAuthenticated(redirectTo: string = "/dashboard"): Promise<void> {
  const user = await getCurrentUser()
  if (user) {
    throw new Error(`Redirect to ${redirectTo}`)
  }
} 