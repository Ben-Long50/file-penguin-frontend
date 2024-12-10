import { useMutation, useQueryClient } from '@tanstack/react-query';
import editFolder from './editFolder';

const useEditFolderMutation = (apiUrl, setErrors) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (folderInfo) => {
      editFolder(folderInfo.folderId, folderInfo.folderTitle, apiUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'], exact: false });
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

export default useEditFolderMutation;
