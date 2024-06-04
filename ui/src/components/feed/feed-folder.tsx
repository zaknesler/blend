import { Collapsible } from '@kobalte/core/collapsible';
import { cx } from 'class-variance-authority';
import { HiSolidChevronRight } from 'solid-icons/hi';
import { type ParentComponent, createSignal } from 'solid-js';
import * as feedClasses from '~/constants/ui/feed';

type FeedFolderProps = {
  label: string;
};

export const FeedFolder: ParentComponent<FeedFolderProps> = props => {
  const [open, setOpen] = createSignal(false);

  return (
    <Collapsible open={open()} onOpenChange={setOpen} class="-mx-1 flex flex-col gap-1">
      <Collapsible.Trigger as="button" class={feedClasses.folder({ active: open() })}>
        <div class="flex size-7 items-center justify-center md:size-5">
          <HiSolidChevronRight
            class={cx('size-4 text-gray-500 transition-transform md:size-3', open() && 'rotate-90')}
          />
        </div>
        <span class="text-sm">{props.label}</span>
      </Collapsible.Trigger>

      <Collapsible.Content class="mr-1 flex">
        <div class="w-4 shrink-0" />
        <div class="flex flex-1 flex-col gap-1">{props.children}</div>
      </Collapsible.Content>
    </Collapsible>
  );
};
