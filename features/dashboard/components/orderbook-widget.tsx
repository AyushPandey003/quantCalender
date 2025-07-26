"use client"

import { useOrderBook } from "@/services/hooks/use-orderbook"
import { useCalendarStore } from "@/features/calendar/stores/calendar-store"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

type OrderBookEntry = {
  price: number
  quantity: number
}

type OrderBook = {
  timestamp: number
  asks: OrderBookEntry[]
  bids: OrderBookEntry[]
}

export function OrderBookWidget() {
  const { selectedSymbol } = useCalendarStore()
  const { data: orderBook, isLoading, error } = useOrderBook(selectedSymbol) as {
    data: OrderBook | undefined
    isLoading: boolean
    error: unknown
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    )
  }

  if (error || !orderBook) {
    return <div className="text-center text-muted-foreground py-8">Unable to load order book data</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline">{selectedSymbol}</Badge>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date(orderBook.timestamp).toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-xs font-medium text-muted-foreground">
        <div>Price</div>
        <div className="text-center">Size</div>
        <div className="text-right">Total</div>
      </div>

      {/* Asks (Sell Orders) */}
      <div className="space-y-1">
        {orderBook.asks
          .slice(0, 5)
          .reverse()
          .map((ask, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-red-500 font-mono">{ask.price.toFixed(2)}</div>
              <div className="text-center font-mono">{ask.quantity.toFixed(4)}</div>
              <div className="text-right font-mono">{(ask.price * ask.quantity).toFixed(2)}</div>
            </div>
          ))}
      </div>

      {/* Spread */}
      <div className="border-t border-b py-2">
        <div className="text-center text-sm font-medium">
          Spread: ${(orderBook.asks[0].price - orderBook.bids[0].price).toFixed(2)}
        </div>
      </div>

      {/* Bids (Buy Orders) */}
      <div className="space-y-1">
        {orderBook.bids.slice(0, 5).map((bid, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-green-500 font-mono">{bid.price.toFixed(2)}</div>
            <div className="text-center font-mono">{bid.quantity.toFixed(4)}</div>
            <div className="text-right font-mono">{(bid.price * bid.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
