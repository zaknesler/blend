import { createInfiniteQuery } from '@tanstack/solid-query';
import { ApiPaginatedResponse } from '~/api';
import { getEntries } from '~/api/entries';
import { QUERY_KEYS } from '~/constants/query';
import { type Entry } from '~/types/bindings';
import { useFilterParams } from '../use-filter-params';
import { debounce } from '@solid-primitives/scheduled';

export const useInfiniteEntries = () => {
  const filter = useFilterParams();

  const query = createInfiniteQuery<ApiPaginatedResponse<Entry[]>>(() => ({
    queryKey: [QUERY_KEYS.ENTRIES_INDEX, filter.params.feed_uuid, filter.getView()],
    queryFn: fetchParams =>
      getEntries({
        feed: filter.params.feed_uuid,
        view: filter.getView(),
        sort: filter.getSort(),
        cursor: fetchParams.pageParam as undefined | string,
      }),
    getNextPageParam: last => last.next_cursor,
    initialPageParam: undefined,
  }));

  const getAllEntries = () => query.data?.pages.flatMap(page => page.data) || [];

  const fetchMore = debounce(() => {
    // Only fetch more if we have more to fetch and we're not already fetching
    if (!query.hasNextPage || query.isFetchingNextPage) return;

    query.fetchNextPage();
  }, 100);

  return {
    query,
    getAllEntries,
    fetchMore,
  };
};
