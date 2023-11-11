import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  driver: "libsql",
  dbCredentials: {
    url: process.env.DATABASE_URL_DEV,
  },
} satisfies Config;
