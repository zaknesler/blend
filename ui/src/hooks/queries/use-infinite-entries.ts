import { createInfiniteQuery } from '@tanstack/solid-query';
import { ApiPaginatedResponse } from '~/api';
import { getEntries } from '~/api/entries';
import { QUERY_KEYS } from '~/constants/query';
import { type Entry } from '~/types/bindings';
import { useFilterParams } from '../use-filter-params';
import { debounce, leading } from '@solid-primitives/scheduled';
import { createEffect, createSignal } from 'solid-js';
import { getEntryComparator } from '~/utils/entries';

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
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }));

  const getAllEntries = () => query.data?.pages.flatMap(page => page.data) || [];

  // Maintain local state of entries to prevent entries just marked as read from being removed
  const [localEntries, setLocalEntries] = createSignal(getAllEntries());

  // Associate the local entries with the feed we're viewing, so we know when to reset the data
  const [localFeedKey, setLocalFeedKey] = createSignal(filter.getFeedUrl());

  createEffect(() => {
    const currentIds = localEntries().map(entry => entry.id);
    const newEntries = getAllEntries().filter(entry => !currentIds.includes(entry.id));

    // Don't bother updating local state if we've got nothing to add
    if (!newEntries.length) return;

    // Add new entries and sort to maintain order
    setLocalEntries([...localEntries(), ...newEntries].sort(getEntryComparator(filter.getSort())));
  });

  createEffect(() => {
    const feedKey = filter.getFeedUrl();

    // Only reset the local cache if we look at a new feed
    if (localFeedKey() === feedKey) return;

    // Reset the local cache
    setLocalFeedKey(feedKey);
    setLocalEntries(getAllEntries());
  });

  const fetchMore = leading(
    debounce,
    () => {
      // Only fetch more if we have more to fetch and we're not already fetching
      if (!query.hasNextPage || query.isFetchingNextPage) return;

      query.fetchNextPage();
    },
    100,
  );

  return {
    query,
    localEntries,
    getAllEntries,
    fetchMore,
  };
};
