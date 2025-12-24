import { Pool } from "pg";

export const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "app",
  password: "app",   // ← MUST be a literal string
  database: "feed",
});
