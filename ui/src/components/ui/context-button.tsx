import { Popover, PopoverRootProps } from '@kobalte/core/popover';
import { cx } from 'class-variance-authority';
import { type IconTypes } from 'solid-icons';
import { HiSolidEllipsisHorizontal } from 'solid-icons/hi';
import { type JSX, type ParentComponent, type Setter, createSignal, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

type SharedContextProps = {
  forceFocus?: boolean;
  onlyDisplayForGroup?: boolean;
};

export type ContextButtonProps = Omit<PopoverRootProps, 'open' | 'onOpenChange'> &
  SharedContextProps & {
    open: boolean;
    setOpen: Setter<boolean>;
    triggerIcon?: IconTypes;
    returnFocusToTrigger?: boolean;
    triggerClass?: string;
    triggerIconClass?: string;
  };

const ContextButtonRoot: ParentComponent<ContextButtonProps> = props => {
  const [local, rest] = splitProps(props, [
    'children',
    'open',
    'setOpen',
    'forceFocus',
    'triggerIcon',
    'triggerClass',
    'triggerIconClass',
    'returnFocusToTrigger',
    'onlyDisplayForGroup',
  ]);

  const [navItemElement, setNavItemElement] = createSignal<HTMLAnchorElement>();

  const handleMenuClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    local.setOpen(true);
  };

  const handleReturnFocusToNavItem = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    navItemElement()?.focus();
  };

  return (
    <Popover placement="bottom-end" {...rest} open={local.open} onOpenChange={local.setOpen} modal>
      <Popover.Anchor>
        <Popover.Trigger
          as={() => (
            <ActionButton
              onClick={handleMenuClick}
              onlyDisplayForGroup={!!local.onlyDisplayForGroup}
              forceFocus={local.forceFocus || (local.onlyDisplayForGroup && local.open)}
              ref={setNavItemElement}
              class={local.triggerClass}
            >
              <Dynamic component={local.triggerIcon || HiSolidEllipsisHorizontal} class={local.triggerIconClass} />
            </ActionButton>
          )}
        />
      </Popover.Anchor>

      <Popover.Portal>
        <Popover.Content
          class={cx(
            'z-50 w-32 overflow-hidden rounded-md border shadow-sm',
            'border-gray-200 bg-white text-gray-600',
            'dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200',
            'origin-[--kb-popover-content-transform-origin] animate-contentHide ui-expanded:animate-contentShow',
          )}
          onCloseAutoFocus={local.returnFocusToTrigger ? handleReturnFocusToNavItem : undefined}
        >
          <div class="flex flex-col gap-0.5 p-1 text-sm">{local.children}</div>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
};

type ActionButtonProps = JSX.IntrinsicElements['button'] & SharedContextProps;

const ActionButton: ParentComponent<ActionButtonProps> = props => {
  const [local, rest] = splitProps(props, ['onlyDisplayForGroup', 'forceFocus', 'class']);

  return (
    <button
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
    </button>
  );
};

type ContextItemProps = Omit<JSX.IntrinsicElements['button'], 'onClick'> & {
  onClick: () => void;
};

const ContextItem: ParentComponent<ContextItemProps> = props => {
  const handleClick = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    props.onClick?.();
  };

  return (
    <button
      {...props}
      onClick={event => handleClick(event)}
      class={cx(
        'appearance-none rounded px-2 py-1 text-left',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'hover:bg-gray-100 focus:bg-gray-100 focus:outline-none active:bg-gray-100',
        'dark:hover:bg-gray-700 dark:focus:bg-gray-700 dark:focus:outline-none dark:active:bg-gray-700',
      )}
    >
      {props.children}
    </button>
  );
};

export const ContextButton = Object.assign(ContextButtonRoot, {
  Item: ContextItem,
});
