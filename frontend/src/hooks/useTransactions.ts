import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '@/services/transaction.service';
import { toast } from 'react-hot-toast';

export function useTransactions() {
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionService.getTransactions(),
  });

  const { mutate: createTransaction, isPending: isCreating } = useMutation({
    mutationFn: transactionService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Thêm Giao dịch thành công');
    },
    onError: (error: unknown) => {
      toast.error(
        (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
        'Lỗi khi thêm Giao dịch'
      );
    }
  });

  const { mutate: updateTransaction, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => transactionService.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Cập nhật Giao dịch thành công');
    },
    onError: (error: unknown) => {
      toast.error(
        (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
        'Lỗi khi cập nhật Giao dịch'
      );
    }
  });

  const { mutate: deleteTransaction, isPending: isDeleting } = useMutation({
    mutationFn: transactionService.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Xóa Giao dịch thành công');
    },
    onError: (error: unknown) => {
      toast.error(
        (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
        'Lỗi khi xóa Giao dịch'
      );
    }
  });

  return {
    transactions,
    isLoading,
    createTransaction,
    isCreating,
    updateTransaction,
    isUpdating,
    deleteTransaction,
    isDeleting,
  };
}

export function useCustomerTransactions(customerId?: string) {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', customerId],
    queryFn: () => transactionService.getCustomerTransactions(customerId!),
    enabled: !!customerId,
  });

  return {
    transactions,
    isLoading,
  };
}
