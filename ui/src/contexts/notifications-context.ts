import { WebSocket } from 'partysocket';
import { createContext, createSignal, useContext } from 'solid-js';
import type { Notification } from '~/types/bindings';
import { wsUrl } from '~/utils/url';
import { useInvalidateFeed } from '../hooks/queries/use-invalidate-feed';

type NotificationsContextType = ReturnType<typeof makeNotificationsContext>;
export const NotificationsContext = createContext<NotificationsContextType>();

export const useNotifications = () => {
  const notifications = useContext(NotificationsContext);
  if (!notifications) throw new Error('NotificationsContext has not been initialized.');

  return notifications;
};

export const makeNotificationsContext = () => {
  const invalidateFeed = useInvalidateFeed();

  const [feedsRefreshing, setFeedsRefreshing] = createSignal<string[]>([]);

  const socket = new WebSocket(wsUrl('/notifications'), undefined, {
    connectionTimeout: 1000,
    maxRetries: 20,
  });

  socket.addEventListener('open', () => console.info('[ws] connection established'));
  socket.addEventListener('close', () => console.info('[ws] connection terminated'));
  socket.addEventListener('error', event => console.info('[ws] error:', event.error));

  socket.addEventListener('message', event => {
    const notif = JSON.parse(event.data) as Notification;

    console.info('[ws] received message:', notif);

    switch (notif.type) {
      case 'StartedFeedRefresh':
        setFeedsRefreshing(uuids => [...uuids, notif.data.feed_uuid]);
        break;

      case 'FinishedFeedRefresh':
        setFeedsRefreshing(uuids => uuids.filter(uuid => uuid !== notif.data.feed_uuid));
        invalidateFeed(notif.data.feed_uuid);
        break;

      case 'FinishedScrapingEntries':
      case 'FinishedFetchingFeedFavicon':
        invalidateFeed(notif.data.feed_uuid);
        break;
    }
  });

  return {
    feedsRefreshing,
  };
};
