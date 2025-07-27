/**
 * Real-time Calendar Integration
 * Enhances calendar view with live price data
 */

"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMarketDataContext } from "@/shared/contexts/market-data-context"
import { useCalendarStore } from "../stores/calendar-store"
import { POPULAR_TOKENS, formatTokenDisplayName } from "@/lib/utils/token-utils"
import { cn } from "@/lib/utils"
import { 
  Calendar,
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  RefreshCw,
  Wifi,
  WifiOff
} from "lucide-react"

interface CalendarPriceOverlayProps {
  date: Date
  price?: number
  change?: number
  className?: string
}

function CalendarPriceOverlay({ date, price, change, className }: CalendarPriceOverlayProps) {
  if (!price) return null

  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <div className={cn(
      "absolute inset-0 flex flex-col justify-between p-1 text-xs",
      className
    )}>
      <div className="flex justify-end">
        {change !== undefined && (
          <div className={cn(
            "flex items-center space-x-1 px-1 rounded",
            isPositive && "text-green-600 bg-green-50",
            isNegative && "text-red-600 bg-red-50"
          )}>
            {isPositive && <TrendingUp className="h-2 w-2" />}
            {isNegative && <TrendingDown className="h-2 w-2" />}
            <span>{change.toFixed(1)}%</span>
          </div>
        )}
      </div>
      <div className="text-center">
        <div className="font-semibold">
          ${price.toLocaleString()}
        </div>
      </div>
    </div>
  )
}

export function RealTimeCalendarIntegration() {
  const { selectedSymbol, setSelectedSymbol } = useCalendarStore()
  const { 
    connectionState, 
    getTokenPrice, 
    connectToSymbol,
    disconnect,
    connect
  } = useMarketDataContext()
  
  const [selectedToken, setSelectedToken] = useState(selectedSymbol || "bitcoin")
  const [historicalData, setHistoricalData] = useState<Record<string, { price: number; change: number }>>({})

  const currentTokenData = getTokenPrice(selectedToken)

  // Subscribe to real-time data when token changes
  useEffect(() => {
    if (connectionState === "connected" && selectedToken) {
      connectToSymbol(selectedToken)
    }
  }, [selectedToken, connectionState, connectToSymbol])

  // Update calendar store when token changes
  useEffect(() => {
    if (selectedToken !== selectedSymbol) {
      setSelectedSymbol(selectedToken)
    }
  }, [selectedToken, selectedSymbol, setSelectedSymbol])

  // Simulate historical data generation for calendar
  useEffect(() => {
    if (currentTokenData) {
      const today = new Date()
      const newHistoricalData: Record<string, { price: number; change: number }> = {}
      
      // Generate 30 days of sample data around current price
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateKey = date.toISOString().split('T')[0]
        
        // Simulate price variation around current price
        const variation = (Math.random() - 0.5) * 0.1 // ±10% variation
        const price = currentTokenData.price * (1 + variation)
        const change = (Math.random() - 0.5) * 10 // ±5% daily change
        
        newHistoricalData[dateKey] = { price, change }
      }
      
      setHistoricalData(newHistoricalData)
    }
  }, [currentTokenData])

  const handleTokenChange = (tokenSlug: string) => {
    setSelectedToken(tokenSlug)
  }

  const handleRefresh = async () => {
    if (connectionState === "connected") {
      connectToSymbol(selectedToken)
    } else {
      await connect()
    }
  }

  const connectionIcon = connectionState === "connected" ? 
    <Wifi className="h-4 w-4 text-green-500" /> : 
    <WifiOff className="h-4 w-4 text-gray-500" />

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Real-Time Calendar Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Token</label>
                <Select value={selectedToken} onValueChange={handleTokenChange}>
                  <SelectTrigger className="w-48">
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

              {currentTokenData && (
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Current Price</div>
                  <div className="text-2xl font-bold">
                    ${currentTokenData.price.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {currentTokenData.token_name}
                  </div>
                </div>
              )}
            </div>

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

          {connectionState === "connected" && currentTokenData && (
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <Zap className="h-3 w-3" />
              <span>Live data enabled for calendar</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calendar with Price Overlay</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              This shows how the calendar would look with real-time price data overlays.
              In the actual calendar view, each day would show the price and change for that date.
            </div>
            
            {/* Sample Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              <div className="text-center text-sm font-medium p-2">Sun</div>
              <div className="text-center text-sm font-medium p-2">Mon</div>
              <div className="text-center text-sm font-medium p-2">Tue</div>
              <div className="text-center text-sm font-medium p-2">Wed</div>
              <div className="text-center text-sm font-medium p-2">Thu</div>
              <div className="text-center text-sm font-medium p-2">Fri</div>
              <div className="text-center text-sm font-medium p-2">Sat</div>
              
              {Array.from({ length: 21 }, (_, i) => {
                const date = new Date()
                date.setDate(date.getDate() - (20 - i))
                const dateKey = date.toISOString().split('T')[0]
                const dayData = historicalData[dateKey]
                
                return (
                  <div
                    key={i}
                    className="relative h-16 border rounded-md bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="absolute top-1 left-1 text-xs font-medium">
                      {date.getDate()}
                    </div>
                    {dayData && (
                      <CalendarPriceOverlay
                        date={date}
                        price={dayData.price}
                        change={dayData.change}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
                  <span>Price increase</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-50 border border-red-200 rounded"></div>
                  <span>Price decrease</span>
                </div>
              </div>
              <span>Hover over dates to see details</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Real-time Enhancements</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Live price updates on calendar cells</li>
                <li>• Visual indicators for price movements</li>
                <li>• Automatic data synchronization</li>
                <li>• Historical data context</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Calendar Features</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Interactive date selection</li>
                <li>• Price overlay on calendar days</li>
                <li>• Trend visualization</li>
                <li>• Multi-token support</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
