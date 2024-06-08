import { debounce, leading } from '@solid-primitives/scheduled';
import { createInfiniteQuery } from '@tanstack/solid-query';
import { createEffect, createSignal } from 'solid-js';
import type { ApiPaginatedResponse } from '~/api';
import { getEntries } from '~/api/entries';
import { QUERY_KEYS } from '~/constants/query';
import type { Entry } from '~/types/bindings';
import { findEntryItem } from '~/utils/entries';
import { useQueryState } from '../../contexts/query-state-context';

export const useInfiniteEntries = () => {
  const state = useQueryState();

  const query = createInfiniteQuery<ApiPaginatedResponse<Entry[]>>(() => ({
    queryKey: [QUERY_KEYS.ENTRIES_INDEX, state.params.feed_uuid, state.getView()],
    queryFn: fetchParams =>
      getEntries({
        feed: state.params.feed_uuid,
        view: state.getView(),
        sort: state.getSort(),
        folder: state.params.folder_slug,
        cursor: fetchParams.pageParam as undefined | string,
      }),
    getNextPageParam: last => last.next_cursor,
    initialPageParam: undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }));

  const allEntries = () => query.data?.pages.flatMap(page => page.data) || [];

  const fetchMore = leading(
    debounce,
    () => {
      // Only fetch more if we have more to fetch and we're not already fetching
      if (!query.hasNextPage || query.isFetchingNextPage) return;

      query.fetchNextPage();
    },
    100,
  );

  const [init, setInit] = createSignal(false);

  // Continue fetching entries until the active item is on the page
  createEffect(() => {
    if (init() || !state.params.entry_uuid) return;

    const uuids = allEntries().map(entry => entry.uuid);
    const loaded = uuids.includes(state.params.entry_uuid);

    // Stop the loop if we've loaded the entry
    if (loaded) {
      const activeItem = findEntryItem(state.params.entry_uuid);
      if (activeItem) activeItem.focus();

      setInit(true);
      return;
    }

    query.fetchNextPage();
  });

  return {
    query,
    fetchMore,
    allEntries,
  };
};
