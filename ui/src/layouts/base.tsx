import { type RouteSectionProps } from '@solidjs/router';
import { Sidebar } from '../components/sidebar';
import { Nav } from '~/components/nav';
import { connectWs } from '~/hooks/connectWs';
import { Header } from '~/components/header';

export default ({ children }: RouteSectionProps) => {
  connectWs();

  return (
    <div class="flex h-full w-full flex-col md:flex-row">
      <Sidebar class="hidden shrink-0 md:flex md:w-sidebar" />
      <Header class="flex md:hidden" />
      <Nav class="flex md:hidden" />

      <div class="flex h-full w-full flex-1 items-stretch justify-stretch gap-4 overflow-hidden md:p-4">
        <div class="flex-1 flex-col gap-8 overflow-x-auto overflow-y-auto bg-white p-4 md:rounded-lg md:p-8 md:shadow-md">
          {children}
          <div class="h-16 md:hidden" />
        </div>
      </div>
    </div>
  );
};
