import { createMutation } from '@tanstack/solid-query';
import { refreshFeed } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';

export const useRefreshFeed = () => {
  const query = createMutation(() => ({
    mutationKey: [QUERY_KEYS.FEEDS_VIEW_REFRESH],
    mutationFn: refreshFeed,
  }));

  return (feed_uuid: string) => query.mutateAsync(feed_uuid);
};
