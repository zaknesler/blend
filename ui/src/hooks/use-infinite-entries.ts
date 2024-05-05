import { createInfiniteQuery } from '@tanstack/solid-query';
import { ApiPaginatedResponse } from '~/api';
import { getEntries } from '~/api/entries';
import { QUERY_KEYS } from '~/constants/query';
import { Entry } from '~/types/bindings/entry';

type UseInfiniteEntriesParams = {
  unread?: boolean;
  feed_uuid?: string;
  current_entry_uuid?: string;
};

export const useInfiniteEntries = (params: UseInfiniteEntriesParams) =>
  createInfiniteQuery<ApiPaginatedResponse<Entry[]>>(() => ({
    queryKey: [QUERY_KEYS.ENTRIES_INDEX, params.feed_uuid, params.unread],
    queryFn: fetchParams =>
      getEntries({
        feed: params.feed_uuid,
        unread: params.unread,
        cursor: fetchParams.pageParam as undefined | string,
      }),
    getNextPageParam: last => last.next_cursor,
    initialPageParam: undefined,
  }));
