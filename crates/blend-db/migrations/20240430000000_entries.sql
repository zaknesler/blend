CREATE TABLE IF NOT EXISTS entries (
  uuid TEXT PRIMARY KEY NOT NULL,
  feed_uuid TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  summary TEXT,
  content_html TEXT,
  published_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY(feed_uuid) REFERENCES feeds(uuid),
  UNIQUE(feed_uuid, url)
);
