import { debounce, leadingAndTrailing } from '@solid-primitives/scheduled';
import { useQueryClient } from '@tanstack/solid-query';
import { QUERY_KEYS } from '~/constants/query';

const DEBOUNCE_MS = 500;

/**
 * Invalidate an entry by its UUID, debounced.
 */
export const useInvalidateEntry = () => {
  const queryClient = useQueryClient();

  return leadingAndTrailing(
    debounce,
    (entry_uuid: string) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_VIEW, entry_uuid] });
    },
    DEBOUNCE_MS,
  );
};
