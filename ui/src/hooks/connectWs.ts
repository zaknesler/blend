import { wsUrl } from '~/utils/url';
import { WebSocket } from 'partysocket';
import { Notification } from '~/types/bindings/notification';
import { useQueryClient } from '@tanstack/solid-query';
import { QUERY_KEYS } from '~/constants/query';

export const connectWs = () => {
  const queryClient = useQueryClient();

  const socket = new WebSocket(wsUrl('/notifs'), undefined, {
    connectionTimeout: 1000,
    maxRetries: 10,
  });

  socket.addEventListener('open', () => console.log('[ws] connection established'));
  socket.addEventListener('close', () => console.log('[ws] connection terminated'));
  socket.addEventListener('error', event => console.log('[ws] error:', event.error));

  socket.addEventListener('message', event => {
    const notif = JSON.parse(event.data) as Notification;
    console.log('[ws] received message:', notif);

    switch (notif.type) {
      case 'EntriesFetched':
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDS_VIEW, notif.feed_uuid] });
    }
  });
};
