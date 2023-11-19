import type { Config } from "drizzle-kit";
import "dotenv/config";

const prod = process.argv.includes("--prod");

const url = prod ? process.env.DATABASE_URL_PROD : process.env.DATABASE_URL_DEV;

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  driver: prod ? "turso" : "libsql",
  dbCredentials: {
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
