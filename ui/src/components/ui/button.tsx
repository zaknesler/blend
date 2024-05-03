import { type VariantProps } from 'class-variance-authority';
import { JSX, ParentComponent } from 'solid-js';
import { Button as BaseButton, ButtonRootProps } from '@kobalte/core/button';
import { buttonClass } from '~/constants/ui/button';

type ButtonProps = JSX.IntrinsicElements['button'] &
  ButtonRootProps &
  VariantProps<typeof buttonClass> & {
    icon?: JSX.Element;
    iconSide?: 'left' | 'right';
    href?: string;
  };

export const Button: ParentComponent<ButtonProps> = props => (
  <BaseButton
    {...props}
    disabled={props.disabled}
    class={buttonClass({
      size: props.size,
      fullWidth: props.fullWidth,
      variant: props.variant,
      disabled: props.disabled,
      class: props.class,
    })}
  >
    {props.icon ? (
      <>
        {props.iconSide === 'left' && props.icon}
        <span>{props.children}</span>
        {props.iconSide === 'right' && props.icon}
      </>
    ) : (
      props.children
    )}
  </BaseButton>
);
