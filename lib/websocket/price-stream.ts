/**
 * WebSocket client for TokenMetrics real-time price streaming
 * Handles connection management, subscriptions, and error handling
 */

import { config } from "../config"

export interface TokenPriceData {
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

export interface SubscriptionMessage {
  is_append: 0 | 1
  tokens: string[]
}

export type ConnectionState = "connecting" | "connected" | "disconnected" | "error"

export interface PriceStreamEvents {
  onPriceUpdate: (data: TokenPriceData) => void
  onConnectionChange: (state: ConnectionState) => void
  onError: (error: Error) => void
  onSubscriptionUpdate: (tokens: string[]) => void
}

export class TokenPriceStream {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private reconnectTimer: NodeJS.Timeout | null = null
  private subscribedTokens: Set<string> = new Set()
  private connectionState: ConnectionState = "disconnected"
  private events: Partial<PriceStreamEvents> = {}

  constructor(private apiKey: string) {
    if (!this.apiKey) {
      throw new Error("TokenMetrics API key is required")
    }
  }

  /**
   * Register event handlers
   */
  on<K extends keyof PriceStreamEvents>(event: K, handler: PriceStreamEvents[K]) {
    this.events[event] = handler
  }

  /**
   * Remove event handlers
   */
  off<K extends keyof PriceStreamEvents>(event: K) {
    delete this.events[event]
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState
  }

  /**
   * Get currently subscribed tokens
   */
  getSubscribedTokens(): string[] {
    return Array.from(this.subscribedTokens)
  }

  /**
   * Connect to the WebSocket
   */
  async connect(): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return
    }

    try {
      this.setConnectionState("connecting")
      
      this.ws = new WebSocket(config.tokenMetrics.wsUrl)
      
      // Set the API key in headers (note: this may not work in all browsers)
      // For browser compatibility, we'll send the API key in the first message
      
      this.ws.onopen = this.handleOpen.bind(this)
      this.ws.onmessage = this.handleMessage.bind(this)
      this.ws.onclose = this.handleClose.bind(this)
      this.ws.onerror = this.handleError.bind(this)

    } catch (error) {
      this.handleError(error as Event)
    }
  }

  /**
   * Disconnect from the WebSocket
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close(1000, "Client initiated disconnect")
      this.ws = null
    }

    this.subscribedTokens.clear()
    this.setConnectionState("disconnected")
  }

  /**
   * Subscribe to token price updates
   */
  async subscribeToTokens(tokens: string[], append = false): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected")
    }

    const message: SubscriptionMessage = {
      is_append: append ? 1 : 0,
      tokens
    }

    try {
      this.ws.send(JSON.stringify(message))
      
      if (append) {
        tokens.forEach(token => this.subscribedTokens.add(token))
      } else {
        this.subscribedTokens.clear()
        tokens.forEach(token => this.subscribedTokens.add(token))
      }

      this.events.onSubscriptionUpdate?.(Array.from(this.subscribedTokens))
    } catch (error) {
      this.events.onError?.(new Error(`Failed to subscribe to tokens: ${error}`))
    }
  }

  /**
   * Add tokens to existing subscription
   */
  async addTokens(tokens: string[]): Promise<void> {
    return this.subscribeToTokens(tokens, true)
  }

  /**
   * Replace current token subscription
   */
  async replaceTokens(tokens: string[]): Promise<void> {
    return this.subscribeToTokens(tokens, false)
  }

  /**
   * Remove specific tokens from subscription
   */
  async removeTokens(tokensToRemove: string[]): Promise<void> {
    const remainingTokens = Array.from(this.subscribedTokens).filter(
      token => !tokensToRemove.includes(token)
    )
    return this.replaceTokens(remainingTokens)
  }

  private handleOpen(): void {
    console.log("WebSocket connected to TokenMetrics")
    this.reconnectAttempts = 0
    this.setConnectionState("connected")

    // Send API key as first message for authentication
    // This is a workaround since browser WebSocket doesn't support custom headers
    try {
      this.ws?.send(JSON.stringify({ 
        type: "auth", 
        "x-api-key": this.apiKey 
      }))
    } catch (error) {
      console.warn("Could not send auth message:", error)
    }
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data)
      
      // Handle authentication response
      if (data.type === "auth_response") {
        if (!data.success) {
          this.events.onError?.(new Error("Authentication failed"))
          return
        }
        console.log("WebSocket authenticated successfully")
        return
      }

      // Handle price updates
      if (this.isTokenPriceData(data)) {
        this.events.onPriceUpdate?.(data)
      } else {
        console.log("Received unknown message format:", data)
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error)
      this.events.onError?.(new Error(`Failed to parse message: ${error}`))
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log("WebSocket connection closed:", event.code, event.reason)
    this.ws = null
    
    if (event.code === 1002 || event.code === 1003) {
      // Authentication error
      this.setConnectionState("error")
      this.events.onError?.(new Error("Authentication failed - invalid API key"))
      return
    }

    if (event.code !== 1000) {
      // Unexpected close - attempt reconnect
      this.setConnectionState("disconnected")
      this.attemptReconnect()
    } else {
      this.setConnectionState("disconnected")
    }
  }

  private handleError(event: Event): void {
    console.error("WebSocket error:", event)
    this.setConnectionState("error")
    this.events.onError?.(new Error("WebSocket connection error"))
    this.attemptReconnect()
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= config.websocket.reconnectAttempts) {
      console.error("Max reconnection attempts reached")
      this.events.onError?.(new Error("Max reconnection attempts reached"))
      return
    }

    const delay = Math.min(
      config.websocket.reconnectDelay * Math.pow(2, this.reconnectAttempts),
      config.websocket.maxReconnectDelay
    )

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1})`)
    
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectAttempts++
      try {
        await this.connect()
        
        // Resubscribe to previously subscribed tokens
        if (this.subscribedTokens.size > 0) {
          await this.subscribeToTokens(Array.from(this.subscribedTokens))
        }
      } catch (error) {
        console.error("Reconnection failed:", error)
        this.attemptReconnect()
      }
    }, delay)
  }

  private setConnectionState(state: ConnectionState): void {
    if (this.connectionState !== state) {
      this.connectionState = state
      this.events.onConnectionChange?.(state)
    }
  }

  private isTokenPriceData(data: any): data is TokenPriceData {
    return (
      data &&
      typeof data.token_symbol === "string" &&
      typeof data.price === "number" &&
      typeof data.timestamp === "string"
    )
  }
}

/**
 * Singleton instance for the token price stream
 */
let priceStreamInstance: TokenPriceStream | null = null

export function getPriceStream(): TokenPriceStream {
  if (!priceStreamInstance) {
    if (!config.tokenMetrics.apiKey) {
      throw new Error("TokenMetrics API key not configured")
    }
    priceStreamInstance = new TokenPriceStream(config.tokenMetrics.apiKey)
  }
  return priceStreamInstance
}

/**
 * Clean up the singleton instance
 */
export function destroyPriceStream(): void {
  if (priceStreamInstance) {
    priceStreamInstance.disconnect()
    priceStreamInstance = null
  }
}
