import { useMutation, useQueryClient } from '@tanstack/react-query';
import moveFolder from './moveFolder';

const useMoveFolderMutation = (apiUrl) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (folders) => {
      await moveFolder(folders.folderId, folders.childId, apiUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['folderContents'] });
    },
    onError: (error) => {
      console.log(error);
    },
    throwOnError: false,
  });
};

export default useMoveFolderMutation;
