// server/src/routes/seed.ts
import { Router } from "express";
import { pool } from "../db";

const router = Router();
/*
router.post("/", async (_, res) => {
  for (let i = 0; i < 15; i++) {
    await pool.query(
      `INSERT INTO activity_events (user_id, type, message)
       VALUES ($1, $2, $3)`,
      ["u1", "ACTION", `Action event #${i + 1}`]
    );
  }
  res.json({ inserted: 15 });
});*/

export default router;
