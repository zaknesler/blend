import { createQuery, useQueryClient } from '@tanstack/solid-query';
import { EntryView } from '~/components/entry/entry-view';
import { Match, Switch, createEffect, Show } from 'solid-js';
import { getEntry } from '~/api/entries';
import { Panel } from '~/components/layout/panel';
import { QUERY_KEYS } from '~/constants/query';
import { updateEntryAsRead } from '~/api/entries';
import { createMutation } from '@tanstack/solid-query';
import { useQueryState } from '~/hooks/use-query-state';
import { Empty } from '../ui/empty';
import { useViewport } from '~/hooks/use-viewport';
import { Spinner } from '../ui/spinner';
import { useInvalidateStats } from '~/hooks/queries/use-invalidate-stats';

export const EntryPanel = () => {
  const state = useQueryState();
  const queryClient = useQueryClient();
  const { gtBreakpoint } = useViewport();
  const invalidateStats = useInvalidateStats();

  const entry = createQuery(() => ({
    enabled: !!state.params.entry_uuid,
    queryKey: [QUERY_KEYS.ENTRIES_VIEW, state.params.entry_uuid],
    queryFn: () => getEntry(state.params.entry_uuid!),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }));

  const markAsRead = createMutation(() => ({
    mutationKey: [QUERY_KEYS.ENTRIES_VIEW_READ],
    mutationFn: updateEntryAsRead,
  }));

  createEffect(() => {
    if (!entry.isSuccess || !entry.data || entry.data.read_at) return;

    markAsRead.mutateAsync(entry.data.uuid).then(() => {
      invalidateStats();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_VIEW, entry.data.uuid] });
    });
  });

  return (
    <Show
      when={state.params.entry_uuid}
      fallback={
        gtBreakpoint('md') && (
          <Panel class="h-full w-full p-4 lg:p-8">
            <Empty />
          </Panel>
        )
      }
    >
      <Switch>
        <Match when={entry.isPending}>
          <Panel class="h-full w-full p-4 lg:p-8">
            <Empty>
              <Spinner />
            </Empty>
          </Panel>
        </Match>

        <Match when={entry.isError}>
          <Panel class="p-4 lg:p-8">Error: {entry.error?.message}</Panel>
        </Match>

        <Match when={entry.isSuccess}>
          <Panel class="p-4 lg:p-8">
            {entry.data ? <EntryView entry={entry.data} class="max-w-4xl" /> : 'No entry'}
          </Panel>
        </Match>
      </Switch>
    </Show>
  );
};
