import { createInfiniteQuery } from '@tanstack/solid-query';
import { ApiPaginatedResponse } from '~/api';
import { getEntries } from '~/api/entries';
import { QUERY_KEYS } from '~/constants/query';
import { Entry } from '~/types/bindings/entry';
import { useFilter } from './use-filter';

export const useInfiniteEntries = () => {
  const filter = useFilter();

  return createInfiniteQuery<ApiPaginatedResponse<Entry[]>>(() => ({
    queryKey: [QUERY_KEYS.ENTRIES_INDEX, filter.params.feed_uuid, filter.getUnread()],
    queryFn: fetchParams =>
      getEntries({
        feed: filter.params.feed_uuid,
        unread: filter.getUnread(),
        cursor: fetchParams.pageParam as undefined | string,
      }),
    getNextPageParam: last => last.next_cursor,
    initialPageParam: undefined,
  }));
};
