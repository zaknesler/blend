import { useNavigate } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { HiOutlineQueueList, HiOutlineXMark } from 'solid-icons/hi';
import { type Component, type Setter, Show, createSignal } from 'solid-js';
import { useQueryState } from '~/contexts/query-state-context';
import { AppMenu } from '../menus/menu-app';
import { ActionButton } from '../ui/button/action-button';

type NavRowProps = {
  class?: string;
  open: boolean;
  setOpen: Setter<boolean>;
  showFeedSwitch: boolean;
  showCloseButton: boolean;
};

export const NavRow: Component<NavRowProps> = props => {
  const state = useQueryState();
  const navigate = useNavigate();

  const [settingsOpen, setSettingsOpen] = createSignal(false);

  return (
    <div class={cx('flex w-full items-center gap-4 bg-gray-50 p-4 dark:bg-gray-950 md:dark:bg-gray-900', props.class)}>
      <AppMenu open={settingsOpen()} setOpen={setSettingsOpen} gutter={4} />

      <div class="flex flex-1 items-center justify-end">
        <Show when={props.showFeedSwitch}>
          <ActionButton
            onClick={() => props.setOpen(val => !val)}
            class="-m-1"
            tooltip={props.open ? 'Hide feeds' : 'Show feeds'}
            icon={props.open ? HiOutlineXMark : HiOutlineQueueList}
          />
        </Show>

        <Show when={props.showCloseButton}>
          <ActionButton
            onClick={() => navigate(state.getFeedUrl())}
            class="-m-1 ml-auto"
            tooltip="Back to entries"
            icon={HiOutlineXMark}
          />
        </Show>
      </div>
    </div>
  );
};
