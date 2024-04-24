import { type RouteSectionProps } from '@solidjs/router';
import { Sidebar } from '../components/sidebar';

export default ({ children }: RouteSectionProps) => (
  <div class="flex h-full w-full">
    <Sidebar />

    <div class="h-full w-full flex-1 overflow-y-auto overflow-x-hidden">
      <div class="flex max-w-4xl flex-col gap-8 p-8 font-serif md:p-16">{children}</div>
    </div>
  </div>
);
