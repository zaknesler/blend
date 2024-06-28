import { createQuery } from '@tanstack/solid-query';
import { getFeedStats } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';
import { useQueryState } from '~/contexts/query-state-context';
import { View } from '~/types/bindings';
import { sumStats } from '~/utils/stats';

export const useFeedsStats = () => {
  const state = useQueryState();

  const query = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS_STATS],
    queryFn: getFeedStats,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }));

  const total = () => (query.data ? sumStats(query.data) : undefined);

  const byFeed = (uuid: string) => query.data?.find(item => item.uuid === uuid);

  const byView = (view?: View) => {
    if (!query?.data) return null;

    const items = state.params.feed_uuid ? [byFeed(state.params.feed_uuid)] : query.data;
    const sum = sumStats(items.filter(Boolean));

    switch (view || state.getView()) {
      case View.Unread:
        return sum.count_unread;
      case View.Saved:
        return sum.count_saved;
      case View.All:
        return sum.count_total;
    }

    return null;
  };

  return {
    query,
    total,
    byFeed,
    byView,
  };
};
