export type FeedItem = {
  id: number;
  user_id: string;
  type: string;
  message: string;
  created_at: string;
};

export type FeedResponse = {
  items: FeedItem[];
  nextCursor: string | null;
};

const API_BASE = "http://localhost:4000";

export async function fetchFeed(cursor?: string, limit = 20): Promise<FeedResponse> {
  const url = new URL(`${API_BASE}/api/feed`);
  url.searchParams.set("limit", String(limit));
  if (cursor) url.searchParams.set("cursor", cursor);
    console.log("url ", url);
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load feed");
  return res.json();
}
