import { Feed } from '../types/bindings/feed';
import { apiUrl } from '../utils/api';

export const getFeeds = async () => {
  const res = await fetch(apiUrl('/feeds'));
  const { data } = await res.json();

  return data as Feed[];
};
