import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { voucherService } from '@/services/voucher.service';
import { toast } from 'react-hot-toast';

export function useVouchers() {
  const queryClient = useQueryClient();

  const { data: vouchers = [], isLoading } = useQuery({
    queryKey: ['vouchers'],
    queryFn: () => voucherService.getVouchers(),
  });

  const { mutate: createVoucher, isPending: isCreating } = useMutation({
    mutationFn: voucherService.createVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      toast.success('Thêm Voucher thành công');
    },
    onError: (error: unknown) => {
      toast.error(
        (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
        'Lỗi khi thêm Voucher'
      );
    }
  });

  const { mutate: updateVoucher, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => voucherService.updateVoucher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      toast.success('Cập nhật Voucher thành công');
    },
    onError: (error: unknown) => {
      toast.error(
        (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
        'Lỗi khi cập nhật Voucher'
      );
    }
  });

  const { mutate: deleteVoucher, isPending: isDeleting } = useMutation({
    mutationFn: voucherService.deleteVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      toast.success('Xóa Voucher thành công');
    },
    onError: (error: unknown) => {
      toast.error(
        (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
        'Lỗi khi xóa Voucher'
      );
    }
  });

  const { mutate: exchangeVoucher, isPending: isExchanging } = useMutation({
    mutationFn: voucherService.exchangeVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] }); // since it creates a transaction
      queryClient.invalidateQueries({ queryKey: ['customers'] }); // since it deducts points
      toast.success('Đổi điểm lấy Voucher thành công');
    },
    onError: (error: unknown) => {
      toast.error(
        (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
        'Lỗi khi đổi Voucher'
      );
    }
  });

  return {
    vouchers,
    isLoading,
    createVoucher,
    isCreating,
    updateVoucher,
    isUpdating,
    deleteVoucher,
    isDeleting,
    exchangeVoucher,
    isExchanging,
  };
}

export function useRewards() {
  const { data: rewards = [], isLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: () => voucherService.getRewards(),
  });

  return {
    rewards,
    isLoading,
  };
}
