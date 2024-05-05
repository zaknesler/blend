import { Entry } from '~/types/bindings/entry';
import { ApiPaginatedResponse, ApiResponse, ApiSuccessResponse } from '.';
import { apiUrl } from '../utils/url';
import axios from 'axios';

type IndexEntriesParams = {
  feed?: string;
  unread?: boolean;
  cursor?: string;
};

export const getEntries = async (params: IndexEntriesParams) => {
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
