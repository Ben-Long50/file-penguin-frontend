import { useQuery } from '@tanstack/react-query';
import getAllFiles from './getAllFiles';
import getFolderContents from './getFolderContents';

const useFolderContentQuery = (allId, activeId, apiUrl) => {
  return useQuery({
    queryKey: ['folderContents', activeId],
    queryFn: () => {
      if (allId === activeId) {
        return getAllFiles(apiUrl);
      } else {
        return getFolderContents(activeId, apiUrl);
      }
    },
  });
};

export default useFolderContentQuery;
