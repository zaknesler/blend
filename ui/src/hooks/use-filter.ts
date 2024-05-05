import { useParams, useSearchParams } from '@solidjs/router';
import { Tab } from '~/constants/tabs';

type RouterParams = {
  feed_uuid?: string;
  entry_uuid?: string;
};

type QueryParams = {
  unread?: string;
};

export const useFilter = () => {
  const params = useParams<RouterParams>();
  const [query, setQuery] = useSearchParams<QueryParams>();

  const setUnread = (value?: boolean | Tab) => {
    let unread: boolean | undefined;

    if (typeof value === 'string') unread = value === 'unread' ? true : undefined;
    if (typeof value === 'boolean') unread = value;

    setQuery({ unread });
  };

  const getUnread = () => {
    if (query.unread === 'true') return true;
    if (query.unread === 'false') return false;
    return undefined;
  };

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
    setUnread,
    getUnread,
    getQueryString,
  };
};
