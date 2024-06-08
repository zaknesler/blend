import { useWindowSize } from '@solid-primitives/resize-observer';
import { createContext, useContext } from 'solid-js';
import { screens } from '~/constants/screens';

export type ScreenSize = keyof typeof screens;
export const getBreakpoint = (screen: ScreenSize) => +screens[screen].replace('px', '');

type ViewportContext = ReturnType<typeof makeViewportContext>;
export const ViewportContext = createContext<ViewportContext>();

export const useViewport = () => {
  const state = useContext(ViewportContext);
  if (!state) throw new Error('ViewportContext has not been initialized.');
  return state;
};

export const makeViewportContext = () => {
  const size = useWindowSize();

  const lteBreakpoint = (screen: ScreenSize) => size.width <= getBreakpoint(screen);
  const gtBreakpoint = (screen: ScreenSize) => size.width > getBreakpoint(screen);

  return {
    size,
    lteBreakpoint,
    gtBreakpoint,
  };
};
