"use client"

import { CalendarHeatmap } from "./calendar-heatmap"
import { CalendarControls } from "./calendar-controls"
import { CalendarFilters } from "./calendar-filters"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCalendarStore } from "../stores/calendar-store"

export function CalendarView() {
  const { selectedSymbol, selectedMetric, dateRange } = useCalendarStore()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Market Calendar</CardTitle>
          <CardDescription>
            Interactive heatmap showing {selectedMetric} patterns for {selectedSymbol}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CalendarFilters />
          <CalendarControls />
          <CalendarHeatmap />
        </CardContent>
      </Card>
    </div>
  )
}
