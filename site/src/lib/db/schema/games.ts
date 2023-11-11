import { integer, primaryKey } from "drizzle-orm/sqlite-core";
import { users } from "./users";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const games = sqliteTable("games", {
  id: text("id").primaryKey(),
  createdAt: integer("id", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  result_code: integer("result_code").notNull().default(0),
  white: text("white").references(() => users.id).unique(),
  black: text("black").references(() => users.id).unique(),
  tc_minutes: integer("tc_minutes").notNull(),
  tc_increment: integer("tc_increment").notNull(),
});

export const gameRelations = relations(games, ({ one }) => {
  return {
    white: one(users, {
      fields: [games.white],
      references: [users.id],
    }),
    black: one(users, {
      fields: [games.black],
      references: [users.id],
    }),
  };
})

export const moves = sqliteTable("moves", {
  id: integer("index"),
  gameId: text("game_id").references(() => games.id),
}, (table) => ({
  pk: primaryKey(table.id, table.gameId),
}));
