import { View } from '~/types/bindings';

export const DEFAULT_VIEW = View.Unread;

export const VIEWS = [View.Unread, View.All];

export const VIEW_LABELS: Record<View, string> = {
  [View.All]: 'All',
  [View.Read]: 'Read',
  [View.Unread]: 'Unread',
};
