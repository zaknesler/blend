import wretch from 'wretch';
import type { CreateFeedData, Feed, FeedStats, UpdateFeedFoldersData } from '~/types/bindings';
import type { ApiResponse, ApiSuccessResponse } from '.';
import { apiUrl } from '../utils/url';

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

export const createFeed = async (params: CreateFeedData) =>
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

export const updateFeedAsRead = async (uuid: string) =>
  wretch(apiUrl(`/feeds/${uuid}/read`))
    .post()
    .json<ApiSuccessResponse>();

export const updateFeedFolders = async (data: { uuid: string } & UpdateFeedFoldersData) => {
  const { uuid, ...rest } = data;

  return wretch(apiUrl(`/feeds/${uuid}/folders`))
    .post(rest)
    .json<ApiSuccessResponse>();
};
