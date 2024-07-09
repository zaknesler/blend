import { lazy } from 'solid-js';
import { CreateFeedModal } from '~/components/modals/create-feed';
import { CreateFolderModal } from '~/components/modals/create-folder';
import { EntriesContext, makeEntriesContext } from '~/contexts/entries-context';
import { NotificationContext, makeNotificationContext } from '~/contexts/notification-context';
import { QueryStateContext, makeQueryStateContext } from '~/contexts/query-state-context';
import { useShortcuts } from '~/hooks/use-shortcuts';

const Sidebar = lazy(() => import('~/components/ui/layout/sidebar').then(d => ({ default: d.Sidebar })));
const EntryPanel = lazy(() => import('~/components/panels/entry-panel').then(d => ({ default: d.EntryPanel })));
const ListPanel = lazy(() => import('~/components/panels/list-panel').then(d => ({ default: d.ListPanel })));

export default () => {
  const queryState = makeQueryStateContext();

  return (
    <QueryStateContext.Provider value={queryState}>
      <Inner />
    </QueryStateContext.Provider>
  );
};

const Inner = () => {
  const entries = makeEntriesContext();
  const notifications = makeNotificationContext();

  useShortcuts();

  return (
    <EntriesContext.Provider value={entries}>
      <NotificationContext.Provider value={notifications}>
        <Sidebar class="hidden xl:flex xl:w-sidebar xl:shrink-0" />

        <div class="flex size-full flex-1 flex-col overflow-hidden md:flex-row md:gap-4 md:p-4">
          <ListPanel />
          <EntryPanel />
        </div>

        <CreateFeedModal />
        <CreateFolderModal />
      </NotificationContext.Provider>
    </EntriesContext.Provider>
  );
};
