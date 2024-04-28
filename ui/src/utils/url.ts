import { DEV_HOSTNAME } from '../api';

export const apiUrl = (uri: string) => {
  const withSlash = uri.startsWith('/') ? uri : `/${uri}`;
  const withApiPrefix = uri.startsWith('/api') ? withSlash : `/api${uri}`;
  return import.meta.env.PROD ? withApiPrefix : `http://${DEV_HOSTNAME}${withApiPrefix}`;
};

export const wsUrl = (uri: string) => {
  const withSlash = uri.startsWith('/') ? uri : `/${uri}`;
  const withApiPrefix = uri.startsWith('/api/ws') ? withSlash : `/api/ws${uri}`;
  const port = location.port === '80' || location.port === '443' ? '' : `:${location.port}`;

  return import.meta.env.PROD
    ? `ws://${location.hostname}${port}${withApiPrefix}`
    : `ws://${DEV_HOSTNAME}${withApiPrefix}`;
};
