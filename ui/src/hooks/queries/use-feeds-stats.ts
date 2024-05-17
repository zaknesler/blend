import { createQuery } from '@tanstack/solid-query';
import { getFeedStats } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';

export const useFeedsStats = () => {
  const stats = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS_STATS],
    queryFn: getFeedStats,
  }));

  const totalStats = () =>
    stats.data?.reduce(
      (acc, stat) => ({
        count_total: acc.count_total + stat.count_total,
        count_unread: acc.count_unread + stat.count_unread,
      }),
      { count_total: 0, count_unread: 0 },
    );

  return {
    stats,
    totalStats,
  };
};
