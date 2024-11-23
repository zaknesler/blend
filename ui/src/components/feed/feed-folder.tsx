import { Button } from '@kobalte/core/button';
import { Collapsible } from '@kobalte/core/collapsible';
import { useNavigate } from '@solidjs/router';
import { cx } from 'class-variance-authority';
import { HiOutlineChevronRight } from 'solid-icons/hi';
import { type ParentComponent, createSignal } from 'solid-js';
import * as feedClasses from '~/constants/ui/feed';
import { useQueryState } from '~/contexts/query-state-context';

type FeedFolderProps = {
  slug: string;
  label: string;
};

export const FeedFolder: ParentComponent<FeedFolderProps> = props => {
  const state = useQueryState();
  const navigate = useNavigate();

  const isActive = () => state.params.folder_slug === props.slug;
  const [open, setOpen] = createSignal(isActive());

  const handleNavigate = (isOpen: boolean) => {
    navigate(`/folder/${props.slug}`);
    if (isOpen) setOpen(isOpen);
    else if (!isOpen && isActive()) setOpen(isOpen);
  };

  const handleClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setOpen(value => !value);
  };

  return (
    <Collapsible open={open()} onOpenChange={handleNavigate} class="flex flex-col items-stretch gap-1">
      <Collapsible.Trigger as="button" class={feedClasses.item({ active: isActive() })}>
        <Button
          class={feedClasses.folderTrigger({
            active: isActive(),
            class: 'flex size-7 items-center justify-center md:size-5',
          })}
          onClick={handleClick}
        >
          <HiOutlineChevronRight
            class={cx('size-4 text-gray-500 transition-transform md:size-3 dark:text-gray-400', open() && 'rotate-90')}
          />
        </Button>

        <span class="text-base md:text-sm">{props.label}</span>
      </Collapsible.Trigger>

      <Collapsible.Content class="flex animate-collapse-up ui-expanded:animate-collapse-down overflow-hidden">
        <div class="flex w-full flex-col gap-1 overflow-hidden pl-6">{props.children}</div>
      </Collapsible.Content>
    </Collapsible>
  );
};
