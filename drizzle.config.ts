import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: [
    "./src/integrations/db/tables.ts",
    "./src/integrations/db/auth-schema.ts",
    "./src/integrations/db/relations.ts",
  ],
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_ACCESS_TOKEN,
  },
});
