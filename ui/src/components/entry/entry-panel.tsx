import { createQuery, useQueryClient } from '@tanstack/solid-query';
import { EntryView } from '~/components/entry/entry';
import { Match, Switch, createEffect } from 'solid-js';
import { getEntry } from '~/api/entries';
import { Panel } from '~/components/layout/panel';
import { QUERY_KEYS } from '~/constants/query';
import { updateEntryAsRead } from '~/api/entries';
import { createMutation } from '@tanstack/solid-query';
import { useFilterParams } from '~/hooks/use-filter-params';

export const EntryPanel = () => {
  const filter = useFilterParams();
  const queryClient = useQueryClient();

  const entry = createQuery(() => ({
    enabled: !!filter.params.entry_uuid,
    queryKey: [QUERY_KEYS.ENTRIES_VIEW, filter.params.entry_uuid],
    queryFn: () => getEntry(filter.params.entry_uuid!),
  }));

  const markAsRead = createMutation(() => ({
    mutationKey: [QUERY_KEYS.ENTRIES_VIEW_READ],
    mutationFn: updateEntryAsRead,
  }));

  createEffect(() => {
    if (!entry.isSuccess || !entry.data || entry.data.read_at) return;

    markAsRead.mutateAsync(entry.data.uuid).then(() => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS_STATS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_INDEX, filter.params.feed_uuid] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_VIEW, entry.data.uuid] });
    });
  });

  return (
    <Switch>
      <Match when={entry.isPending}>
        <Panel class="p-4 md:p-8">Loading entry...</Panel>
      </Match>

      <Match when={entry.isError}>
        <Panel class="p-4 md:p-8">Error: {entry.error?.message}</Panel>
      </Match>

      <Match when={entry.isSuccess}>
        <Panel class="p-4 md:p-8">
          {entry.data ? <EntryView entry={entry.data} class="max-w-4xl" /> : <div>No entry!</div>}
        </Panel>
      </Match>
    </Switch>
  );
};
