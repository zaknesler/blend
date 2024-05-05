CREATE VIEW IF NOT EXISTS feeds_stats AS
SELECT
  feeds.uuid,
  COUNT(entries.uuid) as count_total,
  COUNT(
    CASE
      WHEN entries.read_at IS NULL THEN 1
      ELSE NULL
    END
  ) as count_unread
FROM
  feeds
  INNER JOIN entries ON feeds.uuid = entries.feed_uuid
GROUP BY
  feeds.uuid
