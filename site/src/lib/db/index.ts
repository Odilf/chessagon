import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { DATABASE_URL_DEV, DATABASE_URL_PROD, TURSO_AUTH_TOKEN } from "$env/static/private";
import * as schema from "./schema";

export const client = createClient({
  url: DATABASE_URL_DEV,
  syncUrl: DATABASE_URL_PROD,
  authToken: TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
