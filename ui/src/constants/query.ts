export const QUERY_KEYS = {
  // Feeds
  FEEDS: 'feeds.index',
  FEEDS_REFRESH: 'feeds.refresh',
  FEEDS_CREATE: 'feeds.create',
  FEEDS_VIEW: 'feeds.view',
  FEEDS_VIEW_REFRESH: 'feeds.view.refresh',
  FEEDS_STATS: 'feeds.stats',

  // Entries
  ENTRIES_INDEX: 'entries.index',
  ENTRIES_VIEW: 'entries.view',
  ENTRIES_VIEW_READ: 'entries.view.read',
  ENTRIES_VIEW_UNREAD: 'entries.view.unread',
  ENTRIES_VIEW_SAVED: 'entries.view.saved',
  ENTRIES_VIEW_UNSAVED: 'entries.view.unsaved',

  // Folders
  FOLDERS: 'folders.index',
  FOLDERS_CREATE: 'folders.create',
} as const;
