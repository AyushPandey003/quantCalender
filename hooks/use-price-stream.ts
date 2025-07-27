/**
 * React hook for managing TokenMetrics WebSocket price streams
 * Provides real-time price data with automatic reconnection and error handling
 */

import { useEffect, useCallback, useRef, useState } from "react"
import { getPriceStream, type TokenPriceData, type ConnectionState } from "../lib/websocket/price-stream"

// Re-export types for convenience
export type { TokenPriceData, ConnectionState } from "../lib/websocket/price-stream"

export interface UsePriceStreamOptions {
  /**
   * Array of token slugs to subscribe to (e.g., ["bitcoin", "ethereum"])
   */
  tokens?: string[]
  
  /**
   * Whether to automatically connect when the hook mounts
   * @default true
   */
  autoConnect?: boolean
  
  /**
   * Whether to automatically disconnect when the hook unmounts
   * @default true
   */
  autoDisconnect?: boolean
  
  /**
   * Callback fired when price data is received
   */
  onPriceUpdate?: (data: TokenPriceData) => void
  
  /**
   * Callback fired when connection state changes
   */
  onConnectionChange?: (state: ConnectionState) => void
  
  /**
   * Callback fired when an error occurs
   */
  onError?: (error: Error) => void
}

export interface UsePriceStreamReturn {
  /**
   * Current connection state
   */
  connectionState: ConnectionState
  
  /**
   * Currently subscribed tokens
   */
  subscribedTokens: string[]
  
  /**
   * Latest price data indexed by token symbol
   */
  priceData: Record<string, TokenPriceData>
  
  /**
   * Connect to the WebSocket
   */
  connect: () => Promise<void>
  
  /**
   * Disconnect from the WebSocket
   */
  disconnect: () => void
  
  /**
   * Subscribe to new tokens (replaces current subscription)
   */
  subscribeToTokens: (tokens: string[]) => Promise<void>
  
  /**
   * Add tokens to current subscription
   */
  addTokens: (tokens: string[]) => Promise<void>
  
  /**
   * Remove tokens from current subscription
   */
  removeTokens: (tokens: string[]) => Promise<void>
  
  /**
   * Whether the hook is currently mounted
   */
  isConnected: boolean
  
  /**
   * Clear all price data
   */
  clearPriceData: () => void
}

export function usePriceStream(options: UsePriceStreamOptions = {}): UsePriceStreamReturn {
  const {
    tokens = [],
    autoConnect = true,
    autoDisconnect = true,
    onPriceUpdate,
    onConnectionChange,
    onError
  } = options

  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected")
  const [subscribedTokens, setSubscribedTokens] = useState<string[]>([])
  const [priceData, setPriceData] = useState<Record<string, TokenPriceData>>({})
  
  const priceStreamRef = useRef(getPriceStream())
  const isMountedRef = useRef(true)
  const callbacksRef = useRef({ onPriceUpdate, onConnectionChange, onError })

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = { onPriceUpdate, onConnectionChange, onError }
  }, [onPriceUpdate, onConnectionChange, onError])

  // Handle price updates
  const handlePriceUpdate = useCallback((data: TokenPriceData) => {
    if (!isMountedRef.current) return
    
    setPriceData(prev => ({
      ...prev,
      [data.token_symbol]: data
    }))
    
    callbacksRef.current.onPriceUpdate?.(data)
  }, [])

  // Handle connection state changes
  const handleConnectionChange = useCallback((state: ConnectionState) => {
    if (!isMountedRef.current) return
    
    setConnectionState(state)
    callbacksRef.current.onConnectionChange?.(state)
  }, [])

  // Handle errors
  const handleError = useCallback((error: Error) => {
    if (!isMountedRef.current) return
    
    console.error("Price stream error:", error)
    callbacksRef.current.onError?.(error)
  }, [])

  // Handle subscription updates
  const handleSubscriptionUpdate = useCallback((tokens: string[]) => {
    if (!isMountedRef.current) return
    
    setSubscribedTokens(tokens)
  }, [])

  // Connect function
  const connect = useCallback(async () => {
    try {
      await priceStreamRef.current.connect()
    } catch (error) {
      handleError(error as Error)
    }
  }, [handleError])

  // Disconnect function
  const disconnect = useCallback(() => {
    priceStreamRef.current.disconnect()
  }, [])

  // Subscribe to tokens function
  const subscribeToTokens = useCallback(async (tokens: string[]) => {
    try {
      await priceStreamRef.current.subscribeToTokens(tokens)
    } catch (error) {
      handleError(error as Error)
    }
  }, [handleError])

  // Add tokens function
  const addTokens = useCallback(async (tokens: string[]) => {
    try {
      await priceStreamRef.current.addTokens(tokens)
    } catch (error) {
      handleError(error as Error)
    }
  }, [handleError])

  // Remove tokens function
  const removeTokens = useCallback(async (tokens: string[]) => {
    try {
      await priceStreamRef.current.removeTokens(tokens)
    } catch (error) {
      handleError(error as Error)
    }
  }, [handleError])

  // Clear price data function
  const clearPriceData = useCallback(() => {
    setPriceData({})
  }, [])

  // Setup event handlers
  useEffect(() => {
    const stream = priceStreamRef.current

    stream.on("onPriceUpdate", handlePriceUpdate)
    stream.on("onConnectionChange", handleConnectionChange)
    stream.on("onError", handleError)
    stream.on("onSubscriptionUpdate", handleSubscriptionUpdate)

    return () => {
      stream.off("onPriceUpdate")
      stream.off("onConnectionChange")
      stream.off("onError")
      stream.off("onSubscriptionUpdate")
    }
  }, [handlePriceUpdate, handleConnectionChange, handleError, handleSubscriptionUpdate])

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      isMountedRef.current = false
      if (autoDisconnect) {
        disconnect()
      }
    }
  }, [autoConnect, autoDisconnect, connect, disconnect])

  // Auto-subscribe to initial tokens
  useEffect(() => {
    if (tokens.length > 0 && connectionState === "connected") {
      subscribeToTokens(tokens)
    }
  }, [tokens, connectionState, subscribeToTokens])

  // Update mounted ref on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  return {
    connectionState,
    subscribedTokens,
    priceData,
    connect,
    disconnect,
    subscribeToTokens,
    addTokens,
    removeTokens,
    isConnected: connectionState === "connected",
    clearPriceData
  }
}

/**
 * Hook for subscribing to a single token's price data
 */
export function useTokenPrice(tokenSlug: string) {
  const { priceData, connectionState, ...rest } = usePriceStream({
    tokens: tokenSlug ? [tokenSlug] : [],
    autoConnect: !!tokenSlug
  })

  return {
    priceData: tokenSlug ? priceData[tokenSlug] : undefined,
    connectionState,
    ...rest
  }
}

/**
 * Hook for getting price data for multiple tokens
 */
export function useMultipleTokenPrices(tokenSlugs: string[]) {
  const { priceData, connectionState, ...rest } = usePriceStream({
    tokens: tokenSlugs,
    autoConnect: tokenSlugs.length > 0
  })

  const tokenPrices = tokenSlugs.reduce((acc, slug) => {
    const symbolData = Object.values(priceData).find(data => 
      data.cg_id === slug || data.token_symbol.toLowerCase() === slug.toLowerCase()
    )
    if (symbolData) {
      acc[slug] = symbolData
    }
    return acc
  }, {} as Record<string, TokenPriceData>)

  return {
    tokenPrices,
    priceData,
    connectionState,
    ...rest
  }
}
