import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tierService } from '@/services/tier.service';
import { toast } from 'react-hot-toast';

export function useTiers() {
  const queryClient = useQueryClient();

  const { data: tiers = [], isLoading } = useQuery({
    queryKey: ['tiers'],
    queryFn: () => tierService.getTiers(),
  });

  const { mutate: createTier, isPending: isCreating } = useMutation({
    mutationFn: tierService.createTier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiers'] });
      toast.success('Thêm Hạng thẻ thành công');
    },
    onError: (error: unknown) => {
      toast.error(
        (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
        'Lỗi khi thêm Hạng thẻ'
      );
    }
  });

  const { mutate: updateTier, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => tierService.updateTier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiers'] });
      toast.success('Cập nhật Hạng thẻ thành công');
    },
    onError: (error: unknown) => {
      toast.error(
        (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
        'Lỗi khi cập nhật Hạng thẻ'
      );
    }
  });

  const { mutate: deleteTier, isPending: isDeleting } = useMutation({
    mutationFn: tierService.deleteTier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tiers'] });
      toast.success('Xóa Hạng thẻ thành công');
    },
    onError: (error: unknown) => {
      toast.error(
        (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
        'Lỗi khi xóa Hạng thẻ'
      );
    }
  });

  return {
    tiers,
    isLoading,
    createTier,
    isCreating,
    updateTier,
    isUpdating,
    deleteTier,
    isDeleting,
  };
}
