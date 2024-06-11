export const formatQueryString = (data: Record<string, string | undefined>) => {
  // Since we fallback to default values, remove any empty query params to get the cleanest URL we can
  const filtered = Object.entries(data).filter(([, value]) => Boolean(value)) as [string, string][];
  if (!filtered.length) return '';

  const builder = new URLSearchParams(Object.fromEntries(filtered));
  return `?${builder.toString()}`;
};
