import { useQuery } from '@tanstack/react-query';
import getFolders from './getFolders';

const useFolderQuery = (apiUrl) => {
  return useQuery({
    queryKey: ['folders'],
    queryFn: () => getFolders(apiUrl),
  });
};

export default useFolderQuery;
