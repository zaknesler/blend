CREATE TABLE IF NOT EXISTS folders (
  id INTEGER PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS folders_feeds (
  id INTEGER PRIMARY KEY,
  folder_id INTEGER NOT NULL,
  feed_uuid INTEGER NOT NULL,
  UNIQUE(folder_id, feed_uuid)
);
