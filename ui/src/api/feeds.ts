import type { FeedStats, Feed } from '~/types/bindings';
import { ApiResponse, ApiSuccessResponse } from '.';
import { apiUrl } from '../utils/url';
import wretch from 'wretch';

export const getFeeds = async () =>
  wretch(apiUrl('/feeds'))
    .get()
    .json<ApiResponse<Feed[]>>()
    .then(res => res.data);

export const getFeedStats = async () =>
  wretch(apiUrl('/feeds/stats'))
    .get()
    .json<ApiResponse<FeedStats[]>>()
    .then(res => res.data);

export const refreshFeeds = async () => wretch(apiUrl('/feeds/refresh')).post({}).json<ApiSuccessResponse>();

export const addFeed = async (params: { url: string }) =>
  wretch(apiUrl('/feeds'))
    .post(params)
    .json<ApiResponse<Feed>>()
    .then(res => res.data);

export const getFeed = async (uuid: string) =>
  wretch(apiUrl(`/feeds/${uuid}`))
    .get()
    .json<ApiResponse<Feed>>()
    .then(res => res.data);

export const refreshFeed = async (uuid: string) =>
  wretch(apiUrl(`/feeds/${uuid}/refresh`))
    .post()
    .json<ApiSuccessResponse>();
