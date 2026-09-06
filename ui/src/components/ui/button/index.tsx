import { Button as BaseButton, type ButtonRootProps } from '@kobalte/core/button';
import type { VariantProps } from 'class-variance-authority';
import { type JSX, type ParentProps, Show } from 'solid-js';
import * as classes from '~/constants/ui/button';

export type ButtonProps = JSX.IntrinsicElements['button'] &
  ButtonRootProps &
  VariantProps<typeof classes.button> & {
    icon?: JSX.Element;
    iconSide?: 'left' | 'right';
    href?: string;
  };

export const Button = (props: ParentProps<ButtonProps>) => (
  <BaseButton
    {...props}
    disabled={props.disabled}
    class={classes.button({
      size: props.size,
      fullWidth: props.fullWidth,
      variant: props.variant,
      disabled: props.disabled,
      class: props.class,
    })}
  >
    <Show when={props.icon} fallback={props.children}>
      <Show when={props.iconSide === 'left'}>{props.icon}</Show>
      {props.children}
      <Show when={props.iconSide === 'right'}>{props.icon}</Show>
    </Show>
  </BaseButton>
);
