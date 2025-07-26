"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { CalendarView } from "@/features/calendar/components/calendar-view"
import { CalendarProvider } from "@/features/calendar/contexts/calendar-context"

export default function CalendarPage() {
  return (
    <ProtectedRoute>
      <CalendarProvider>
        <div className="container mx-auto p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Market Calendar</h1>
              <p className="text-muted-foreground">
                Interactive calendar heatmap showing market seasonality patterns
              </p>
            </div>
            <CalendarView />
          </div>
        </div>
      </CalendarProvider>
    </ProtectedRoute>
  )
}
