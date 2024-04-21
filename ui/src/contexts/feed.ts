import { createContext, createSignal, useContext } from 'solid-js';
import { Feed } from '../types/bindings/feed';

export const useFeedContext = () => {
  const feeds = useContext(FeedContext);
  console.log({ feeds });
  if (!feeds) {
    throw new Error('useFeedContext was not called');
  }

  return feeds;
};

export const makeFeedContext = (initialFeeds?: Feed[]) => {
  const [feeds, setFeeds] = createSignal<Feed[]>(initialFeeds || []);
  return { feeds, setFeeds };
};

type FeedContextType = ReturnType<typeof makeFeedContext>;
export const FeedContext = createContext<FeedContextType>();
