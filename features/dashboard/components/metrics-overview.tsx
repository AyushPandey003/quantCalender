"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3, Zap } from "lucide-react"
import { useCalendarStore } from "@/features/calendar/stores/calendar-store"
import { useMarketMetrics } from "@/services/hooks/use-market-metrics"
import { useMarketDataContext } from "@/shared/contexts/market-data-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

export function MetricsOverview() {
  const { selectedSymbol } = useCalendarStore()
  const { data: metrics, isLoading } = useMarketMetrics(selectedSymbol)
  const { getTokenPrice, connectionState, connectToSymbol } = useMarketDataContext()
  const [realTimePrice, setRealTimePrice] = useState<number | null>(null)
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'neutral'>('neutral')

  // Get real-time price data for the selected symbol
  const liveTokenData = getTokenPrice(selectedSymbol?.toLowerCase() || 'bitcoin')

  // Subscribe to real-time data for the selected symbol
  useEffect(() => {
    if (selectedSymbol && connectionState === "connected") {
      connectToSymbol(selectedSymbol.toLowerCase())
    }
  }, [selectedSymbol, connectionState, connectToSymbol])

  // Track price changes for animations
  useEffect(() => {
    if (liveTokenData?.price && realTimePrice !== null) {
      if (liveTokenData.price > realTimePrice) {
        setPriceDirection('up')
      } else if (liveTokenData.price < realTimePrice) {
        setPriceDirection('down')
      }
      
      // Reset direction after animation
      const timer = setTimeout(() => setPriceDirection('neutral'), 1000)
      return () => clearTimeout(timer)
    }
    
    if (liveTokenData?.price) {
      setRealTimePrice(liveTokenData.price)
    }
  }, [liveTokenData?.price, realTimePrice])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Use real-time price if available, otherwise fall back to metrics
  const currentPrice = liveTokenData?.price || metrics?.currentPrice || 0
  const currentVolume = liveTokenData?.volume || metrics?.volume24h || 0

  const metricCards = [
    {
      title: "Current Price",
      value: currentPrice ? `$${currentPrice.toLocaleString()}` : "N/A",
      change: metrics?.priceChange24h || 0,
      icon: DollarSign,
      color: "text-green-600",
      isRealTime: !!liveTokenData?.price,
      direction: priceDirection
    },
    {
      title: "24h Volatility",
      value: metrics?.volatility24h ? `${metrics.volatility24h.toFixed(2)}%` : "N/A",
      change: metrics?.volatilityChange || 0,
      icon: TrendingUp,
      color: "text-red-600",
      isRealTime: false
    },
    {
      title: "24h Volume",
      value: currentVolume ? `$${(currentVolume / 1000000).toFixed(1)}M` : "N/A",
      change: metrics?.volumeChange || 0,
      icon: BarChart3,
      color: "text-blue-600",
      isRealTime: !!liveTokenData?.volume
    },
    {
      title: "Liquidity Score",
      value: metrics?.liquidityScore ? metrics.liquidityScore.toFixed(1) : "N/A",
      change: metrics?.liquidityChange || 0,
      icon: Activity,
      color: "text-purple-600",
      isRealTime: false
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Market Overview</h2>
        <div className="flex items-center space-x-2">
          <Badge variant={connectionState === "connected" ? "default" : "secondary"}>
            {connectionState === "connected" ? "Live" : "Historical"}
          </Badge>
          {connectionState === "connected" && (
            <div className="flex items-center space-x-1 text-sm text-green-600">
              <Zap className="h-3 w-3" />
              <span>Real-time</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => (
          <Card 
            key={index}
            className={`transition-all duration-300 ${
              metric.isRealTime && metric.direction === 'up' ? 'bg-green-50 dark:bg-green-950/20' :
              metric.isRealTime && metric.direction === 'down' ? 'bg-red-50 dark:bg-red-950/20' : ''
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center space-x-1">
                <span>{metric.title}</span>
                {metric.isRealTime && (
                  <Zap className="h-3 w-3 text-yellow-500" />
                )}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold transition-colors duration-300 ${
                metric.isRealTime && metric.direction === 'up' ? 'text-green-600' :
                metric.isRealTime && metric.direction === 'down' ? 'text-red-600' : ''
              }`}>
                {metric.value}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {metric.change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : metric.change < 0 ? (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                ) : null}
                <span className={metric.change > 0 ? "text-green-500" : metric.change < 0 ? "text-red-500" : ""}>
                  {metric.change > 0 ? "+" : ""}
                  {metric.change.toFixed(2)}%
                </span>
                <span className="ml-1">from yesterday</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
