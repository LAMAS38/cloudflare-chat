-- PulseChat D1 — messages par salon
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_slug TEXT NOT NULL,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_messages_room_created
  ON messages (room_slug, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_room_user_created
  ON messages (room_slug, username, created_at DESC);
