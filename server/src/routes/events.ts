import { Router } from "express";
import { z } from "zod";
import { ingestQueue } from "../queue";

const router = Router();

const BodySchema = z.object({
  userId: z.string(),
  type: z.string(),
  message: z.string(),
});

router.post("/", async (req, res) => {
  const parsed = BodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  await ingestQueue.add("ingest", parsed.data, {
    removeOnComplete: true,
    attempts: 3,
  });

  res.status(202).json({ queued: true });
});

export default router;
