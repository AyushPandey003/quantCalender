"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { marketData, watchlists } from "@/lib/db/schema"
import { eq, and, gte, lte, desc } from "drizzle-orm"
import { getCurrentUser } from "@/lib/auth"

export interface MarketDataPoint {
  id: string
  symbolId: string
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  volatility?: number
  liquidity?: number
}

export async function getMarketDataAction(
  symbolId: string,
  startDate: string,
  endDate: string,
): Promise<MarketDataPoint[]> {
  try {
    const data = await db
      .select({
        id: marketData.id,
        symbolId: marketData.symbolId,
        date: marketData.date,
        open: marketData.open,
        high: marketData.high,
        low: marketData.low,
        close: marketData.close,
        volume: marketData.volume,
        volatility: marketData.volatility,
        liquidity: marketData.liquidity,
      })
      .from(marketData)
      .where(
        and(
          eq(marketData.symbolId, symbolId),
          gte(marketData.date, new Date(startDate)),
          lte(marketData.date, new Date(endDate)),
        ),
      )
      .orderBy(desc(marketData.date))
      .limit(1000)

    return data.map((item) => ({
      ...item,
      date: item.date.toISOString(),
      open: Number(item.open),
      high: Number(item.high),
      low: Number(item.low),
      close: Number(item.close),
      volume: Number(item.volume),
      volatility: item.volatility ? Number(item.volatility) : undefined,
      liquidity: item.liquidity ? Number(item.liquidity) : undefined,
    }))
  } catch (error) {
    console.error("Error fetching market data:", error)
    return []
  }
}

export async function addToWatchlistAction(symbolId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Check if already in watchlist
    const existing = await db
      .select()
      .from(watchlists)
      .where(and(eq(watchlists.userId, user.id), eq(watchlists.symbolId, symbolId)))
      .limit(1)

    if (existing.length > 0) {
      return { success: false, error: "Symbol already in watchlist" }
    }

    await db.insert(watchlists).values({
      userId: user.id,
      symbolId,
    })

    revalidatePath("/dashboard")
    revalidatePath("/settings")

    return { success: true }
  } catch (error) {
    console.error("Error adding to watchlist:", error)
    return { success: false, error: "Failed to add to watchlist" }
  }
}

export async function removeFromWatchlistAction(symbolId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    await db.delete(watchlists).where(and(eq(watchlists.userId, user.id), eq(watchlists.symbolId, symbolId)))

    revalidatePath("/dashboard")
    revalidatePath("/settings")

    return { success: true }
  } catch (error) {
    console.error("Error removing from watchlist:", error)
    return { success: false, error: "Failed to remove from watchlist" }
  }
}

export async function getUserWatchlistAction(): Promise<string[]> {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return []
    }

    const watchlistItems = await db
      .select({ symbolId: watchlists.symbolId })
      .from(watchlists)
      .where(eq(watchlists.userId, user.id))

    return watchlistItems.map((item) => item.symbolId)
  } catch (error) {
    console.error("Error fetching watchlist:", error)
    return []
  }
}
