"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3 } from "lucide-react"
import { useCalendarStore } from "@/features/calendar/stores/calendar-store"
import { useMarketMetrics } from "@/services/hooks/use-market-metrics"
import { Skeleton } from "@/components/ui/skeleton"

export function MetricsOverview() {
  const { selectedSymbol } = useCalendarStore()
  const { data: metrics, isLoading } = useMarketMetrics(selectedSymbol)

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

  const metricCards = [
    {
      title: "Current Price",
      value: metrics?.currentPrice ? `$${metrics.currentPrice.toLocaleString()}` : "N/A",
      change: metrics?.priceChange24h || 0,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "24h Volatility",
      value: metrics?.volatility24h ? `${metrics.volatility24h.toFixed(2)}%` : "N/A",
      change: metrics?.volatilityChange || 0,
      icon: TrendingUp,
      color: "text-red-600",
    },
    {
      title: "24h Volume",
      value: metrics?.volume24h ? `$${(metrics.volume24h / 1000000).toFixed(1)}M` : "N/A",
      change: metrics?.volumeChange || 0,
      icon: BarChart3,
      color: "text-blue-600",
    },
    {
      title: "Liquidity Score",
      value: metrics?.liquidityScore ? metrics.liquidityScore.toFixed(1) : "N/A",
      change: metrics?.liquidityChange || 0,
      icon: Activity,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
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
  )
}
