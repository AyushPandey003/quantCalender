"use client"

import type React from "react"
import { createContext, useContext, useCallback, useState, useEffect } from "react"
import { usePriceStream, type TokenPriceData } from "../../hooks/use-price-stream"
import type { ConnectionState } from "../../lib/websocket/price-stream"

interface MarketDataContextValue {
  // WebSocket connection management
  connectToSymbol: (symbol: string) => void
  disconnectFromSymbol: (symbol: string) => void
  connectionState: ConnectionState
  subscribedTokens: string[]
  
  // Real-time price data
  priceData: Record<string, TokenPriceData>
  getTokenPrice: (symbol: string) => TokenPriceData | undefined
  
  // Data transformation utilities
  normalizePrice: (price: number, symbol: string) => string
  formatVolume: (volume: number) => string
  calculatePercentageChange: (current: number, previous: number) => number
  
  // Batch operations
  subscribeToMultipleTokens: (tokens: string[]) => Promise<void>
  addTokenSubscriptions: (tokens: string[]) => Promise<void>
  removeTokenSubscriptions: (tokens: string[]) => Promise<void>
  
  // Connection management
  connect: () => Promise<void>
  disconnect: () => void
  clearData: () => void
}

const MarketDataContext = createContext<MarketDataContextValue | null>(null)

export function MarketDataProvider({ children }: { children: React.ReactNode }) {
  const [watchedTokens, setWatchedTokens] = useState<string[]>([])
  
  const {
    connectionState,
    subscribedTokens,
    priceData,
    connect,
    disconnect,
    subscribeToTokens,
    addTokens,
    removeTokens,
    clearPriceData
  } = usePriceStream({
    tokens: watchedTokens,
    autoConnect: true,
    onError: (error) => {
      console.error("Market data stream error:", error)
    },
    onConnectionChange: (state) => {
      console.log("Market data connection state:", state)
    }
  })

  const connectToSymbol = useCallback((symbol: string) => {
    const slug = symbol.toLowerCase()
    setWatchedTokens(prev => {
      if (!prev.includes(slug)) {
        return [...prev, slug]
      }
      return prev
    })
  }, [])

  const disconnectFromSymbol = useCallback((symbol: string) => {
    const slug = symbol.toLowerCase()
    setWatchedTokens(prev => prev.filter(token => token !== slug))
  }, [])

  const getTokenPrice = useCallback((symbol: string): TokenPriceData | undefined => {
    // Try to find by symbol first
    const bySymbol = Object.values(priceData).find(data => 
      data.token_symbol.toLowerCase() === symbol.toLowerCase()
    )
    if (bySymbol) return bySymbol

    // Try to find by CoinGecko ID
    const byCgId = Object.values(priceData).find(data => 
      data.cg_id === symbol.toLowerCase()
    )
    return byCgId
  }, [priceData])

  const subscribeToMultipleTokens = useCallback(async (tokens: string[]) => {
    const slugs = tokens.map(token => token.toLowerCase())
    setWatchedTokens(slugs)
    await subscribeToTokens(slugs)
  }, [subscribeToTokens])

  const addTokenSubscriptions = useCallback(async (tokens: string[]) => {
    const slugs = tokens.map(token => token.toLowerCase())
    setWatchedTokens(prev => {
      const newTokens = slugs.filter(slug => !prev.includes(slug))
      return newTokens.length > 0 ? [...prev, ...newTokens] : prev
    })
    await addTokens(slugs)
  }, [addTokens])

  const removeTokenSubscriptions = useCallback(async (tokens: string[]) => {
    const slugs = tokens.map(token => token.toLowerCase())
    setWatchedTokens(prev => prev.filter(token => !slugs.includes(token)))
    await removeTokens(slugs)
  }, [removeTokens])

  const normalizePrice = useCallback((price: number, symbol: string): string => {
    const decimals = symbol.includes("BTC") ? 2 : symbol.includes("ETH") ? 2 : 4
    return price.toFixed(decimals)
  }, [])

  const formatVolume = useCallback((volume: number): string => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(1)}B`
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(1)}M`
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(1)}K`
    }
    return volume.toFixed(0)
  }, [])

  const calculatePercentageChange = useCallback((current: number, previous: number): number => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }, [])

  const value: MarketDataContextValue = {
    connectToSymbol,
    disconnectFromSymbol,
    connectionState,
    subscribedTokens,
    priceData,
    getTokenPrice,
    normalizePrice,
    formatVolume,
    calculatePercentageChange,
    subscribeToMultipleTokens,
    addTokenSubscriptions,
    removeTokenSubscriptions,
    connect,
    disconnect,
    clearData: clearPriceData,
  }

  return <MarketDataContext.Provider value={value}>{children}</MarketDataContext.Provider>
}

export function useMarketDataContext() {
  const context = useContext(MarketDataContext)
  if (!context) {
    throw new Error("useMarketDataContext must be used within a MarketDataProvider")
  }
  return context
}
