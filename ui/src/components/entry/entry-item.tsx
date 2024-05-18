import { A } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { cx } from 'class-variance-authority';
import { type Component } from 'solid-js';
import { getEntry } from '~/api/entries';
import { QUERY_KEYS } from '~/constants/query';
import { useFeeds } from '~/hooks/queries/use-feeds';
import { useFilterParams } from '~/hooks/use-filter-params';
import type { Entry } from '~/types/bindings';
import { formatDate } from '~/utils/date';

type EntryItemProps = {
  entry: Entry;
};

export const EntryItem: Component<EntryItemProps> = props => {
  const filter = useFilterParams();
  const feeds = useFeeds();

  // Get the data for an entry to check if user marked it as read
  const entryData = createQuery(() => ({
    enabled: filter.params.entry_uuid === props.entry.uuid,
    queryKey: [QUERY_KEYS.ENTRIES_VIEW, props.entry.uuid],
    queryFn: () => getEntry(props.entry.uuid),
  }));

  const feed = () => feeds.findFeed(props.entry.feed_uuid);
  const isRead = () => !!props.entry.read_at || !!entryData.data?.read_at;

  return (
    <A
      href={filter.getEntryUrl(props.entry.uuid)}
      activeClass="bg-gray-100 dark:bg-gray-950"
      inactiveClass={cx(
        'hover:bg-gray-100 dark:hover:bg-gray-950',
        filter.getView() === 'unread' && isRead() && 'opacity-50',
      )}
      class={cx(
        '-mx-2 flex flex-col gap-1 rounded-lg px-2 py-1.5 ring-gray-300 transition dark:ring-gray-700',
        'focus:bg-gray-100 focus:outline-none focus:ring focus:dark:bg-gray-950',
      )}
    >
      <h4 class="text-pretty text-base/5 md:text-sm xl:text-base/5">{props.entry.title}</h4>

      <small class="flex w-full gap-1 text-xs text-gray-500 dark:text-gray-400">
        {!isRead() && <span class="h-2 w-2 self-center rounded-full bg-gray-500 dark:bg-gray-300" />}

        {!filter.params.feed_uuid && (
          <>
            <span class="font-medium">{feed()?.title}</span>
            <span class="text-gray-400 dark:text-gray-600">&ndash;</span>
          </>
        )}

        {props.entry.published_at && <span>{formatDate(props.entry.published_at)}</span>}
      </small>
    </A>
  );
};
