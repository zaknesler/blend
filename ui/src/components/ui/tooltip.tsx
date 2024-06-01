import type { PolymorphicProps } from '@kobalte/core/polymorphic';
import * as TooltipPrimitive from '@kobalte/core/tooltip';
import { cx } from 'class-variance-authority';
import { type JSX, Show, type ValidComponent, mergeProps, splitProps } from 'solid-js';

const TooltipBase = (props: TooltipPrimitive.TooltipRootProps) => <TooltipPrimitive.Root {...props} />;

type TooltipContentProps = TooltipPrimitive.TooltipContentProps & {
  class?: string;
  showArrow?: boolean;
  children?: JSX.Element;
};

const TooltipContent = <T extends ValidComponent = 'div'>(props: PolymorphicProps<T, TooltipContentProps>) => {
  const [local, rest] = splitProps(props as TooltipContentProps, ['class', 'showArrow', 'children']);
  const merge = mergeProps({ showArrow: true }, local);

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        {...rest}
        class={cx(
          'z-50 rounded-lg bg-gray-800 px-4 py-2 text-white text-xs',
          'origin-[--kb-menu-content-transform-origin] animate-content-hide ui-expanded:animate-content-show',
          local.class,
        )}
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
