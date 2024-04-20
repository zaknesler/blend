import { createContext, createSignal, useContext } from 'solid-js';
import { Feed } from '~bindings/Feed';

export const useFeedContext = () => {
  const feeds = useContext(FeedContext);
  if (!feeds) {
    throw new Error('useFeedContext was not calld inside its ContextProvider');
  }

  return feeds;
};

export const makeFeedContext = (initialFeeds?: Feed[]) => {
  const [feeds, setFeeds] = createSignal<Feed[]>(initialFeeds || []);
  return { feeds, setFeeds };
};

type FeedContextType = ReturnType<typeof makeFeedContext>;
export const FeedContext = createContext<FeedContextType>();
