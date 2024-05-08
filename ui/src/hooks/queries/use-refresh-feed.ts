import { createMutation, useQueryClient } from '@tanstack/solid-query';
import { QUERY_KEYS } from '~/constants/query';
import { useFilterParams } from '../use-filter-params';
import { refreshFeed } from '~/api/feeds';

export const useRefreshFeed = () => {
  const filter = useFilterParams();
  const queryClient = useQueryClient();

  const query = createMutation(() => ({
    mutationKey: [QUERY_KEYS.FEEDS_VIEW_REFRESH],
    mutationFn: refreshFeed,
  }));

  const handleRefresh = async (feed_uuid: string) => {
    await query.mutateAsync(feed_uuid);

    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS_STATS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_INDEX, feed_uuid, filter.getView()] });
  };

  return {
    query,
    refreshFeed: handleRefresh,
  };
};
