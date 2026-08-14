'use client';

import { useState } from 'react';
import { useTiers } from '@/hooks/useTiers';
import { Tier } from '@/types/tier';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit, Award } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function TiersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTier, setEditTier] = useState<Tier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  
  const { tiers, isLoading, createTier, isCreating, updateTier, isUpdating, deleteTier, isDeleting } = useTiers();

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: Record<string, unknown>) => {
    const formattedData = {
      ...data,
      min_spent_amount: Number(data.min_spent_amount),
      point_multiplier: Number(data.point_multiplier)
    };

    if (editTier) {
      updateTier({ id: editTier.tier_id, data: formattedData }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        }
      });
    } else {
      createTier(formattedData, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        }
      });
    }
  };

  const handleOpenCreate = () => {
    setEditTier(null);
    reset({ tier_code: '', tier_name: '', min_spent_amount: 0, point_multiplier: 1.0, description: '' });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (tier: Tier) => {
    setEditTier(tier);
    reset({ 
      tier_code: tier.tier_code, 
      tier_name: tier.tier_name, 
      min_spent_amount: tier.min_spent_amount, 
      point_multiplier: tier.point_multiplier, 
      description: tier.description 
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Award className="h-8 w-8 text-amber-500" />
            Hạng Thành Viên
          </h1>
          <p className="mt-1 text-slate-500">Quản lý các cấp độ hạng thẻ và điều kiện nâng hạng.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) { setEditTier(null); reset(); }
        }}>
          <DialogTrigger render={<Button onClick={handleOpenCreate} className="group relative overflow-hidden bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/30" />}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
              <Plus className="mr-2 h-4 w-4" /> <span>Tạo Hạng Mới</span>
          </DialogTrigger>
          <DialogContent className="border-slate-200 bg-white backdrop-blur-xl text-slate-900 sm:max-w-[425px] rounded-2xl shadow-2xl shadow-slate-200/50">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900">
                {editTier ? 'Cập nhật Hạng Thẻ' : 'Tạo mới Hạng Thẻ'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">Mã (Code) *</Label>
                  <Input placeholder="BRONZE, SILVER..." className="border-slate-200 uppercase focus-visible:ring-amber-500" {...register('tier_code', { required: true })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">Tên Hạng *</Label>
                  <Input placeholder="Đồng, Bạc, Vàng..." className="border-slate-200 focus-visible:ring-amber-500" {...register('tier_name', { required: true })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500">Mức chi tối thiểu (VNĐ) *</Label>
                <Input type="number" className="border-slate-200 focus-visible:ring-amber-500" {...register('min_spent_amount', { required: true })} />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500">Hệ số nhân điểm *</Label>
                <Input type="number" step="0.1" className="border-slate-200 focus-visible:ring-amber-500" {...register('point_multiplier', { required: true })} />
                <p className="text-[10px] text-slate-400">Ví dụ: 1.5 nghĩa là khách được nhân gấp rưỡi điểm.</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500">Mô tả thêm</Label>
                <Input className="border-slate-200 focus-visible:ring-amber-500" {...register('description')} />
              </div>
              
              <Button type="submit" className="w-full bg-amber-500 text-white hover:bg-amber-600 mt-4 rounded-xl" disabled={isCreating || isUpdating}>
                {(isCreating || isUpdating) ? 'Đang lưu...' : 'Lưu Hạng Thẻ'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 bg-slate-50">
              <TableHead className="text-xs font-semibold uppercase text-slate-700">Mã</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-700">Tên Hạng</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-700">Chi tiêu tối thiểu</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-700 text-center">Hệ số điểm</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-500 py-12">Đang tải...</TableCell>
              </TableRow>
            ) : tiers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-500 py-12">Không có hạng thẻ nào.</TableCell>
              </TableRow>
            ) : (
              tiers.map((tier) => (
                <TableRow key={tier.tier_id} className="border-slate-100 hover:bg-slate-50/50">
                  <TableCell className="font-bold text-slate-900">{tier.tier_code}</TableCell>
                  <TableCell className="font-semibold text-amber-600 flex items-center gap-2">
                    <Award className="h-4 w-4" /> {tier.tier_name}
                  </TableCell>
                  <TableCell className="text-emerald-600 font-medium">
                    {Number(tier.min_spent_amount).toLocaleString()} đ
                  </TableCell>
                  <TableCell className="text-center font-bold text-indigo-600">
                    x{Number(tier.point_multiplier)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600" onClick={() => handleOpenEdit(tier)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-rose-600" onClick={() => setDeleteTarget(tier.tier_id)}>
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
            Bạn có chắc chắn muốn xóa hạng thành viên này không?
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Hủy</Button>
            <Button className="bg-rose-500 text-white hover:bg-rose-600" onClick={() => { if (deleteTarget) deleteTier(deleteTarget, { onSuccess: () => setDeleteTarget(null) }); }} disabled={isDeleting}>
              {isDeleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
