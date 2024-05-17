import { createQuery } from '@tanstack/solid-query';
import { QUERY_KEYS } from '~/constants/query';
import { getFeeds } from '~/api/feeds';

export const useFeeds = () => {
  const feeds = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS],
    queryFn: getFeeds,
  }));

  const findFeed = (feed_uuid: string) => feeds.data?.find(feed => feed.uuid === feed_uuid);

  return {
    feeds,
    findFeed,
  };
};
