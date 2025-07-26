import { pgTable, text, timestamp, boolean, decimal, uuid, pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Enums
export const planEnum = pgEnum("plan", ["FREE", "PRO", "ENTERPRISE"])
export const themeEnum = pgEnum("theme", ["light", "dark", "system"])

// Users table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  passwordHash: text("password_hash").notNull(),
  plan: planEnum("plan").notNull().default("FREE"),
  emailVerified: boolean("email_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// User settings table
export const userSettings = pgTable("user_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  theme: themeEnum("theme").notNull().default("system"),
  notifications: boolean("notifications").notNull().default(true),
  emailNotifications: boolean("email_notifications").notNull().default(true),
  pushNotifications: boolean("push_notifications").notNull().default(false),
  dataRetention: text("data_retention").notNull().default("30d"),
  apiRateLimit: text("api_rate_limit").notNull().default("1000"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// Symbols table
export const symbols = pgTable("symbols", {
  id: uuid("id").defaultRandom().primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  category: text("category").notNull().default("cryptocurrency"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// Market data table
export const marketData = pgTable("market_data", {
  id: uuid("id").defaultRandom().primaryKey(),
  symbolId: uuid("symbol_id")
    .notNull()
    .references(() => symbols.id, { onDelete: "cascade" }),
  timestamp: timestamp("timestamp").notNull(),
  date: timestamp("date").notNull(),
  open: decimal("open", { precision: 20, scale: 8 }).notNull(),
  high: decimal("high", { precision: 20, scale: 8 }).notNull(),
  low: decimal("low", { precision: 20, scale: 8 }).notNull(),
  close: decimal("close", { precision: 20, scale: 8 }).notNull(),
  volume: decimal("volume", { precision: 20, scale: 8 }).notNull(),
  volatility: decimal("volatility", { precision: 10, scale: 4 }),
  liquidity: decimal("liquidity", { precision: 20, scale: 8 }),
  performance: decimal("performance", { precision: 10, scale: 4 }),
  timeframe: text("timeframe").notNull().default("1d"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// User watchlists table
export const userWatchlists = pgTable("user_watchlists", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// Watchlist symbols table (many-to-many)
export const watchlistSymbols = pgTable("watchlist_symbols", {
  id: uuid("id").defaultRandom().primaryKey(),
  watchlistId: uuid("watchlist_id")
    .notNull()
    .references(() => userWatchlists.id, { onDelete: "cascade" }),
  symbolId: uuid("symbol_id")
    .notNull()
    .references(() => symbols.id, { onDelete: "cascade" }),
  addedAt: timestamp("added_at").notNull().defaultNow(),
})

// Price alerts table
export const priceAlerts = pgTable("price_alerts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  symbolId: uuid("symbol_id")
    .notNull()
    .references(() => symbols.id, { onDelete: "cascade" }),
  condition: text("condition").notNull(), // "above", "below", "change"
  targetPrice: decimal("target_price", { precision: 20, scale: 8 }),
  percentageChange: decimal("percentage_change", { precision: 10, scale: 4 }),
  isActive: boolean("is_active").notNull().default(true),
  triggered: boolean("triggered").notNull().default(false),
  triggeredAt: timestamp("triggered_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// User sessions table
export const userSessions = pgTable("user_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  settings: one(userSettings, {
    fields: [users.id],
    references: [userSettings.userId],
  }),
  watchlists: many(userWatchlists),
  priceAlerts: many(priceAlerts),
  sessions: many(userSessions),
}))

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}))

export const symbolsRelations = relations(symbols, ({ many }) => ({
  marketData: many(marketData),
  watchlistSymbols: many(watchlistSymbols),
  priceAlerts: many(priceAlerts),
}))

export const marketDataRelations = relations(marketData, ({ one }) => ({
  symbol: one(symbols, {
    fields: [marketData.symbolId],
    references: [symbols.id],
  }),
}))

export const userWatchlistsRelations = relations(userWatchlists, ({ one, many }) => ({
  user: one(users, {
    fields: [userWatchlists.userId],
    references: [users.id],
  }),
  symbols: many(watchlistSymbols),
}))

export const watchlistSymbolsRelations = relations(watchlistSymbols, ({ one }) => ({
  watchlist: one(userWatchlists, {
    fields: [watchlistSymbols.watchlistId],
    references: [userWatchlists.id],
  }),
  symbol: one(symbols, {
    fields: [watchlistSymbols.symbolId],
    references: [symbols.id],
  }),
}))

export const priceAlertsRelations = relations(priceAlerts, ({ one }) => ({
  user: one(users, {
    fields: [priceAlerts.userId],
    references: [users.id],
  }),
  symbol: one(symbols, {
    fields: [priceAlerts.symbolId],
    references: [symbols.id],
  }),
}))

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}))
