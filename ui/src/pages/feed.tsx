import { EntryPanel } from '~/components/entry/entry-panel';
import { useFilterParams } from '~/hooks/use-filter-params';
import { FeedPanel } from '~/components/feed/feed-panel';

export default () => {
  const filter = useFilterParams();

  return (
    <>
      <FeedPanel />
      {filter.params.entry_uuid && <EntryPanel />}
    </>
  );
};
