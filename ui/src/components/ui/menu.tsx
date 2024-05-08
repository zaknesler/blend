import {
  DropdownMenu,
  DropdownMenuItemProps,
  DropdownMenuRootProps,
  DropdownMenuTriggerProps,
} from '@kobalte/core/dropdown-menu';
import { cx } from 'class-variance-authority';
import { type IconTypes } from 'solid-icons';
import { HiSolidEllipsisHorizontal } from 'solid-icons/hi';
import { type ParentComponent, type Setter, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

type SharedMenuProps = {
  forceFocus?: boolean;
  onlyDisplayForGroup?: boolean;
};

export type MenuProps = Omit<DropdownMenuRootProps, 'open' | 'onOpenChange'> &
  SharedMenuProps & {
    open: boolean;
    setOpen: Setter<boolean>;
    triggerIcon?: IconTypes;
    triggerClass?: string;
    triggerIconClass?: string;
  };

const MenuRoot: ParentComponent<MenuProps> = props => {
  const [local, rest] = splitProps(props, [
    'children',
    'open',
    'setOpen',
    'forceFocus',
    'triggerIcon',
    'triggerClass',
    'triggerIconClass',
    'onlyDisplayForGroup',
  ]);

  return (
    <DropdownMenu placement="bottom-end" {...rest} open={local.open} onOpenChange={local.setOpen} modal>
      <MenuTrigger
        onlyDisplayForGroup={!!local.onlyDisplayForGroup}
        forceFocus={local.forceFocus || (local.onlyDisplayForGroup && local.open)}
        class={cx('relative', local.triggerClass)}
      >
        <Dynamic component={local.triggerIcon || HiSolidEllipsisHorizontal} class={local.triggerIconClass} />
      </MenuTrigger>

      <DropdownMenu.Portal>
        <MenuContent>{local.children}</MenuContent>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
};

type MenuTrigger = DropdownMenuTriggerProps &
  SharedMenuProps & {
    class?: string;
  };

const MenuTrigger: ParentComponent<MenuTrigger> = props => {
  const [local, rest] = splitProps(props, ['onlyDisplayForGroup', 'forceFocus', 'class']);

  return (
    <DropdownMenu.Trigger
      {...rest}
      class={cx(
        'flex shrink-0 appearance-none items-center justify-center rounded border border-gray-200 transition dark:border-gray-700',
        'focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-600',
        local.onlyDisplayForGroup && 'opacity-0 focus:opacity-100 group-focus:opacity-100',
        local.onlyDisplayForGroup && local.forceFocus
          ? 'border-gray-500 bg-gray-100 opacity-100 outline-none ring-1 ring-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:ring-gray-600'
          : 'bg-white hover:border-gray-300 hover:bg-gray-100 group-hover:opacity-100 dark:bg-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-600',
        props.class,
      )}
    >
      {props.children}
    </DropdownMenu.Trigger>
  );
};

const MenuItem: ParentComponent<DropdownMenuItemProps> = props => (
  <DropdownMenu.Item
    {...props}
    class={cx(
      'select-none appearance-none rounded px-2 py-1 text-left',
      'ui-disabled:cursor-not-allowed ui-disabled:opacity-50',
      'hover:bg-gray-100 focus:bg-gray-100 focus:outline-none active:bg-gray-100',
      'dark:hover:bg-gray-700 dark:focus:bg-gray-700 dark:focus:outline-none dark:active:bg-gray-700',
    )}
  >
    {props.children}
  </DropdownMenu.Item>
);

const MenuContent: ParentComponent = props => (
  <DropdownMenu.Content
    class={cx(
      'z-50 min-w-32 overflow-hidden rounded-md border shadow-sm',
      'border-gray-200 bg-white text-gray-600',
      'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200',
      'origin-[--kb-menu-content-transform-origin] animate-contentHide ui-expanded:animate-contentShow',
    )}
  >
    <div class="flex flex-col gap-0.5 p-1 text-sm">{props.children}</div>
  </DropdownMenu.Content>
);

export const Menu = Object.assign(MenuRoot, {
  Item: MenuItem,
  Content: MenuContent,
});
