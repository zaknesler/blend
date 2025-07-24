import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import * as TooltipPrimitive from '@kobalte/core/tooltip';
import type { VariantProps } from 'class-variance-authority';
import { type JSX, mergeProps, Show, splitProps, type ValidComponent } from 'solid-js';
import * as classes from '~/constants/ui/tooltip';

const TooltipBase = (props: TooltipPrimitive.TooltipRootProps) => <TooltipPrimitive.Root {...props} />;

type TooltipContentProps = TooltipPrimitive.TooltipContentProps &
  VariantProps<typeof classes.content> & {
    class?: string;
    showArrow?: boolean;
    children?: JSX.Element;
  };

const TooltipContent = <T extends ValidComponent = 'div'>(props: PolymorphicProps<T, TooltipContentProps>) => {
  const [local, rest] = splitProps(props as TooltipContentProps, ['class', 'showArrow', 'children', 'size']);
  const merge = mergeProps({ showArrow: true }, local);

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        {...rest}
        class={classes.content({
          size: local.size,
          class: ['origin-[--kb-menu-content-transform-origin]', local.class],
        })}
      >
        <Show when={merge.showArrow}>
          <Tooltip.Arrow class="-mb-px z-50" />
        </Show>

        {merge.children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
};

export const Tooltip = Object.assign(TooltipBase, {
  Content: TooltipContent,
  Trigger: TooltipPrimitive.Trigger,
  Arrow: TooltipPrimitive.Arrow,
});
