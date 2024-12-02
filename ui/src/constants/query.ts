import { type FilterEntriesParams, SortDirection, View } from '~/types/bindings';

export const QUERY_KEYS = {
  // Feeds
  FEEDS: 'feeds.index',
  FEEDS_REFRESH: 'feeds.refresh',
  FEEDS_CREATE: 'feeds.create',
  FEEDS_VIEW: 'feeds.view',
  FEEDS_VIEW_REFRESH: 'feeds.view.refresh',
  FEEDS_VIEW_READ: 'feeds.view.read',
  FEEDS_STATS: 'feeds.stats',
  FEEDS_FOLDERS_UPDATE: 'feeds.folders.update',

  // Entries
  ENTRIES_INDEX: 'entries.index',
  ENTRIES_INDEX_READ: 'entries.index.read',
  ENTRIES_VIEW: 'entries.view',
  ENTRIES_VIEW_READ: 'entries.view.read',
  ENTRIES_VIEW_UNREAD: 'entries.view.unread',
  ENTRIES_VIEW_SAVED: 'entries.view.saved',
  ENTRIES_VIEW_UNSAVED: 'entries.view.unsaved',

  // Folders
  FOLDERS: 'folders.index',
  FOLDERS_CREATE: 'folders.create',
} as const;

export type RouterParams = {
  entry_uuid?: string;
  feed_uuid?: string;
  folder_slug?: string;
};

export type QueryParams = Partial<Pick<FilterEntriesParams, 'view' | 'sort'>>;

export const DEFAULTS: Required<QueryParams> = {
  view: View.Unread,
  sort: SortDirection.Newest,
};
