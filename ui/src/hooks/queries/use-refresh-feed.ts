import { createMutation } from '@tanstack/solid-query';
import { refreshFeed } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';

export const useRefreshFeed = () => {
  const query = createMutation(() => ({
    mutationKey: [QUERY_KEYS.FEEDS_VIEW_REFRESH],
    mutationFn: refreshFeed,
  }));

  const handleRefresh = async (feed_uuid: string) => query.mutateAsync(feed_uuid);

  return {
    query,
    refreshFeed: handleRefresh,
  };
};
