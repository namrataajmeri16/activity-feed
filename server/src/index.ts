import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import feedRouter from "./routes/feed";
import eventsRouter from "./routes/events";
import path from "path";
import seedRouter from "./routes/seed";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

//docker exec -it activity-feed-db-1 psql -U app -d feed

console.log("DB URL:", process.env.DATABASE_URL);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/events", eventsRouter);
app.get("/health", (_, res) => res.json({ ok: true }));
app.use("/api/feed", feedRouter);
//app.use("/api/seed", seedRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API on :${port}`));
