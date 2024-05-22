/*
 Generated by typeshare 1.9.2
*/

export interface Entry {
  uuid: string;
  feed_uuid: string;
  id: string;
  url: string;
  title?: string;
  summary_html?: string;
  content_html?: string;
  content_scraped_html?: string;
  published_at?: string;
  updated_at?: string;
  read_at?: string;
  saved_at?: string;
}

export interface Feed {
  uuid: string;
  id: string;
  url_feed: string;
  url_site?: string;
  title?: string;
  title_display?: string;
  favicon_b64?: string;
  favicon_url?: string;
  published_at?: string;
  updated_at?: string;
}

export interface FeedStats {
  uuid: string;
  count_total: number;
  count_unread: number;
}

export enum SortDirection {
  Oldest = 'oldest',
  Newest = 'newest',
}

export enum View {
  All = 'all',
  Read = 'read',
  Unread = 'unread',
}

export interface FilterEntriesParams {
  sort: SortDirection;
  cursor?: string;
  feed?: string;
  view?: View;
}

export type Notification =
  | {
      type: 'StartedFeedRefresh';
      data: {
        feed_uuid: string;
      };
    }
  | {
      type: 'FinishedFeedRefresh';
      data: {
        feed_uuid: string;
      };
    }
  | {
      type: 'EntriesFetched';
      data: {
        feed_uuid: string;
        entry_uuids: string[];
      };
    };
