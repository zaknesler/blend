import { wsUrl } from '~/utils/url';
import { WebSocket } from 'partysocket';
import type { Notification } from '~/types/bindings';
import { useQueryClient } from '@tanstack/solid-query';
import { QUERY_KEYS } from '~/constants/query';
import { useFilterParams } from './use-filter-params';
import { createEffect, createSignal } from 'solid-js';

export const useWs = () => {
  const filter = useFilterParams();
  const queryClient = useQueryClient();

  const [feedsRefreshing, setFeedsRefreshing] = createSignal<string[]>([]);

  createEffect(() => {
    const refreshing = feedsRefreshing();
    if (!refreshing.length) return;

    console.log(`refreshing ${refreshing.length} feeds`);
  });

  const socket = new WebSocket(wsUrl('/notifs'), undefined, {
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
        break;

      case 'EntriesFetched':
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS_STATS] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS_VIEW, notif.data.feed_uuid] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_INDEX] }); // TODO: move this to only run after all feeds have been refreshed
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_INDEX, notif.data.feed_uuid, filter.getView()] });
        break;
    }
  });
};
