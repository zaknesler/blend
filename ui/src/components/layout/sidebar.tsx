import { cx } from 'class-variance-authority';
import { type Component, createSignal } from 'solid-js';
import { FeedList } from '../feed/feed-list';
import { MenuSettings } from '../menus/menu-settings';
import { LogoSquare } from './logo';

type SidebarProps = {
  class?: string;
};

export const Sidebar: Component<SidebarProps> = props => {
  const [settingsOpen, setSettingsOpen] = createSignal(false);

  return (
    <div class={cx('-mr-4 relative flex h-full flex-col items-stretch gap-4 p-4 dark:bg-gray-950', props.class)}>
      <div class="flex justify-between">
        <LogoSquare class="h-6 w-6" />
        <MenuSettings open={settingsOpen()} setOpen={setSettingsOpen} gutter={4} />
      </div>

      <FeedList />
    </div>
  );
};
