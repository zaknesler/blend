import { createQuery } from '@tanstack/solid-query';
import { getFeeds } from '../api/feeds';

export const useFeeds = () =>
  createQuery(() => ({
    queryKey: ['feeds'],
    queryFn: getFeeds,
  }));
