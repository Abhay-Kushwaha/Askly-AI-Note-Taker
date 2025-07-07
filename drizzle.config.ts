import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });
console.log(process.env.DB_URL);

export default {
    schema: "./lib/schema.ts",
    out: "./drizzle/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DB_URL,
    },
} satisfies Config;
