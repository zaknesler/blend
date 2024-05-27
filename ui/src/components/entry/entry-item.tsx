import { A, type AnchorProps, useMatch } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { cx } from 'class-variance-authority';
import { type Component, splitProps } from 'solid-js';
import { getEntry } from '~/api/entries';
import { DATA_ATTRIBUTES } from '~/constants/attributes';
import { QUERY_KEYS } from '~/constants/query';
import { useFeeds } from '~/hooks/queries/use-feeds';
import { useQueryState } from '~/hooks/use-query-state';
import type { Entry } from '~/types/bindings';
import { formatDate } from '~/utils/date';
import { getEntryDate } from '~/utils/entries';

type EntryItemProps = Omit<AnchorProps, 'href' | 'activeClass' | 'inactiveClass'> & {
  entry: Entry;
};

export const EntryItem: Component<EntryItemProps> = props => {
  const state = useQueryState();
  const feeds = useFeeds();

  const [local, rest] = splitProps(props, ['entry', 'class']);

  // Get the data for an entry to check if user marked it as read
  const entryData = createQuery(() => ({
    enabled: state.params.entry_uuid === local.entry.uuid,
    queryKey: [QUERY_KEYS.ENTRIES_VIEW, local.entry.uuid],
    queryFn: () => getEntry(local.entry.uuid),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }));

  const feed = () => feeds.findFeed(local.entry.feed_uuid);
  const isRead = () => !!local.entry.read_at || !!entryData.data?.read_at;

  const getDate = () => getEntryDate(local.entry);

  const entryRouteMatch = useMatch(() => state.getEntryUrl(local.entry.uuid, false));
  const isActive = () => Boolean(entryRouteMatch());

  return (
    <A
      {...{ [DATA_ATTRIBUTES.ENTRY_ITEM_UUID]: local.entry.uuid }}
      href={state.getEntryUrl(local.entry.uuid)}
      class={cx(
        '-mx-2 flex flex-col gap-1 rounded-lg px-2 py-1.5 ring-gray-300 transition dark:ring-gray-700',
        'focus:outline-none focus:ring',
        isActive()
          ? 'bg-gray-600 text-white dark:bg-gray-950'
          : [
              'dark:hover:bg-gray-950 hover:bg-gray-100',
              'focus:bg-gray-100 focus:dark:bg-gray-950',
              state.getView() === 'unread' && isRead() && 'opacity-50',
            ],
        local.class,
      )}
      {...rest}
    >
      <h4 class="text-pretty text-base/5 md:text-sm xl:text-base/5" innerHTML={local.entry.title} />

      <small
        class={cx(
          'flex w-full gap-1 overflow-hidden text-xs transition',
          isActive() ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400',
        )}
      >
        {!isRead() && (
          <span
            class={cx(
              'h-2 w-2 shrink-0 self-center rounded-full transition',
              isActive() ? 'bg-gray-400' : 'bg-gray-500 dark:bg-gray-300',
            )}
          />
        )}

        {!state.params.feed_uuid && (
          <>
            <span class="truncate break-all font-medium">{feed()?.title_display || feed()?.title}</span>
            {!!getDate() && <span class="opacity-50">&ndash;</span>}
          </>
        )}

        {!!getDate() && <span class="shrink-0">{formatDate(getDate()!)}</span>}
      </small>
    </A>
  );
};
