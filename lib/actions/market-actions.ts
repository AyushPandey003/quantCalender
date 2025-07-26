"use server"

import { revalidatePath } from "next/cache"
import { db } from "../db"
import { symbols, marketData, userWatchlists } from "../db/schema"
import { eq, and, gte, lte, desc } from "drizzle-orm"
import { getCurrentUser } from "../auth"

export interface MarketDataResult {
  success: boolean
  message: string
  data?: any[]
}

export interface WatchlistResult {
  success: boolean
  message: string
  data?: any[]
}

export async function getMarketDataAction(
  symbolId: string,
  startDate: Date,
  endDate: Date,
  timeframe = "1d",
): Promise<MarketDataResult> {
  try {
    const data = await db
      .select({
        id: marketData.id,
        symbolId: marketData.symbolId,
        timestamp: marketData.timestamp,
        date: marketData.date,
        open: marketData.open,
        high: marketData.high,
        low: marketData.low,
        close: marketData.close,
        volume: marketData.volume,
        volatility: marketData.volatility,
        liquidity: marketData.liquidity,
        performance: marketData.performance,
        timeframe: marketData.timeframe,
        symbol: {
          id: symbols.id,
          symbol: symbols.symbol,
          name: symbols.name,
          slug: symbols.slug,
        },
      })
      .from(marketData)
      .innerJoin(symbols, eq(marketData.symbolId, symbols.id))
      .where(
        and(
          eq(marketData.symbolId, symbolId),
          gte(marketData.date, startDate),
          lte(marketData.date, endDate),
          eq(marketData.timeframe, timeframe),
        ),
      )
      .orderBy(marketData.date)

    return {
      success: true,
      message: "Market data retrieved successfully",
      data,
    }
  } catch (error) {
    console.error("Get market data error:", error)
    return {
      success: false,
      message: "Failed to retrieve market data",
    }
  }
}

export async function addToWatchlistAction(symbolId: string): Promise<WatchlistResult> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: "Authentication required",
      }
    }

    // Check if already in watchlist
    const [existing] = await db
      .select()
      .from(userWatchlists)
      .where(and(eq(userWatchlists.userId, user.id), eq(userWatchlists.symbolId, symbolId)))
      .limit(1)

    if (existing) {
      return {
        success: false,
        message: "Symbol already in watchlist",
      }
    }

    await db.insert(userWatchlists).values({
      userId: user.id,
      symbolId,
    })

    revalidatePath("/dashboard")
    revalidatePath("/market")

    return {
      success: true,
      message: "Added to watchlist successfully",
    }
  } catch (error) {
    console.error("Add to watchlist error:", error)
    return {
      success: false,
      message: "Failed to add to watchlist",
    }
  }
}

export async function removeFromWatchlistAction(symbolId: string): Promise<WatchlistResult> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: "Authentication required",
      }
    }

    await db
      .delete(userWatchlists)
      .where(and(eq(userWatchlists.userId, user.id), eq(userWatchlists.symbolId, symbolId)))

    revalidatePath("/dashboard")
    revalidatePath("/market")

    return {
      success: true,
      message: "Removed from watchlist successfully",
    }
  } catch (error) {
    console.error("Remove from watchlist error:", error)
    return {
      success: false,
      message: "Failed to remove from watchlist",
    }
  }
}

export async function getUserWatchlistAction(): Promise<WatchlistResult> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: "Authentication required",
      }
    }

    const watchlist = await db
      .select({
        id: userWatchlists.id,
        symbolId: userWatchlists.symbolId,
        createdAt: userWatchlists.createdAt,
        symbol: {
          id: symbols.id,
          symbol: symbols.symbol,
          name: symbols.name,
          slug: symbols.slug,
          category: symbols.category,
        },
      })
      .from(userWatchlists)
      .innerJoin(symbols, eq(userWatchlists.symbolId, symbols.id))
      .where(eq(userWatchlists.userId, user.id))
      .orderBy(desc(userWatchlists.createdAt))

    return {
      success: true,
      message: "Watchlist retrieved successfully",
      data: watchlist,
    }
  } catch (error) {
    console.error("Get watchlist error:", error)
    return {
      success: false,
      message: "Failed to retrieve watchlist",
    }
  }
}

export async function getAllSymbolsAction() {
  try {
    const allSymbols = await db
      .select({
        id: symbols.id,
        symbol: symbols.symbol,
        name: symbols.name,
        slug: symbols.slug,
        category: symbols.category,
        isActive: symbols.isActive,
      })
      .from(symbols)
      .where(eq(symbols.isActive, true))
      .orderBy(symbols.name)

    return {
      success: true,
      message: "Symbols retrieved successfully",
      data: allSymbols,
    }
  } catch (error) {
    console.error("Get symbols error:", error)
    return {
      success: false,
      message: "Failed to retrieve symbols",
    }
  }
}
