import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { DATABASE_URL_DEV, DATABASE_URL_PROD } from "$env/static/private";
import { dev } from "$app/environment";
import todo from "ts-todo";
import * as schema from "./schema";

export const client = createClient({
  url: dev ? DATABASE_URL_DEV : DATABASE_URL_PROD,
});

export const db = drizzle(client, { schema });
