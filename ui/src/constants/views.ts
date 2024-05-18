import { View } from '~/types/bindings';

export const VIEWS = [View.Unread, View.All];
export const VIEW_LABELS: Record<View, string> = {
  [View.All]: 'All',
  [View.Read]: 'Read',
  [View.Unread]: 'Unread',
};
