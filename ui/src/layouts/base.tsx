import { type RouteSectionProps } from '@solidjs/router';
import { Sidebar } from '../components/layout/sidebar';
import { useWs } from '~/hooks/use-ws';
import { Header } from '~/components/layout/header';

export default (props: RouteSectionProps) => {
  useWs();

  return (
    <div class="flex h-full w-full flex-col xl:flex-row">
      <Sidebar class="hidden shrink-0 xl:flex xl:w-sidebar" />
      <Header class="sticky left-0 right-0 top-0 flex xl:hidden" />

      <div class="flex w-full flex-1 items-stretch justify-stretch gap-4 md:h-full md:overflow-hidden md:p-4">
        {props.children}
      </div>
    </div>
  );
};
