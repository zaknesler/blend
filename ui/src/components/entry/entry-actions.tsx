import { cx } from 'class-variance-authority';
import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBookmark,
  HiOutlineEnvelope,
  HiSolidBookmark,
} from 'solid-icons/hi';
import type { Component } from 'solid-js';
import { useEntries } from '~/contexts/entries-context';
import { useEntryRead } from '~/hooks/queries/use-entry-read';
import { useEntrySaved } from '~/hooks/queries/use-entry-saved';
import type { Entry } from '~/types/bindings';
import { ActionButton } from '../ui/button/action-button';

type EntryActionsProps = {
  entry: Entry;
};

export const EntryActions: Component<EntryActionsProps> = props => {
  const entries = useEntries();
  const entryRead = useEntryRead();
  const entrySaved = useEntrySaved();

  const handleToggleRead = () => {
    const action = props.entry.read_at ? entryRead.markUnread : entryRead.markRead;
    action(props.entry.uuid);
  };

  const handleToggleSaved = () => {
    const action = props.entry.saved_at ? entrySaved.markUnsaved : entrySaved.markSaved;
    action(props.entry.uuid, true);
  };

  const handleNavigateBack = () => {
    entries.nav.maybeNavigate('back');
  };

  const handleNavigateNext = () => {
    entries.nav.maybeNavigate('next');
  };

  return (
    <div
      class={cx(
        'z-10 flex items-center gap-2 bg-gray-50 p-2 shadow-top dark:bg-gray-950',
        'md:fixed md:top-8 md:right-8 md:gap-1 md:rounded-xl md:border md:border-gray-400/25 md:dark:border-gray-500/25 md:bg-white/25 md:dark:bg-black/10 md:p-1 dark:shadow-top-xl md:shadow-none md:backdrop-blur-md',
      )}
    >
      <ActionButton
        onClick={handleToggleRead}
        icon={HiOutlineEnvelope}
        tooltip={props.entry.read_at ? 'Mark as unread' : 'Mark as read'}
        showCircle={!props.entry.read_at}
        class="p-2"
      />

      <ActionButton
        onClick={handleToggleSaved}
        icon={props.entry.saved_at ? HiSolidBookmark : HiOutlineBookmark}
        tooltip={props.entry.saved_at ? 'Unsave' : 'Save'}
        class="p-2"
      />

      <ActionButton href={props.entry.url} icon={HiOutlineArrowTopRightOnSquare} tooltip="Open entry URL" class="p-2" />

      <ActionButton
        onClick={handleNavigateBack}
        disabled={!entries.nav.canGoBack()}
        icon={HiOutlineArrowLeft}
        tooltip="Previous entry"
        class="ml-auto p-2 md:hidden"
      />

      <ActionButton
        onClick={handleNavigateNext}
        disabled={!entries.nav.canGoForward()}
        icon={HiOutlineArrowRight}
        tooltip="Next entry"
        class="p-2 md:hidden"
      />
    </div>
  );
};
