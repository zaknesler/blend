import { createWindowSize } from '@solid-primitives/resize-observer';
import { ScreenSize, getBreakpoint } from '~/utils/tw';

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
