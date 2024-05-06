export type View = (typeof VIEWS)[number]['value'];

export const DEFAULT_VIEW: View = 'unread';

export const VIEWS = [
  { label: 'Unread', value: 'unread' },
  // { label: 'Saved', value: 'saved' },
  { label: 'All', value: 'all' },
] as const;
