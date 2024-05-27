/**
 * Format date as ISO 8601.
 *
 * e.g. "2024-05-27"
 */
export const formatDateIso = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().split('T')[0];
};

export const dateWithinWeek = (value: string | Date) => {
  const today = new Date();
  const date = value instanceof Date ? value : new Date(value);

  const startOfWeek = new Date();
  startOfWeek.setDate(today.getDate() - today.getDay());

  return date.getTime() >= startOfWeek.getTime();
};

/**
 * Format human-readable relative date up to the start of the week.
 *
 * e.g. "Today", "Yesterday", "Sunday", null...
 */
export const formatRelativeDate = (value: string) => {
  const today = new Date(formatDateIso(new Date()));
  const date = new Date(formatDateIso(value));

  // If the date is today, return "Today"
  if (today.getTime() === date.getTime()) return 'Today';

  // If the date is yesterday, return "Yesterday"
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (yesterday.getTime() === date.getTime()) return 'Yesterday';

  // If the date is within the current week, return the weekday
  if (dateWithinWeek(date)) return date.toLocaleString('en-us', { weekday: 'long' });

  return formatDate(value);
};

/**
 * Format date as locale string.
 *
 * e.g. "May 27, 2024"
 */
export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));

/**
 * Format date and time as locale string.
 *
 * e.g. "May 27, 2024 at 8:25 AM"
 */
export const formatDateTime = (value: string) => {
  const date = new Date(value);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);

  return `${formattedDate} at ${formattedTime}`;
};
