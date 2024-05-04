import { Entry } from '~/types/bindings/entry';
import { ApiResponse } from '.';
import { apiUrl } from '../utils/url';
import axios from 'axios';

type IndexEntriesParams = {
  feed?: string;
};

export const getEntries = async (params: IndexEntriesParams) => {
  type Response = ApiResponse<Entry[]>;

  const res = await axios.get<Response>(apiUrl(`/entries`), { params });
  return res.data.data;
};

export const getEntry = async (entry_uuid: string) => {
  type Response = ApiResponse<Entry>;

  const res = await axios.get<Response>(apiUrl(`/entries/${entry_uuid}`));
  return res.data.data;
};
