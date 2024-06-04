import { useQueryClient } from '@tanstack/solid-query';
import { createMutation } from '@tanstack/solid-query';
import { Match, Show, Switch, createEffect } from 'solid-js';
import { updateEntryAsRead } from '~/api/entries';
import { EntryView } from '~/components/entry/entry-view';
import { Panel } from '~/components/ui/layout/panel';
import { QUERY_KEYS } from '~/constants/query';
import { useQueryState } from '~/contexts/query-state-context';
import { useEntry } from '~/hooks/queries/use-entry';
import { useInvalidateStats } from '~/hooks/queries/use-invalidate-stats';
import { useViewport } from '~/hooks/use-viewport';
import { Empty } from '../ui/empty';
import { Spinner } from '../ui/spinner';

export const EntryPanel = () => {
  const state = useQueryState();
  const viewport = useViewport();
  const queryClient = useQueryClient();
  const invalidateStats = useInvalidateStats();

  const entry = useEntry(() => ({ entry_uuid: state.params.entry_uuid }));

  const markAsRead = createMutation(() => ({
    mutationKey: [QUERY_KEYS.ENTRIES_VIEW_READ],
    mutationFn: updateEntryAsRead,
  }));

  createEffect(() => {
    if (!entry.isSuccess || !entry.data || entry.data.read_at) return;

    markAsRead.mutateAsync(entry.data.uuid).then(() => {
      invalidateStats();
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ENTRIES_VIEW, entry.data.uuid],
      });
    });
  });

  return (
    <Show
      when={state.params.entry_uuid}
      fallback={
        <Show when={viewport.gtBreakpoint('md')}>
          <Panel class="size-full p-4 lg:p-8">
            <Empty />
          </Panel>
        </Show>
      }
    >
      <Switch>
        <Match when={entry.isPending}>
          <Panel class="size-full p-4 lg:p-8">
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
            <Show when={entry.data} fallback="No data.">
              <EntryView entry={entry.data!} class="max-w-4xl" />
            </Show>
          </Panel>
        </Match>
      </Switch>
    </Show>
  );
};
