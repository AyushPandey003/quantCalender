import { useQuery } from "@tanstack/react-query"
import type { MarketData } from "@/features/calendar/types"
import { useTokenMetricsWebSocket } from "./use-tokenmetrics-websocket"

interface UseMarketDataParams {
  symbol: string
  startDate: string
  endDate: string
  metric: string
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

// Generate historical mock data for calendar view
const generateHistoricalData = (params: UseMarketDataParams): MarketData[] => {
  const { startDate, endDate } = params
  const start = new Date(startDate)
  const end = new Date(endDate)
  const data: MarketData[] = []

  const current = new Date(start)
  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0]

    // Generate realistic mock historical data
    const basePrice = 45000 + Math.random() * 10000
    const volatility = Math.random() * 5 + 1 // 1-6%
    const volume = Math.random() * 1000000000 + 100000000 // 100M-1B
    const performance = (Math.random() - 0.5) * 10 // -5% to +5%

    data.push({
      date: dateStr,
      volatility,
      liquidity: volume,
      performance,
      volume,
      open: basePrice,
      high: basePrice * (1 + Math.random() * 0.05),
      low: basePrice * (1 - Math.random() * 0.05),
      close: basePrice * (1 + (Math.random() - 0.5) * 0.02),
    })

    current.setDate(current.getDate() + 1)
  }

  return data
}

export function useMarketData(params: UseMarketDataParams) {
  const tokenSlug = symbolToTokenSlug(params.symbol)

  // Subscribe to real-time data for current price updates
  const { data: liveData, isConnected } = useTokenMetricsWebSocket([tokenSlug])

  return useQuery({
    queryKey: ["marketData", params.symbol, params.startDate, params.endDate, params.metric],
    queryFn: () => {
      const historicalData = generateHistoricalData(params)

      // If we have live data, update the most recent day with real-time info
      if (liveData && liveData[tokenSlug]) {
        const livePrice = liveData[tokenSlug]
        const today = new Date().toISOString().split("T")[0]

        // Find today's data or add it
        const todayIndex = historicalData.findIndex((d) => d.date === today)
        if (todayIndex >= 0) {
          // Update existing today's data with live price
          historicalData[todayIndex] = {
            ...historicalData[todayIndex],
            close: livePrice.price_in_usd,
            volume: livePrice.volume || historicalData[todayIndex].volume,
          }
        } else {
          // Add today's data
          historicalData.push({
            date: today,
            volatility: Math.random() * 5 + 1,
            liquidity: livePrice.volume || 1000000000,
            performance: (Math.random() - 0.5) * 10,
            volume: livePrice.volume || 1000000000,
            open: livePrice.price_in_usd,
            high: livePrice.price_in_usd * 1.02,
            low: livePrice.price_in_usd * 0.98,
            close: livePrice.price_in_usd,
          })
        }
      }

      return historicalData
    },
    staleTime: 30_000, // 30 seconds
    cacheTime: 360_000, // 6 minutes
    refetchInterval: isConnected ? 60_000 : 300_000, // 1 min if connected, 5 min if not
  })
}
