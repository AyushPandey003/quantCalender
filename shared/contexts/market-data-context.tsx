"use client"

import type React from "react"
import { createContext, useContext, useCallback } from "react"

interface MarketDataContextValue {
  // WebSocket connection management
  connectToSymbol: (symbol: string) => void
  disconnectFromSymbol: (symbol: string) => void

  // Data transformation utilities
  normalizePrice: (price: number, symbol: string) => string
  formatVolume: (volume: number) => string
  calculatePercentageChange: (current: number, previous: number) => number
}

const MarketDataContext = createContext<MarketDataContextValue | null>(null)

export function MarketDataProvider({ children }: { children: React.ReactNode }) {
  const connectToSymbol = useCallback((symbol: string) => {
    // WebSocket connection logic would go here
    console.log(`Connecting to ${symbol} data stream`)
  }, [])

  const disconnectFromSymbol = useCallback((symbol: string) => {
    // WebSocket disconnection logic would go here
    console.log(`Disconnecting from ${symbol} data stream`)
  }, [])

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
    normalizePrice,
    formatVolume,
    calculatePercentageChange,
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
