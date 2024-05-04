import { useParams } from '@solidjs/router';
import { Panel } from '~/components/layout/panel';
import { EntryList } from '~/components/feed/entry-list';
import { FeedInfo } from '~/components/feed/feed-info';
import { FeedHeader } from '~/components/feed/feed-header';
import { EntryPanel } from '~/components/feed/entry-panel';

export default () => {
  const params = useParams<{ feed_uuid?: string; entry_uuid?: string }>();

  return (
    <>
      <Panel class="flex max-w-md flex-col gap-2 p-4 pb-2">
        {params.feed_uuid ? <FeedInfo uuid={params.feed_uuid} /> : <FeedHeader title="All feeds" />}
        <EntryList feed_uuid={params.feed_uuid} current_entry_uuid={params.entry_uuid} />
      </Panel>

      {params.entry_uuid && <EntryPanel feed_uuid={params.feed_uuid} entry_uuid={params.entry_uuid} />}
    </>
  );
};
