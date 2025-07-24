import wretch from 'wretch';
import type { CreateFolderData, Folder, FolderFeedMap, UpdateFolderFeedsData } from '~/types/bindings';
import { apiUrl } from '../utils/url';
import type { ApiResponse, ApiSuccessResponse } from '.';

export const getFolders = async () =>
  wretch(apiUrl('/folders'))
    .get()
    .json<ApiResponse<FolderFeedMap[]>>()
    .then(res => res.data);

export const createFolder = async (data: CreateFolderData) =>
  wretch(apiUrl('/folders'))
    .post(data)
    .json<ApiResponse<Folder>>()
    .then(res => res.data);

export const updateFolderFeeds = async (data: { uuid: string } & UpdateFolderFeedsData) => {
  const { uuid, ...rest } = data;

  return wretch(apiUrl(`/folders/${uuid}`))
    .post(rest)
    .json<ApiSuccessResponse>();
};
