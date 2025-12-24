import { Router } from "express";
import { z } from "zod";
import { pool } from "../db";
import { redis } from "../redis";

const router = Router();

const QuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(20),
  cursor: z.string().optional(), // "2025-12-23T00:00:00.000Z|123"
});

function cacheKey(limit: number, cursor?: string) {
  return `feed:v1:limit=${limit}:cursor=${cursor ?? "FIRST"}`;
}

router.get("/", async (req, res) => {
  const parsed = QuerySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { limit, cursor } = parsed.data;

  // 1) Cache lookup
  const key = cacheKey(limit, cursor);
  const cached = await redis.get(key);
  if (cached) {
    return res.json(JSON.parse(cached));
  }

  // 2) Cursor → where clause
  let where = "";
  const params: any[] = [limit];

  if (cursor) {
    const [createdAtStr, idStr] = cursor.split("|");
    params.push(createdAtStr);
    params.push(Number(idStr));
    where = `WHERE (created_at, id) < ($2::timestamptz, $3::bigint)`;
  }

  const sql = `
    SELECT id, user_id, type, message, created_at
    FROM activity_events
    ${where}
    ORDER BY created_at DESC, id DESC
    LIMIT $1
  `;

  const { rows } = await pool.query(sql, params);

  const nextCursor =
    rows.length === limit
      ? `${rows[rows.length - 1].created_at.toISOString()}|${rows[rows.length - 1].id}`
      : null;

  const payload = { items: rows, nextCursor };

  // 3) Cache set (short TTL for “hot pages”)
  await redis.set(key, JSON.stringify(payload), "EX", 15);

  res.json(payload);
});

export default router;
