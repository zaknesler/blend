import { Sidebar } from '~/components/layout/sidebar';
import { EntryPanel } from '~/components/panels/entry-panel';
import { ListPanel } from '~/components/panels/list-panel';
import { NotificationsContext, makeNotificationsContext } from '~/contexts/notifications-context';
import { QueryStateContext, makeQueryStateContext } from '~/contexts/query-state-context';

export default () => {
  const queryState = makeQueryStateContext();

  return (
    <QueryStateContext.Provider value={queryState}>
      <Inner />
    </QueryStateContext.Provider>
  );
};

const Inner = () => {
  const notifications = makeNotificationsContext();

  return (
    <NotificationsContext.Provider value={notifications}>
      <Sidebar class="hidden xl:flex xl:w-sidebar xl:shrink-0" />

      <div class="flex size-full flex-1 flex-col overflow-hidden md:flex-row md:gap-4 md:p-4">
        <ListPanel />
        <EntryPanel />
      </div>
    </NotificationsContext.Provider>
  );
};
