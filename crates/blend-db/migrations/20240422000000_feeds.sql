CREATE TABLE IF NOT EXISTS feeds (
  uuid TEXT PRIMARY KEY NOT NULL,
  id TEXT NOT NULL,
  url_feed TEXT NOT NULL,
  url_site TEXT,
  title TEXT,
  published_at DATETIME,
  updated_at DATETIME,
  UNIQUE(id)
);
