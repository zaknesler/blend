import wretch from 'wretch';
import type { CreateFolderParams, Folder, FolderFeedMap, UpdateFolderParams } from '~/types/bindings';
import type { ApiResponse } from '.';
import { apiUrl } from '../utils/url';

export const getFolders = async () =>
  wretch(apiUrl('/folders'))
    .get()
    .json<ApiResponse<FolderFeedMap[]>>()
    .then(res => res.data);

export const createFolder = async (params: CreateFolderParams) =>
  wretch(apiUrl('/folders'))
    .post(params)
    .json<ApiResponse<Folder>>()
    .then(res => res.data);

export const updateFolderUuids = async (slug: string, params: UpdateFolderParams) =>
  wretch(apiUrl(`/folders/${slug}`))
    .patch(params)
    .json<ApiResponse<FolderFeedMap>>()
    .then(res => res.data);
