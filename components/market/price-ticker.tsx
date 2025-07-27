/**
 * Real-time price ticker component
 * Displays live cryptocurrency prices using WebSocket connection
 */

"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useMarketDataContext } from "../../shared/contexts/market-data-context"
import { cn } from "../../lib/utils"
import { 
  TrendingUp, 
  TrendingDown, 
  Wifi, 
  WifiOff, 
  Plus, 
  X, 
  Activity 
} from "lucide-react"

interface PriceDisplayProps {
  symbol: string
  onRemove?: () => void
}

function PriceDisplay({ symbol, onRemove }: PriceDisplayProps) {
  const { getTokenPrice, normalizePrice, formatVolume } = useMarketDataContext()
  const priceData = getTokenPrice(symbol)
  
  if (!priceData) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
            <span className="font-medium text-muted-foreground">
              {symbol.toUpperCase()}
            </span>
          </div>
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          Waiting for data...
        </div>
      </Card>
    )
  }

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${normalizePrice(price, symbol)}`
    } else {
      return `$${price.toFixed(6)}`
    }
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const priceTime = new Date(timestamp)
    const diffMs = now.getTime() - priceTime.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    
    if (diffSecs < 60) {
      return `${diffSecs}s ago`
    } else if (diffSecs < 3600) {
      return `${Math.floor(diffSecs / 60)}m ago`
    } else {
      return `${Math.floor(diffSecs / 3600)}h ago`
    }
  }

  return (
    <Card className="p-4 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <h3 className="font-semibold">{priceData.token_name}</h3>
          <Badge variant="secondary">{priceData.token_symbol}</Badge>
        </div>
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            {formatPrice(priceData.price)}
          </span>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Activity className="h-3 w-3" />
            <span>{getTimeAgo(priceData.timestamp)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Volume:</span>
            <div className="font-medium">{formatVolume(priceData.volume)}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Exchange:</span>
            <div className="font-medium capitalize">{priceData.exchange}</div>
          </div>
        </div>
        
        {priceData.exchange_rank && (
          <div className="text-xs text-muted-foreground">
            Exchange Rank: #{priceData.exchange_rank}
          </div>
        )}
      </div>
    </Card>
  )
}

export default function PriceTicker() {
  const {
    connectionState,
    subscribedTokens,
    connectToSymbol,
    disconnectFromSymbol,
    connect,
    disconnect
  } = useMarketDataContext()
  
  const [newToken, setNewToken] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connect()
    } catch (error) {
      console.error("Failed to connect:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleAddToken = () => {
    if (newToken.trim()) {
      connectToSymbol(newToken.trim().toLowerCase())
      setNewToken("")
    }
  }

  const handleRemoveToken = (token: string) => {
    disconnectFromSymbol(token)
  }

  const getConnectionStatusColor = () => {
    switch (connectionState) {
      case "connected":
        return "text-green-500"
      case "connecting":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getConnectionIcon = () => {
    if (connectionState === "connected") {
      return <Wifi className="h-4 w-4" />
    }
    return <WifiOff className="h-4 w-4" />
  }

  // Add some default tokens when first connecting
  useEffect(() => {
    if (connectionState === "connected" && subscribedTokens.length === 0) {
      // Add some popular tokens by default
      const defaultTokens = ["bitcoin", "ethereum", "solana"]
      defaultTokens.forEach(token => connectToSymbol(token))
    }
  }, [connectionState, subscribedTokens.length, connectToSymbol])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Price Ticker</span>
            <div className={cn("flex items-center space-x-2", getConnectionStatusColor())}>
              {getConnectionIcon()}
              <span className="text-sm font-normal capitalize">
                {connectionState}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Label htmlFor="token-input">Add Token</Label>
              <Input
                id="token-input"
                placeholder="Enter token slug (e.g., bitcoin, ethereum)"
                value={newToken}
                onChange={(e) => setNewToken(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddToken()
                  }
                }}
                disabled={connectionState !== "connected"}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use token slugs like: bitcoin, ethereum, solana, cardano, polygon
              </p>
            </div>
            <Button
              onClick={handleAddToken}
              disabled={!newToken.trim() || connectionState !== "connected"}
              className="mt-6"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {connectionState === "disconnected" && (
              <Button 
                onClick={handleConnect} 
                disabled={isConnecting}
                variant="outline"
              >
                {isConnecting ? "Connecting..." : "Connect"}
              </Button>
            )}
            {connectionState === "connected" && (
              <Button onClick={disconnect} variant="outline">
                Disconnect
              </Button>
            )}
            <span className="text-sm text-muted-foreground">
              {subscribedTokens.length} token{subscribedTokens.length !== 1 ? "s" : ""} subscribed
            </span>
          </div>
        </CardContent>
      </Card>

      {subscribedTokens.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subscribedTokens.map((token) => (
            <PriceDisplay
              key={token}
              symbol={token}
              onRemove={() => handleRemoveToken(token)}
            />
          ))}
        </div>
      )}

      {connectionState === "connected" && subscribedTokens.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No tokens subscribed</h3>
            <p>Add some tokens above to start receiving live price data</p>
          </div>
        </Card>
      )}

      {connectionState === "error" && (
        <Card className="p-8 text-center border-red-200">
          <div className="text-red-600">
            <WifiOff className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Connection Error</h3>
            <p className="text-sm">
              Failed to connect to price stream. Please check your API key and try again.
            </p>
            <Button onClick={handleConnect} className="mt-4" variant="outline">
              Retry Connection
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
