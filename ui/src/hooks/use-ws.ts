import { wsUrl } from '~/utils/url';
import { WebSocket } from 'partysocket';
import { Notification } from '~/types/bindings/notification';
import { useQueryClient } from '@tanstack/solid-query';
import { QUERY_KEYS } from '~/constants/query';

export const useWs = () => {
  const queryClient = useQueryClient();

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
      case 'EntriesFetched':
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS_VIEW, notif.feed_uuid] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENTRIES_INDEX, notif.feed_uuid] });
    }
  });
};
