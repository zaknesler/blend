import { createInfiniteQuery } from '@tanstack/solid-query';
import { ApiPaginatedResponse } from '~/api';
import { getEntries } from '~/api/entries';
import { QUERY_KEYS } from '~/constants/query';
import { Entry } from '~/types/bindings/entry';
import { useFilterParams } from '../use-filter-params';

export const useInfiniteEntries = () => {
  const filter = useFilterParams();

  const query = createInfiniteQuery<ApiPaginatedResponse<Entry[]>>(() => ({
    queryKey: [QUERY_KEYS.ENTRIES_INDEX, filter.params.feed_uuid, filter.getView()],
    queryFn: fetchParams =>
      getEntries({
        feed: filter.params.feed_uuid,
        view: filter.getView(),
        cursor: fetchParams.pageParam as undefined | string,
        dir: 'desc',
      }),
    getNextPageParam: last => last.next_cursor,
    initialPageParam: undefined,
  }));

  const getAllEntries = () => query.data?.pages.flatMap(page => page.data) || [];

  return {
    query,
    getAllEntries,
  };
};
