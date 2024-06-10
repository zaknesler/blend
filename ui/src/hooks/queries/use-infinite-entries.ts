import { debounce, leading } from '@solid-primitives/scheduled';
import { createInfiniteQuery } from '@tanstack/solid-query';
import { createEffect, createSignal } from 'solid-js';
import type { ApiPaginatedResponse } from '~/api';
import { getEntries } from '~/api/entries';
import { QUERY_KEYS } from '~/constants/query';
import { useViewport } from '~/contexts/viewport-context';
import type { Entry } from '~/types/bindings';
import { entryMayExistInView, findEntryItem } from '~/utils/entries';
import { useQueryState } from '../../contexts/query-state-context';
import { useEntry } from './use-entry';

/**
 * How many times are we willing to fetch more pages in order to populate the entry list up to the currently-viewed entry?
 */
const MAX_FETCHES = 20;

export const useInfiniteEntries = () => {
  const state = useQueryState();
  const viewport = useViewport();

  const entry = useEntry(() => ({ entry_uuid: state.params.entry_uuid }));

  const query = createInfiniteQuery<ApiPaginatedResponse<Entry[]>>(() => ({
    queryKey: [QUERY_KEYS.ENTRIES_INDEX, state.params.feed_uuid, state.getView()],
    queryFn: fetchParams =>
      getEntries({
        feed: state.params.feed_uuid,
        folder: state.params.folder_slug,
        cursor: fetchParams.pageParam as undefined | string,
        view: state.getView(),
        sort: state.getSort(),
      }),
    getNextPageParam: last => last.next_cursor,
    initialPageParam: undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }));

  const allEntries = () => query.data?.pages.flatMap(page => page.data) || [];

  const canFetchMore = () => query.hasNextPage && !query.isFetchingNextPage;

  // Only fetch more if we have more to fetch and we're not already fetching
  const fetchMore = leading(debounce, () => canFetchMore() && query.fetchNextPage(), 100);

  const getNextCursor = () => query.data?.pages[query.data?.pages.length - 1].next_cursor;

  const [init, setInit] = createSignal(false);
  const [fetches, setFetches] = createSignal(0);
  const [lastCursor, setLastCursor] = createSignal(getNextCursor());

  createEffect(() => {
    state.getFeedUrl();
    setInit(false);
  });

  // Load the entries up until the current entry (and maybe fetch more on mobile)
  createEffect(() => {
    if (
      init() ||
      !state.params.entry_uuid ||
      !entry.data ||
      !entryMayExistInView(entry.data, state.getView()) ||
      getNextCursor() === lastCursor() ||
      !canFetchMore()
    )
      return;

    setTimeout(() => {
      const activeItem = findEntryItem(state.params.entry_uuid);
      if (activeItem) activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);

    const uuids = allEntries().map(entry => entry.uuid);

    const entryIsLoaded = uuids.includes(state.params.entry_uuid);
    const viewingLastMobile = viewport.lte('md') ? uuids[uuids.length - 1] === state.params.entry_uuid : false;

    // If the entry is not listed or if we're viewing the last item on mobile, fetch more entries
    if ((!entryIsLoaded && fetches() < MAX_FETCHES) || viewingLastMobile) {
      query.fetchNextPage();
      setFetches(val => val + 1);
      setLastCursor(getNextCursor());
      return;
    }

    setInit(true);
  });

  return {
    query,
    fetchMore,
    allEntries,
  };
};
