import { prisma } from "../lib/db"
import bcrypt from "bcryptjs"

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

    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        name: userData.name,
        plan: userData.plan,
        passwordHash,
        emailVerified: true,
        settings: {
          create: {},
        },
      },
    })
  }

  // Create symbols
  const symbols = [
    { symbol: "BTCUSDT", name: "Bitcoin", slug: "bitcoin" },
    { symbol: "ETHUSDT", name: "Ethereum", slug: "ethereum" },
    { symbol: "ADAUSDT", name: "Cardano", slug: "cardano" },
    { symbol: "DOTUSDT", name: "Polkadot", slug: "polkadot" },
    { symbol: "LINKUSDT", name: "Chainlink", slug: "chainlink" },
    { symbol: "SOLUSDT", name: "Solana", slug: "solana" },
    { symbol: "MATICUSDT", name: "Polygon", slug: "polygon" },
    { symbol: "AVAXUSDT", name: "Avalanche", slug: "avalanche-2" },
  ]

  for (const symbolData of symbols) {
    await prisma.symbol.upsert({
      where: { symbol: symbolData.symbol },
      update: {},
      create: symbolData,
    })
  }

  // Generate sample market data
  const btcSymbol = await prisma.symbol.findUnique({
    where: { symbol: "BTCUSDT" },
  })

  if (btcSymbol) {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000)
      const basePrice = 45000 + Math.random() * 10000

      await prisma.marketData.create({
        data: {
          symbolId: btcSymbol.id,
          timestamp: date,
          date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          open: basePrice,
          high: basePrice * (1 + Math.random() * 0.05),
          low: basePrice * (1 - Math.random() * 0.05),
          close: basePrice * (1 + (Math.random() - 0.5) * 0.02),
          volume: Math.random() * 1000000000 + 100000000,
          volatility: Math.random() * 5 + 1,
          liquidity: Math.random() * 1000000000 + 100000000,
          performance: (Math.random() - 0.5) * 10,
          timeframe: "1d",
        },
      })
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
    await prisma.$disconnect()
  })
