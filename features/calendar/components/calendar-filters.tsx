"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useCalendarStore } from "../stores/calendar-store"

const SYMBOLS = ["BTCUSDT", "ETHUSDT", "ADAUSDT", "DOTUSDT", "LINKUSDT"]
const METRICS = [
  { value: "volatility", label: "Volatility", color: "bg-red-500" },
  { value: "liquidity", label: "Liquidity", color: "bg-blue-500" },
  { value: "performance", label: "Performance", color: "bg-green-500" },
]

export function CalendarFilters() {
  const { selectedSymbol, setSelectedSymbol, selectedMetric, setSelectedMetric } = useCalendarStore()

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="symbol-select" className="text-sm font-medium">
          Symbol:
        </label>
        <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
          <SelectTrigger id="symbol-select" className="w-[120px]">
            <SelectValue placeholder="Select symbol" />
          </SelectTrigger>
          <SelectContent>
            {SYMBOLS.map((symbol) => (
              <SelectItem key={symbol} value={symbol}>
                {symbol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <label htmlFor="metric-select" className="text-sm font-medium">
          Metric:
        </label>
        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
          <SelectTrigger id="metric-select" className="w-[140px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            {METRICS.map((metric) => (
              <SelectItem key={metric.value} value={metric.value}>
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${metric.color}`} />
                  <span>{metric.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Badge variant="secondary">
          {selectedSymbol} • {METRICS.find((m) => m.value === selectedMetric)?.label}
        </Badge>
      </div>
    </div>
  )
}
