import { useQuery } from "@tanstack/react-query"
import { useTokenMetricsWebSocket } from "./use-tokenmetrics-websocket"

interface OrderBookEntry {
  price: number
  quantity: number
}

interface OrderBook {
  symbol: string
  timestamp: number
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
  spread: number
  lastPrice?: number
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

const generateMockOrderBook = (symbol: string, currentPrice?: number): OrderBook => {
  const basePrice = currentPrice || (symbol === "BTCUSDT" ? 45000 : symbol === "ETHUSDT" ? 3000 : 1000)

  const bids: OrderBookEntry[] = []
  const asks: OrderBookEntry[] = []

  // Generate bids (buy orders) - decreasing prices
  for (let i = 0; i < 10; i++) {
    bids.push({
      price: basePrice - (i + 1) * (basePrice * 0.001),
      quantity: Math.random() * 10 + 0.1,
    })
  }

  // Generate asks (sell orders) - increasing prices
  for (let i = 0; i < 10; i++) {
    asks.push({
      price: basePrice + (i + 1) * (basePrice * 0.001),
      quantity: Math.random() * 10 + 0.1,
    })
  }

  const sortedBids = bids.sort((a, b) => b.price - a.price) // Highest bid first
  const sortedAsks = asks.sort((a, b) => a.price - b.price) // Lowest ask first

  return {
    symbol,
    timestamp: Date.now(),
    bids: sortedBids,
    asks: sortedAsks,
    spread: sortedAsks[0].price - sortedBids[0].price,
    lastPrice: currentPrice,
  }
}

export function useOrderBook(symbol: string) {
  const tokenSlug = symbolToTokenSlug(symbol)
  const { data: liveData, isConnected, lastUpdate } = useTokenMetricsWebSocket([tokenSlug])

  return useQuery({
    queryKey: ["orderBook", symbol, lastUpdate],
    queryFn: () => {
      const currentPrice = liveData?.[tokenSlug]?.price_in_usd
      return generateMockOrderBook(symbol, currentPrice)
    },
    staleTime: isConnected ? 2_000 : 5_000, // 2s if connected, 5s if not
    refetchInterval: isConnected ? 3_000 : 5_000, // 3s if connected, 5s if not
  })
}
