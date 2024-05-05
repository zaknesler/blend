import { useParams, useSearchParams } from '@solidjs/router';

type RouterParams = {
  feed_uuid?: string;
  entry_uuid?: string;
};

type QueryParams = {
  unread?: string;
};

export const useFilterParams = () => {
  const params = useParams<RouterParams>();
  const [query, setQuery] = useSearchParams<QueryParams>();

  const getUnread = () => {
    if (query.unread === 'true') return true;
    if (query.unread === 'false') return false;
    return undefined;
  };

  const setUnread = (unread?: boolean) => setQuery({ unread });

  const getQueryString = () => {
    const builder = new URLSearchParams({
      unread: query.unread || '',
    });

    const hasValues = !![...builder.values()].filter(Boolean).length;
    return hasValues ? `?${builder.toString()}` : '';
  };

  return {
    params,
    query,
    setQuery,
    getUnread,
    setUnread,
    getQueryString,
  };
};
