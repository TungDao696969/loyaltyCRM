'use client';

import { useState } from 'react';
import { useVouchers } from '@/hooks/useVouchers';
import { Voucher } from '@/types/voucher';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit, Ticket } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function VouchersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExchangeDialogOpen, setIsExchangeDialogOpen] = useState(false);
  const [editVoucher, setEditVoucher] = useState<Voucher | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  
  const { vouchers, isLoading, createVoucher, isCreating, updateVoucher, isUpdating, deleteVoucher, isDeleting, exchangeVoucher, isExchanging } = useVouchers();

  const { register, handleSubmit, reset } = useForm();
  const { register: registerExchange, handleSubmit: handleSubmitExchange, reset: resetExchange } = useForm();

  const onSubmit = (data: Record<string, unknown>) => {
    // Formatting before sending to backend
    const formattedData = {
      ...data,
      discount_value: Number(data.discount_value),
      customer_id: data.customer_id ? data.customer_id : null,
      expired_at: data.expired_at ? new Date(data.expired_at as string).toISOString() : null,
    };

    if (editVoucher) {
      updateVoucher({ id: editVoucher.voucher_id, data: formattedData }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        }
      });
    } else {
      createVoucher(formattedData, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        }
      });
    }
  };

  const handleOpenCreate = () => {
    setEditVoucher(null);
    reset({ voucher_code: '', discount_value: '', status: 'active', expired_at: '', customer_id: '' });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (voucher: Voucher) => {
    setEditVoucher(voucher);
    reset({ 
      voucher_code: voucher.voucher_code, 
      discount_value: voucher.discount_value, 
      status: voucher.status,
      customer_id: voucher.customer_id || '',
      expired_at: voucher.expired_at ? new Date(voucher.expired_at).toISOString().split('T')[0] : ''
    });
    setIsDialogOpen(true);
  };

  const onExchangeSubmit = (data: Record<string, unknown>) => {
    exchangeVoucher({ customer_id: data.customer_id as string, reward_id: data.reward_id as string }, {
      onSuccess: () => {
        setIsExchangeDialogOpen(false);
        resetExchange();
      }
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Ticket className="h-8 w-8 text-indigo-500" />
            Vouchers
          </h1>
          <p className="mt-1 text-slate-500">Quản lý mã giảm giá và khuyến mãi.</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isExchangeDialogOpen} onOpenChange={(open) => {
            setIsExchangeDialogOpen(open);
            if (!open) resetExchange();
          }}>
            <DialogTrigger render={<Button className="group relative overflow-hidden bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/30" />}>
                <Ticket className="mr-2 h-4 w-4" /> <span>Đổi Điểm Lấy Voucher</span>
            </DialogTrigger>
            <DialogContent className="border-slate-200 bg-white backdrop-blur-xl text-slate-900 sm:max-w-[425px] rounded-2xl shadow-2xl shadow-slate-200/50">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  Đổi Điểm Lấy Voucher
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmitExchange(onExchangeSubmit)} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">ID Khách hàng *</Label>
                  <Input type="text" placeholder="Nhập ID Khách hàng" className="border-slate-200 bg-white focus-visible:ring-indigo-500" {...registerExchange('customer_id', { required: true })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">ID Ưu đãi (Reward ID) *</Label>
                  <Input type="text" placeholder="Ví dụ: 1" className="border-slate-200 bg-white focus-visible:ring-indigo-500" {...registerExchange('reward_id', { required: true })} />
                  <p className="text-xs text-slate-500">Nhập ID của ưu đãi trong mục Reward Catalog</p>
                </div>
                
                <Button type="submit" className="w-full bg-amber-500 text-white hover:bg-amber-600 mt-4 rounded-xl" disabled={isExchanging}>
                  {isExchanging ? 'Đang đổi...' : 'Xác nhận Đổi'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) { setEditVoucher(null); reset(); }
          }}>
          <DialogTrigger render={<Button onClick={handleOpenCreate} className="group relative overflow-hidden bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/30" />}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
              <Plus className="mr-2 h-4 w-4" /> <span>Tạo Voucher</span>
          </DialogTrigger>
          <DialogContent className="border-slate-200 bg-white backdrop-blur-xl text-slate-900 sm:max-w-[425px] rounded-2xl shadow-2xl shadow-slate-200/50">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900">
                {editVoucher ? 'Cập nhật Voucher' : 'Tạo mới Voucher'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500">Mã Voucher</Label>
                <Input 
                  placeholder="Để trống để tự động sinh mã ngẫu nhiên" 
                  className="border-slate-200 bg-white focus-visible:ring-indigo-500 uppercase" 
                  {...register('voucher_code')} 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500">Giá trị giảm (VNĐ) *</Label>
                <Input type="number" className="border-slate-200 bg-white focus-visible:ring-indigo-500" {...register('discount_value', { required: true })} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">Ngày hết hạn</Label>
                  <Input type="date" className="border-slate-200 bg-white focus-visible:ring-indigo-500" {...register('expired_at')} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">Trạng thái</Label>
                  <select 
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:ring-indigo-500 outline-none" 
                    {...register('status')}
                  >
                    <option value="active" className="bg-white">Active</option>
                    <option value="used" className="bg-white">Used</option>
                    <option value="expired" className="bg-white">Expired</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500">ID Khách hàng (Tùy chọn)</Label>
                <Input type="text" placeholder="Gắn cho khách hàng cụ thể..." className="border-slate-200 bg-white focus-visible:ring-indigo-500" {...register('customer_id')} />
              </div>
              
              <Button type="submit" className="w-full bg-indigo-600 text-white hover:bg-indigo-700 mt-4 rounded-xl" disabled={isCreating || isUpdating}>
                {(isCreating || isUpdating) ? 'Đang lưu...' : 'Lưu Voucher'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white backdrop-blur-xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">Mã Voucher</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">Giảm giá</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">Khách hàng</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">Trạng thái</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">Hết hạn</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500 py-12">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : vouchers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500 py-12">
                  Không tìm thấy mã giảm giá nào.
                </TableCell>
              </TableRow>
            ) : (
              vouchers.map((voucher) => (
                <TableRow key={voucher.voucher_id} className="border-slate-100 transition-colors hover:bg-slate-50/50">
                  <TableCell className="font-bold text-indigo-600 tracking-wider">
                    {voucher.voucher_code}
                  </TableCell>
                  <TableCell className="text-emerald-500 font-semibold text-base">
                    - {Number(voucher.discount_value).toLocaleString()} đ
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {voucher.customer ? voucher.customer.full_name : <span className="text-slate-400 italic">Mọi người</span>}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${
                      voucher.status === 'active' 
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600' 
                        : voucher.status === 'used'
                        ? 'border-slate-500/20 bg-slate-500/10 text-slate-600'
                        : 'border-rose-500/20 bg-rose-500/10 text-rose-600'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        voucher.status === 'active' ? 'bg-emerald-500' : voucher.status === 'used' ? 'bg-slate-500' : 'bg-rose-500'
                      }`} />
                      {voucher.status.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {voucher.expired_at ? new Date(voucher.expired_at).toLocaleDateString('vi-VN') : 'Không giới hạn'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-500/10 transition-colors" onClick={() => handleOpenEdit(voucher)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors" onClick={() => setDeleteTarget(voucher.voucher_id)}>
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
        <DialogContent className="border-slate-200 bg-white backdrop-blur-xl text-slate-900 sm:max-w-[425px] rounded-2xl shadow-2xl shadow-slate-200/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-slate-500 text-sm">
            Bạn có chắc chắn muốn xóa mã giảm giá này vĩnh viễn không? Hành động này không thể hoàn tác.
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl">
              Hủy
            </Button>
            <Button 
              className="bg-rose-500 text-white hover:bg-rose-600 rounded-xl shadow-md shadow-rose-500/20" 
              onClick={() => {
                if (deleteTarget) deleteVoucher(deleteTarget, { onSuccess: () => setDeleteTarget(null) });
              }}
              disabled={isDeleting}
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
