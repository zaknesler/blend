import { WebSocket } from 'partysocket';
import { createContext, createSignal, useContext } from 'solid-js';
import { useEntry } from '~/hooks/queries/use-entry';
import { useInvalidateEntry } from '~/hooks/queries/use-invalidate-entry';
import type { Notification } from '~/types/bindings';
import { wsUrl } from '~/utils/url';
import { useInvalidateFeed } from '../hooks/queries/use-invalidate-feed';
import { useQueryState } from './query-state-context';

type NotificationContextType = ReturnType<typeof makeNotificationContext>;
export const NotificationContext = createContext<NotificationContextType>();

export const useNotifications = () => {
  const notification = useContext(NotificationContext);
  if (!notification) throw new Error('NotificationContext has not been initialized.');

  return notification;
};

export const makeNotificationContext = () => {
  const state = useQueryState();

  const currentEntry = useEntry(() => ({ entry_uuid: state.params.entry_uuid }));

  const invalidateFeed = useInvalidateFeed();
  const invalidateEntry = useInvalidateEntry();

  const socket = new WebSocket(wsUrl('/notifications'), undefined, {
    connectionTimeout: 1000,
    maxRetries: 20,
  });

  const [feedsRefreshing, setFeedsRefreshing] = createSignal<string[]>([]);

  const isFeedRefreshing = (feed_uuid: string) => feedsRefreshing().includes(feed_uuid);

  const maybeInvalidateCurrentEntry = (feed_uuid: string) => {
    if (!state.params.entry_uuid || currentEntry.data?.feed_uuid !== feed_uuid) return;

    // Invalidate the entry being viewed if it belongs to the same feed
    invalidateEntry(state.params.entry_uuid);
  };

  socket.addEventListener('open', () => console.info('[ws] connection established'));
  socket.addEventListener('close', () => console.info('[ws] connection terminated'));
  socket.addEventListener('error', event => console.info('[ws] error:', event.error));

  socket.addEventListener('message', event => {
    const notif = JSON.parse(event.data) as Notification;

    console.debug('[ws] received message:', notif);

    switch (notif.type) {
      case 'StartedFeedRefresh': {
        setFeedsRefreshing(uuids => [...uuids, notif.data.feed_uuid]);
        break;
      }

      case 'FinishedFeedRefresh': {
        setFeedsRefreshing(uuids => uuids.filter(uuid => uuid !== notif.data.feed_uuid));
        invalidateFeed(notif.data.feed_uuid);
        maybeInvalidateCurrentEntry(notif.data.feed_uuid);
        break;
      }

      case 'FinishedScrapingEntries':
      case 'FinishedFetchingFeedFavicon': {
        invalidateFeed(notif.data.feed_uuid);
        maybeInvalidateCurrentEntry(notif.data.feed_uuid);
        break;
      }
    }
  });

  return {
    feedsRefreshing,
    isFeedRefreshing,
  };
};
