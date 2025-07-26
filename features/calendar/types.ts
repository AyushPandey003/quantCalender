export interface MarketData {
  date: string
  volatility: number
  liquidity: number
  performance: number
  volume: number
  open: number
  high: number
  low: number
  close: number
}

export interface CalendarDay {
  date: string
  dayOfWeek: number
  dayOfMonth: number
  data: MarketData | null
}

export interface DateRange {
  start: string
  end: string
}

export type MetricType = "volatility" | "liquidity" | "performance"
export type TimeframeType = "1D" | "1W" | "1M" | "3M"
