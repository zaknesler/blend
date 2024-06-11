import { A, type AnchorProps, useMatch } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { type Component, Show, splitProps } from 'solid-js';
import { IDS } from '~/constants/elements';
import { useQueryState } from '~/contexts/query-state-context';
import { useEntry } from '~/hooks/queries/use-entry';
import { useFeeds } from '~/hooks/queries/use-feeds';
import type { Entry } from '~/types/bindings';
import { formatDate } from '~/utils/date';

type EntryItemProps = Omit<AnchorProps, 'href' | 'activeClass' | 'inactiveClass'> & {
  entry: Entry;
};

export const EntryItem: Component<EntryItemProps> = props => {
  const state = useQueryState();
  const feeds = useFeeds();

  const [local, rest] = splitProps(props, ['entry', 'class']);

  // Get the data for an entry to check if user marked it as read
  const entryData = useEntry(() => ({
    entry_uuid: local.entry.uuid,
    enabled: state.params.entry_uuid === local.entry.uuid,
  }));

  const feed = () => feeds.findFeed(local.entry.feed_uuid);
  const isRead = () => !!local.entry.read_at || !!entryData.data?.read_at;
  const getDate = () => local.entry.published_at || local.entry.updated_at;

  const entryRouteMatch = useMatch(() => state.getEntryUrl(local.entry.uuid, false));
  const isActive = () => !!entryRouteMatch();

  return (
    <A
      id={IDS.ENTRY(local.entry.uuid)}
      href={state.getEntryUrl(local.entry.uuid)}
      class={cx(
        '-mx-2 flex select-none flex-col gap-1 rounded-lg px-2 py-1.5 ring-gray-300 transition dark:ring-gray-700',
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
          isActive() ? 'text-gray-300 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500',
        )}
      >
        <Show when={!isRead()}>
          <span
            class={cx(
              'size-2 shrink-0 self-center rounded-full transition',
              isActive() ? 'bg-gray-400' : 'bg-gray-500 dark:bg-gray-300',
            )}
          />
        </Show>

        <Show when={!state.params.feed_uuid}>
          <span class="truncate break-all font-medium" innerHTML={feed()?.title_display || feed()?.title} />

          <Show when={getDate()}>
            <span class="opacity-50">&ndash;</span>
          </Show>
        </Show>

        <Show when={getDate()}>
          <span class="shrink-0">{formatDate(getDate()!)}</span>
        </Show>
      </small>
    </A>
  );
};
