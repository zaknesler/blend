import { createMutation } from '@tanstack/solid-query';
import { QUERY_KEYS } from '~/constants/query';
import { refreshFeeds } from '~/api/feeds';

export const useRefreshFeeds = () => {
  const query = createMutation(() => ({
    mutationKey: [QUERY_KEYS.FEEDS_REFRESH],
    mutationFn: refreshFeeds,
  }));

  const handleRefresh = async () => query.mutateAsync();

  return {
    query,
    refreshFeeds: handleRefresh,
  };
};
