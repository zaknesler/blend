CREATE TABLE IF NOT EXISTS feeds (
  uuid TEXT PRIMARY KEY NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  published_at DATETIME,
  updated_at DATETIME,
  UNIQUE(url)
);
