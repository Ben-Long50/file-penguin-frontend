import { useMutation, useQueryClient } from '@tanstack/react-query';
import moveFile from './moveFile';

const useMoveFileMutation = (apiUrl, setErrors) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) =>
      await moveFile(data.folderId, data.fileId, apiUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folderContents'] });
    },
    onError: (error) => {
      setErrors([error]);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    },
    throwOnError: false,
  });
};

export default useMoveFileMutation;
