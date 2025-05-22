import { debounce, leadingAndTrailing } from '@solid-primitives/scheduled';
import { useQueryClient } from '@tanstack/solid-query';
import { QUERY_KEYS } from '~/constants/query';

const DEBOUNCE_MS = 500;

/**
 * Invalidate all folders.
 */
export const useInvalidateFolders = () => {
  const queryClient = useQueryClient();

  return leadingAndTrailing(
    debounce,
    () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FOLDERS] });
    },
    DEBOUNCE_MS,
  );
};
