/**
 * Real-time Price Widget for Dashboard
 * Displays live cryptocurrency prices with WebSocket integration
 */

"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMarketDataContext } from "@/shared/contexts/market-data-context"
import { usePriceStream, type TokenPriceData } from "@/hooks/use-price-stream"
import { POPULAR_TOKENS, formatTokenDisplayName } from "@/lib/utils/token-utils"
import { cn } from "@/lib/utils"
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  RefreshCw, 
  Wifi, 
  WifiOff,
  DollarSign,
  BarChart3
} from "lucide-react"

interface PriceCardProps {
  tokenData: TokenPriceData
  isSelected?: boolean
  onClick?: () => void
}

function PriceCard({ tokenData, isSelected, onClick }: PriceCardProps) {
  const [previousPrice, setPreviousPrice] = useState<number>(tokenData.price)
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'neutral'>('neutral')

  useEffect(() => {
    if (tokenData.price !== previousPrice) {
      setPriceDirection(tokenData.price > previousPrice ? 'up' : 'down')
      setPreviousPrice(tokenData.price)
      
      // Reset direction after animation
      const timer = setTimeout(() => setPriceDirection('neutral'), 1000)
      return () => clearTimeout(timer)
    }
  }, [tokenData.price, previousPrice])

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return price.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
    return price.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 6,
      maximumFractionDigits: 6
    })
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(1)}K`
    return `$${volume.toFixed(0)}`
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const priceTime = new Date(timestamp)
    const diffSecs = Math.floor((now.getTime() - priceTime.getTime()) / 1000)
    
    if (diffSecs < 60) return `${diffSecs}s ago`
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`
    return `${Math.floor(diffSecs / 3600)}h ago`
  }

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary",
        priceDirection === 'up' && "bg-green-50 dark:bg-green-950/20",
        priceDirection === 'down' && "bg-red-50 dark:bg-red-950/20"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h3 className="font-semibold">{tokenData.token_name}</h3>
            <Badge variant="secondary">{tokenData.token_symbol}</Badge>
          </div>
          {priceDirection !== 'neutral' && (
            <div className={cn(
              "transition-all duration-500",
              priceDirection === 'up' ? "text-green-500" : "text-red-500"
            )}>
              {priceDirection === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={cn(
            "text-2xl font-bold transition-colors duration-300",
            priceDirection === 'up' && "text-green-600",
            priceDirection === 'down' && "text-red-600"
          )}>
            {formatPrice(tokenData.price)}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-1">
            <BarChart3 className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Volume:</span>
          </div>
          <div className="font-medium">{formatVolume(tokenData.volume)}</div>
          
          <div className="flex items-center space-x-1">
            <Activity className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Exchange:</span>
          </div>
          <div className="font-medium capitalize">{tokenData.exchange}</div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Rank #{tokenData.exchange_rank}</span>
          <span>{getTimeAgo(tokenData.timestamp)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function RealTimePriceWidget() {
  const { connectionState, priceData } = useMarketDataContext()
  const [selectedToken, setSelectedToken] = useState<string>("bitcoin")
  const [watchedTokens, setWatchedTokens] = useState<string[]>(["bitcoin", "ethereum", "solana"])

  const {
    connect,
    disconnect,
    subscribeToTokens,
    isConnected
  } = usePriceStream({
    tokens: watchedTokens,
    autoConnect: true
  })

  const handleTokenSelect = (tokenSlug: string) => {
    setSelectedToken(tokenSlug)
    if (!watchedTokens.includes(tokenSlug)) {
      const newWatchedTokens = [...watchedTokens, tokenSlug]
      setWatchedTokens(newWatchedTokens)
      subscribeToTokens(newWatchedTokens)
    }
  }

  const handleRefresh = async () => {
    if (isConnected) {
      await subscribeToTokens(watchedTokens)
    } else {
      await connect()
    }
  }

  const selectedTokenData = selectedToken ? priceData[Object.keys(priceData).find(key => 
    priceData[key].cg_id === selectedToken || 
    priceData[key].token_symbol.toLowerCase() === selectedToken.toLowerCase()
  ) || ''] : undefined

  const connectionIcon = connectionState === "connected" ? 
    <Wifi className="h-4 w-4 text-green-500" /> : 
    <WifiOff className="h-4 w-4 text-gray-500" />

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Real-Time Prices</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {connectionIcon}
            <Badge variant={connectionState === "connected" ? "default" : "secondary"}>
              {connectionState}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={connectionState === "connecting"}
            >
              <RefreshCw className={cn(
                "h-4 w-4",
                connectionState === "connecting" && "animate-spin"
              )} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Token</label>
          <Select value={selectedToken} onValueChange={handleTokenSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a token" />
            </SelectTrigger>
            <SelectContent>
              {POPULAR_TOKENS.map((token) => (
                <SelectItem key={token.slug} value={token.slug}>
                  {formatTokenDisplayName(token)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTokenData && (
          <div className="space-y-4">
            <PriceCard 
              tokenData={selectedTokenData} 
              isSelected={true}
            />
          </div>
        )}

        {Object.keys(priceData).length > 1 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Other Watched Tokens</h4>
            <div className="grid gap-2">
              {Object.values(priceData)
                .filter(data => data.cg_id !== selectedToken && data.token_symbol.toLowerCase() !== selectedToken.toLowerCase())
                .slice(0, 2)
                .map((tokenData) => (
                  <PriceCard
                    key={tokenData.token_symbol}
                    tokenData={tokenData}
                    onClick={() => setSelectedToken(tokenData.cg_id || tokenData.token_symbol.toLowerCase())}
                  />
                ))}
            </div>
          </div>
        )}

        {connectionState === "error" && (
          <div className="text-center py-4 text-red-600">
            <WifiOff className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Connection failed. Check your API key.</p>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
              Retry
            </Button>
          </div>
        )}

        {connectionState === "connected" && Object.keys(priceData).length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Waiting for price data...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
