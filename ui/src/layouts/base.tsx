import { type RouteSectionProps } from '@solidjs/router';
import { Sidebar } from '../components/layout/sidebar';
import { connectWs } from '~/hooks/connectWs';
import { Header } from '~/components/layout/header';

export default (props: RouteSectionProps) => {
  connectWs();

  return (
    <div class="flex h-full w-full flex-col md:flex-row">
      <Sidebar class="hidden shrink-0 md:flex md:w-sidebar" />
      <Header class="flex md:hidden" />

      <div class="flex h-full w-full flex-1 items-stretch justify-stretch gap-4 overflow-hidden md:p-4">
        {props.children}
      </div>
    </div>
  );
};
