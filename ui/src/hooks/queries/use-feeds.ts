import { createQuery } from '@tanstack/solid-query';
import { getFeeds } from '~/api/feeds';
import { QUERY_KEYS } from '~/constants/query';

export const useFeeds = () => {
  const feeds = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS],
    queryFn: getFeeds,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }));

  const findFeed = (feed_uuid: string) => feeds.data?.find(feed => feed.uuid === feed_uuid);

  return {
    feeds,
    findFeed,
  };
};
