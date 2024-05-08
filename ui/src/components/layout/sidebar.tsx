import { type Component, createSignal } from 'solid-js';
import { Logo } from './logo';
import { CreateFeed } from '../modals/create-feed';
import { cx } from 'class-variance-authority';
import { Menu } from '../ui/menu';
import { TiCog } from 'solid-icons/ti';
import { FeedList } from '../feed/feed-list';
import { useRefreshFeeds } from '~/hooks/queries/use-refresh-feeds';

type SidebarProps = {
  class?: string;
};

export const Sidebar: Component<SidebarProps> = props => {
  const [settingsOpen, setSettingsOpen] = createSignal(false);

  const refresh = useRefreshFeeds();

  const handleRefreshFeeds = () => {
    refresh.refreshFeeds();
    setSettingsOpen(false);
  };

  return (
    <div class={cx('relative -mr-4 flex h-full flex-col items-stretch gap-8 p-4 dark:bg-gray-950', props.class)}>
      <div class="flex justify-between">
        <Logo />

        <Menu
          open={settingsOpen()}
          setOpen={setSettingsOpen}
          triggerIcon={TiCog}
          gutter={4}
          triggerClass="w-6 h-6 rounded-md"
          triggerIconClass="w-5 h-5 text-gray-500"
        >
          <Menu.Item onSelect={() => console.log('clicky')} disabled>
            Settings
          </Menu.Item>
          <Menu.Item onSelect={handleRefreshFeeds}>Refresh feeds</Menu.Item>
        </Menu>
      </div>

      <div class="flex w-full flex-col gap-1">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Feeds</h3>
        <FeedList />
      </div>

      <CreateFeed triggerClass="absolute bottom-4 right-4" />
    </div>
  );
};
