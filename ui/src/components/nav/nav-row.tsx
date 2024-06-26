import { Button } from '@kobalte/core/button';
import type { TooltipTriggerProps } from '@kobalte/core/tooltip';
import { useNavigate } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { HiOutlineQueueList, HiSolidArrowLeft, HiSolidXMark } from 'solid-icons/hi';
import { type Component, type Setter, Show, createSignal } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useQueryState } from '~/contexts/query-state-context';
import { AppMenu } from '../menus/menu-app';
import { Tooltip } from '../ui/tooltip';

type NavRowProps = {
  class?: string;
  open: boolean;
  setOpen: Setter<boolean>;
  showFeedSwitch: boolean;
  showBackArrow: boolean;
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
          <Tooltip openDelay={100}>
            <Tooltip.Trigger
              as={(local: TooltipTriggerProps) => (
                <Button
                  {...local}
                  onClick={() => props.setOpen(val => !val)}
                  class="-m-1 z-10 cursor-default appearance-none rounded-lg p-1 dark:hover:bg-gray-700 hover:bg-gray-100 focus:outline-none dark:focus:ring-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-opacity-30"
                >
                  <Dynamic
                    component={props.open ? HiSolidXMark : HiOutlineQueueList}
                    class="size-5 text-gray-500 dark:text-gray-400"
                  />
                </Button>
              )}
            />
            <Tooltip.Content>{props.open ? 'Hide feeds' : 'Show feeds'}</Tooltip.Content>
          </Tooltip>
        </Show>

        <Show when={props.showBackArrow}>
          <Tooltip openDelay={100}>
            <Tooltip.Trigger
              as={(local: TooltipTriggerProps) => (
                <Button
                  {...local}
                  onClick={() => navigate(state.getFeedUrl())}
                  class="-m-1 z-10 ml-auto cursor-default appearance-none rounded-lg p-1 dark:hover:bg-gray-800 hover:bg-gray-100"
                >
                  <HiSolidArrowLeft class="size-5 text-gray-500 dark:text-gray-400" />
                </Button>
              )}
            />
            <Tooltip.Content>Back to feeds</Tooltip.Content>
          </Tooltip>
        </Show>
      </div>
    </div>
  );
};
