export const DEV_BASE_URL = 'localhost:4000';

/**
 * Get the full API URL for a given path partial.
 */
export const apiUrl = (path: string) => {
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  const withApiPrefix = path.startsWith('/api') ? withSlash : `/api${path}`;
  return import.meta.env.PROD ? withApiPrefix : `http://${DEV_BASE_URL}${withApiPrefix}`;
};

/**
 * Get the full websocket URL for a given path partial.
 */
export const wsUrl = (path: string) => {
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  const withApiPrefix = path.startsWith('/api/ws') ? withSlash : `/api/ws${path}`;
  const port = location.port === '80' || location.port === '443' ? '' : `:${location.port}`;
  const prefix = location.protocol.startsWith('https') ? 'wss' : 'ws';

  return import.meta.env.PROD
    ? `${prefix}://${location.hostname}${port}${withApiPrefix}`
    : `${prefix}://${DEV_BASE_URL}${withApiPrefix}`;
};
