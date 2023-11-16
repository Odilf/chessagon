import { integer, primaryKey } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const games = sqliteTable("games", {
  id: text("id").primaryKey(),
  created_at: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  status_code: integer("status_code").notNull().default(0),
  white: text("white").references(() => users.id, { onDelete: "set null" }),
  black: text("black").references(() => users.id, { onDelete: "set null" }),
  tc_minutes: integer("tc_minutes").notNull(),
  tc_increment: integer("tc_increment").notNull(),
});

export const gameRelations = relations(games, ({ one, many }) => {
  return {
    white: one(users, {
      fields: [games.white],
      references: [users.id],
    }),
    black: one(users, {
      fields: [games.black],
      references: [users.id],
    }),

    moves: many(moves),
    drawOffers: one(drawOffers),
  };
});

export const moves = sqliteTable(
  "moves",
  {
    index: integer("index").notNull(),
    gameId: text("game_id")
      .references(() => games.id, { onDelete: "cascade" })
      .notNull(),
    origin_x: integer("origin_x").notNull(),
    origin_y: integer("origin_y").notNull(),
    target_x: integer("target_x").notNull(),
    target_y: integer("target_y").notNull(),
    timestamp: integer("timestamp", { mode: "timestamp" })
      .notNull()
      .$default(() => new Date()),
  },
  (table) => ({
    pk: primaryKey(table.index, table.gameId),
  }),
);

export const moveRelations = relations(moves, ({ one }) => {
  return {
    game: one(games, {
      fields: [moves.gameId],
      references: [games.id],
    }),
  };
});

export const drawOffers = sqliteTable("draw_offers", {
  gameId: text("game_id")
    .references(() => games.id, { onDelete: "cascade" })
    .notNull()
    .primaryKey(),
  from: integer("from").notNull(),
});

export const drawOffersRelations = relations(drawOffers, ({ one }) => {
  return {
    game: one(games, {
      fields: [drawOffers.gameId],
      references: [games.id],
    }),
  };
});
