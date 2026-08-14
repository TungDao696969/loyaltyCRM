import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { storeService } from '@/services/store.service';
import { toast } from 'react-hot-toast';

export const useStores = (activeTab: "active" | "trash" = "active") => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['stores', activeTab],
    queryFn: () => storeService.getStores(activeTab),
  });

  const createMutation = useMutation({
    mutationFn: storeService.createStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store created successfully');
    },
    onError: (error: unknown) => {
      toast.error((error as {response?: {data?: {message?: string}}}).response?.data?.message || 'Failed to create store');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      storeService.updateStore(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store updated successfully');
    },
    onError: (error: unknown) => {
      toast.error((error as {response?: {data?: {message?: string}}}).response?.data?.message || 'Failed to update store');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: storeService.deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store deleted successfully');
    },
  });

  const restoreMutation = useMutation({
    mutationFn: storeService.restoreStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      toast.success('Store restored successfully');
    },
  });

  return {
    stores: query.data || [],
    isLoading: query.isLoading,
    createStore: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateStore: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteStore: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    restoreStore: restoreMutation.mutate,
    isRestoring: restoreMutation.isPending,
  };
};
