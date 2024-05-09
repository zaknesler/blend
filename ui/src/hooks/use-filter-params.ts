import { useParams, useSearchParams } from '@solidjs/router';
import { DEFAULT_VIEW, View } from '~/constants/views';

type RouterParams = {
  feed_uuid?: string;
  entry_uuid?: string;
};

type QueryParams = {
  view?: View;
};

export const useFilterParams = () => {
  const params = useParams<RouterParams>();
  const [query, setQuery] = useSearchParams<QueryParams>();

  const getView = () => query.view || DEFAULT_VIEW;
  const setView = (value?: View) => {
    const view = value === DEFAULT_VIEW ? undefined : value;
    setQuery({ view });
  };

  const getQueryString = () => {
    const builder = new URLSearchParams({
      view: query.view || '',
    });

    const hasValues = !![...builder.values()].filter(Boolean).length;
    return hasValues ? `?${builder.toString()}` : '';
  };

  const getFeedUrl = (append?: string) => {
    const path = params.feed_uuid ? `/feeds/${params.feed_uuid}` : `/`;
    const withAppended = append ? path.concat(append) : path;
    return withAppended.replace(/\/\//g, '/').concat(getQueryString());
  };

  const getEntryUrl = (entry_uuid: string) => getFeedUrl(`/entries/${entry_uuid}`);

  return {
    params,
    query,
    setQuery,
    getView,
    setView,
    getQueryString,
    getFeedUrl,
    getEntryUrl,
  };
};
