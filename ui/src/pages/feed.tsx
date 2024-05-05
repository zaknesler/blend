import { useParams } from '@solidjs/router';
import { Panel } from '~/components/layout/panel';
import { EntryList } from '~/components/feed/entry-list';
import { FeedInfo } from '~/components/feed/feed-info';
import { FeedHeader } from '~/components/feed/feed-header';
import { EntryPanel } from '~/components/feed/entry-panel';
import { createSignal } from 'solid-js';
import { createElementBounds } from '@solid-primitives/bounds';

export default () => {
  const [unreadOnly, setUnreadOnly] = createSignal(false);
  const [container, setContainer] = createSignal<HTMLElement>();

  const params = useParams<{ feed_uuid?: string; entry_uuid?: string }>();

  const bounds = createElementBounds(container);

  return (
    <>
      <Panel class="flex max-w-md shrink-0 flex-col gap-2 p-4 pb-2" ref={setContainer}>
        <div class="flex justify-between">
          {params.feed_uuid ? <FeedInfo uuid={params.feed_uuid} /> : <FeedHeader title="All feeds" />}

          <label class="inline-flex items-center gap-2 text-sm">
            <span>Unread only</span>
            <input type="checkbox" checked={unreadOnly()} onChange={() => setUnreadOnly(val => !val)} />
          </label>
        </div>

        <EntryList
          bottomOfContainer={bounds.bottom || undefined}
          feed_uuid={params.feed_uuid}
          current_entry_uuid={params.entry_uuid}
          unread={unreadOnly() || undefined}
        />
      </Panel>

      {params.entry_uuid && <EntryPanel feed_uuid={params.feed_uuid} entry_uuid={params.entry_uuid} />}
    </>
  );
};
