import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  max: 1,
})

export const db = drizzle(client, { schema })

// Database utility functions
export async function connectDB() {
  try {
    await client`SELECT 1`
    console.log("Database connected successfully")
  } catch (error) {
    console.error("Database connection failed:", error)
    throw error
  }
}

export async function disconnectDB() {
  await client.end()
}

// Health check
export async function checkDBHealth() {
  try {
    await client`SELECT 1`
    return { status: "healthy", timestamp: new Date() }
  } catch (error) {
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date(),
    }
  }
}
