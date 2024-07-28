import { cx } from 'class-variance-authority';
import { type JSX, type ParentComponent, mergeProps, splitProps } from 'solid-js';

type PanelProps = JSX.IntrinsicElements['div'] & {
  overflow?: boolean;
};

export const Panel: ParentComponent<PanelProps> = props => {
  const [local, rest] = splitProps(props, ['class', 'overflow']);
  const merged = mergeProps({ overflow: true }, local);

  return (
    <div
      {...rest}
      class={cx(
        'flex-1 bg-white md:rounded-lg md:shadow-md dark:bg-gray-900 dark:md:shadow-xl',
        merged.overflow ? 'overflow-touch-scrolling overflow-auto' : 'overflow-hidden',
        merged.class,
      )}
    >
      {props.children}
    </div>
  );
};
