import { type Component } from 'solid-js';
import { Logo } from './logo';
import { cx } from 'class-variance-authority';

type HeaderProps = {
  class?: string;
};

export const Header: Component<HeaderProps> = props => (
  <div
    class={cx(
      'flex items-center justify-between gap-4 bg-gray-200/20 p-4 shadow-md backdrop-blur-md md:bg-white dark:bg-gray-900',
      props.class,
    )}
  >
    <Logo />
  </div>
);
