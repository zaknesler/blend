import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBookmark,
  HiOutlineEnvelope,
  HiOutlineEnvelopeOpen,
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
    <div class="z-10 flex w-full items-center gap-2 bg-gray-50 p-2 shadow-top md:shadow dark:bg-gray-900 dark:md:shadow-xl">
      <ActionButton
        onClick={handleToggleRead}
        icon={props.entry.read_at ? HiOutlineEnvelope : HiOutlineEnvelopeOpen}
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

      <ActionButton
        href={props.entry.url}
        icon={HiOutlineArrowTopRightOnSquare}
        tooltip="Open entry URL"
        class="p-2 md:ml-auto"
      />

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
