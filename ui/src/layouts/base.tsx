import { type RouteSectionProps } from '@solidjs/router';
import { Sidebar } from '../components/sidebar';
import { Nav } from '~/components/nav';

export default ({ children }: RouteSectionProps) => (
  <div class="flex h-full w-full">
    <Sidebar class="hidden md:flex md:w-sidebar" />
    <Nav class="flex md:hidden" />

    <div class="h-full w-full flex-1 overflow-y-auto overflow-x-hidden">
      <div class="flex max-w-4xl flex-col gap-8 p-8 md:p-16">
        {children}

        <div class="h-10 md:hidden" />
      </div>
    </div>
  </div>
);
