import { useMutation, useQueryClient } from '@tanstack/react-query';
import deleteItem from './deleteItem';

const useDeleteItemMutation = (apiUrl) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemInfo) => {
      await deleteItem(itemInfo.itemId, itemInfo.type, apiUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folderContents'] });
    },
  });
};

export default useDeleteItemMutation;
