import { prisma } from "./db"
import { Decimal } from "@prisma/client/runtime/library"

export async function getOrCreateSymbol(symbol: string, name: string, slug: string) {
  return await prisma.symbol.upsert({
    where: { symbol },
    update: { name, slug },
    create: { symbol, name, slug },
  })
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
  return await prisma.marketData.upsert({
    where: {
      symbolId_timestamp_timeframe: {
        symbolId: data.symbolId,
        timestamp: data.timestamp,
        timeframe: data.timeframe,
      },
    },
    update: {
      open: new Decimal(data.open),
      high: new Decimal(data.high),
      low: new Decimal(data.low),
      close: new Decimal(data.close),
      volume: new Decimal(data.volume),
      volatility: data.volatility ? new Decimal(data.volatility) : null,
      liquidity: data.liquidity ? new Decimal(data.liquidity) : null,
      performance: data.performance ? new Decimal(data.performance) : null,
    },
    create: {
      symbolId: data.symbolId,
      timestamp: data.timestamp,
      date: data.date,
      open: new Decimal(data.open),
      high: new Decimal(data.high),
      low: new Decimal(data.low),
      close: new Decimal(data.close),
      volume: new Decimal(data.volume),
      volatility: data.volatility ? new Decimal(data.volatility) : null,
      liquidity: data.liquidity ? new Decimal(data.liquidity) : null,
      performance: data.performance ? new Decimal(data.performance) : null,
      timeframe: data.timeframe,
    },
  })
}

export async function getMarketData(symbolId: string, startDate: Date, endDate: Date, timeframe = "1d") {
  return await prisma.marketData.findMany({
    where: {
      symbolId,
      date: {
        gte: startDate,
        lte: endDate,
      },
      timeframe,
    },
    orderBy: {
      date: "asc",
    },
    include: {
      symbol: true,
    },
  })
}

export async function getLatestPrice(symbolId: string) {
  return await prisma.marketData.findFirst({
    where: { symbolId },
    orderBy: { timestamp: "desc" },
    include: { symbol: true },
  })
}
