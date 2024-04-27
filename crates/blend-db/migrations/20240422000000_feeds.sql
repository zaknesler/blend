CREATE TABLE IF NOT EXISTS feeds (
  uuid TEXT PRIMARY KEY NOT NULL,
  title TEXT,
  url TEXT,
  published_at DATETIME,
  updated_at DATETIME
);
