import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  json,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Enums
export const planEnum = pgEnum("plan", ["FREE", "PRO", "ENTERPRISE"])
export const alertTypeEnum = pgEnum("alert_type", ["PRICE", "VOLUME", "VOLATILITY", "PERCENTAGE_CHANGE"])
export const alertConditionEnum = pgEnum("alert_condition", ["ABOVE", "BELOW", "CROSSES_ABOVE", "CROSSES_BELOW"])

// User Management
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  plan: planEnum("plan").default("FREE").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),

  // Authentication
  passwordHash: text("password_hash").notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  emailVerificationToken: text("email_verification_token"),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
})

export const userSettings = pgTable("user_settings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),

  // Theme preferences
  theme: text("theme").default("system").notNull(),
  colorScheme: text("color_scheme").default("default").notNull(),
  fontSize: text("font_size").default("medium").notNull(),
  reducedMotion: boolean("reduced_motion").default(false).notNull(),
  highContrast: boolean("high_contrast").default(false).notNull(),

  // Notification preferences
  emailNotifications: boolean("email_notifications").default(true).notNull(),
  pushNotifications: boolean("push_notifications").default(true).notNull(),
  soundEnabled: boolean("sound_enabled").default(true).notNull(),
  notificationVolume: integer("notification_volume").default(75).notNull(),

  // Data preferences
  defaultTimeframe: text("default_timeframe").default("1D").notNull(),
  defaultMetric: text("default_metric").default("volatility").notNull(),
  cacheSize: integer("cache_size").default(500).notNull(),
  dataRetention: integer("data_retention").default(30).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const userSessions = pgTable("user_sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  sessionToken: text("session_token").notNull().unique(),
  device: text("device"),
  browser: text("browser"),
  os: text("os"),
  ipAddress: text("ip_address"),
  location: text("location"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastActive: timestamp("last_active").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
})

export const apiKeys = pgTable("api_keys", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  keyHash: text("key_hash").notNull().unique(),
  lastUsed: timestamp("last_used"),
  permissions: json("permissions").default({}).notNull(),
  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
})

// Market Data Models
export const symbols = pgTable("symbols", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),
  isActive: boolean("is_active").default(true).notNull(),

  metadata: json("metadata").default({}).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const marketData = pgTable(
  "market_data",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    symbolId: text("symbol_id")
      .notNull()
      .references(() => symbols.id, { onDelete: "cascade" }),

    // Time data
    timestamp: timestamp("timestamp").notNull(),
    date: timestamp("date").notNull(),

    // OHLCV data
    open: decimal("open", { precision: 20, scale: 8 }).notNull(),
    high: decimal("high", { precision: 20, scale: 8 }).notNull(),
    low: decimal("low", { precision: 20, scale: 8 }).notNull(),
    close: decimal("close", { precision: 20, scale: 8 }).notNull(),
    volume: decimal("volume", { precision: 20, scale: 8 }).notNull(),

    // Calculated metrics
    volatility: decimal("volatility", { precision: 10, scale: 4 }),
    liquidity: decimal("liquidity", { precision: 20, scale: 8 }),
    performance: decimal("performance", { precision: 10, scale: 4 }),

    // Technical indicators
    sma20: decimal("sma20", { precision: 20, scale: 8 }),
    sma50: decimal("sma50", { precision: 20, scale: 8 }),
    rsi: decimal("rsi", { precision: 5, scale: 2 }),
    macd: decimal("macd", { precision: 20, scale: 8 }),

    // Metadata
    source: text("source").default("api").notNull(),
    timeframe: text("timeframe").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    symbolTimestampTimeframeIdx: uniqueIndex("symbol_timestamp_timeframe_idx").on(
      table.symbolId,
      table.timestamp,
      table.timeframe,
    ),
    symbolDateIdx: index("symbol_date_idx").on(table.symbolId, table.date),
    timestampIdx: index("timestamp_idx").on(table.timestamp),
    dateIdx: index("date_idx").on(table.date),
  }),
)

// User Features
export const watchlists = pgTable("watchlists", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  description: text("description"),
  isDefault: boolean("is_default").default(false).notNull(),
  color: text("color").default("#3b82f6").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const watchlistItems = pgTable(
  "watchlist_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    watchlistId: text("watchlist_id")
      .notNull()
      .references(() => watchlists.id, { onDelete: "cascade" }),
    symbolId: text("symbol_id")
      .notNull()
      .references(() => symbols.id, { onDelete: "cascade" }),

    order: integer("order").default(0).notNull(),
    notes: text("notes"),
    addedAt: timestamp("added_at").defaultNow().notNull(),
  },
  (table) => ({
    watchlistSymbolIdx: uniqueIndex("watchlist_symbol_idx").on(table.watchlistId, table.symbolId),
  }),
)

export const priceAlerts = pgTable("price_alerts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  symbolId: text("symbol_id")
    .notNull()
    .references(() => symbols.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  alertType: alertTypeEnum("alert_type").notNull(),
  condition: alertConditionEnum("condition").notNull(),
  targetValue: decimal("target_value", { precision: 20, scale: 8 }).notNull(),

  isActive: boolean("is_active").default(true).notNull(),
  isTriggered: boolean("is_triggered").default(false).notNull(),
  triggeredAt: timestamp("triggered_at"),

  // Notification settings
  emailNotification: boolean("email_notification").default(true).notNull(),
  pushNotification: boolean("push_notification").default(true).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  settings: one(userSettings),
  watchlists: many(watchlists),
  alerts: many(priceAlerts),
  sessions: many(userSessions),
  apiKeys: many(apiKeys),
}))

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}))

export const symbolsRelations = relations(symbols, ({ many }) => ({
  marketData: many(marketData),
  watchlistItems: many(watchlistItems),
  alerts: many(priceAlerts),
}))

export const marketDataRelations = relations(marketData, ({ one }) => ({
  symbol: one(symbols, {
    fields: [marketData.symbolId],
    references: [symbols.id],
  }),
}))

export const watchlistsRelations = relations(watchlists, ({ one, many }) => ({
  user: one(users, {
    fields: [watchlists.userId],
    references: [users.id],
  }),
  items: many(watchlistItems),
}))

export const watchlistItemsRelations = relations(watchlistItems, ({ one }) => ({
  watchlist: one(watchlists, {
    fields: [watchlistItems.watchlistId],
    references: [watchlists.id],
  }),
  symbol: one(symbols, {
    fields: [watchlistItems.symbolId],
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
