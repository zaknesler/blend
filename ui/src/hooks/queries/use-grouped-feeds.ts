import { useFeeds } from './use-feeds';
import { useFolders } from './use-folders';

export const useGroupedFeeds = () => {
  const feeds = useFeeds();
  const folders = useFolders();

  const getFoldersWithFeeds = () =>
    folders.query.data?.map(folder => ({
      folder,
      feeds: folder.feed_uuids
        .map(feed_uuid => feeds.query.data?.find(feed => feed.uuid === feed_uuid))
        .filter(Boolean),
    }));

  const getUngroupedFeeds = () => {
    const groupedFeeds = folders.query.data?.flatMap(folder => folder.feed_uuids);
    return feeds.query.data?.filter(feed => !groupedFeeds?.includes(feed.uuid));
  };

  return {
    feeds,
    folders,
    getFoldersWithFeeds,
    getUngroupedFeeds,
  };
};
