import { Sidebar } from '~/components/layout/sidebar';
import { EntryPanel } from '~/components/panels/entry-panel';
import { ListPanel } from '~/components/panels/list-panel';

export default () => (
  <>
    <Sidebar class="hidden xl:flex xl:w-sidebar xl:shrink-0" />

    <div class="flex size-full flex-1 flex-col overflow-hidden md:flex-row md:gap-4 md:p-4">
      <ListPanel />
      <EntryPanel />
    </div>
  </>
);
