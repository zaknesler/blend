import { Collapsible } from '@kobalte/core/collapsible';
import { cx } from 'class-variance-authority';
import { HiOutlineChevronRight } from 'solid-icons/hi';
import { type ParentComponent, createSignal } from 'solid-js';
import * as feedClasses from '~/constants/ui/feed';

type FeedFolderProps = {
  slug: string;
  label: string;
};

export const FeedFolder: ParentComponent<FeedFolderProps> = props => {
  const [open, setOpen] = createSignal(false);

  return (
    <Collapsible open={open()} onOpenChange={setOpen} class="flex flex-col items-stretch gap-1">
      <Collapsible.Trigger as="button" class={feedClasses.folder({ active: open() })}>
        <div class="flex size-7 items-center justify-center md:size-5">
          <HiOutlineChevronRight
            class={cx('size-4 text-gray-500 transition-transform md:size-3', open() && 'rotate-90')}
          />
        </div>
        <span class="text-base md:text-sm">{props.label}</span>
      </Collapsible.Trigger>

      <Collapsible.Content class="flex animate-collapse-up ui-expanded:animate-collapse-down overflow-hidden">
        <div class="flex w-full flex-col gap-1 overflow-hidden pl-4">{props.children}</div>
      </Collapsible.Content>
    </Collapsible>
  );
};
