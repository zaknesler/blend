import { createQuery } from '@tanstack/solid-query';
import { getFeedStats } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';
import { sumStats } from '~/utils/stats';

export const useFeedsStats = () => {
  const query = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS_STATS],
    queryFn: getFeedStats,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }));

  const total = () => (query.data ? sumStats(query.data) : undefined);

  const byFeed = (uuid: string) => query.data?.find(item => item.uuid === uuid);

  return {
    query,
    total,
    byFeed,
  };
};
