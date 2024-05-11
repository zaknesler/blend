import { EntryPanel } from '~/components/entry/entry-panel';
import { NavPanel } from '~/components/nav/nav-panel';
import { useFilterParams } from '~/hooks/use-filter-params';

export default () => {
  const filter = useFilterParams();

  return (
    <>
      <NavPanel />
      {filter.params.entry_uuid && <EntryPanel />}
    </>
  );
};
