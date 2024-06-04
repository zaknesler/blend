import { CreateFeedModal } from '~/components/modals/create-feed-modal';
import { EntryPanel } from '~/components/panels/entry-panel';
import { ListPanel } from '~/components/panels/list-panel';
import { Sidebar } from '~/components/ui/layout/sidebar';
import { NotificationContext, makeNotificationContext } from '~/contexts/notification-context';
import { QueryStateContext, makeQueryStateContext } from '~/contexts/query-state-context';
import { useShortcuts } from '~/hooks/use-shortcuts';

export default () => {
  const queryState = makeQueryStateContext();

  return (
    <QueryStateContext.Provider value={queryState}>
      <Inner />
    </QueryStateContext.Provider>
  );
};

const Inner = () => {
  const notifications = makeNotificationContext();

  useShortcuts();

  return (
    <NotificationContext.Provider value={notifications}>
      <Sidebar class="hidden xl:flex xl:w-sidebar xl:shrink-0" />
      <div class="flex size-full flex-1 flex-col overflow-hidden md:flex-row md:gap-4 md:p-4">
        <ListPanel />
        <EntryPanel />
      </div>

      <CreateFeedModal />
    </NotificationContext.Provider>
  );
};
