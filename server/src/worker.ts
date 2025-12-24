import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import { pool } from "./db";
import { redis } from "./redis";

new Worker(
  "ingest-events",
  async (job) => {
    const { userId, type, message } = job.data;

    await pool.query(
      `INSERT INTO activity_events (user_id, type, message) VALUES ($1,$2,$3)`,
      [userId, type, message]
    );

    // simplest invalidation: clear FIRST page caches
    const keys = await redis.keys("feed:v1:limit=*cursor=FIRST");
    if (keys.length) await redis.del(keys);
  },
  { connection: { url: process.env.REDIS_URL! } }
);

console.log("Worker running...");
