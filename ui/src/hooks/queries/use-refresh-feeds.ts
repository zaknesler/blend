import { useMutation } from '@tanstack/solid-query';
import { refreshFeeds } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';

export const useRefreshFeeds = () => {
  const query = useMutation(() => ({
    mutationKey: [QUERY_KEYS.FEEDS_REFRESH],
    mutationFn: refreshFeeds,
  }));

  return () => query.mutateAsync();
};
