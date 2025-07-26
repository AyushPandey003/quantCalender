import { pgTable, text, timestamp, boolean, decimal, uuid, index, uniqueIndex } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Users table
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    passwordHash: text("password_hash").notNull(),
    avatar: text("avatar"),
    plan: text("plan", { enum: ["FREE", "PRO", "ENTERPRISE"] })
      .notNull()
      .default("FREE"),
    emailVerified: boolean("email_verified").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    lastLoginAt: timestamp("last_login_at"),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    createdAtIdx: index("users_created_at_idx").on(table.createdAt),
  }),
)

// User settings table
export const userSettings = pgTable("user_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  theme: text("theme", { enum: ["light", "dark", "system"] })
    .notNull()
    .default("system"),
  notifications: boolean("notifications").notNull().default(true),
  emailNotifications: boolean("email_notifications").notNull().default(true),
  marketAlerts: boolean("market_alerts").notNull().default(true),
  priceAlerts: boolean("price_alerts").notNull().default(true),
  newsAlerts: boolean("news_alerts").notNull().default(false),
  defaultTimeframe: text("default_timeframe").notNull().default("1d"),
  defaultSymbols: text("default_symbols").array().notNull().default(["BTCUSDT", "ETHUSDT"]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// Symbols table
export const symbols = pgTable(
  "symbols",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    symbol: text("symbol").notNull().unique(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    category: text("category").notNull().default("cryptocurrency"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    symbolIdx: uniqueIndex("symbols_symbol_idx").on(table.symbol),
    categoryIdx: index("symbols_category_idx").on(table.category),
    activeIdx: index("symbols_active_idx").on(table.isActive),
  }),
)

// Market data table
export const marketData = pgTable(
  "market_data",
  {
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
  },
  (table) => ({
    symbolDateIdx: index("market_data_symbol_date_idx").on(table.symbolId, table.date),
    timestampIdx: index("market_data_timestamp_idx").on(table.timestamp),
    timeframeIdx: index("market_data_timeframe_idx").on(table.timeframe),
    symbolTimeframeIdx: index("market_data_symbol_timeframe_idx").on(table.symbolId, table.timeframe),
  }),
)

// User watchlists table
export const userWatchlists = pgTable(
  "user_watchlists",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    symbolId: uuid("symbol_id")
      .notNull()
      .references(() => symbols.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    userSymbolIdx: uniqueIndex("user_watchlists_user_symbol_idx").on(table.userId, table.symbolId),
    userIdx: index("user_watchlists_user_idx").on(table.userId),
  }),
)

// Price alerts table
export const priceAlerts = pgTable(
  "price_alerts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    symbolId: uuid("symbol_id")
      .notNull()
      .references(() => symbols.id, { onDelete: "cascade" }),
    condition: text("condition", { enum: ["above", "below"] }).notNull(),
    targetPrice: decimal("target_price", { precision: 20, scale: 8 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    isTriggered: boolean("is_triggered").notNull().default(false),
    triggeredAt: timestamp("triggered_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("price_alerts_user_idx").on(table.userId),
    symbolIdx: index("price_alerts_symbol_idx").on(table.symbolId),
    activeIdx: index("price_alerts_active_idx").on(table.isActive),
  }),
)

// User sessions table
export const userSessions = pgTable(
  "user_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    sessionToken: text("session_token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    sessionTokenIdx: uniqueIndex("user_sessions_token_idx").on(table.sessionToken),
    userIdx: index("user_sessions_user_idx").on(table.userId),
    expiresIdx: index("user_sessions_expires_idx").on(table.expiresAt),
  }),
)

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
  watchlists: many(userWatchlists),
  priceAlerts: many(priceAlerts),
}))

export const marketDataRelations = relations(marketData, ({ one }) => ({
  symbol: one(symbols, {
    fields: [marketData.symbolId],
    references: [symbols.id],
  }),
}))

export const userWatchlistsRelations = relations(userWatchlists, ({ one }) => ({
  user: one(users, {
    fields: [userWatchlists.userId],
    references: [users.id],
  }),
  symbol: one(symbols, {
    fields: [userWatchlists.symbolId],
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
