'use client';

import { useState } from 'react';
import { useCRM } from '@/hooks/useCRM';
import { Campaign } from '@/types/crm';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit, Megaphone, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function CampaignsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  
  const { 
    campaigns, isLoadingCampaigns, createCampaign, isCreatingCampaign, updateCampaign, isUpdatingCampaign, deleteCampaign, isDeletingCampaign, sendCampaign, isSendingCampaign,
    segments
  } = useCRM();

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: Record<string, unknown>) => {
    const formattedData = {
      campaign_name: data.campaign_name,
      segment_id: data.segment_id ? Number(data.segment_id) : null,
      channel: data.channel,
      message_template: data.message_template,
      status: data.status,
      scheduled_at: data.scheduled_at ? new Date(data.scheduled_at as string).toISOString() : null,
    };

    if (editCampaign) {
      updateCampaign({ id: String(editCampaign.campaign_id), data: formattedData }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        }
      });
    } else {
      createCampaign(formattedData, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        }
      });
    }
  };

  const handleOpenCreate = () => {
    setEditCampaign(null);
    reset({ 
      campaign_name: '', segment_id: '', channel: 'SMS', message_template: 'Chào {{name}}, ', status: 'draft', scheduled_at: '' 
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (campaign: Campaign) => {
    setEditCampaign(campaign);
    reset({ 
      campaign_name: campaign.campaign_name, 
      segment_id: campaign.segment_id || '', 
      channel: campaign.channel, 
      message_template: campaign.message_template, 
      status: campaign.status,
      scheduled_at: campaign.scheduled_at ? new Date(campaign.scheduled_at).toISOString().slice(0, 16) : ''
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Megaphone className="h-8 w-8 text-orange-500" />
            Chiến Dịch (Campaigns)
          </h1>
          <p className="mt-1 text-slate-500">Gửi SMS/Zalo tự động tới các Nhóm Khách Hàng (Segments).</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) { setEditCampaign(null); reset(); }
        }}>
          <DialogTrigger render={<Button onClick={handleOpenCreate} className="group relative overflow-hidden bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/30" />}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
              <Plus className="mr-2 h-4 w-4" /> <span>Tạo Chiến Dịch</span>
          </DialogTrigger>
          <DialogContent className="border-slate-200 bg-white backdrop-blur-xl text-slate-900 sm:max-w-[500px] rounded-2xl shadow-2xl shadow-slate-200/50">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-orange-500" />
                {editCampaign ? 'Cập nhật Chiến dịch' : 'Tạo mới Chiến dịch'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500">Tên Chiến Dịch *</Label>
                <Input placeholder="Ví dụ: Tri ân khách hàng tháng 10" className="border-slate-200 focus-visible:ring-orange-500" {...register('campaign_name', { required: true })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">Phân nhóm (Segment) *</Label>
                  <select 
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:ring-orange-500 outline-none" 
                    {...register('segment_id', { required: true })}
                  >
                    <option value="" disabled>-- Chọn Nhóm --</option>
                    {segments.map(seg => (
                      <option key={seg.segment_id} value={seg.segment_id}>{seg.segment_name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">Kênh Gửi (Channel)</Label>
                  <select 
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:ring-orange-500 outline-none" 
                    {...register('channel')}
                  >
                    <option value="SMS">Tin nhắn SMS</option>
                    <option value="ZALO">Zalo ZNS</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500 flex justify-between">
                  <span>Nội dung tin nhắn (Template) *</span>
                  <span className="text-orange-500 lowercase">Biến: {"{{name}}"}, {"{{points}}"}</span>
                </Label>
                <textarea 
                  rows={4}
                  className="w-full rounded-md border border-slate-200 p-3 text-sm focus-visible:ring-orange-500 focus:outline-none"
                  placeholder="Chào {{name}}, bạn đang có {{points}} điểm trong ví..."
                  {...register('message_template', { required: true })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">Thời gian hẹn giờ (Tùy chọn)</Label>
                  <Input type="datetime-local" className="border-slate-200 focus-visible:ring-orange-500" {...register('scheduled_at')} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">Trạng thái</Label>
                  <select 
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:ring-orange-500 outline-none" 
                    {...register('status')}
                  >
                    <option value="draft">Bản nháp (Draft)</option>
                    <option value="scheduled">Đã lên lịch (Scheduled)</option>
                    <option value="sent">Đã gửi (Sent)</option>
                  </select>
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-orange-600 text-white hover:bg-orange-700 mt-4 rounded-xl" disabled={isCreatingCampaign || isUpdatingCampaign}>
                {(isCreatingCampaign || isUpdatingCampaign) ? 'Đang lưu...' : 'Lưu Chiến Dịch'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 bg-slate-50">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700 w-16">ID</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700 w-[200px]">Tên Chiến Dịch</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">Kênh</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">Đối tượng (Segment)</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">Trạng thái</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingCampaigns ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500 py-12">Đang tải...</TableCell>
              </TableRow>
            ) : campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500 py-12">Chưa có chiến dịch nào.</TableCell>
              </TableRow>
            ) : (
              campaigns.map((campaign) => (
                <TableRow key={campaign.campaign_id} className="border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-medium text-slate-500">#{campaign.campaign_id}</TableCell>
                  <TableCell className="font-bold text-orange-600 line-clamp-1">{campaign.campaign_name}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800`}>
                      {campaign.channel}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    {campaign.segment?.segment_name || <span className="text-rose-500 text-xs italic">Missing Segment</span>}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold border ${
                      campaign.status === 'sent' 
                        ? 'border-emerald-500/20 bg-emerald-50 text-emerald-600'
                        : campaign.status === 'scheduled'
                        ? 'border-blue-500/20 bg-blue-50 text-blue-600'
                        : 'border-slate-300 bg-slate-50 text-slate-600'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        campaign.status === 'sent' ? 'bg-emerald-500' : campaign.status === 'scheduled' ? 'bg-blue-500' : 'bg-slate-400'
                      }`} />
                      {campaign.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      {campaign.status !== 'sent' && (
                        <Button variant="ghost" size="sm" className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => sendCampaign(String(campaign.campaign_id))} disabled={isSendingCampaign}>
                          <Send className="h-3 w-3 mr-1" /> {isSendingCampaign ? 'Đang gửi...' : 'Gửi Ngay'}
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-orange-600 hover:bg-orange-50" onClick={() => handleOpenEdit(campaign)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => setDeleteTarget(campaign.campaign_id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="border-slate-200 bg-white text-slate-900 sm:max-w-[425px] rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-slate-500 text-sm">
            Bạn có chắc chắn muốn xóa chiến dịch này không?
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Hủy</Button>
            <Button className="bg-rose-500 text-white hover:bg-rose-600" onClick={() => { if (deleteTarget) deleteCampaign(String(deleteTarget), { onSuccess: () => setDeleteTarget(null) }); }} disabled={isDeletingCampaign}>
              {isDeletingCampaign ? 'Đang xóa...' : 'Xóa Chiến Dịch'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
