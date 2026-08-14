'use client';

import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { Transaction } from '@/types/transaction';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit, Receipt, Eye, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function TransactionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [viewTransaction, setViewTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { transactions, isLoading, createTransaction, isCreating, updateTransaction, isUpdating, deleteTransaction, isDeleting } = useTransactions();

  const filteredTransactions = transactions.filter(tx => 
    tx.pos_invoice_code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (tx.customer?.full_name || 'Khách vãng lai').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { register, handleSubmit, reset, watch } = useForm();
  const transactionType = watch('transaction_type');

  const onSubmit = (data: Record<string, unknown>) => {
    const formattedData = {
      ...data,
      order_amount: Number(data.order_amount),
      points: Number(data.points),
      store_id: data.store_id ? Number(data.store_id) : null,
      customer_id: data.customer_id ? data.customer_id : null,
      is_offline_sync: data.is_offline_sync === 'true'
    };

    if (editTransaction) {
      updateTransaction({ id: editTransaction.transaction_id, data: formattedData }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        }
      });
    } else {
      createTransaction(formattedData, {
        onSuccess: () => {
          setIsDialogOpen(false);
          reset();
        }
      });
    }
  };

  const handleOpenCreate = () => {
    setEditTransaction(null);
    reset({ 
      pos_invoice_code: '', 
      transaction_type: 'EARN', 
      order_amount: 0, 
      points: 0, 
      customer_id: '',
      store_id: '',
      is_offline_sync: 'false'
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (transaction: Transaction) => {
    setEditTransaction(transaction);
    reset({ 
      pos_invoice_code: transaction.pos_invoice_code, 
      transaction_type: transaction.transaction_type, 
      order_amount: transaction.order_amount, 
      points: transaction.points, 
      customer_id: transaction.customer_id || '',
      store_id: transaction.store_id || '',
      is_offline_sync: transaction.is_offline_sync ? 'true' : 'false'
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Receipt className="h-8 w-8 text-blue-500" />
            Lịch sử Giao dịch
          </h1>
          <p className="mt-1 text-slate-500">Quản lý hóa đơn mua hàng và biến động điểm số của khách.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Tìm theo Mã HĐ, tên khách..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-slate-200 focus-visible:ring-blue-500 rounded-xl"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) { setEditTransaction(null); reset(); }
          }}>
          <DialogTrigger render={<Button onClick={handleOpenCreate} className="group relative overflow-hidden bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30" />}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
              <Plus className="mr-2 h-4 w-4" /> <span>Tạo Giao Dịch Mới</span>
          </DialogTrigger>
          <DialogContent className="border-slate-200 bg-white backdrop-blur-xl text-slate-900 sm:max-w-[425px] rounded-2xl shadow-2xl shadow-slate-200/50">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900">
                {editTransaction ? 'Sửa Giao Dịch' : 'Tạo mới Giao Dịch'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">Mã Hóa Đơn POS *</Label>
                  <Input placeholder="INV-123456" className="border-slate-200 uppercase focus-visible:ring-blue-500" {...register('pos_invoice_code', { required: true })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">Loại Giao Dịch</Label>
                  <select 
                    className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus-visible:ring-blue-500 outline-none" 
                    {...register('transaction_type')}
                  >
                    <option value="EARN" className="bg-white">EARN (Tích điểm)</option>
                    <option value="REDEEM" className="bg-white">REDEEM (Tiêu điểm)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">Tổng tiền Hóa đơn *</Label>
                  <Input type="number" className="border-slate-200 focus-visible:ring-blue-500" {...register('order_amount', { required: true })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-slate-500">
                    {transactionType === 'EARN' ? 'Điểm (Tự động tính)' : 'Điểm cần tiêu *'}
                  </Label>
                  <Input 
                    type="number" 
                    className="border-slate-200 focus-visible:ring-blue-500" 
                    placeholder={transactionType === 'EARN' ? 'Để trống để tự động tính' : ''}
                    disabled={transactionType === 'EARN'}
                    {...register('points', { required: transactionType !== 'EARN' })} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500">ID Khách hàng (Bắt buộc để cộng điểm) *</Label>
                <Input type="text" placeholder="Nhập ID khách hàng" className="border-slate-200 focus-visible:ring-blue-500" {...register('customer_id', { required: true })} />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-slate-500">ID Cửa hàng (Tùy chọn)</Label>
                <Input type="number" placeholder="Nhập ID cửa hàng" className="border-slate-200 focus-visible:ring-blue-500" {...register('store_id')} />
              </div>
              
              <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 mt-4 rounded-xl" disabled={isCreating || isUpdating}>
                {(isCreating || isUpdating) ? 'Đang xử lý...' : 'Lưu Giao Dịch'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 bg-slate-50">
              <TableHead className="text-xs font-semibold uppercase text-slate-700">Mã HĐ</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-700">Khách Hàng</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-700">Loại</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-700">Tổng Tiền</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-700 text-center">Điểm Thay Đổi</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-700 text-center">Số Dư</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-700">Ngày</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-slate-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-slate-500 py-12">Đang tải...</TableCell>
              </TableRow>
            ) : filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-slate-500 py-12">Chưa có giao dịch nào.</TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow key={transaction.transaction_id} className="border-slate-100 hover:bg-slate-50/50">
                  <TableCell className="font-bold text-slate-900">{transaction.pos_invoice_code}</TableCell>
                  <TableCell className="font-medium text-slate-700">
                    {transaction.customer ? transaction.customer.full_name : 'Khách Vãng Lai'}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold border ${
                      transaction.transaction_type === 'EARN' 
                        ? 'border-emerald-500/20 bg-emerald-50 text-emerald-600'
                        : 'border-rose-500/20 bg-rose-50 text-rose-600'
                    }`}>
                      {transaction.transaction_type}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {Number(transaction.order_amount).toLocaleString()} đ
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    <span className={transaction.transaction_type === 'EARN' ? 'text-emerald-500' : 'text-rose-500'}>
                      {transaction.transaction_type === 'EARN' ? '+' : '-'}{transaction.points}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-bold text-slate-900">
                    {transaction.balance_after}
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">
                    {new Date(transaction.created_at || '').toLocaleString('vi-VN')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600" onClick={() => setViewTransaction(transaction)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600" onClick={() => handleOpenEdit(transaction)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-rose-600" onClick={() => setDeleteTarget(transaction.transaction_id)}>
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
            Cảnh báo: Xóa giao dịch không khuyến khích trong thực tế vì ảnh hưởng báo cáo kế toán. Bạn có chắc chắn xóa?
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Hủy</Button>
            <Button className="bg-rose-500 text-white hover:bg-rose-600" onClick={() => { if (deleteTarget) deleteTransaction(deleteTarget, { onSuccess: () => setDeleteTarget(null) }); }} disabled={isDeleting}>
              {isDeleting ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewTransaction} onOpenChange={() => setViewTransaction(null)}>
        <DialogContent className="border-slate-200 bg-white text-slate-900 sm:max-w-[500px] rounded-3xl shadow-xl p-0 overflow-hidden">
          {viewTransaction && (
            <>
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Chi tiết giao dịch</h3>
                  <p className="text-slate-500 text-sm">Mã HĐ: <span className="font-semibold text-slate-700">{viewTransaction.pos_invoice_code}</span></p>
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border uppercase tracking-wider ${
                  viewTransaction.transaction_type === 'EARN' 
                    ? 'border-emerald-500/20 bg-emerald-100 text-emerald-700'
                    : 'border-rose-500/20 bg-rose-100 text-rose-700'
                }`}>
                  {viewTransaction.transaction_type}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Khách hàng</p>
                    <p className="font-medium text-slate-900">{viewTransaction.customer?.full_name || 'Khách vãng lai'}</p>
                    {viewTransaction.customer && <p className="text-sm text-slate-500">{viewTransaction.customer.phone_number}</p>}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Ngày giờ</p>
                    <p className="font-medium text-slate-900">{new Date(viewTransaction.created_at || '').toLocaleDateString('vi-VN')}</p>
                    <p className="text-sm text-slate-500">{new Date(viewTransaction.created_at || '').toLocaleTimeString('vi-VN')}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-2xl p-4 grid grid-cols-3 gap-4 border border-slate-100 mt-4">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Tổng Tiền</p>
                    <p className="font-bold text-slate-900">{Number(viewTransaction.order_amount).toLocaleString()}đ</p>
                  </div>
                  <div className="text-center border-l border-r border-slate-200">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Điểm</p>
                    <p className={`font-bold ${viewTransaction.transaction_type === 'EARN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {viewTransaction.transaction_type === 'EARN' ? '+' : '-'}{viewTransaction.points}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Số dư điểm</p>
                    <p className="font-bold text-indigo-600">{viewTransaction.balance_after}</p>
                  </div>
                </div>

                {viewTransaction.is_offline_sync && (
                  <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Giao dịch đồng bộ Offline
                  </div>
                )}
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <Button variant="outline" className="rounded-xl" onClick={() => setViewTransaction(null)}>Đóng</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
