import { cx } from 'class-variance-authority';
import {
  HiOutlineBookmark,
  HiOutlineEnvelope,
  HiSolidArrowLeft,
  HiSolidArrowRight,
  HiSolidBookmark,
} from 'solid-icons/hi';
import type { Component } from 'solid-js';
import { useEntryRead } from '~/hooks/queries/use-entry-read';
import { useEntrySaved } from '~/hooks/queries/use-entry-saved';
import type { Entry } from '~/types/bindings';
import { ActionButton } from '../ui/button/action-button';

type EntryActionsProps = {
  entry: Entry;
};

export const EntryActions: Component<EntryActionsProps> = props => {
  const entryRead = useEntryRead();
  const entrySaved = useEntrySaved();

  const handleToggleRead = () => {
    const action = props.entry.read_at ? entryRead.markUnread : entryRead.markRead;
    action(props.entry.uuid, props.entry.feed_uuid);
  };

  const handleToggleSaved = () => {
    const action = props.entry.saved_at ? entrySaved.markUnsaved : entrySaved.markSaved;
    action(props.entry.uuid, props.entry.feed_uuid);
  };

  return (
    <div
      class={cx(
        'z-10 flex items-center gap-2 bg-gray-50 p-2 shadow-top dark:bg-gray-950',
        'md:fixed md:top-8 md:right-8 md:gap-1 md:rounded-xl md:border md:border-gray-400/25 md:dark:border-gray-500/25 md:bg-white/25 md:dark:bg-black/10 md:p-1 dark:shadow-top-xl md:shadow-none md:backdrop-blur-md',
      )}
    >
      <ActionButton
        showCircle={!props.entry.read_at}
        icon={HiOutlineEnvelope}
        tooltip={props.entry.read_at ? 'Mark as unread' : 'Mark as read'}
        class="p-2 md:p-1"
        onClick={handleToggleRead}
      />

      <ActionButton
        icon={props.entry.saved_at ? HiSolidBookmark : HiOutlineBookmark}
        tooltip={props.entry.saved_at ? 'Mark as unsaved' : 'Mark as saved'}
        class="p-2 md:p-1"
        onClick={handleToggleSaved}
      />

      <ActionButton icon={HiSolidArrowLeft} tooltip="View previous item" class="ml-auto p-2 md:hidden md:p-1" />
      <ActionButton icon={HiSolidArrowRight} tooltip="View next item" class="p-2 md:hidden md:p-1" />
    </div>
  );
};
