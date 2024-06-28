import { View } from '~/types/bindings';

export const VIEWS = [View.Unread, View.Saved, View.All];
export const VIEW_LABELS: Record<View, string> = {
  [View.All]: 'All',
  [View.Read]: 'Read',
  [View.Unread]: 'Unread',
  [View.Saved]: 'Saved',
};
