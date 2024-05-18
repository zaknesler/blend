import { screens } from '~/constants/screens';
import { createWindowSize } from '@solid-primitives/resize-observer';

export type ScreenSize = keyof typeof screens;
export const getBreakpoint = (screen: ScreenSize) => +screens[screen].replace('px', '');

export const useViewport = () => {
  const size = createWindowSize();

  const belowBreakpoint = (screen: ScreenSize) => size.width <= getBreakpoint(screen);
  const aboveBreakpoint = (screen: ScreenSize) => size.width > getBreakpoint(screen);

  return {
    size,
    belowBreakpoint,
    aboveBreakpoint,
  };
};
