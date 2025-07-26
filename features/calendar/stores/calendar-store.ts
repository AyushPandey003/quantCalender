import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

interface CalendarState {
  selectedSymbol: string
  selectedMetric: string
  selectedTimeframe: string
  dateRange: {
    start: string
    end: string
  }
  hoveredDate: string | null
  currentMonth: number
  currentYear: number

  // Actions
  setSelectedSymbol: (symbol: string) => void
  setSelectedMetric: (metric: string) => void
  setSelectedTimeframe: (timeframe: string) => void
  setDateRange: (range: { start: string; end: string }) => void
  setHoveredDate: (date: string | null) => void
  navigateMonth: (direction: number) => void
  resetView: () => void
}

const getCurrentMonthRange = (month: number, year: number) => {
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0)

  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  }
}

const now = new Date()
const currentMonth = now.getMonth()
const currentYear = now.getFullYear()

export const useCalendarStore = create<CalendarState>()(
  subscribeWithSelector((set, get) => ({
    selectedSymbol: "BTCUSDT",
    selectedMetric: "volatility",
    selectedTimeframe: "1D",
    dateRange: getCurrentMonthRange(currentMonth, currentYear),
    hoveredDate: null,
    currentMonth,
    currentYear,

    setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
    setSelectedMetric: (metric) => set({ selectedMetric: metric }),
    setSelectedTimeframe: (timeframe) => set({ selectedTimeframe: timeframe }),
    setDateRange: (range) => set({ dateRange: range }),
    setHoveredDate: (date) => set({ hoveredDate: date }),

    navigateMonth: (direction) => {
      const { currentMonth, currentYear } = get()
      let newMonth = currentMonth + direction
      let newYear = currentYear

      if (newMonth < 0) {
        newMonth = 11
        newYear -= 1
      } else if (newMonth > 11) {
        newMonth = 0
        newYear += 1
      }

      const newDateRange = getCurrentMonthRange(newMonth, newYear)

      set({
        currentMonth: newMonth,
        currentYear: newYear,
        dateRange: newDateRange,
      })
    },

    resetView: () => {
      const now = new Date()
      const month = now.getMonth()
      const year = now.getFullYear()

      set({
        currentMonth: month,
        currentYear: year,
        dateRange: getCurrentMonthRange(month, year),
        hoveredDate: null,
      })
    },
  })),
)
