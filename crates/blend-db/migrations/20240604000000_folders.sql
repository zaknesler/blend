CREATE TABLE IF NOT EXISTS folders (
  uuid TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS folders_feeds (
  folder_uuid TEXT NOT NULL,
  feed_uuid TEXT NOT NULL,
  UNIQUE(folder_uuid, feed_uuid)
);
