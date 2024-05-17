import { type Component, createSignal } from 'solid-js';
import { LogoSquare } from './logo';
import { CreateFeed } from '../modals/create-feed';
import { cx } from 'class-variance-authority';
import { TiCog } from 'solid-icons/ti';
import { FeedList } from '../feed/feed-list';
import { Menu } from '../ui/menu';

type SidebarProps = {
  class?: string;
};

export const Sidebar: Component<SidebarProps> = props => {
  const [settingsOpen, setSettingsOpen] = createSignal(false);

  return (
    <div class={cx('relative -mr-4 flex h-full flex-col items-stretch gap-4 p-4 dark:bg-gray-950', props.class)}>
      <div class="flex justify-between">
        <LogoSquare class="h-6 w-6" />

        <Menu
          open={settingsOpen()}
          setOpen={setSettingsOpen}
          triggerIcon={TiCog}
          gutter={4}
          triggerClass="w-6 h-6 rounded-md"
          triggerIconClass="w-5 h-5 text-gray-500"
        >
          <Menu.Item onSelect={() => {}} disabled>
            Import/export
          </Menu.Item>
          <Menu.Item onSelect={() => {}} disabled>
            Settings
          </Menu.Item>
          <Menu.Item onSelect={() => {}} disabled>
            Sign out
          </Menu.Item>
        </Menu>
      </div>

      <FeedList />
      <CreateFeed triggerClass="absolute bottom-4 right-4" />
    </div>
  );
};
