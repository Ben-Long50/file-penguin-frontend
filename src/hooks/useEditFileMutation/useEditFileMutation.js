import { useMutation, useQueryClient } from '@tanstack/react-query';
import editFile from './editFile';

const useEditFileMutation = (apiUrl, setErrors) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => {
      editFile(data.fileId, data.fileTitle, apiUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
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

export default useEditFileMutation;
