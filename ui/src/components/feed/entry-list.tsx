import { A } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import dayjs from 'dayjs';
import { Switch, Match, For, Component } from 'solid-js';
import { getEntries } from '~/api/entries';
import { QUERY_KEYS } from '~/constants/query';

type EntryListProps = {
  feed_uuid?: string;
  current_entry_uuid?: string;
};

export const EntryList: Component<EntryListProps> = props => {
  const entries = createQuery(() => ({
    queryKey: [QUERY_KEYS.ENTRIES_INDEX, props.feed_uuid],
    queryFn: () => getEntries({ feed: props.feed_uuid }),
  }));

  const getUrl = (uuid: string) => (props.feed_uuid ? `/feeds/${props.feed_uuid}/entries/${uuid}` : `/entries/${uuid}`);

  // useKeyboardNav(() => ({
  //   entries: entries.data || [],
  //   current_entry_uuid: props.current_entry_uuid,
  //   getUrl,
  // }));

  return (
    <Switch>
      <Match when={entries.isPending}>
        <p>Loading entries...</p>
      </Match>

      <Match when={entries.isError}>
        <p>Error: {entries.error?.message}</p>
      </Match>

      <Match when={entries.isSuccess}>
        {entries.data?.length ? (
          <div class="flex flex-col gap-1">
            <For each={entries.data}>
              {entry => (
                <A
                  href={getUrl(entry.uuid)}
                  activeClass="bg-gray-100"
                  inactiveClass="hover:bg-gray-100"
                  class="-mx-2 flex flex-col gap-1 rounded-lg p-2 ring-gray-300 transition focus:bg-gray-100 focus:outline-none focus:ring"
                >
                  <h3 class="text-base/5">{entry.title}</h3>
                  <small class="text-xs text-gray-500">{dayjs(entry.published_at).format('MMMM DD, YYYY')}</small>
                </A>
              )}
            </For>
          </div>
        ) : (
          <div>No entries.</div>
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
