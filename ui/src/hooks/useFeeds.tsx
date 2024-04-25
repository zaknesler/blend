import { createQuery } from '@tanstack/solid-query';
import { getFeeds } from '../api/feeds';
import { QUERY_KEYS } from '../constants/query';

export const useFeeds = () =>
  createQuery(() => ({
    queryKey: [QUERY_KEYS.FEEDS],
    queryFn: getFeeds,
  }));
