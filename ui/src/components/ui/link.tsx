import { A, type AnchorProps } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import type { Component, ParentProps } from 'solid-js';

type Props = ParentProps<AnchorProps>;

export const Link: Component<Props> = props => (
  <A
    {...props}
    class={cx(
      'font-sans font-semibold text-gray-500 transition-colors dark:hover:text-white dark:text-gray-200 hover:text-gray-800 hover:underline',
      props.class,
    )}
  >
    {props.children}
  </A>
);
