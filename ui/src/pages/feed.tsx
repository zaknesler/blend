import { EntryPanel } from '~/components/entry/entry-panel';
import { Sidebar } from '~/components/layout/sidebar';
import { NavPanel } from '~/components/nav/nav-panel';
import { useFilterParams } from '~/hooks/use-filter-params';

export default () => {
  const filter = useFilterParams();

  return (
    <>
      <Sidebar class="hidden xl:flex xl:w-sidebar xl:shrink-0" />

      <div class="flex h-full w-full flex-1 flex-col overflow-hidden">
        <div class="flex flex-1 flex-col overflow-auto md:flex-row md:gap-4 md:p-4">
          <NavPanel />
          {filter.params.entry_uuid && <EntryPanel />}
        </div>
      </div>
    </>
  );
};
