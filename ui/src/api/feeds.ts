import { FeedStats } from '~/types/bindings/stats';
import { ApiResponse, ApiSuccessResponse } from '.';
import { Feed } from '../types/bindings/feed';
import { apiUrl } from '../utils/url';
import axios from 'axios';

export const getFeeds = async () => {
  type Response = ApiResponse<Feed[]>;

  const res = await axios.get<Response>(apiUrl('/feeds'));
  return res.data.data;
};

export const getFeedStats = async () => {
  type Response = ApiResponse<FeedStats[]>;

  const res = await axios.get<Response>(apiUrl('/feeds/stats'));
  return res.data.data;
};

export const refreshFeeds = async () => {
  type Response = ApiSuccessResponse;

  const res = await axios.post<Response>(apiUrl('/feeds/refresh'));
  return res.data;
};

export const addFeed = async (params: { url: string }) => {
  type Response = ApiResponse<Feed>;

  const res = await axios.post<Response>(apiUrl('/feeds'), params);
  return res.data.data;
};

export const getFeed = async (uuid: string) => {
  type Response = ApiResponse<Feed>;

  const res = await axios.get<Response>(apiUrl(`/feeds/${uuid}`));
  return res.data.data;
};

export const refreshFeed = async (uuid: string) => {
  type Response = ApiSuccessResponse;

  const res = await axios.post<Response>(apiUrl(`/feeds/${uuid}/refresh`));
  return res.data;
};
