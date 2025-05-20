import { createSignal } from 'solid-js';
import { Button } from '~/components/ui/button';
import { TextInput } from '~/components/ui/input';
import { Panel } from '~/components/ui/layout/panel';
import { Skeleton } from '~/components/ui/skeleton';
import { Spinner } from '~/components/ui/spinner';
import { Tabs } from '~/components/ui/tabs';

export default () => {
  const [tab, setTab] = createSignal('first');

  return (
    <div class="size-full p-4 md:p-8">
      <Panel class="flex h-full max-w-md flex-col items-stretch gap-8 rounded-lg p-8 shadow-md dark:shadow-2xl">
        <div class="flex gap-4">
          <Button size="sm" variant="primary">
            Primary
          </Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="danger">
            Danger
          </Button>
        </div>

        <div class="flex gap-4">
          <Button size="md" variant="primary">
            Primary
          </Button>
          <Button size="md" variant="secondary">
            Secondary
          </Button>
          <Button size="md" variant="danger">
            Danger
          </Button>
        </div>

        <div class="flex gap-4">
          <Button size="lg" variant="primary">
            Primary
          </Button>
          <Button size="lg" variant="secondary">
            Secondary
          </Button>
          <Button size="lg" variant="danger">
            Danger
          </Button>
        </div>

        <TextInput name="test" label="Example input" class="w-full" />

        <Tabs
          value={tab()}
          onChange={setTab}
          items={[
            { value: 'first', label: 'First' },
            { value: 'second', label: 'Second' },
            { value: 'third', label: 'Third' },
          ]}
        />

        <Spinner />

        <Skeleton variant="light" class="h-8 w-full" />
        <Skeleton variant="dark" class="h-8 w-full" />
      </Panel>
    </div>
  );
};
