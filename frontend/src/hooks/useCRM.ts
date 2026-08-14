import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmService } from '@/services/crm.service';
import { toast } from 'react-hot-toast';

export function useCRM() {
  const queryClient = useQueryClient();

  // --- Segments ---
  const { data: segments = [], isLoading: isLoadingSegments } = useQuery({
    queryKey: ['segments'],
    queryFn: () => crmService.getSegments(),
  });

  const { mutate: createSegment, isPending: isCreatingSegment } = useMutation({
    mutationFn: crmService.createSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
      toast.success('Tạo phân nhóm thành công');
    },
    onError: (error: unknown) => {
      toast.error(
        (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
        'Lỗi khi tạo phân nhóm'
      );
    }
  });

  const { mutate: updateSegment, isPending: isUpdatingSegment } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => crmService.updateSegment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
      toast.success('Cập nhật phân nhóm thành công');
    },
    onError: (error: unknown) => {
      toast.error(
        (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
        'Lỗi khi cập nhật phân nhóm'
      );
    }
  });

  const { mutate: deleteSegment, isPending: isDeletingSegment } = useMutation({
    mutationFn: crmService.deleteSegment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['segments'] });
      toast.success('Xóa phân nhóm thành công');
    },
    onError: (error: unknown) => {
      toast.error(
        (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
        'Lỗi khi xóa phân nhóm'
      );
    }
  });

  // --- Campaigns ---
  const { data: campaigns = [], isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => crmService.getCampaigns(),
  });

  const { mutate: createCampaign, isPending: isCreatingCampaign } = useMutation({
    mutationFn: crmService.createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Tạo chiến dịch thành công');
    },
    onError: (error: unknown) => {
      toast.error(
        (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
        'Lỗi khi tạo chiến dịch'
      );
    }
  });

  const { mutate: updateCampaign, isPending: isUpdatingCampaign } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => crmService.updateCampaign(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Cập nhật chiến dịch thành công');
    },
    onError: (error: unknown) => {
      toast.error(
        (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
        'Lỗi khi cập nhật chiến dịch'
      );
    }
  });

  const { mutate: deleteCampaign, isPending: isDeletingCampaign } = useMutation({
    mutationFn: crmService.deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Xóa chiến dịch thành công');
    },
    onError: (error: unknown) => {
      toast.error(
        (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
        'Lỗi khi xóa chiến dịch'
      );
    }
  });

  const { mutate: sendCampaign, isPending: isSendingCampaign } = useMutation({
    mutationFn: crmService.sendCampaign,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Gửi chiến dịch thành công! Đã ghi log hệ thống.');
    },
    onError: (error: unknown) => {
      toast.error(
        (error as {response?: {data?: {message?: string}}}).response?.data?.message || 
        'Lỗi khi gửi chiến dịch'
      );
    }
  });

  return {
    segments, isLoadingSegments, createSegment, isCreatingSegment, updateSegment, isUpdatingSegment, deleteSegment, isDeletingSegment,
    campaigns, isLoadingCampaigns, createCampaign, isCreatingCampaign, updateCampaign, isUpdatingCampaign, deleteCampaign, isDeletingCampaign, sendCampaign, isSendingCampaign
  };
}
