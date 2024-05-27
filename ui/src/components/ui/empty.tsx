import type { ParentComponent } from 'solid-js';

export const Empty: ParentComponent = props => (
  <div class="flex h-full w-full items-center justify-center rounded-lg border-4 border-gray-200 border-dashed p-4 py-16 text-center text-gray-500 text-sm dark:border-gray-800 dark:text-gray-300">
    {props.children}
  </div>
);
