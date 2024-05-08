import { createMutation, useQueryClient } from '@tanstack/solid-query';
import { QUERY_KEYS } from '~/constants/query';
import { refreshFeeds } from '~/api/feeds';

export const useRefreshFeeds = () => {
  const queryClient = useQueryClient();

  const query = createMutation(() => ({
    mutationKey: [QUERY_KEYS.FEEDS_REFRESH],
    mutationFn: refreshFeeds,
  }));

  const handleRefresh = async () => {
    await query.mutateAsync();

    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS_STATS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_INDEX] });
  };

  return {
    query,
    refreshFeeds: handleRefresh,
  };
};
