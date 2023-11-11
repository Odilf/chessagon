import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { DATABASE_URL_DEV } from "$env/static/private";
import { dev } from "$app/environment";
import todo from "ts-todo";
import * as schema from "./schema";

export const client = createClient({
  url: DATABASE_URL_DEV,
  // url: dev ? DATABASE_URL_DEV : todo(),
});

export const db = drizzle(client, { schema });
