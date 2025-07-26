/**
 * Token utilities for TokenMetrics API
 * Provides token validation, normalization, and metadata
 */

import { config } from "../config"

export interface TokenInfo {
  slug: string
  symbol: string
  name: string
  category?: string
}

/**
 * Common cryptocurrency tokens with their TokenMetrics slugs
 */
export const POPULAR_TOKENS: TokenInfo[] = [
  { slug: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { slug: "ethereum", symbol: "ETH", name: "Ethereum" },
  { slug: "solana", symbol: "SOL", name: "Solana" },
  { slug: "cardano", symbol: "ADA", name: "Cardano" },
  { slug: "polygon", symbol: "MATIC", name: "Polygon" },
  { slug: "chainlink", symbol: "LINK", name: "Chainlink" },
  { slug: "avalanche", symbol: "AVAX", name: "Avalanche" },
  { slug: "polkadot", symbol: "DOT", name: "Polkadot" },
  { slug: "litecoin", symbol: "LTC", name: "Litecoin" },
  { slug: "uniswap", symbol: "UNI", name: "Uniswap" },
  { slug: "aave", symbol: "AAVE", name: "Aave" },
  { slug: "cosmos", symbol: "ATOM", name: "Cosmos" },
  { slug: "algorand", symbol: "ALGO", name: "Algorand" },
  { slug: "near", symbol: "NEAR", name: "NEAR Protocol" },
  { slug: "fantom", symbol: "FTM", name: "Fantom" },
  { slug: "harmony", symbol: "ONE", name: "Harmony" },
  { slug: "theta", symbol: "THETA", name: "Theta Network" },
  { slug: "elrond", symbol: "EGLD", name: "MultiversX" },
]

/**
 * Normalize token input to a valid slug
 */
export function normalizeTokenSlug(input: string): string {
  const normalized = input.toLowerCase().trim()
  
  // Check if input is already a valid slug
  if (isValidTokenSlug(normalized)) {
    return normalized
  }
  
  // Try to find by symbol
  const bySymbol = POPULAR_TOKENS.find(token => 
    token.symbol.toLowerCase() === normalized
  )
  if (bySymbol) {
    return bySymbol.slug
  }
  
  // Return normalized input (might still be valid for less common tokens)
  return normalized
}

/**
 * Check if a token slug is supported
 */
export function isValidTokenSlug(slug: string): boolean {
  return config.tokenMetrics.supportedTokens.includes(slug.toLowerCase())
}

/**
 * Get token info by slug or symbol
 */
export function getTokenInfo(slugOrSymbol: string): TokenInfo | undefined {
  const normalized = slugOrSymbol.toLowerCase()
  
  // Try by slug first
  let token = POPULAR_TOKENS.find(t => t.slug === normalized)
  if (token) return token
  
  // Try by symbol
  token = POPULAR_TOKENS.find(t => t.symbol.toLowerCase() === normalized)
  if (token) return token
  
  return undefined
}

/**
 * Get suggested tokens based on partial input
 */
export function getSuggestedTokens(input: string, limit = 10): TokenInfo[] {
  if (!input.trim()) {
    return POPULAR_TOKENS.slice(0, limit)
  }
  
  const normalized = input.toLowerCase()
  
  const matches = POPULAR_TOKENS.filter(token =>
    token.slug.includes(normalized) ||
    token.symbol.toLowerCase().includes(normalized) ||
    token.name.toLowerCase().includes(normalized)
  )
  
  return matches.slice(0, limit)
}

/**
 * Validate token list against plan limits
 */
export function validateTokenList(tokens: string[], planType: keyof typeof config.planLimits = "basic"): {
  isValid: boolean
  maxAllowed: number
  excess: number
} {
  const limits = config.planLimits[planType]
  const maxAllowed = limits.symbols
  const excess = Math.max(0, tokens.length - maxAllowed)
  
  return {
    isValid: tokens.length <= maxAllowed,
    maxAllowed,
    excess
  }
}

/**
 * Format token display name
 */
export function formatTokenDisplayName(token: TokenInfo): string {
  return `${token.name} (${token.symbol})`
}

/**
 * Check if API key is configured
 */
export function isApiKeyConfigured(): boolean {
  return !!config.tokenMetrics.apiKey && config.tokenMetrics.apiKey !== ""
}

/**
 * Get plan type based on token count (for display purposes)
 */
export function getRecommendedPlan(tokenCount: number): keyof typeof config.planLimits {
  if (tokenCount <= config.planLimits.basic.symbols) return "basic"
  if (tokenCount <= config.planLimits.advanced.symbols) return "advanced"
  if (tokenCount <= config.planLimits.premium.symbols) return "premium"
  return "vip"
}

/**
 * Parse token list from string input
 */
export function parseTokenList(input: string): string[] {
  return input
    .split(/[,\s]+/)
    .map(token => normalizeTokenSlug(token))
    .filter(token => token.length > 0)
    .filter((token, index, arr) => arr.indexOf(token) === index) // Remove duplicates
}

/**
 * Create WebSocket subscription message
 */
export function createSubscriptionMessage(tokens: string[], append = false) {
  return {
    is_append: append ? 1 : 0,
    tokens: tokens.map(normalizeTokenSlug)
  }
}
