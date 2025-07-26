"use client"

import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Loader2 } from "lucide-react"
import { useTokenMetricsWebSocket } from "@/services/hooks/use-tokenmetrics-websocket"
import { useCalendarStore } from "@/features/calendar/stores/calendar-store"

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

export function ConnectionStatus() {
  const { selectedSymbol } = useCalendarStore()
  const tokenSlug = symbolToTokenSlug(selectedSymbol)
  const { isConnected, isConnecting, error, data, lastUpdate } = useTokenMetricsWebSocket([tokenSlug])

  const getStatusBadge = () => {
    if (isConnecting) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Connecting...
        </Badge>
      )
    }

    if (error) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <WifiOff className="h-3 w-3" />
          Connection Error
        </Badge>
      )
    }

    if (isConnected) {
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-green-500">
          <Wifi className="h-3 w-3" />
          Live Data
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <WifiOff className="h-3 w-3" />
        Offline
      </Badge>
    )
  }

  const currentPrice = data?.[tokenSlug]?.price_in_usd

  return (
    <div className="flex items-center gap-3">
      {getStatusBadge()}

      {currentPrice && (
        <div className="text-sm">
          <span className="text-muted-foreground">Price: </span>
          <span className="font-mono font-medium">
            $
            {currentPrice.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      )}

      {lastUpdate > 0 && (
        <div className="text-xs text-muted-foreground">Updated: {new Date(lastUpdate).toLocaleTimeString()}</div>
      )}
    </div>
  )
}
