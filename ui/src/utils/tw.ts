import { screens } from '~/constants/screens';

export type ScreenSize = keyof typeof screens;
export const getBreakpoint = (screen: ScreenSize) => +screens[screen].replace('px', '');
