import { createMutation, useQueryClient } from '@tanstack/solid-query';
import { updateEntryAsRead, updateEntryAsUnread } from '~/api/entries';
import { QUERY_KEYS } from '~/constants/query';
import { useQueryState } from '~/contexts/query-state-context';
import { useInvalidateStats } from '~/hooks/queries/use-invalidate-stats';

export const useEntryRead = () => {
  const state = useQueryState();
  const queryClient = useQueryClient();
  const invalidateStats = useInvalidateStats();

  const markAsRead = createMutation(() => ({
    mutationKey: [QUERY_KEYS.ENTRIES_VIEW_READ],
    mutationFn: updateEntryAsRead,
  }));

  const markAsUnread = createMutation(() => ({
    mutationKey: [QUERY_KEYS.ENTRIES_VIEW_UNREAD],
    mutationFn: updateEntryAsUnread,
  }));

  const invalidate = (entry_uuid: string, invalidateIndex: boolean) => {
    invalidateStats();
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_VIEW, entry_uuid] });

    if (invalidateIndex)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_INDEX, undefined, state.getView()] });
  };

  const handleMarkRead = (entry_uuid: string, invalidateIndex = false) =>
    markAsRead.mutateAsync(entry_uuid).then(() => invalidate(entry_uuid, invalidateIndex));

  const handleMarkUnread = (entry_uuid: string, invalidateIndex = false) =>
    markAsUnread.mutateAsync(entry_uuid).then(() => invalidate(entry_uuid, invalidateIndex));

  return {
    markRead: handleMarkRead,
    markUnread: handleMarkUnread,
  };
};
