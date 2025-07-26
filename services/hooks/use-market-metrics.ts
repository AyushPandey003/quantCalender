import { useQuery } from "@tanstack/react-query"
import { useTokenMetricsWebSocket } from "./use-tokenmetrics-websocket"

interface MarketMetrics {
  currentPrice: number
  priceChange24h: number
  volatility24h: number
  volatilityChange: number
  volume24h: number
  volumeChange: number
  liquidityScore: number
  liquidityChange: number
  lastUpdate: string
}

// Convert symbol format (BTCUSDT -> bitcoin)
const symbolToTokenSlug = (symbol: string): string => {
  const mapping: Record<string, string> = {
    BTCUSDT: "bitcoin",
    ETHUSDT: "ethereum",
    ADAUSDT: "cardano",
    DOTUSDT: "polkadot",
    LINKUSDT: "chainlink",
    SOLUSDT: "solana",
    MATICUSDT: "polygon",
    AVAXUSDT: "avalanche-2",
    UNIUSDT: "uniswap",
    LTCUSDT: "litecoin",
  }
  return mapping[symbol] || "bitcoin"
}

const generateMockMetrics = (symbol: string): MarketMetrics => {
  const basePrice = symbol === "BTCUSDT" ? 45000 : symbol === "ETHUSDT" ? 3000 : 1000

  return {
    currentPrice: basePrice + (Math.random() - 0.5) * basePrice * 0.1,
    priceChange24h: (Math.random() - 0.5) * 10,
    volatility24h: Math.random() * 5 + 1,
    volatilityChange: (Math.random() - 0.5) * 2,
    volume24h: Math.random() * 1000000000 + 100000000,
    volumeChange: (Math.random() - 0.5) * 20,
    liquidityScore: Math.random() * 10 + 5,
    liquidityChange: (Math.random() - 0.5) * 5,
    lastUpdate: new Date().toISOString(),
  }
}

export function useMarketMetrics(symbol: string) {
  const tokenSlug = symbolToTokenSlug(symbol)
  const { data: liveData, isConnected, lastUpdate } = useTokenMetricsWebSocket([tokenSlug])

  return useQuery({
    queryKey: ["marketMetrics", symbol, lastUpdate],
    queryFn: () => {
      const mockMetrics = generateMockMetrics(symbol)

      // If we have live data, use real price and volume
      if (liveData && liveData[tokenSlug]) {
        const livePrice = liveData[tokenSlug]

        return {
          ...mockMetrics,
          currentPrice: livePrice.price_in_usd,
          volume24h: livePrice.volume || mockMetrics.volume24h,
          lastUpdate: livePrice.timestamp,
        }
      }

      return mockMetrics
    },
    staleTime: isConnected ? 5_000 : 30_000, // 5s if connected, 30s if not
    cacheTime: 360_000,
    refetchInterval: isConnected ? 10_000 : 30_000, // 10s if connected, 30s if not
  })
}
