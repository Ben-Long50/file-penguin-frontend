import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteTrash from './deleteTrash';

const useDeleteTrashMutation = (trashId, apiUrl, closeModal) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteTrash(trashId, apiUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['folderContents'],
        exact: false,
      });
      closeModal();
    },
  });
};

export default useDeleteTrashMutation;
