"use client"

import type React from "react"
import { createContext, useContext, useCallback } from "react"
import { useCalendarStore } from "../stores/calendar-store"

interface CalendarContextValue {
  // Calendar navigation
  navigateToDate: (date: string) => void
  selectDateRange: (start: string, end: string) => void

  // Keyboard navigation
  handleKeyboardNavigation: (event: KeyboardEvent) => void

  // Accessibility
  announceChange: (message: string) => void
}

const CalendarContext = createContext<CalendarContextValue | null>(null)

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const { setDateRange, setHoveredDate } = useCalendarStore()

  const navigateToDate = useCallback(
    (date: string) => {
      const targetDate = new Date(date)
      const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1)
      const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0)

      setDateRange({
        start: startOfMonth.toISOString().split("T")[0],
        end: endOfMonth.toISOString().split("T")[0],
      })
    },
    [setDateRange],
  )

  const selectDateRange = useCallback(
    (start: string, end: string) => {
      setDateRange({ start, end })
    },
    [setDateRange],
  )

  const handleKeyboardNavigation = useCallback(
    (event: KeyboardEvent) => {
      // Implement keyboard navigation logic
      switch (event.key) {
        case "ArrowLeft":
          // Navigate to previous day
          break
        case "ArrowRight":
          // Navigate to next day
          break
        case "ArrowUp":
          // Navigate to previous week
          break
        case "ArrowDown":
          // Navigate to next week
          break
        case "Escape":
          setHoveredDate(null)
          break
      }
    },
    [setHoveredDate],
  )

  const announceChange = useCallback((message: string) => {
    // Create a live region for screen readers
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.setAttribute("aria-atomic", "true")
    announcement.className = "sr-only"
    announcement.textContent = message

    document.body.appendChild(announcement)

    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, [])

  const value: CalendarContextValue = {
    navigateToDate,
    selectDateRange,
    handleKeyboardNavigation,
    announceChange,
  }

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>
}

export function useCalendarContext() {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error("useCalendarContext must be used within a CalendarProvider")
  }
  return context
}
