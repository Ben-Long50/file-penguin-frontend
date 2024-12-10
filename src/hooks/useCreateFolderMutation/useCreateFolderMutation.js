import { useMutation, useQueryClient } from '@tanstack/react-query';
import createFolder from './createFolder';

const useCreateFolderMutation = (
  apiUrl,
  setErrors,
  setInput,
  toggleCreateMode,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input, parentFolderId) =>
      createFolder(input, parentFolderId, apiUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'], exact: false });
      setInput('');
      toggleCreateMode();
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

export default useCreateFolderMutation;
