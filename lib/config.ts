export const config = {
  tokenMetrics: {
    wsUrl: "wss://price.data-service.tokenmetrics.com",
    apiKey: process.env.NEXT_PUBLIC_TOKENMETRICS_API_KEY || "",
  },
  websocket: {
    reconnectAttempts: 5,
    reconnectDelay: 1000,
    maxReconnectDelay: 30000,
  },
  api: {
    staleTime: 30_000, // 30 seconds
    cacheTime: 360_000, // 6 minutes
  },
}

// Validate configuration
export const validateConfig = () => {
  if (!config.tokenMetrics.apiKey) {
    console.warn("TokenMetrics API key not found. Please set NEXT_PUBLIC_TOKENMETRICS_API_KEY environment variable.")
    return false
  }
  return true
}
