import { Button } from '@kobalte/core/button';
import type { TooltipTriggerProps } from '@kobalte/core/tooltip';
import { useNavigate } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { HiOutlineQueueList, HiSolidArrowLeft, HiSolidXMark } from 'solid-icons/hi';
import type { Component, Setter } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useQueryState } from '~/hooks/use-query-state';
import { LogoSquare } from '../layout/logo';
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

  return (
    <div class={cx('flex w-full items-center gap-4 bg-gray-200/20 p-4', props.class)}>
      <LogoSquare class="h-6 w-6" />

      <div class="flex flex-1 items-center justify-end">
        {props.showFeedSwitch && (
          <Tooltip openDelay={100}>
            <Tooltip.Trigger
              as={(local: TooltipTriggerProps) => (
                <Button
                  {...local}
                  onClick={() => props.setOpen(val => !val)}
                  class="-m-1 rounded-lg p-1 hover:bg-gray-100"
                >
                  <Dynamic component={props.open ? HiSolidXMark : HiOutlineQueueList} class="h-5 w-5 text-gray-500" />
                </Button>
              )}
            />
            <Tooltip.Content>{props.open ? 'Hide feeds' : 'Show feeds'}</Tooltip.Content>
          </Tooltip>
        )}

        {props.showBackArrow && (
          <Tooltip openDelay={100}>
            <Tooltip.Trigger
              as={(local: TooltipTriggerProps) => (
                <Button
                  {...local}
                  onClick={() => navigate(state.getFeedUrl())}
                  class="-m-1 ml-auto rounded-lg p-1 hover:bg-gray-100"
                >
                  <HiSolidArrowLeft class="h-5 w-5 text-gray-500" />
                </Button>
              )}
            />
            <Tooltip.Content>Back to feeds</Tooltip.Content>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
