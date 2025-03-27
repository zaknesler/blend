import { Button } from '~/components/ui/button';
import { TextInput } from '~/components/ui/input';
import { Panel } from '~/components/ui/layout/panel';

export default () => (
  <div class="size-full p-4 md:p-8">
    <Panel class="flex size-full flex-col items-start gap-8 rounded-lg p-8 shadow-md dark:shadow-2xl">
      <Button>Normal button</Button>
      <TextInput name="test" label="Example input" class="w-full max-w-xs" />
    </Panel>
  </div>
);
