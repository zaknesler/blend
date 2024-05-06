import { createInfiniteQuery } from '@tanstack/solid-query';
import { ApiPaginatedResponse } from '~/api';
import { getEntries } from '~/api/entries';
import { QUERY_KEYS } from '~/constants/query';
import { Entry } from '~/types/bindings/entry';
import { useFilterParams } from './use-filter-params';

export const useInfiniteEntries = () => {
  const filter = useFilterParams();

  const unread = () => filter.getView() === 'unread' || undefined;

  return createInfiniteQuery<ApiPaginatedResponse<Entry[]>>(() => ({
    queryKey: [QUERY_KEYS.ENTRIES_INDEX, filter.params.feed_uuid, unread()],
    queryFn: fetchParams =>
      getEntries({
        feed: filter.params.feed_uuid,
        unread: unread(),
        cursor: fetchParams.pageParam as undefined | string,
      }),
    getNextPageParam: last => last.next_cursor,
    initialPageParam: undefined,
  }));
};
