import { cx } from 'class-variance-authority';
import { createSignal } from 'solid-js';
import { FeedList } from '../feed/feed-list';
import { AppMenu } from '../menus/menu-app';

type SidebarProps = {
  class?: string;
};

export default (props: SidebarProps) => {
  const [settingsOpen, setSettingsOpen] = createSignal(false);

  return (
    <div class={cx('-mr-4 relative flex h-full flex-col items-stretch gap-4 py-4 dark:bg-bg-dark', props.class)}>
      <div class="flex flex-col items-stretch px-4">
        <AppMenu open={settingsOpen()} setOpen={setSettingsOpen} gutter={4} />
      </div>

      <div class="flex-1 flex-col items-stretch gap-4 overflow-y-auto px-4 xl:px-3">
        <FeedList />
      </div>
    </div>
  );
};
