import { useWindowSize } from '@solid-primitives/resize-observer';
import { screens } from '~/constants/screens';

export type ScreenSize = keyof typeof screens;
export const getBreakpoint = (screen: ScreenSize) => +screens[screen].replace('px', '');

export const useViewport = () => {
  const size = useWindowSize();

  const lteBreakpoint = (screen: ScreenSize) => size.width <= getBreakpoint(screen);
  const gtBreakpoint = (screen: ScreenSize) => size.width > getBreakpoint(screen);

  return {
    size,
    lteBreakpoint,
    gtBreakpoint,
  };
};
