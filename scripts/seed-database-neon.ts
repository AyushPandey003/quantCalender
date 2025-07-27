import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "../lib/db/schema"
import { users, userSettings, symbols, marketData } from "../lib/db/schema"
import bcrypt from "bcryptjs"
import { eq, and } from "drizzle-orm"

// Use the same DATABASE_URL from your .env file
const DATABASE_URL = "postgresql://neondb_owner:npg_5Gb0aoLWQCcF@ep-twilight-darkness-a1tth0ik-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

const client = postgres(DATABASE_URL, {
  prepare: false,
  max: 1,
})

const db = drizzle(client, { schema })

async function main() {
  console.log("🌱 Seeding database...")

  try {
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
        const [user] = await db
          .insert(users)
          .values({
            email: userData.email,
            name: userData.name,
            plan: userData.plan,
            passwordHash,
            emailVerified: true,
          })
          .returning()

        // Create user settings
        await db.insert(userSettings).values({
          userId: user.id,
          theme: "system",
          notifications: true,
          emailNotifications: true,
        })

        console.log(`✅ Created user: ${userData.name}`)
      } else {
        console.log(`⏭️  User already exists: ${userData.name}`)
      }
    }

    // Create demo symbols
    const demoSymbols = [
      { symbol: "BTCUSDT", name: "Bitcoin", slug: "bitcoin" },
      { symbol: "ETHUSDT", name: "Ethereum", slug: "ethereum" },
      { symbol: "ADAUSDT", name: "Cardano", slug: "cardano" },
      { symbol: "DOTUSDT", name: "Polkadot", slug: "polkadot" },
      { symbol: "LINKUSDT", name: "Chainlink", slug: "chainlink" },
    ]

    for (const symbolData of demoSymbols) {
      const [existingSymbol] = await db
        .select({ id: symbols.id })
        .from(symbols)
        .where(eq(symbols.symbol, symbolData.symbol))
        .limit(1)

      if (!existingSymbol) {
        await db.insert(symbols).values(symbolData)
        console.log(`✅ Created symbol: ${symbolData.symbol}`)
      } else {
        console.log(`⏭️  Symbol already exists: ${symbolData.symbol}`)
      }
    }

    // Generate some sample market data
    const symbolRecords = await db.select().from(symbols)
    const sampleData = []

    for (const symbol of symbolRecords) {
      // Generate 30 days of sample data
      for (let i = 0; i < 30; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)

        const basePrice = Math.random() * 50000 + 1000 // Random price between 1000-51000
        const volatility = Math.random() * 5 + 1 // 1-6% volatility
        const performance = (Math.random() - 0.5) * 10 // -5% to +5% performance

        sampleData.push({
          symbolId: symbol.id,
          timestamp: date,
          date: date,
          open: basePrice.toFixed(8),
          high: (basePrice * 1.05).toFixed(8),
          low: (basePrice * 0.95).toFixed(8),
          close: (basePrice * (1 + (Math.random() - 0.5) * 0.1)).toFixed(8),
          volume: (Math.random() * 1000000).toFixed(8),
          volatility: volatility.toFixed(4),
          liquidity: (Math.random() * 100000).toFixed(8),
          performance: performance.toFixed(4),
          timeframe: "1d",
        })
      }
    }

    // Insert market data in batches
    const batchSize = 50
    for (let i = 0; i < sampleData.length; i += batchSize) {
      const batch = sampleData.slice(i, i + batchSize)
      await db.insert(marketData).values(batch)
    }

    console.log(`✅ Created ${sampleData.length} market data records`)
    console.log("🎉 Database seeding completed!")

  } catch (error) {
    console.error("❌ Seeding failed:", error)
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
