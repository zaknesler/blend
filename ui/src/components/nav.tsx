import { type Component } from 'solid-js';
import { Logo } from './logo';
import { CreateFeed } from './modals/create-feed';
import { cx } from 'class-variance-authority';
import { Portal } from 'solid-js/web';

type NavProps = {
  class?: string;
};

export const Nav: Component<NavProps> = props => (
  <Portal>
    <div
      class={cx(
        'absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 rounded-xl bg-white/75 p-4 shadow-md backdrop-blur',
        props.class,
      )}
    >
      <Logo />
      <CreateFeed />
    </div>
  </Portal>
);
