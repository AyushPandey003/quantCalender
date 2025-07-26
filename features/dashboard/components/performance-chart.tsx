"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useCalendarStore } from "@/features/calendar/stores/calendar-store"
import { useMarketData } from "@/services/hooks/use-market-data"
import { Skeleton } from "@/components/ui/skeleton"

export function PerformanceChart() {
  const { selectedSymbol, dateRange } = useCalendarStore()

  const { data: marketData, isLoading } = useMarketData({
    symbol: selectedSymbol,
    startDate: dateRange.start,
    endDate: dateRange.end,
    metric: "performance",
  })

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full" />
  }

  const chartData =
    marketData?.map((item) => ({
      date: new Date(item.date).toLocaleDateString(),
      performance: item.performance,
      volatility: item.volatility,
      volume: item.volume / 1000000, // Convert to millions
    })) || []

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="date" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
          <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
          />
          <Line
            type="monotone"
            dataKey="performance"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            name="Performance (%)"
          />
          <Line
            type="monotone"
            dataKey="volatility"
            stroke="hsl(var(--destructive))"
            strokeWidth={2}
            dot={false}
            name="Volatility (%)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
