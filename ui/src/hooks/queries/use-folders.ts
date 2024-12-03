import { createQuery } from '@tanstack/solid-query';
import { getFolders } from '~/api/folders';
import { QUERY_KEYS } from '~/constants/query';

export const useFolders = () => {
  const query = createQuery(() => ({
    queryKey: [QUERY_KEYS.FOLDERS],
    queryFn: getFolders,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  }));

  const findBySlug = (slug?: string) => query.data?.find(folder => folder.slug === slug);
  const findByUuid = (uuid?: string) => query.data?.find(folder => folder.uuid === uuid);

  return {
    query,
    findBySlug,
    findByUuid,
  };
};
