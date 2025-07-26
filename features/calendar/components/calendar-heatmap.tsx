"use client"

import { useMemo, useCallback } from "react"
import { useCalendarStore } from "../stores/calendar-store"
import { useMarketData } from "@/services/hooks/use-market-data"
import { CalendarCell } from "./calendar-cell"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function CalendarHeatmap() {
  const { selectedSymbol, selectedMetric, dateRange, hoveredDate, setHoveredDate } = useCalendarStore()

  const {
    data: marketData,
    isLoading,
    error,
  } = useMarketData({
    symbol: selectedSymbol,
    startDate: dateRange.start,
    endDate: dateRange.end,
    metric: selectedMetric,
  })

  const calendarDays = useMemo(() => {
    if (!marketData) return []

    const days = []
    const current = new Date(dateRange.start)
    const end = new Date(dateRange.end)

    while (current <= end) {
      const dateStr = current.toISOString().split("T")[0]
      const dayData = marketData.find((d) => d.date === dateStr)

      days.push({
        date: dateStr,
        dayOfWeek: current.getDay(),
        dayOfMonth: current.getDate(),
        data: dayData || null,
      })

      current.setDate(current.getDate() + 1)
    }

    return days
  }, [marketData, dateRange])

  const handleCellHover = useCallback(
    (date: string | null) => {
      setHoveredDate(date)
    },
    [setHoveredDate],
  )

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load market data. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  const weeks = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => (
              <CalendarCell
                key={`${weekIndex}-${dayIndex}`}
                day={day}
                metric={selectedMetric}
                isHovered={hoveredDate === day.date}
                onHover={handleCellHover}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
        <span>Low</span>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div key={level} className={`h-3 w-3 rounded-sm ${getColorForLevel(level, selectedMetric)}`} />
          ))}
        </div>
        <span>High</span>
      </div>
    </div>
  )
}

function getColorForLevel(level: number, metric: string): string {
  const baseColors = {
    volatility: ["bg-red-100", "bg-red-200", "bg-red-300", "bg-red-400", "bg-red-500"],
    liquidity: ["bg-blue-100", "bg-blue-200", "bg-blue-300", "bg-blue-400", "bg-blue-500"],
    performance: ["bg-green-100", "bg-green-200", "bg-green-300", "bg-green-400", "bg-green-500"],
  }

  const darkColors = {
    volatility: ["dark:bg-red-900", "dark:bg-red-800", "dark:bg-red-700", "dark:bg-red-600", "dark:bg-red-500"],
    liquidity: ["dark:bg-blue-900", "dark:bg-blue-800", "dark:bg-blue-700", "dark:bg-blue-600", "dark:bg-blue-500"],
    performance: [
      "dark:bg-green-900",
      "dark:bg-green-800",
      "dark:bg-green-700",
      "dark:bg-green-600",
      "dark:bg-green-500",
    ],
  }

  const base = baseColors[metric as keyof typeof baseColors] || baseColors.volatility
  const dark = darkColors[metric as keyof typeof darkColors] || darkColors.volatility

  return `${base[level - 1]} ${dark[level - 1]}`
}
