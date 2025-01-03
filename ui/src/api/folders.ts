import wretch from 'wretch';
import type { CreateFolderData, Folder, FolderFeedMap, UpdateFolderUuidsData } from '~/types/bindings';
import type { ApiResponse, ApiSuccessResponse } from '.';
import { apiUrl } from '../utils/url';

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

export const updateFolderUuids = async (data: { uuid: string } & UpdateFolderUuidsData) => {
  const { uuid, ...rest } = data;

  return wretch(apiUrl(`/folders/${uuid}`))
    .post(rest)
    .json<ApiSuccessResponse>();
};
