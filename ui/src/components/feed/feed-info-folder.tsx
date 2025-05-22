import { cx } from 'class-variance-authority';
import { HiOutlineArrowPath, HiOutlineCheck } from 'solid-icons/hi';
import { Match, Switch } from 'solid-js';
import { useNotifications } from '~/contexts/notification-context';
import { useQueryState } from '~/contexts/query-state-context';
import { useFolders } from '~/hooks/queries/use-folders';
import { useRefreshFeeds } from '~/hooks/queries/use-refresh-feeds';
import { IconButton } from '../ui/button/icon-button';
import { FeedHeader } from './feed-header';

export const FeedInfoFolder = () => {
  const state = useQueryState();

  const refreshFeeds = useRefreshFeeds();
  const notifications = useNotifications();

  const folders = useFolders();
  const getFolder = () => folders.findBySlug(state.params.folder_slug);

  return (
    <Switch>
      <Match when={folders.query.isPending}>
        <p>Loading folder...</p>
      </Match>

      <Match when={folders.query.isError}>
        <p>Error: {folders.query.error?.message}</p>
      </Match>

      <Match when={folders.query.isSuccess}>
        <div class="flex w-full select-none items-start justify-between gap-2">
          <FeedHeader title={getFolder()?.label} />

          <IconButton
            disabled
            icon={HiOutlineCheck}
            tooltip="Mark all as read"
            class="z-10 size-8 rounded-lg text-gray-500 md:size-6 md:rounded-md"
            iconClass="size-5 md:size-4"
          />

          <IconButton
            onSelect={() => refreshFeeds()}
            icon={HiOutlineArrowPath}
            tooltip="Refresh all feeds"
            class="z-10 size-8 rounded-lg text-gray-500 md:size-6 md:rounded-md"
            iconClass={cx('size-5 md:size-4', !!notifications.feedsRefreshing().length && 'animate-spin')}
          />
        </div>
      </Match>
    </Switch>
  );
};
