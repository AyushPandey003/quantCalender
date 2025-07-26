import { db } from "./db"
import { symbols, marketData } from "./db/schema"
import { eq, and, gte, lte, desc } from "drizzle-orm"

export async function getOrCreateSymbol(symbol: string, name: string, slug: string, category = "cryptocurrency") {
  // Try to find existing symbol
  const [existingSymbol] = await db.select().from(symbols).where(eq(symbols.symbol, symbol)).limit(1)

  if (existingSymbol) {
    // Update existing symbol
    const [updatedSymbol] = await db
      .update(symbols)
      .set({ name, slug, category })
      .where(eq(symbols.id, existingSymbol.id))
      .returning()

    return updatedSymbol
  }

  // Create new symbol
  const [newSymbol] = await db.insert(symbols).values({ symbol, name, slug, category }).returning()

  return newSymbol
}

export async function saveMarketData(data: {
  symbolId: string
  timestamp: Date
  date: Date
  open: number
  high: number
  low: number
  close: number
  volume: number
  volatility?: number
  liquidity?: number
  performance?: number
  timeframe: string
}) {
  // Check if data already exists
  const [existing] = await db
    .select({ id: marketData.id })
    .from(marketData)
    .where(
      and(
        eq(marketData.symbolId, data.symbolId),
        eq(marketData.timestamp, data.timestamp),
        eq(marketData.timeframe, data.timeframe),
      ),
    )
    .limit(1)

  const marketDataValues = {
    symbolId: data.symbolId,
    timestamp: data.timestamp,
    date: data.date,
    open: data.open.toString(),
    high: data.high.toString(),
    low: data.low.toString(),
    close: data.close.toString(),
    volume: data.volume.toString(),
    volatility: data.volatility?.toString() || null,
    liquidity: data.liquidity?.toString() || null,
    performance: data.performance?.toString() || null,
    timeframe: data.timeframe,
  }

  if (existing) {
    // Update existing record
    const [updated] = await db
      .update(marketData)
      .set(marketDataValues)
      .where(eq(marketData.id, existing.id))
      .returning()

    return updated
  }

  // Insert new record
  const [inserted] = await db.insert(marketData).values(marketDataValues).returning()

  return inserted
}

export async function getMarketData(symbolId: string, startDate: Date, endDate: Date, timeframe = "1d") {
  return await db
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
}

export async function getLatestPrice(symbolId: string) {
  const [latest] = await db
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
    .where(eq(marketData.symbolId, symbolId))
    .orderBy(desc(marketData.timestamp))
    .limit(1)

  return latest
}
