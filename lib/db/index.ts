import "server-only"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// Create a singleton connection
let globalConnection: postgres.Sql | undefined

function createConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required")
  }

  return postgres(process.env.DATABASE_URL, {
    prepare: false,
    max: 1,
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    ssl: process.env.NODE_ENV === "production" ? "require" : false,
  })
}

// Get or create connection
function getConnection() {
  if (!globalConnection) {
    globalConnection = createConnection()
  }
  return globalConnection
}

const client = getConnection()
export const db = drizzle(client, { schema })

// Database utility functions
export async function connectDB() {
  try {
    const connection = getConnection()
    await connection`SELECT 1`
    console.log("Database connected successfully")
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    throw error
  }
}

export async function disconnectDB() {
  if (globalConnection) {
    await globalConnection.end()
    globalConnection = undefined
  }
}

// Health check
export async function checkDBHealth() {
  try {
    const connection = getConnection()
    await connection`SELECT 1`
    return { status: "healthy", timestamp: new Date() }
  } catch (error) {
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date(),
    }
  }
}

// Graceful shutdown
if (typeof process !== "undefined") {
  process.on("beforeExit", async () => {
    await disconnectDB()
  })

  process.on("SIGINT", async () => {
    await disconnectDB()
    process.exit(0)
  })

  process.on("SIGTERM", async () => {
    await disconnectDB()
    process.exit(0)
  })
}
