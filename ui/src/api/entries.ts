import type { Entry, FilterEntriesParams } from '~/types/bindings';
import { ApiPaginatedResponse, ApiResponse, ApiSuccessResponse } from '.';
import { apiUrl } from '../utils/url';
import axios from 'axios';

export const getEntries = async (params: FilterEntriesParams) => {
  type Response = ApiPaginatedResponse<Entry[]>;

  const res = await axios.get<Response>(apiUrl(`/entries`), { params });
  return res.data;
};

export const getEntry = async (entry_uuid: string) => {
  type Response = ApiResponse<Entry>;

  const res = await axios.get<Response>(apiUrl(`/entries/${entry_uuid}`));
  return res.data.data;
};

export const updateEntryAsRead = async (entry_uuid: string) => {
  const res = await axios.post<ApiSuccessResponse>(apiUrl(`/entries/${entry_uuid}/read`));
  return res.data;
};

export const updateEntryAsUnread = async (entry_uuid: string) => {
  const res = await axios.post<ApiSuccessResponse>(apiUrl(`/entries/${entry_uuid}/unread`));
  return res.data;
};
