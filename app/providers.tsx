"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"
import { MarketDataProvider } from "@/shared/contexts/market-data-context"
import { CalendarProvider } from "@/features/calendar/contexts/calendar-context"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000, // 30 seconds
            cacheTime: 360_000, // 6 minutes
            refetchOnWindowFocus: false,
            retry: 3,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <MarketDataProvider>
        <CalendarProvider>{children}</CalendarProvider>
      </MarketDataProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
