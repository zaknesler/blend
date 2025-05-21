import { Match, Show, Switch } from 'solid-js';
import { EntryView } from '~/components/entry/entry-view';
import { Panel } from '~/components/ui/layout/panel';
import { IDS } from '~/constants/elements';
import { useQueryState } from '~/contexts/query-state-context';
import { useViewport } from '~/contexts/viewport-context';
import { useEntry } from '~/hooks/queries/use-entry';
import { EntryActions } from '../entry/entry-actions';
import { Empty } from '../ui/empty';
import { Spinner } from '../ui/spinner';

export default () => {
  const state = useQueryState();
  const viewport = useViewport();

  const entry = useEntry(() => ({ entry_uuid: state.params.entry_uuid }));

  return (
    <Show
      when={state.params.entry_uuid}
      fallback={
        <Show when={viewport.gt('md')}>
          <Panel class="size-full p-4 lg:p-8">
            <Empty dashed={false} />
          </Panel>
        </Show>
      }
    >
      <Switch>
        <Match when={entry.isPending}>
          <Panel class="size-full p-4 lg:p-8">
            <Empty dashed={false}>
              <Spinner />
            </Empty>
          </Panel>
        </Match>

        <Match when={entry.isError}>
          <Panel class="p-4 lg:p-8">Error: {entry.error?.message}</Panel>
        </Match>

        <Match when={entry.isSuccess}>
          <Panel id={IDS.ARTICLE} class="relative flex flex-col-reverse md:flex-col" overflow={false}>
            <Show when={entry.data} fallback="No data.">
              <EntryActions entry={entry.data!} />
              <div class="overflow-touch-scrolling flex-1 overflow-auto">
                <EntryView entry={entry.data!} class="max-w-4xl flex-1 p-4 lg:p-8" />
              </div>
            </Show>
          </Panel>
        </Match>
      </Switch>
    </Show>
  );
};
