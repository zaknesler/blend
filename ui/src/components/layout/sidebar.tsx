import { cx } from 'class-variance-authority';
import { type Component, createSignal } from 'solid-js';
import { FeedList } from '../feed/feed-list';
import { AppMenu } from '../menus/menu-app';

type SidebarProps = {
  class?: string;
};

export const Sidebar: Component<SidebarProps> = props => {
  const [settingsOpen, setSettingsOpen] = createSignal(false);

  return (
    <div class={cx('-mr-4 relative flex h-full flex-col items-stretch gap-4 p-4 dark:bg-gray-950', props.class)}>
      <AppMenu open={settingsOpen()} setOpen={setSettingsOpen} gutter={4} />
      <FeedList />
    </div>
  );
};
