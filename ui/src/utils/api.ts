export const apiUrl = (uri: string) => {
  const withSlash = uri.startsWith('/') ? uri : `/${uri}`;
  const withApiPrefix = uri.startsWith('/api') ? withSlash : `/api${uri}`;
  return import.meta.env.PROD ? withApiPrefix : `http://localhost:4000${withApiPrefix}`;
};
