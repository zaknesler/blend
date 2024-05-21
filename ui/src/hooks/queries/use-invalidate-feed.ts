import { debounce, leadingAndTrailing } from '@solid-primitives/scheduled';
import { QUERY_KEYS } from '~/constants/query';
import { useFilterParams } from '../use-filter-params';
import { useQueryClient } from '@tanstack/solid-query';

const DEBOUNCE_MS = 500;

/**
 * Invalidate a feed by its UUID, as well as any other caches in which it may appear, debounced.
 */
export const useInvalidateFeed = () => {
  const filter = useFilterParams();
  const queryClient = useQueryClient();

  return leadingAndTrailing(
    debounce,
    (feed_uuid: string) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS_STATS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS_VIEW, feed_uuid] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_INDEX] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_INDEX, feed_uuid, filter.getView()] });
    },
    DEBOUNCE_MS,
  );
};
