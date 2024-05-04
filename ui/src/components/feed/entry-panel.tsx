import { createQuery } from '@tanstack/solid-query';
import { EntryView } from '~/components/entry';
import { Component, Match, Switch } from 'solid-js';
import { getEntry } from '~/api/entries';
import { Panel } from '~/components/layout/panel';
import { QUERY_KEYS } from '~/constants/query';

type EntryPanelProps = {
  entry_uuid: string;
};

export const EntryPanel: Component<EntryPanelProps> = props => {
  const entry = createQuery(() => ({
    queryKey: [QUERY_KEYS.ENTRIES_VIEW, props.entry_uuid],
    queryFn: () => getEntry(props.entry_uuid),
  }));

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
