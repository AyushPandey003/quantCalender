export const config = {
  tokenMetrics: {
    wsUrl: "wss://price.data-service.tokenmetrics.com",
    apiKey: process.env.NEXT_PUBLIC_TOKENMETRICS_API_KEY || "",
    // Supported token slugs for reference
    supportedTokens: [
      "bitcoin", "ethereum", "solana", "cardano", "polygon", "chainlink",
      "avalanche", "polkadot", "litecoin", "uniswap", "aave", "cosmos",
      "algorand", "near", "fantom", "harmony", "theta", "elrond"
    ]
  },
  websocket: {
    reconnectAttempts: 5,
    reconnectDelay: 1000,
    maxReconnectDelay: 30000,
    heartbeatInterval: 30000, // 30 seconds
  },
  api: {
    staleTime: 30_000, // 30 seconds
    cacheTime: 360_000, // 6 minutes
    maxRetries: 3,
  },
  planLimits: {
    basic: { connections: 1, symbols: 15, messagesPerSec: 1 },
    advanced: { connections: 3, symbols: 60, messagesPerSec: 3 },
    premium: { connections: 6, symbols: 120, messagesPerSec: 8 },
    vip: { connections: 12, symbols: 250, messagesPerSec: 12 },
  }
}

// Validate configuration
export const validateConfig = () => {
  if (!config.tokenMetrics.apiKey) {
    console.warn("TokenMetrics API key not found. Please set NEXT_PUBLIC_TOKENMETRICS_API_KEY environment variable.")
    return false
  }
  return true
}
