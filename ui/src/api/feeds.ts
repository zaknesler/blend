import { ApiResponse } from '.';
import { Feed } from '../types/bindings/feed';
import { apiUrl } from '../utils/api';
import axios from 'axios';

export const getFeeds = async () => {
  type Response = ApiResponse<Feed[]>;

  const res = await axios.get<Response>(apiUrl('/feeds'));

  return res.data.data;
};

export const addFeed = async (params: { url: string }) => {
  type Response = ApiResponse<{
    title: string;
  }>;

  const res = await axios.post<Response>(apiUrl('/feeds/add'), params);
  return res.data.data;
};
