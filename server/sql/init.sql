CREATE TABLE IF NOT EXISTS activity_events (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- helps feed queries
CREATE INDEX IF NOT EXISTS idx_events_created_id
ON activity_events (created_at DESC, id DESC);
