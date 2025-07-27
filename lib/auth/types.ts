export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  plan: "free" | "pro" | "enterprise"
  createdAt: string
  lastLoginAt: string
}

export interface JWTPayload {
  userId: string
  email: string
  iat: number
  exp: number
}

export interface AuthResult {
  success: boolean
  message?: string
  user?: User
  error?: string
}

export interface AuthState {
  success: boolean
  user?: User
  error?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  name: string
}

export interface RefreshTokenPayload {
  userId: string
  tokenId: string
  iat: number
  exp: number
} 