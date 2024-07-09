import wretch from 'wretch';
import type { CreateFolderParams } from '~/types/bindings';
import type { ApiResponse } from '.';
import { apiUrl } from '../utils/url';

export const createFolder = async (params: CreateFolderParams) =>
  wretch(apiUrl('/folders'))
    .post(params)
    .json<ApiResponse<CreateFolderParams>>()
    .then(res => res.data);
