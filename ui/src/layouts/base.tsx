import { type RouteSectionProps } from '@solidjs/router';
import { Sidebar } from '../components/sidebar';
import { Nav } from '~/components/nav';
import { connectWs } from '~/hooks/connectWs';
import { Header } from '~/components/header';

export default ({ children }: RouteSectionProps) => {
  connectWs();

  return (
    <div class="flex h-full w-full flex-col md:flex-row">
      <Sidebar class="hidden md:flex md:w-sidebar" />
      <Header class="flex md:hidden" />
      <Nav class="flex md:hidden" />

      <div class="h-full w-full flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 dark:bg-gray-900">
        <div class="flex max-w-4xl flex-col gap-8 p-8 md:p-16">
          {children}
          <div class="h-10 md:hidden" />
        </div>
      </div>
    </div>
  );
};
