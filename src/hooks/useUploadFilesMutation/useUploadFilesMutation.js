import { useMutation, useQueryClient } from '@tanstack/react-query';
import uploadFiles from './uploadFiles';

const useUploadFilesMutation = (
  activeId,
  apiUrl,
  setErrors,
  setFilesToUpload,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) =>
      await uploadFiles(activeId, formData, apiUrl),
    onSuccess: () => {
      setFilesToUpload([]);
      return queryClient.invalidateQueries({
        queryKey: ['folderContents'],
        exact: false,
      });
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

export default useUploadFilesMutation;
