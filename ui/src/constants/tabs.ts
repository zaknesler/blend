export type Tab = (typeof TABS)[number]['value'];
export const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
] as const;
