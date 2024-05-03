import { cx } from 'class-variance-authority';
import { JSX, ParentComponent } from 'solid-js';
import { Feed } from '~/types/bindings/feed';

type ActionButtonProps = JSX.IntrinsicElements['button'] & {
  forceFocus: boolean;
};

export const ActionButton: ParentComponent<ActionButtonProps> = props => (
  <button
    {...props}
    class={cx(
      'flex h-5 w-5 shrink-0 appearance-none items-center justify-center rounded border border-gray-200 opacity-0 transition',
      'focus:border-gray-400 focus:opacity-100 focus:outline-none focus:ring-1 focus:ring-gray-200 group-focus:opacity-100',
      props.forceFocus
        ? 'border-gray-500 bg-gray-100 opacity-100 outline-none ring-1 ring-gray-200'
        : 'bg-white hover:border-gray-300 hover:bg-gray-100 group-hover:opacity-100',
    )}
  >
    {props.children}
  </button>
);

type ContextItemProps = Omit<JSX.IntrinsicElements['button'], 'onClick'> & {
  feed: Feed;
  onClick: () => void;
};

export const ContextItem: ParentComponent<ContextItemProps> = props => {
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
        'appearance-none rounded border border-transparent px-2 py-1 text-left',
        'hover:border-gray-100 hover:bg-white',
        'focus:border-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-200',
      )}
    >
      {props.children}
    </button>
  );
};
