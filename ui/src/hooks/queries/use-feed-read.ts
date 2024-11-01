import { createMutation, useQueryClient } from '@tanstack/solid-query';
import { updateFeedAsRead } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';
import { useQueryState } from '~/contexts/query-state-context';
import { useInvalidateStats } from '~/hooks/queries/use-invalidate-stats';

export const useFeedRead = () => {
  const state = useQueryState();
  const queryClient = useQueryClient();
  const invalidateStats = useInvalidateStats();

  const markAsRead = createMutation(() => ({
    mutationKey: [QUERY_KEYS.FEEDS_VIEW_READ],
    mutationFn: updateFeedAsRead,
  }));

  const invalidate = (feed_uuid: string) => {
    invalidateStats();
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS_VIEW, feed_uuid] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_INDEX, undefined, state.getView()] });
  };

  return (feed_uuid: string) => markAsRead.mutateAsync(feed_uuid).then(() => invalidate(feed_uuid));
};
