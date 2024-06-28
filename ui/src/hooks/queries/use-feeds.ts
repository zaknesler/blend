import { createQuery } from '@tanstack/solid-query';
import { getFeeds } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';

export const useFeeds = () => {
  const query = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS],
    queryFn: getFeeds,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }));

  const findFeed = (feed_uuid: string) => query.data?.find(feed => feed.uuid === feed_uuid);

  return {
    query,
    findFeed,
  };
};
