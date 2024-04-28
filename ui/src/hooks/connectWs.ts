import { wsUrl } from '~/utils/url';

export const connectWs = () => {
  const socket = new WebSocket(wsUrl('/jobs'));

  socket.addEventListener('open', () => console.log('ws connection established'));
  socket.addEventListener('message', event => console.log('received:', JSON.parse(event.data)));
};
