import { Entry } from '~/types/bindings/entry';
import { ApiResponse } from '.';
import { apiUrl } from '../utils/url';
import axios from 'axios';

export const getEntries = async (feed_uuid: string) => {
  type Response = ApiResponse<Entry[]>;

  const res = await axios.get<Response>(apiUrl(`/feeds/${feed_uuid}/entries`));
  return res.data.data;
};
export const getEntry = async (feed_uuid: string, entry_uuid: string) => {
  type Response = ApiResponse<Entry>;

  const res = await axios.get<Response>(apiUrl(`/feeds/${feed_uuid}/entries/${entry_uuid}`));
  return res.data.data;
};
