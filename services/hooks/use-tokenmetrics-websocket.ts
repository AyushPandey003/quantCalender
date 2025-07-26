"use client"

import { useEffect, useRef, useState, useCallback } from "react"

// TokenMetrics WebSocket response interface
interface TokenMetricsPrice {
  timestamp: string
  event_timestamp: string
  arrival_timestamp: string
  epoch: number
  token_address: string | null
  token_name: string
  token_symbol: string
  token_id: number
  cg_id: string
  instrument: string
  exchange: string
  exchange_rank: number
  exchange_type: string
  amount: number | null
  amount_in_usd: number | null
  price: number
  price_in_usd: number
  price_against_side_currency: number
  volume: number
  side_amount: number | null
  transaction_type: string | null
  isBid: boolean
  sequence: number
  maker_address: string | null
  signature: string | null
  last_5s_messages: any[]
}

interface WebSocketState {
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  data: Record<string, TokenMetricsPrice>
  lastUpdate: number
}

const WS_URL = "wss://price.data-service.tokenmetrics.com"

// You'll need to set your API key here or via environment variable
const API_KEY = process.env.NEXT_PUBLIC_TOKENMETRICS_API_KEY || "your-api-key-here"

export function useTokenMetricsWebSocket(tokens: string[]) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const maxReconnectAttempts = 5

  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    data: {},
    lastUpdate: 0,
  })

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      const ws = new WebSocket(WS_URL)

      // Set API key in headers (Note: This might not work in browser WebSocket)
      // For browser WebSocket, you might need to pass API key differently
      ws.addEventListener("open", () => {
        console.log("TokenMetrics WebSocket connected")

        setState((prev) => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
        }))

        setReconnectAttempts(0)

        // Subscribe to tokens
        if (tokens.length > 0) {
          const subscribeMessage = {
            is_append: 0,
            tokens: tokens,
            // Include API key in the message payload as fallback
            api_key: API_KEY,
          }

          ws.send(JSON.stringify(subscribeMessage))
          console.log("Subscribed to tokens:", tokens)
        }
      })

      ws.addEventListener("message", (event) => {
        try {
          const priceData: TokenMetricsPrice = JSON.parse(event.data)

          setState((prev) => ({
            ...prev,
            data: {
              ...prev.data,
              [priceData.cg_id]: priceData,
            },
            lastUpdate: Date.now(),
          }))
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      })

      ws.addEventListener("error", (error) => {
        console.error("TokenMetrics WebSocket error:", error)
        setState((prev) => ({
          ...prev,
          error: "WebSocket connection error",
          isConnecting: false,
        }))
      })

      ws.addEventListener("close", (event) => {
        console.log("TokenMetrics WebSocket closed:", event.code, event.reason)

        setState((prev) => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
        }))

        wsRef.current = null

        // Attempt to reconnect if not manually closed
        if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)

          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1)
            connect()
          }, delay)
        }
      })

      wsRef.current = ws
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error)
      setState((prev) => ({
        ...prev,
        error: "Failed to create WebSocket connection",
        isConnecting: false,
      }))
    }
  }, [tokens, reconnectAttempts])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "Manual disconnect")
      wsRef.current = null
    }

    setState((prev) => ({
      ...prev,
      isConnected: false,
      isConnecting: false,
    }))
  }, [])

  const updateSubscription = useCallback((newTokens: string[], isAppend = false) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = {
        is_append: isAppend ? 1 : 0,
        tokens: newTokens,
        api_key: API_KEY,
      }

      wsRef.current.send(JSON.stringify(message))
      console.log(`${isAppend ? "Added" : "Replaced"} token subscription:`, newTokens)
    }
  }, [])

  // Connect when component mounts or tokens change
  useEffect(() => {
    if (tokens.length > 0) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [tokens.join(",")]) // Only reconnect when token list changes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    ...state,
    connect,
    disconnect,
    updateSubscription,
    reconnectAttempts,
  }
}
