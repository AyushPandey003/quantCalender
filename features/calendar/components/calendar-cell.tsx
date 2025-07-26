"use client"

import { memo } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { CalendarDay } from "../types"

interface CalendarCellProps {
  day: CalendarDay
  metric: string
  isHovered: boolean
  onHover: (date: string | null) => void
}

export const CalendarCell = memo(function CalendarCell({ day, metric, isHovered, onHover }: CalendarCellProps) {
  const { date, dayOfMonth, data } = day

  const getIntensityLevel = (value: number | null, metric: string): number => {
    if (!value) return 0

    // Normalize values to 1-5 scale based on metric type
    switch (metric) {
      case "volatility":
        return Math.min(5, Math.max(1, Math.ceil(value * 100)))
      case "liquidity":
        return Math.min(5, Math.max(1, Math.ceil(value / 1000000)))
      case "performance":
        return Math.min(5, Math.max(1, Math.ceil(Math.abs(value) * 10)))
      default:
        return 1
    }
  }

  const getPerformanceIcon = (performance: number | null) => {
    if (!performance) return <Minus className="h-3 w-3" />
    if (performance > 0) return <TrendingUp className="h-3 w-3 text-green-500" />
    if (performance < 0) return <TrendingDown className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3" />
  }

  const intensityLevel = getIntensityLevel(data?.[metric as keyof typeof data] as number, metric)
  const cellColor = getCellColor(intensityLevel, metric)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`
              relative h-12 w-full rounded-md border cursor-pointer transition-all duration-200
              ${cellColor}
              ${isHovered ? "ring-2 ring-primary ring-offset-2" : ""}
              ${!data ? "opacity-30" : ""}
              hover:scale-105 hover:shadow-md
            `}
            onMouseEnter={() => onHover(date)}
            onMouseLeave={() => onHover(null)}
            role="gridcell"
            tabIndex={0}
            aria-label={`${date}: ${data ? `${metric} ${data[metric as keyof typeof data]}` : "No data"}`}
          >
            <div className="absolute top-1 left-1 text-xs font-medium">{dayOfMonth}</div>

            {data && <div className="absolute bottom-1 right-1">{getPerformanceIcon(data.performance)}</div>}

            {data?.liquidity && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400 opacity-60 rounded-b-md" />
            )}
          </div>
        </TooltipTrigger>

        <TooltipContent side="top" className="p-3">
          <div className="space-y-1">
            <div className="font-semibold">{new Date(date).toLocaleDateString()}</div>
            {data ? (
              <>
                <div className="text-sm">
                  <span className="text-muted-foreground">Volatility:</span> {data.volatility?.toFixed(2)}%
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Liquidity:</span> ${data.liquidity?.toLocaleString()}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Performance:</span> {data.performance?.toFixed(2)}%
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No data available</div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})

function getCellColor(level: number, metric: string): string {
  if (level === 0) return "bg-muted"

  const colors = {
    volatility: [
      "bg-red-100 dark:bg-red-900/30",
      "bg-red-200 dark:bg-red-800/40",
      "bg-red-300 dark:bg-red-700/50",
      "bg-red-400 dark:bg-red-600/60",
      "bg-red-500 dark:bg-red-500/70",
    ],
    liquidity: [
      "bg-blue-100 dark:bg-blue-900/30",
      "bg-blue-200 dark:bg-blue-800/40",
      "bg-blue-300 dark:bg-blue-700/50",
      "bg-blue-400 dark:bg-blue-600/60",
      "bg-blue-500 dark:bg-blue-500/70",
    ],
    performance: [
      "bg-green-100 dark:bg-green-900/30",
      "bg-green-200 dark:bg-green-800/40",
      "bg-green-300 dark:bg-green-700/50",
      "bg-green-400 dark:bg-green-600/60",
      "bg-green-500 dark:bg-green-500/70",
    ],
  }

  const colorSet = colors[metric as keyof typeof colors] || colors.volatility
  return colorSet[level - 1] || colorSet[0]
}
