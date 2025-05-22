import {
  DropdownMenu,
  type DropdownMenuItemProps,
  type DropdownMenuRootProps,
  type DropdownMenuTriggerProps,
} from '@kobalte/core/dropdown-menu';
import type { KbdKey } from '@solid-primitives/keyboard';
import { type VariantProps, cx } from 'class-variance-authority';
import type { ClassValue } from 'class-variance-authority/types';
import type { IconTypes } from 'solid-icons';
import { HiOutlineEllipsisHorizontal } from 'solid-icons/hi';
import { type Component, For, type JSX, type ParentComponent, type Setter, Show, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import * as menuClasses from '~/constants/ui/menu';

export type MenuProps = Omit<DropdownMenuRootProps, 'open' | 'onOpenChange'> &
  MenuContentProps & {
    open: boolean;
    setOpen: Setter<boolean>;
    trigger?: () => JSX.Element;
    triggerIcon?: IconTypes;
    triggerClass?: string;
    triggerIconClass?: string;
  };

const MenuRoot: ParentComponent<MenuProps> = props => {
  const [local, rest] = splitProps(props, [
    'size',
    'children',
    'open',
    'setOpen',
    'trigger',
    'triggerIcon',
    'triggerClass',
    'triggerIconClass',
  ]);

  return (
    <DropdownMenu placement="bottom-end" {...rest} open={local.open} onOpenChange={local.setOpen} modal>
      <Show
        when={local.trigger}
        fallback={
          <MenuTrigger class={cx('relative', local.triggerClass)}>
            <Dynamic component={local.triggerIcon || HiOutlineEllipsisHorizontal} class={local.triggerIconClass} />
          </MenuTrigger>
        }
      >
        <Dynamic component={local.trigger} />
      </Show>

      <DropdownMenu.Portal>
        <MenuContent size={local.size}>{local.children}</MenuContent>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
};

type MenuTrigger = DropdownMenuTriggerProps & {
  class?: string;
};

const MenuTrigger: ParentComponent<MenuTrigger> = props => {
  const [local, rest] = splitProps(props, ['class']);

  return (
    <DropdownMenu.Trigger {...rest} class={menuClasses.trigger({ class: local.class })}>
      {props.children}
    </DropdownMenu.Trigger>
  );
};

type MenuItemProps = DropdownMenuItemProps & {
  label: string;
  kbd?: KbdKey[];
  icon?: IconTypes;
  iconClass?: ClassValue;
};

const MenuItem: Component<MenuItemProps> = props => {
  const [local, rest] = splitProps(props, ['icon', 'label', 'kbd', 'iconClass']);

  const key = (value: KbdKey) => {
    if (value === 'Shift') return '⇧';
    return value;
  };

  const keyClass = (value: KbdKey) => {
    if (value === 'Shift') return 'text-lg';
    return undefined;
  };

  return (
    <DropdownMenu.Item {...rest} class={menuClasses.item()}>
      <Dynamic component={local.icon} class={menuClasses.itemIcon({ class: local.iconClass })} />

      {local.label}

      <Show when={local.kbd}>
        <kbd class={menuClasses.itemKbd()} title={local.kbd!.join(' + ')}>
          <For each={local.kbd!}>{value => <span class={cx(keyClass(value), 'leading-none')}>{key(value)}</span>}</For>
        </kbd>
      </Show>
    </DropdownMenu.Item>
  );
};

type MenuContentProps = VariantProps<typeof menuClasses.content>;

const MenuContent: ParentComponent<MenuContentProps> = props => (
  <DropdownMenu.Content
    class={menuClasses.content({
      class: 'origin-[--kb-menu-content-transform-origin]',
      size: props.size,
    })}
  >
    <div class={menuClasses.contentInner()}>{props.children}</div>
  </DropdownMenu.Content>
);

export const Menu = Object.assign(MenuRoot, {
  Item: MenuItem,
  Content: MenuContent,
  Trigger: MenuTrigger,
});
