import { db } from "../lib/db"
import { users, userSettings, symbols, marketData } from "../lib/db/schema"
import bcrypt from "bcryptjs"
import { eq, and } from "drizzle-orm"

async function main() {
  console.log("🌱 Seeding database...")

  // Create demo users
  const demoUsers = [
    {
      email: "john@example.com",
      name: "John Doe",
      plan: "PRO" as const,
      password: "password123",
    },
    {
      email: "jane@example.com",
      name: "Jane Smith",
      plan: "ENTERPRISE" as const,
      password: "password123",
    },
  ]

  for (const userData of demoUsers) {
    const passwordHash = await bcrypt.hash(userData.password, 12)

    // Check if user exists
    const [existingUser] = await db.select({ id: users.id }).from(users).where(eq(users.email, userData.email)).limit(1)

    if (!existingUser) {
      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          email: userData.email,
          name: userData.name,
          plan: userData.plan,
          passwordHash,
          emailVerified: true,
        })
        .returning({ id: users.id })

      // Create user settings
      await db.insert(userSettings).values({
        userId: newUser.id,
      })
    }
  }

  // Create symbols
  const symbolsData = [
    { symbol: "BTCUSDT", name: "Bitcoin", slug: "bitcoin", category: "cryptocurrency" },
    { symbol: "ETHUSDT", name: "Ethereum", slug: "ethereum", category: "cryptocurrency" },
    { symbol: "ADAUSDT", name: "Cardano", slug: "cardano", category: "cryptocurrency" },
    { symbol: "DOTUSDT", name: "Polkadot", slug: "polkadot", category: "cryptocurrency" },
    { symbol: "LINKUSDT", name: "Chainlink", slug: "chainlink", category: "cryptocurrency" },
    { symbol: "SOLUSDT", name: "Solana", slug: "solana", category: "cryptocurrency" },
    { symbol: "MATICUSDT", name: "Polygon", slug: "polygon", category: "cryptocurrency" },
    { symbol: "AVAXUSDT", name: "Avalanche", slug: "avalanche-2", category: "cryptocurrency" },
  ]

  for (const symbolData of symbolsData) {
    // Check if symbol exists
    const [existingSymbol] = await db
      .select({ id: symbols.id })
      .from(symbols)
      .where(eq(symbols.symbol, symbolData.symbol))
      .limit(1)

    if (!existingSymbol) {
      await db.insert(symbols).values(symbolData)
    }
  }

  // Generate sample market data for Bitcoin
  const [btcSymbol] = await db.select({ id: symbols.id }).from(symbols).where(eq(symbols.symbol, "BTCUSDT")).limit(1)

  if (btcSymbol) {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000)
      const basePrice = 45000 + Math.random() * 10000

      // Check if data already exists
      const [existingData] = await db
        .select({ id: marketData.id })
        .from(marketData)
        .where(
          and(
            eq(marketData.symbolId, btcSymbol.id),
            eq(marketData.date, new Date(date.getFullYear(), date.getMonth(), date.getDate())),
            eq(marketData.timeframe, "1d"),
          ),
        )
        .limit(1)

      if (!existingData) {
        await db.insert(marketData).values({
          symbolId: btcSymbol.id,
          timestamp: date,
          date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          open: basePrice.toString(),
          high: (basePrice * (1 + Math.random() * 0.05)).toString(),
          low: (basePrice * (1 - Math.random() * 0.05)).toString(),
          close: (basePrice * (1 + (Math.random() - 0.5) * 0.02)).toString(),
          volume: (Math.random() * 1000000000 + 100000000).toString(),
          volatility: (Math.random() * 5 + 1).toString(),
          liquidity: (Math.random() * 1000000000 + 100000000).toString(),
          performance: ((Math.random() - 0.5) * 10).toString(),
          timeframe: "1d",
        })
      }
    }
  }

  console.log("✅ Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    process.exit(0)
  })
