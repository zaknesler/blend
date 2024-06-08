export const QUERY_KEYS = {
  // Feeds
  FEEDS: 'feeds.index',
  FEEDS_REFRESH: 'mut.feeds.refresh',
  FEEDS_ADD: 'mut.feeds.add',
  FEEDS_VIEW: 'feed.view',
  FEEDS_VIEW_REFRESH: 'mut.feed.view',
  FEEDS_STATS: 'feeds.stats',

  // Entries
  ENTRIES_INDEX: 'entries.index',
  ENTRIES_VIEW: 'entries.view',
  ENTRIES_VIEW_READ: 'mut.entries.view.read',
  ENTRIES_VIEW_UNREAD: 'mut.entries.view.unread',
  ENTRIES_VIEW_SAVED: 'mut.entries.view.saved',
  ENTRIES_VIEW_UNSAVED: 'mut.entries.view.unsaved',
} as const;
