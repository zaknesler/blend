import wretch from 'wretch';
import type { Entry, FilterEntriesParams } from '~/types/bindings';
import type { ApiPaginatedResponse, ApiResponse, ApiSuccessResponse } from '.';
import { apiUrl } from '../utils/url';

export const getEntries = async (params: FilterEntriesParams) => {
  const filtered = Object.entries(params).filter(([, value]) => Boolean(value));
  const query = new URLSearchParams(filtered);

  return wretch(`${apiUrl('/entries')}?${query}`)
    .get()
    .json<ApiPaginatedResponse<Entry[]>>();
};

export const getEntry = async (entry_uuid: string) =>
  wretch(apiUrl(`/entries/${entry_uuid}`))
    .get()
    .json<ApiResponse<Entry>>()
    .then(res => res.data);

export const updateEntryAsRead = async (entry_uuid: string) =>
  wretch(apiUrl(`/entries/${entry_uuid}/read`))
    .post()
    .json<ApiSuccessResponse>();

export const updateEntryAsUnread = async (entry_uuid: string) =>
  wretch(apiUrl(`/entries/${entry_uuid}/unread`))
    .post()
    .json<ApiSuccessResponse>();
