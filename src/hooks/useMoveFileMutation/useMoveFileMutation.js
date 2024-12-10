import { useMutation, useQueryClient } from '@tanstack/react-query';
import moveFile from './moveFile';

const useMoveFileMutation = (apiUrl) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      await moveFile(data.folderId, data.fileId, apiUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folderContents'] });
    },
    throwOnError: false,
  });
};

export default useMoveFileMutation;
