import { createQuery } from '@tanstack/solid-query';
import { getEntry } from '~/api/entries';
import { QUERY_KEYS } from '~/constants/query';

type UseEntryParams = {
  entry_uuid?: string;
  enabled?: boolean;
};

export const useEntry = (params: () => UseEntryParams) =>
  createQuery(() => ({
    enabled: (params().enabled ?? true) && !!params().entry_uuid,
    queryKey: [QUERY_KEYS.ENTRIES_VIEW, params().entry_uuid],
    queryFn: () => getEntry(params().entry_uuid!),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }));
