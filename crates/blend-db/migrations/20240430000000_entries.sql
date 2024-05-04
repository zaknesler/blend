CREATE TABLE IF NOT EXISTS entries (
  uuid TEXT PRIMARY KEY NOT NULL,
  feed_uuid TEXT NOT NULL,
  id TEXT NOT NULL,
  url TEXT,
  title TEXT,
  summary TEXT,
  content_html TEXT,
  published_at DATETIME,
  updated_at DATETIME,
  UNIQUE(feed_uuid, id),
  CONSTRAINT fk_feed FOREIGN KEY (feed_uuid) REFERENCES feeds(uuid) ON DELETE CASCADE
);
