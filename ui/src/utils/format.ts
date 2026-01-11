const LOCALE = 'en-US';

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat(LOCALE, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));

export const formatDateTime = (value: string) => {
  const date = new Date(value);

  const formattedDate = new Intl.DateTimeFormat(LOCALE, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat(LOCALE, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);

  return `${formattedDate} at ${formattedTime}`;
};

export const formatNumber = (value: number | string) => Number(value).toLocaleString(LOCALE);
