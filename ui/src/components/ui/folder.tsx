import { Collapsible } from '@kobalte/core/collapsible';
import { cx } from 'class-variance-authority';
import { HiSolidChevronRight } from 'solid-icons/hi';
import { type ParentComponent, createSignal } from 'solid-js';

type FolderProps = {
  label: string;
};

export const Folder: ParentComponent<FolderProps> = props => {
  const [open, setOpen] = createSignal(false);

  return (
    <Collapsible open={open()} onOpenChange={setOpen} class="flex w-full flex-col gap-1">
      <Collapsible.Trigger
        as="button"
        class={cx(
          'flex w-full select-none items-center gap-2 rounded-lg border border-transparent p-1 text-base no-underline outline-none transition md:rounded-md md:text-sm',
          'text-gray-500 ring-gray-100 focus:border-gray-400 hover:border-gray-200 hover:bg-gray-100 xl:hover:bg-gray-200 focus:text-gray-700 hover:text-gray-700 focus:outline-none focus:ring-2',
        )}
      >
        <div class="flex size-7 items-center justify-center md:size-5">
          <HiSolidChevronRight
            class={cx('size-4 text-gray-500 transition-transform md:size-3', open() && 'rotate-90')}
          />
        </div>
        <span class="text-sm">{props.label}</span>
      </Collapsible.Trigger>

      <Collapsible.Content class="flex">
        <div class="w-7 shrink-0" />
        <div class="flex flex-1 flex-col gap-1">{props.children}</div>
      </Collapsible.Content>
    </Collapsible>
  );
};
