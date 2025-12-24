import { Queue } from "bullmq";
import { redis } from "./redis";

export const ingestQueue = new Queue("ingest-events", {
    connection: redis,
});