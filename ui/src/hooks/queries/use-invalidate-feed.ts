import { debounce, leadingAndTrailing } from '@solid-primitives/scheduled';
import { useQueryClient } from '@tanstack/solid-query';
import { QUERY_KEYS } from '~/constants/query';
import { useQueryState } from '../../contexts/query-state-context';

const DEBOUNCE_MS = 500;

/**
 * Invalidate a feed by its UUID, as well as any other caches in which it may appear, debounced.
 */
export const useInvalidateFeed = () => {
  const state = useQueryState();
  const queryClient = useQueryClient();

  return leadingAndTrailing(
    debounce,
    (feed_uuid: string) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS_STATS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS_VIEW, feed_uuid] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_INDEX, undefined, state.getView()] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_INDEX, feed_uuid, state.getView()] });
    },
    DEBOUNCE_MS,
  );
};
