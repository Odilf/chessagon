import type { Config } from "drizzle-kit";
import "dotenv/config";

const url = process.argv.includes("--prod")
  ? process.env.DATABASE_URL_PROD
  : process.env.DATABASE_URL_DEV;

export default {
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  driver: "libsql",
  dbCredentials: {
    url,
  },
} satisfies Config;
