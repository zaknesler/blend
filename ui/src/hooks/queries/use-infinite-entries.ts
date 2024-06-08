import { debounce, leading } from '@solid-primitives/scheduled';
import { createInfiniteQuery } from '@tanstack/solid-query';
import { createEffect, createSignal } from 'solid-js';
import type { ApiPaginatedResponse } from '~/api';
import { getEntries } from '~/api/entries';
import { QUERY_KEYS } from '~/constants/query';
import { useViewport } from '~/contexts/viewport-context';
import type { Entry } from '~/types/bindings';
import { findEntryItem } from '~/utils/entries';
import { useQueryState } from '../../contexts/query-state-context';

export const useInfiniteEntries = () => {
  const state = useQueryState();
  const viewport = useViewport();

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

  // All the entries up until the current entry (and maybe fetch more on mobile)
  createEffect(() => {
    if (init() || !state.params.entry_uuid || !query.hasNextPage) return;

    const uuids = allEntries().map(entry => entry.uuid);

    const entryIsLoaded = uuids.includes(state.params.entry_uuid);
    const viewingLastMobile = viewport.lte('md') ? uuids[uuids.length - 1] === state.params.entry_uuid : false;

    // If the entry is not listed or if we're viewing the last item on mobile, fetch more entries
    if (!entryIsLoaded || viewingLastMobile) {
      query.fetchNextPage();
      return;
    }

    const activeItem = findEntryItem(state.params.entry_uuid);
    if (activeItem) activeItem.focus();

    setInit(true);
  });

  return {
    query,
    fetchMore,
    allEntries,
  };
};
