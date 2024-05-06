import { type Component, createSignal } from 'solid-js';
import { Logo } from './logo';
import { CreateFeed } from '../modals/create-feed';
import { cx } from 'class-variance-authority';
import { ContextButton } from '../ui/context-button';
import { TiCog } from 'solid-icons/ti';
import { FeedList } from '../feed/feed-list';

type SidebarProps = {
  class?: string;
};

export const Sidebar: Component<SidebarProps> = props => {
  const [settingsOpen, setSettingsOpen] = createSignal(false);

  return (
    <div class={cx('relative -mr-4 flex h-full flex-col items-stretch gap-8 p-4 dark:bg-gray-950', props.class)}>
      <div class="flex justify-between">
        <Logo />

        <ContextButton
          open={settingsOpen()}
          setOpen={setSettingsOpen}
          triggerIcon={TiCog}
          gutter={-2}
          triggerClass="w-6 h-6"
          triggerIconClass="w-5 h-5 text-gray-500"
        >
          <ContextButton.Item onClick={() => console.log('clicky')}>Settings</ContextButton.Item>
          <ContextButton.Item onClick={() => console.log('clicky')}>Refresh feeds</ContextButton.Item>
        </ContextButton>
      </div>

      <div class="flex w-full flex-col gap-1">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Feeds</h3>
        <FeedList />
      </div>

      <CreateFeed triggerClass="absolute bottom-4 right-4" />
    </div>
  );
};
