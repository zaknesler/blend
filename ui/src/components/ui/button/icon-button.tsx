import { Button as BaseButton, type ButtonRootProps } from '@kobalte/core/button';
import type { TooltipTriggerProps } from '@kobalte/core/tooltip';
import type { VariantProps } from 'class-variance-authority';
import type { IconTypes } from 'solid-icons';
import { type Component, type JSX, Show, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { trigger } from '~/constants/ui/menu';
import { Tooltip } from '../tooltip';

export type IconButtonProps = JSX.IntrinsicElements['button'] &
  ButtonRootProps &
  VariantProps<typeof trigger> & {
    icon: IconTypes;
    class?: string;
    tooltip?: string;
  };

export const IconButton: Component<IconButtonProps> = props => {
  const [local, rest] = splitProps(props, ['class', 'tooltip', 'icon']);

  return (
    <Show
      when={local.tooltip}
      fallback={
        <BaseButton {...rest} class={trigger({ class: local.class })}>
          <Dynamic component={local.icon} />
        </BaseButton>
      }
    >
      <Tooltip openDelay={100}>
        <Tooltip.Trigger
          as={(polyProps: TooltipTriggerProps) => (
            <BaseButton {...polyProps} {...rest} class={trigger({ class: local.class })}>
              <Dynamic component={local.icon} />
            </BaseButton>
          )}
        />
        <Tooltip.Content>{local.tooltip}</Tooltip.Content>
      </Tooltip>
    </Show>
  );
};
