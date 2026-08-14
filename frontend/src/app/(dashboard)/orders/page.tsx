"use client";

import { useState } from "react";
import { useAllOrders } from "@/hooks/useOrders";
import { Order } from "@/types/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const { orders, isLoading } = useAllOrders();
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-indigo-500" />
            Quản lý Đơn hàng
          </h1>
          <p className="mt-1 text-slate-500">
            Xem toàn bộ lịch sử hóa đơn mua hàng từ các máy POS.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white backdrop-blur-xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">Mã đơn</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">Khách hàng</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700">Ngày mua</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700 text-right">Tổng tiền</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700 text-center">Trạng thái</TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-700 text-right">Chi tiết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-500">Đang tải dữ liệu hóa đơn...</TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-500">Chưa có hóa đơn nào trên hệ thống.</TableCell>
              </TableRow>
            ) : (
              orders.map(order => (
                <TableRow key={order.order_id} className="border-slate-100 transition-colors hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">{order.invoice_code}</TableCell>
                  <TableCell>
                    {order.customer ? (
                      <div>
                        <div className="font-semibold text-slate-700">{order.customer.full_name}</div>
                        <div className="text-xs text-slate-500">{order.customer.phone_number}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Khách vãng lai</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    <div>{order.created_at ? new Date(order.created_at).toLocaleDateString("vi-VN") : "N/A"}</div>
                    <div className="text-xs text-slate-400">{order.created_at ? new Date(order.created_at).toLocaleTimeString("vi-VN") : ""}</div>
                  </TableCell>
                  <TableCell className="text-sm font-bold text-emerald-600 text-right">
                    {Number(order.total_amount).toLocaleString()}đ
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex px-2 py-1 text-[10px] uppercase font-bold rounded-full ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => setViewOrder(order)} className="text-slate-500 hover:text-indigo-600">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewOrder} onOpenChange={() => setViewOrder(null)}>
        <DialogContent className="border-slate-200 bg-white text-slate-900 sm:max-w-[600px] rounded-3xl shadow-xl p-0 overflow-hidden z-[110]">
          {viewOrder && (
            <>
              <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Chi tiết Hóa đơn</h3>
                  <p className="text-slate-500 text-sm">Mã HĐ: <span className="font-semibold text-slate-700">{viewOrder.invoice_code}</span></p>
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border uppercase tracking-wider ${viewOrder.status === "completed" ? "border-emerald-500/20 bg-emerald-100 text-emerald-700" : "border-rose-500/20 bg-rose-100 text-rose-700"}`}>
                  {viewOrder.status}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Khách hàng</p>
                    <p className="font-medium text-slate-900">{viewOrder.customer?.full_name || "Khách vãng lai"}</p>
                    <p className="text-sm text-slate-500">{viewOrder.customer?.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Ngày giờ</p>
                    <p className="font-medium text-slate-900">{viewOrder.created_at ? new Date(viewOrder.created_at).toLocaleDateString("vi-VN") : "N/A"}</p>
                    <p className="text-sm text-slate-500">{viewOrder.created_at ? new Date(viewOrder.created_at).toLocaleTimeString("vi-VN") : ""}</p>
                  </div>
                </div>

                <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="text-xs font-semibold text-slate-700">Tên sản phẩm</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-700 text-center">SL</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-700 text-right">Đơn giá</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-700 text-right">Thành tiền</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewOrder.items && viewOrder.items.length > 0 ? (
                        viewOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium text-slate-900">{item.product_name}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right text-slate-600">{Number(item.price).toLocaleString()}đ</TableCell>
                            <TableCell className="text-right font-semibold text-emerald-600">{Number(item.subtotal).toLocaleString()}đ</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-slate-500 py-4">Không có chi tiết mặt hàng</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-end pt-4">
                  <div className="w-full sm:w-1/2 space-y-2">
                    <div className="flex justify-between border-t border-slate-200 pt-3 mt-1">
                      <span className="font-bold text-slate-900 uppercase tracking-wide">Tổng thanh toán:</span>
                      <span className="font-bold text-2xl text-emerald-600">{Number(viewOrder.total_amount).toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end rounded-b-3xl">
                <Button variant="outline" className="rounded-xl border-slate-300 hover:bg-slate-100 text-slate-700" onClick={() => setViewOrder(null)}>Đóng</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
