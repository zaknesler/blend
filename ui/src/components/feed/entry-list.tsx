import { A } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import dayjs from 'dayjs';
import { Switch, Match, For, Component, createEffect, createSignal } from 'solid-js';
import { QUERY_KEYS } from '~/constants/query';
import { Skeleton } from '../ui/skeleton';
import { cx } from 'class-variance-authority';
import { getFeeds } from '~/api/feeds';
import { useInfiniteEntries } from '~/hooks/use-infinite-entries';
import { Spinner } from '../ui/spinner';
import { createElementBounds } from '@solid-primitives/bounds';

type EntryListProps = {
  bottomOfContainer?: number;
  unread?: boolean;
  feed_uuid?: string;
  current_entry_uuid?: string;
};

export const EntryList: Component<EntryListProps> = props => {
  const [bottomOfList, setBottomOfList] = createSignal<HTMLElement>();

  const feeds = createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS],
    queryFn: getFeeds,
  }));

  const entries = useInfiniteEntries(props);
  const allEntries = () => entries.data?.pages.flatMap(page => page.data) || [];

  const bounds = createElementBounds(bottomOfList);

  createEffect(() => {
    const bottomOfListVisible = props.bottomOfContainer && bounds.bottom && bounds.bottom <= props.bottomOfContainer;
    if (!bottomOfListVisible || !entries.hasNextPage) return;

    entries.fetchNextPage();
  });

  const getUrl = (entry_uuid: string) =>
    props.feed_uuid ? `/feeds/${props.feed_uuid}/entries/${entry_uuid}` : `/entries/${entry_uuid}`;

  const getFeed = (feed_uuid: string) => feeds.data?.find(feed => feed.uuid === feed_uuid);

  // useKeyboardNav(() => ({
  //   entries: entries.data || [],
  //   current_entry_uuid: props.current_entry_uuid,
  //   getUrl,
  // }));

  return (
    <Switch>
      <Match when={entries.isPending}>
        <Skeleton class="h-8" color="muted" />
        <Skeleton class="h-8" color="muted" />
        <Skeleton class="h-8" color="muted" />
        <Skeleton class="h-8" color="muted" />
        <Skeleton class="h-8" color="muted" />
      </Match>

      <Match when={entries.isError}>
        <p>Error: {entries.error?.message}</p>
      </Match>

      <Match when={entries.isSuccess}>
        {allEntries().length ? (
          <div class="flex flex-col gap-1">
            <For each={allEntries()}>
              {(entry, index) => (
                <A
                  data-index={index()}
                  href={getUrl(entry.uuid)}
                  activeClass="bg-gray-100"
                  inactiveClass={cx('hover:bg-gray-100', entry.read_at && 'opacity-50')}
                  class={cx(
                    '-mx-2 flex flex-col gap-1 rounded-lg p-2 ring-gray-300 transition focus:bg-gray-100 focus:outline-none focus:ring',
                  )}
                >
                  <h3 class="text-base/5">{entry.title}</h3>
                  <small class="text-xs text-gray-500">
                    <span class="font-medium">{getFeed(entry.feed_uuid)?.title}</span> -{' '}
                    {dayjs(entry.published_at).format('MMMM DD, YYYY')}
                  </small>
                </A>
              )}
            </For>

            <div ref={setBottomOfList} />

            {entries.isFetchingNextPage && (
              <div class="flex w-full items-center justify-center p-4">
                <Spinner />
              </div>
            )}
          </div>
        ) : (
          <div class="mt-2 w-full rounded-lg bg-gray-50 p-4 py-16 text-center text-sm text-gray-500">
            This feed contains no entries.
          </div>
        )}
      </Match>
    </Switch>
  );
};

// type KeyboardNavParams = {
//   entries: Entry[];
//   current_entry_uuid?: string;
//   getUrl: (uuid: string) => string;
// };

// const useKeyboardNav = (params: () => KeyboardNavParams) => {
//   const keyDownEvent = useKeyDownEvent();
//   const navigate = useNavigate();

//   createEffect(() => {
//     if (!params().entries.length) return;

//     const e = keyDownEvent();
//     if (!e) return;

//     const maybeNavigate = (direction: 'up' | 'down') => {
//       e.preventDefault();

//       const currentIndex = params().entries.findIndex(entry => entry.uuid === params().current_entry_uuid);
//       if (currentIndex === -1) return;

//       const offset = direction === 'up' ? -1 : 1;
//       const entry = params().entries[currentIndex + offset];
//       if (!entry) return;

//       console.log('navigate to', entry.uuid);

//       navigate(params().getUrl(entry.uuid));
//     };

//     switch (e.key) {
//       case 'ArrowDown':
//         maybeNavigate('down');
//         break;

//       case 'ArrowUp':
//         maybeNavigate('up');
//         break;
//     }
//   });
// };
