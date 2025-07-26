import { CalendarView } from "@/features/calendar/components/calendar-view"
import { DashboardView } from "@/features/dashboard/components/dashboard-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SetupGuide } from "@/components/setup-guide"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6 space-y-6">
        <SetupGuide />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Market Analytics</h2>
            <p className="text-muted-foreground">
              Explore volatility, liquidity, and performance patterns across timeframes
            </p>
          </div>
        </div>

        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <CalendarView />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-4">
            <DashboardView />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
}
