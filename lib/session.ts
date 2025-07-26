import { db } from "./db"
import { userSessions } from "./db/schema"
import { eq, and, gt } from "drizzle-orm"

export interface SessionData {
  id: string
  userId: string
  token: string
  expiresAt: Date
  userAgent?: string
  ipAddress?: string
  createdAt: Date
}

// Create a new session
export async function createSession(userId: string, userAgent?: string, ipAddress?: string): Promise<SessionData> {
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const [session] = await db
    .insert(userSessions)
    .values({
      userId,
      token,
      expiresAt,
      userAgent,
      ipAddress,
    })
    .returning()

  return session
}

// Get session by token
export async function getSession(token: string): Promise<SessionData | null> {
  const [session] = await db
    .select()
    .from(userSessions)
    .where(and(eq(userSessions.token, token), gt(userSessions.expiresAt, new Date())))
    .limit(1)

  return session || null
}

// Delete session
export async function deleteSession(token: string): Promise<void> {
  await db.delete(userSessions).where(eq(userSessions.token, token))
}

// Delete all sessions for a user
export async function deleteUserSessions(userId: string): Promise<void> {
  await db.delete(userSessions).where(eq(userSessions.userId, userId))
}

// Clean up expired sessions
export async function cleanupExpiredSessions(): Promise<void> {
  await db.delete(userSessions).where(gt(new Date(), userSessions.expiresAt))
}

// Get all active sessions for a user
export async function getUserSessions(userId: string): Promise<SessionData[]> {
  return await db
    .select()
    .from(userSessions)
    .where(and(eq(userSessions.userId, userId), gt(userSessions.expiresAt, new Date())))
}
