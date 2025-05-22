import type { FeedStats } from '~/types/bindings';

/**
 * Sum a list of feed stats items into a single object of values.
 */
export const sumStats = (items: FeedStats[]) =>
  items.reduce(
    (acc, stat) => ({
      count_total: acc.count_total + stat.count_total,
      count_unread: acc.count_unread + stat.count_unread,
      count_saved: acc.count_saved + stat.count_saved,
    }),
    { count_total: 0, count_unread: 0, count_saved: 0 } as Omit<FeedStats, 'uuid'>,
  );
