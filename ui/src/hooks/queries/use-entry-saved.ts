import { createMutation, useQueryClient } from '@tanstack/solid-query';
import { updateEntryAsSaved, updateEntryAsUnsaved } from '~/api/entries';
import { QUERY_KEYS } from '~/constants/query';
import { useQueryState } from '~/contexts/query-state-context';
import { useInvalidateStats } from '~/hooks/queries/use-invalidate-stats';

export const useEntrySaved = () => {
  const state = useQueryState();
  const queryClient = useQueryClient();
  const invalidateStats = useInvalidateStats();

  const markAsSaved = createMutation(() => ({
    mutationKey: [QUERY_KEYS.ENTRIES_VIEW_SAVED],
    mutationFn: updateEntryAsSaved,
  }));

  const markAsUnsaved = createMutation(() => ({
    mutationKey: [QUERY_KEYS.ENTRIES_VIEW_UNSAVED],
    mutationFn: updateEntryAsUnsaved,
  }));

  const invalidate = (entry_uuid: string, feed_uuid: string, invalidateIndex: boolean) => {
    invalidateStats();
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_VIEW, entry_uuid] });

    if (invalidateIndex)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_INDEX, feed_uuid, state.getView()] });
  };

  const handleMarkSaved = (entry_uuid: string, feed_uuid: string, invalidateIndex = false) =>
    markAsSaved.mutateAsync(entry_uuid).then(() => invalidate(entry_uuid, feed_uuid, invalidateIndex));

  const handleMarkUnsaved = (entry_uuid: string, feed_uuid: string, invalidateIndex = false) =>
    markAsUnsaved.mutateAsync(entry_uuid).then(() => invalidate(entry_uuid, feed_uuid, invalidateIndex));

  return {
    markSaved: handleMarkSaved,
    markUnsaved: handleMarkUnsaved,
  };
};
