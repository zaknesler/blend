CREATE TABLE IF NOT EXISTS folders (
  uuid INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS folders_feeds (
  folder_uuid INTEGER NOT NULL,
  feed_uuid INTEGER NOT NULL,
  UNIQUE(folder_uuid, feed_uuid)
);
