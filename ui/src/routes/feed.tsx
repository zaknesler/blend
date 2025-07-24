import { lazy } from 'solid-js';
import { CreateFeedModal } from '~/components/modals/create-feed';
import { CreateFolderModal } from '~/components/modals/create-folder';
import { MoveFeedModal } from '~/components/modals/move-feed';
import { EntriesContext, makeEntriesContext } from '~/contexts/entries-context';
import { makeNotificationContext, NotificationContext } from '~/contexts/notification-context';
import { makeQueryStateContext, QueryStateContext } from '~/contexts/query-state-context';
import { useShortcuts } from '~/hooks/use-shortcuts';

const SidebarPanel = lazy(() => import('~/components/panels/sidebar-panel'));
const EntryPanel = lazy(() => import('~/components/panels/entry-panel'));
const ListPanel = lazy(() => import('~/components/panels/list-panel'));

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
        <SidebarPanel class="hidden xl:flex xl:w-sidebar xl:shrink-0" />

        <div class="flex size-full flex-1 flex-col overflow-hidden md:flex-row md:gap-4 md:p-4">
          <ListPanel />
          <EntryPanel />
        </div>

        <MoveFeedModal />
        <CreateFeedModal />
        <CreateFolderModal />
      </NotificationContext.Provider>
    </EntriesContext.Provider>
  );
};
