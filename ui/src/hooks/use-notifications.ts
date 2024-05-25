import { wsUrl } from '~/utils/url';
import { WebSocket } from 'partysocket';
import type { Notification } from '~/types/bindings';
import { createEffect, createSignal } from 'solid-js';
import { useInvalidateFeed } from './queries/use-invalidate-feed';

export const useNotifications = () => {
  const [feedsRefreshing, setFeedsRefreshing] = createSignal<string[]>([]);
  const invalidateFeed = useInvalidateFeed();

  createEffect(() => {
    const refreshing = feedsRefreshing();
    if (!refreshing.length) return;

    console.log(`refreshing ${refreshing.length} feeds`);
  });

  const socket = new WebSocket(wsUrl('/notifications'), undefined, {
    connectionTimeout: 1000,
    maxRetries: 10,
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
        invalidateFeed(notif.data.feed_uuid);
        break;
    }
  });
};
