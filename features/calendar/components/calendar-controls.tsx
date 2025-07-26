"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { useCalendarStore } from "../stores/calendar-store"

export function CalendarControls() {
  const { selectedTimeframe, setSelectedTimeframe, navigateMonth, resetView, currentMonth, currentYear } =
    useCalendarStore()

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)} aria-label="Previous month">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="text-lg font-semibold min-w-[200px] text-center">
          {new Date(currentYear, currentMonth).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>

        <Button variant="outline" size="sm" onClick={() => navigateMonth(1)} aria-label="Next month">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1D">Daily</SelectItem>
            <SelectItem value="1W">Weekly</SelectItem>
            <SelectItem value="1M">Monthly</SelectItem>
            <SelectItem value="3M">Quarterly</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={resetView} aria-label="Reset view">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
