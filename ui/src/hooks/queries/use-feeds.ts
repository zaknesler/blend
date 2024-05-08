import { createQuery } from '@tanstack/solid-query';
import { QUERY_KEYS } from '~/constants/query';
import { getFeeds } from '~/api/feeds';

export const useFeeds = () => {
  const query = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS],
    queryFn: getFeeds,
  }));

  const findFeed = (feed_uuid: string) => query.data?.find(feed => feed.uuid === feed_uuid);

  return {
    query,
    findFeed,
  };
};
