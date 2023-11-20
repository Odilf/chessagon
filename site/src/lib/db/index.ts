import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { DATABASE_URL_DEV, DATABASE_URL_PROD, TURSO_AUTH_TOKEN } from "$env/static/private";
import * as schema from "./schema";
import { dev } from "$app/environment";

export const client = createClient({
  url: dev ? DATABASE_URL_DEV : DATABASE_URL_PROD,
  authToken: TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
