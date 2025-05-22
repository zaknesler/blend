import { Button, type ButtonRootProps } from '@kobalte/core/button';
import type { TooltipTriggerProps } from '@kobalte/core/tooltip';
import { cx } from 'class-variance-authority';
import type { IconTypes } from 'solid-icons';
import { type Component, type JSX, splitProps } from 'solid-js';
import { Dynamic, Show } from 'solid-js/web';
import * as classes from '~/constants/ui/button';
import { Tooltip } from '../tooltip';

type ActionButtonProps = JSX.IntrinsicElements['button'] &
  ButtonRootProps & {
    tooltip: string;
    icon: IconTypes;
    showCircle?: boolean;
    class?: string;
    href?: string;
  };

export const ActionButton: Component<ActionButtonProps> = props => {
  const [local, rest] = splitProps(props, ['tooltip', 'icon', 'showCircle', 'class', 'href']);

  return (
    <Tooltip openDelay={100}>
      <Tooltip.Trigger
        as={(polyProps: TooltipTriggerProps) => (
          <Button
            {...polyProps}
            {...rest}
            as={local.href ? 'a' : 'button'}
            href={local.href}
            target={local.href ? '_blank' : undefined}
            class={classes.action({ class: cx('relative', local.class) })}
          >
            <Dynamic component={local.icon} class="size-5 text-current md:size-4" />
            <Show when={local.showCircle}>
              <div class="absolute top-1.5 right-1.5 z-10 h-2 w-2 rounded-full bg-current" />
            </Show>
          </Button>
        )}
      />
      <Tooltip.Content>{local.tooltip}</Tooltip.Content>
    </Tooltip>
  );
};
